
import os
import time
import logging
import json
from typing import List, Optional
from pydantic import BaseModel, Field
from google.cloud import bigquery
import requests
from facebook_business.api import FacebookAdsApi
from facebook_business.adobjects.adaccount import AdAccount
from facebook_business.adobjects.serverside.event import Event
from facebook_business.adobjects.serverside.user_data import UserData
from facebook_business.adobjects.serverside.event_request import EventRequest

# --- Configuração de Logging Estruturado ---
logging.basicConfig(
    level=logging.INFO,
    format='{"timestamp": "%(asctime)s", "level": "%(levelname)s", "message": "%(message)s"}',
    datefmt='%Y-%m-%dT%H:%M:%S%z'
)
logger = logging.getLogger("SignalDispatcher")

# --- Configurações de Ambiente ---
PROJECT_ID = os.environ.get("GCP_PROJECT", "your-gcp-project-id")
META_ACCESS_TOKEN = os.environ.get("META_ACCESS_TOKEN", "your-meta-token")
META_PIXEL_ID = os.environ.get("META_PIXEL_ID", "your-pixel-id")
TIKTOK_ACCESS_TOKEN = os.environ.get("TIKTOK_ACCESS_TOKEN", "your-tiktok-token")
TIKTOK_PIXEL_CODE = os.environ.get("TIKTOK_PIXEL_CODE", "your-pixel-code")

# --- Modelos Pydantic para Validação de Dados ---

class TransactionData(BaseModel):
    transaction_id: str
    revenue_gross: float
    predicted_ltv: Optional[float] = 0.0
    meta_fbp: Optional[str] = None
    tiktok_ttclid: Optional[str] = None

# --- Classe do Dispatcher ---

class SignalDispatcher:
    """
    Coordena a consulta de conversões e o envio de eventos sintéticos
    para plataformas de anúncios parceiras.
    """
    def __init__(self, project_id: str):
        self.bq_client = bigquery.Client(project=project_id)
        try:
            FacebookAdsApi.init(access_token=META_ACCESS_TOKEN)
        except Exception as e:
            logger.error(f"Failed to initialize Facebook Ads API: {e}")

    def get_transactions_to_dispatch(self) -> List[TransactionData]:
        """Consulta o BigQuery para obter transações recentes do Google Ads."""
        logger.info("Querying BigQuery for recent Google Ads transactions...")
        query = """
            SELECT
                ft.transaction_id,
                ft.revenue_gross,
                ltv.predicted_ltv,
                (SELECT id FROM UNNEST(iv.external_ids) WHERE source = 'fbp' LIMIT 1) AS meta_fbp,
                (SELECT id FROM UNNEST(iv.external_ids) WHERE source = 'ttclid' LIMIT 1) AS tiktok_ttclid
            FROM
                `nexus_core.financial_truth` AS ft
            -- Assumindo que financial_truth tem uma chave para join com identity_vault
            JOIN `nexus_core.identity_vault` AS iv ON ft.nexus_id = iv.nexus_id
            LEFT JOIN `nexus_core.ltv_forecaster_predictions` AS ltv ON ft.nexus_id = ltv.nexus_id
            WHERE
                ft.source_platform = 'Google Ads' -- Identificador da plataforma de origem
                AND ft.order_timestamp > TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 1 HOUR)
        """
        try:
            query_job = self.bq_client.query(query)
            results = query_job.result()
            transactions = [TransactionData.model_validate(row) for row in results]
            logger.info(f"Found {len(transactions)} transactions to process.")
            return transactions
        except Exception as e:
            logger.error(f"BigQuery query failed: {e}")
            return []

    def send_to_meta_capi(self, transaction: TransactionData):
        """Envia um evento de compra para a Meta Conversions API."""
        user_data = UserData(fbp=transaction.meta_fbp)
        
        # Lógica de Valor Sintético
        conversion_value = transaction.revenue_gross
        if transaction.predicted_ltv and transaction.predicted_ltv > 500:
            conversion_value *= 3.0
            logger.info(f"Applying synthetic value multiplier for high-LTV user. Original: ${transaction.revenue_gross}, New: ${conversion_value}")

        event = Event(
            event_name="Purchase",
            event_time=int(time.time()),
            user_data=user_data,
            event_id=transaction.transaction_id, # Deduplicação
            custom_data={'currency': 'USD', 'value': conversion_value}
        )
        
        event_request = EventRequest(events=[event], pixel_id=META_PIXEL_ID)
        try:
            event_response = event_request.execute()
            logger.info(f"Successfully sent event {transaction.transaction_id} to Meta CAPI. Trace ID: {event_response.trace_id}")
            return True
        except Exception as e:
            logger.error(f"Failed to send event to Meta CAPI for tx_id {transaction.transaction_id}: {e}")
            return False

    def send_to_tiktok_api(self, transaction: TransactionData):
        """Envia um evento de compra para a TikTok Events API."""
        url = f"https://business-api.tiktok.com/open_api/v1.3/pixel/track/"
        
        # Lógica de Valor Sintético
        conversion_value = transaction.revenue_gross
        if transaction.predicted_ltv and transaction.predicted_ltv > 500:
            conversion_value *= 3.0
        
        payload = {
            "pixel_code": TIKTOK_PIXEL_CODE,
            "event": "CompletePayment",
            "event_id": transaction.transaction_id, # Deduplicação
            "timestamp": time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime()),
            "context": {
                "user": {
                    "ttclid": transaction.tiktok_ttclid,
                }
            },
            "properties": {
                "currency": "USD",
                "value": conversion_value,
                "contents": [{"content_id": "product_id", "content_type": "product", "quantity": 1, "price": conversion_value}]
            }
        }
        headers = {"Access-Token": TIKTOK_ACCESS_TOKEN, "Content-Type": "application/json"}

        try:
            response = requests.post(url, headers=headers, json=payload)
            response.raise_for_status()
            logger.info(f"Successfully sent event {transaction.transaction_id} to TikTok Events API. Request ID: {response.json().get('request_id')}")
            return True
        except requests.exceptions.RequestException as e:
            logger.error(f"Failed to send event to TikTok API for tx_id {transaction.transaction_id}: {e}")
            return False

    def dispatch_events(self):
        """Orquestra o processo de consulta e envio de eventos."""
        transactions = self.get_transactions_to_dispatch()
        if not transactions:
            return

        meta_matches = 0
        tiktok_matches = 0

        for tx in transactions:
            if tx.meta_fbp:
                if self.send_to_meta_capi(tx):
                    meta_matches += 1
            
            if tx.tiktok_ttclid:
                if self.send_to_tiktok_api(tx):
                    tiktok_matches += 1
        
        # Logging de Match Rate
        total = len(transactions)
        meta_match_rate = (meta_matches / total) * 100 if total > 0 else 0
        tiktok_match_rate = (tiktok_matches / total) * 100 if total > 0 else 0
        
        log_data = {
            "total_google_transactions": total,
            "meta_matches": meta_matches,
            "meta_match_rate_percent": round(meta_match_rate, 2),
            "tiktok_matches": tiktok_matches,
            "tiktok_match_rate_percent": round(tiktok_match_rate, 2)
        }
        logger.info(json.dumps({"event": "dispatch_summary", "data": log_data}))


# --- Ponto de Entrada para Execução ---
if __name__ == "__main__":
    if not PROJECT_ID or "your-gcp-project-id" in PROJECT_ID:
        logger.error("GCP_PROJECT environment variable not set. Exiting.")
    else:
        dispatcher = SignalDispatcher(project_id=PROJECT_ID)
        dispatcher.dispatch_events()
