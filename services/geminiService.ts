import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generatePhysicsExplanation = async (
  topic: string, 
  velocity: number, 
  gamma: number
): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Explain the concept of ${topic} in the context of Special Relativity. 
      Specifically, explain what happens when an object travels at ${velocity * 100}% the speed of light (0.99c max), 
      resulting in a Lorentz factor (gamma) of ${gamma.toFixed(2)}. 
      Keep the explanation concise (under 150 words), engaging, and strictly scientifically accurate. 
      Use simple analogies.`
    });
    return response.text || "I couldn't generate an explanation at this moment.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error connecting to the relativity database (AI service unavailable).";
  }
};

export const chatWithEinstein = async (history: {role: string, parts: {text: string}[]}[], message: string): Promise<string> => {
    try {
        const chat = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: `You are Albert Einstein. You are helpful, slightly witty, and deeply knowledgeable about physics. 
                You are talking to a student exploring Special Relativity. 
                Explain concepts clearly. If asked about math, use plain text or standard math symbols, do not use complex LaTeX blocks as they might not render.
                Keep responses relatively short and conversational.`,
            },
            history: history
        });

        const result = await chat.sendMessage({ message });
        return result.text || "I am currently lost in thought.";
    } catch (error) {
        console.error("Gemini Chat Error:", error);
        return "My apologies, I seem to have lost my train of thought (AI service error).";
    }
}