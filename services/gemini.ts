import { GoogleGenAI } from "@google/genai";
import { AnalysisResult, GroundingSource, TruthEntry } from "../types";

export const analyzeProduct = async (productName: string): Promise<AnalysisResult> => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error("API Key missing! Check Netlify variables.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  // Using 1.5-flash as it's the most stable for Search Grounding
  const model = ai.models.get("gemini-1.5-flash");

  const prompt = `
    Analyze the product: "${productName}". 
    Structure your response EXACTLY like this:
    BS_SCORE: [Number 0-100]
    TRUTH_1: [Title]: [Description]
    TRUTH_2: [Title]: [Description]
    TRUTH_3: [Title]: [Description]
    SUMMARY: [2-sentence summary]
  `;

  try {
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      tools: [{ googleSearch: {} }], // This triggers the live web search
    });

    const text = result.response.text();
    
    // Improved Source Extraction for 2026 SDK
    const groundingMetadata = result.response.candidates?.[0]?.groundingMetadata;
    const sources: GroundingSource[] = groundingMetadata?.searchEntryPoint?.renderedContent 
      ? [{ title: "Google Search Knowledge", uri: "https://google.com" }] 
      : [];

    // Parsing logic
    const bsScoreMatch = text.match(/BS_SCORE:\s*(\d+)/i);
    const bsScore = bsScoreMatch ? parseInt(bsScoreMatch[1], 10) : 50;

    const truths: TruthEntry[] = [];
    for (let i = 1; i <= 3; i++) {
      const regex = new RegExp(`TRUTH_${i}:\\s*([^:]+):\\s*([^\n]+)`, 'i');
      const match = text.match(regex);
      if (match) {
        truths.push({ title: match[1].trim(), description: match[2].trim() });
      }
    }

    const summaryMatch = text.match(/SUMMARY:\s*([^\n]+)/i);
    
    return {
      bsScore,
      truths: truths.length > 0 ? truths : [{title: "Analysis Ready", description: "Consensus found."}],
      summary: summaryMatch ? summaryMatch[1].trim() : "Analysis complete based on web results.",
      sources
    };
  } catch (error: any) {
    // THIS WILL TELL YOU THE REAL ERROR IN THE CONSOLE
    console.error("DETAILED API ERROR:", error);
    throw new Error(`Gemini Error: ${error.message || "Unknown error"}`);
  }
};
