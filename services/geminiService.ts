
import { GoogleGenAI } from "@google/genai";
import { BackgroundColor } from "../types";

export const generatePassportPhoto = async (base64: string, mimeType: string, bgColor: BackgroundColor): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  // Using gemini-2.5-flash-image for image editing tasks
  const model = "gemini-2.5-flash-image";
  
  const colorName = bgColor === BackgroundColor.WHITE ? "white" : 
                    bgColor === BackgroundColor.LIGHT_BLUE ? "light blue" : "light gray";

  const prompt = `Transform this photo into a professional passport-style photograph.
  1. Detect the person in the image.
  2. Remove the original background completely.
  3. Replace the background with a solid ${colorName} color.
  4. Crop and center the image to focus on the person's head and shoulders (standard passport composition).
  5. Ensure the lighting looks professional and balanced.
  6. Return the edited image.`;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          { inlineData: { mimeType, data: base64 } },
          { text: prompt }
        ],
      },
    });

    // The model returns the image in parts
    if (response.candidates && response.candidates.length > 0) {
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
            }
        }
    }
    throw new Error("AI did not return an image. Please try again with a clearer photo.");
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
