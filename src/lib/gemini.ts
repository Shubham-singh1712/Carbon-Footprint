/**
 * Gemini API Client
 * Uses native fetch to connect to the Gemini API (gemini-2.5-flash).
 * Fallback to local simulated data if key is not configured.
 */

export interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
}

const MODEL_NAME = "gemini-2.5-flash";

function getApiKey(): string | undefined {
  return process.env.GEMINI_API_KEY;
}

/**
 * Text generation with structured JSON response mode
 */
export async function callGeminiText(
  systemInstruction: string,
  userPrompt: string
): Promise<unknown> {
  const apiKey = getApiKey();
  if (!apiKey) {
    console.warn("GEMINI_API_KEY is not set. Falling back to local mock parsing.");
    return null;
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${apiKey}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: userPrompt }],
          },
        ],
        systemInstruction: {
          parts: [{ text: systemInstruction }],
        },
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.2,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
    }

    const data = (await response.json()) as GeminiResponse;
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      throw new Error("Empty response from Gemini API");
    }

    return JSON.parse(text);
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return null;
  }
}

/**
 * Multimodal image analysis (OCR/receipt parsing) with structured JSON response
 */
export async function callGeminiVision(
  base64Image: string,
  mimeType: string,
  prompt: string
): Promise<unknown> {
  const apiKey = getApiKey();
  if (!apiKey) {
    console.warn("GEMINI_API_KEY is not set. Falling back to local mock parsing.");
    return null;
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${apiKey}`;

  // Strip prefix (e.g. "data:image/png;base64,") if present
  let base64Data = base64Image;
  const match = base64Image.match(/^data:(image\/[a-zA-Z+.-]+);base64,(.+)$/);
  let resolvedMimeType = mimeType;
  if (match) {
    resolvedMimeType = match[1];
    base64Data = match[2];
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: prompt },
              {
                inlineData: {
                  mimeType: resolvedMimeType,
                  data: base64Data,
                },
              },
            ],
          },
        ],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.1,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
    }

    const data = (await response.json()) as GeminiResponse;
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      throw new Error("Empty response from Gemini API");
    }

    return JSON.parse(text);
  } catch (error) {
    console.error("Error calling Gemini API for vision:", error);
    return null;
  }
}
