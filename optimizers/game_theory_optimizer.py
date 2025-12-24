
import random
import time
from google.cloud import bigquery

class GameTheoryOptimizer:
    """
    Implementa um otimizador de lances que utiliza uma estratégia Epsilon-Greedy (ε)
    para balancear entre a exploração de novas oportunidades e a otimização (exploitation)
    de estratégias conhecidas.
    """
    
    # --- Parâmetros de Configuração ---
    EPSILON: float = 0.15  # 15% de chance de explorar
    EXPLORATION_HARD_CAP: float = 5000.0  # Teto máximo de gasto em exploração por ciclo (e.g., diário)
    BIGQUERY_LOG_TABLE: str = "nexus_core.bidding_log"

    def __init__(self, project_id: str):
        """
        Inicializa o otimizador.
        
        Args:
            project_id: O ID do projeto no Google Cloud.
        """
        self.project_id = project_id
        self.bq_client = bigquery.Client(project=self.project_id)
        self.exploration_spend_today: float = 0.0
        print(f"GameTheoryOptimizer inicializado. Teto de exploração: ${self.EXPLORATION_HARD_CAP}")

    def _log_decision_to_bigquery(self, decision: dict):
        """
        Registra a decisão de lance no BigQuery. Ações de exploração são
        explicitamente marcadas para análise de custo de aprendizado.
        """
        errors = self.bq_client.insert_rows_json(self.BIGQUERY_LOG_TABLE, [decision])
        if not errors:
            print(f"LOGGED to BQ: Strategy='{decision['strategy']}', Target='{decision['target_id']}', Cost='${decision['estimated_cost']}'")
        else:
            print(f"ERROR logging to BigQuery: {errors}")

    def decide_bid_strategy(self, target_id: str, poas: float, is_new_target: bool, estimated_cost: float) -> dict:
        """
        Decide se deve explorar ou otimizar, baseado na regra Epsilon (ε).
        
        Args:
            target_id: O ID do público ou termo de busca.
            poas: O Profit on Ad Spend atual para este alvo.
            is_new_target: Flag se o alvo é novo (sem dados históricos).
            estimated_cost: O custo estimado do lance agressivo de exploração.

        Returns:
            Um dicionário contendo a estratégia de lance e os parâmetros.
        """
        strategy = "EXPLOITATION_MODE" # Modo padrão de otimização
        
        # --- Lógica de Decisão Epsilon-Greedy ---
        should_explore = random.random() < self.EPSILON
        can_afford_exploration = (self.exploration_spend_today + estimated_cost) <= self.EXPLORATION_HARD_CAP

        # Condição para entrar em modo de exploração:
        # 1. O dado da sorte (ε) foi lançado.
        # 2. O alvo é novo (sem dados de POAS) OU o POAS atual é baixo (precisa de nova abordagem).
        # 3. O teto de gastos de exploração não foi atingido.
        if should_explore and (is_new_target or poas < 1.5) and can_afford_exploration:
            strategy = "EXPLORATION_MODE"
            self.exploration_spend_today += estimated_cost
            
            decision = {
                "timestamp": time.time(),
                "target_id": target_id,
                "strategy": strategy,
                "bid_multiplier": 5.0, # Lance agressivo
                "estimated_cost": estimated_cost,
                "justification": "Epsilon-Greedy exploration on cold/underperforming target."
            }
        else:
            # Lógica padrão de otimização (exploitation)
            # Ex: Bid Shading, Conquesting baseado em pLTV, etc.
            decision = {
                "timestamp": time.time(),
                "target_id": target_id,
                "strategy": strategy,
                "bid_multiplier": 1.0, # Lance padrão
                "estimated_cost": estimated_cost / 5.0, # Custo normal
                "justification": "Standard POAS-based optimization."
            }
            
        # Log da decisão para análise posterior
        self._log_decision_to_bigquery(decision)
        
        return decision

# --- Exemplo de Execução ---
if __name__ == "__main__":
    # Substitua pelo seu ID de projeto real
    GCP_PROJECT_ID = "your-gcp-project-id"
    
    optimizer = GameTheoryOptimizer(project_id=GCP_PROJECT_ID)
    
    # Simulação de um ciclo de lances
    print("\n--- Iniciando ciclo de otimização de lances ---")
    
    # Cenário 1: Termo de busca conhecido com bom POAS
    optimizer.decide_bid_strategy(
        target_id="search_term_abc",
        poas=3.5,
        is_new_target=False,
        estimated_cost=10.0
    )
    
    # Cenário 2: Novo público (sem dados de POAS)
    optimizer.decide_bid_strategy(
        target_id="lookalike_audience_xyz",
        poas=0.0,
        is_new_target=True,
        estimated_cost=50.0 # Custo para testar um novo público
    )
    
    # Cenário 3: Termo com POAS baixo, candidato à exploração
    optimizer.decide_bid_strategy(
        target_id="search_term_def",
        poas=0.8,
        is_new_target=False,
        estimated_cost=20.0
    )
    
    print(f"\nTotal gasto em exploração no ciclo: ${optimizer.exploration_spend_today:.2f}")
    print("--- Ciclo de otimização finalizado ---")

    # Explicação da Distância de Cosseno para Proteção de Orçamento:
    # A Distância de Cosseno é usada pelo 'HygieneEnforcer' (módulo de negativação)
    # como uma rede de segurança para a exploração.
    #
    # 1. O 'GameTheoryOptimizer' pode decidir explorar um termo como "tênis de corrida noturna".
    # 2. O 'HygieneEnforcer' calcula a distância vetorial deste termo em relação ao vetor
    #    do "Produto Core" (ex: "tênis de corrida profissional").
    # 3. Se a distância for baixa (< 0.35), o termo é semanticamente relevante e a exploração é segura.
    # 4. Se a distância for alta (> 0.35), por exemplo, se o termo explorado for "corrida de cavalos",
    #    o 'HygieneEnforcer' o negativa imediatamente, mesmo que tenha sido uma ação de exploração.
    #
    # Isso garante que a exploração (ε) não desperdice dinheiro em caminhos semanticamente
    # sem saída, protegendo o orçamento de desvios absurdos.
```