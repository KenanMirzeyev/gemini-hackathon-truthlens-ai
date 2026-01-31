
import { GoogleGenAI } from "@google/genai";
import { AnalysisResult, GroundingSource, TruthEntry } from "../types";

export const analyzeProduct = async (productName: string): Promise<AnalysisResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const prompt = `
    Analyze the product: "${productName}". 
    Your mission is to find the "Hidden Truths" that influencers and marketing teams usually skip.
    Search specifically for Reddit user complaints, forum discussions, and long-term owner reviews.
    
    CRITICAL FORMATTING INSTRUCTIONS:
    Provide your response strictly in the following structure so I can parse it:
    BS_SCORE: [A number from 0 to 100 representing how much marketing 'BS' or hype surrounds this product compared to its actual performance]
    TRUTH_1: [Catchy Title]: [Brief description of a common complaint or hidden flaw]
    TRUTH_2: [Catchy Title]: [Brief description of a common complaint or hidden flaw]
    TRUTH_3: [Catchy Title]: [Brief description of a common complaint or hidden flaw]
    SUMMARY: [A 2-sentence summary of the consensus among real users]
    
    Focus on durability, software bugs, hidden costs, or disappointing features.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || "";
    const candidates = response.candidates || [];
    const groundingChunks = candidates[0]?.groundingMetadata?.groundingChunks || [];
    
    // Extract sources
    const sources: GroundingSource[] = groundingChunks
      .filter((chunk: any) => chunk.web)
      .map((chunk: any) => ({
        title: chunk.web.title || "Source",
        uri: chunk.web.uri || "#"
      }));

    // Parse the structured text output
    const bsScoreMatch = text.match(/BS_SCORE:\s*(\d+)/i);
    const bsScore = bsScoreMatch ? parseInt(bsScoreMatch[1], 10) : 50;

    const truths: TruthEntry[] = [];
    for (let i = 1; i <= 3; i++) {
      const regex = new RegExp(`TRUTH_${i}:\\s*([^:]+):\\s*([^\n]+)`, 'i');
      const match = text.match(regex);
      if (match) {
        truths.push({
          title: match[1].trim(),
          description: match[2].trim()
        });
      }
    }

    // Fallback truths if parsing fails
    if (truths.length === 0) {
      truths.push({ title: "Analysis Incomplete", description: "The model couldn't find specific truths for this query." });
    }

    const summaryMatch = text.match(/SUMMARY:\s*([^\n]+(?:\n[^\n]+)?)/i);
    const summary = summaryMatch ? summaryMatch[1].trim() : "No summary available.";

    return {
      bsScore,
      truths,
      summary,
      sources
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to analyze product. Please try again.");
  }
};
