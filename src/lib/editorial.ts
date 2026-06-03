import OpenAI from "openai";
import { unstable_cache } from "next/cache";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function getHotelEditorial(destination: string): Promise<string> {
  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{
        role: "user",
        content: `Write a 200-word editorial section for a hotel search page for ${destination}. Include: best neighbourhoods to stay in, typical price range per night, best time to visit, and one practical tip for travellers. Plain prose, no markdown, no headers. Factual and useful.`,
      }],
      max_tokens: 350,
    });
    return completion.choices[0]?.message?.content ?? "";
  } catch {
    return "";
  }
}

export const getCachedHotelEditorial = unstable_cache(
  getHotelEditorial,
  ["hotel-editorial"],
  { revalidate: 60 * 60 * 24 * 7 }, // 7 days
);
