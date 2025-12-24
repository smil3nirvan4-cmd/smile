
import { useState, useCallback } from 'react';
import { GoogleGenAI } from '@google/genai';

// Ensure the API key is handled by the environment as per instructions.
// Do not add UI for API key input.
const API_KEY = process.env.API_KEY;

export const useGemini = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<string | null>(null);

    const generateContent = useCallback(async (prompt: string) => {
        if (!API_KEY) {
            setError("API key is not configured. Please set the API_KEY environment variable.");
            console.error("API key is not configured. Please set the API_KEY environment variable.");
            // In a real app, you might want to show a more user-friendly message
            // or disable features that require the API. For this demo, we'll simulate a response.
            setResult("Gemini API is not configured. This is a simulated response.");
            return;
        }

        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            const ai = new GoogleGenAI({ apiKey: API_KEY, vertexai: true });
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: { role: 'user', parts: [{ text: prompt }] },
                config: {
                    temperature: 0.3,
                }
            });
            
            const text = response.text;
            setResult(text);
        } catch (e: any) {
            console.error("Gemini API error:", e);
            setError(e.message || "An unknown error occurred while contacting the Gemini API.");
            setResult("Error generating content. Please check the console for details.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    return { isLoading, error, result, generateContent };
};
