// app/api/generate-topics/route.ts

import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";

const topicsSchema = z.object({
  categories: z.array(
    z.object({
      name: z.string(),
      topics: z.array(z.string()),
    })
  ),
  featured: z.array(z.string()),
});

export async function POST(req: Request) {
  try {
    const { searchTerm } = await req.json();

    if (!searchTerm) {
      return new Response(
        JSON.stringify({ error: "Search term is required." }),
        { status: 400 }
      );
    }

    const result = await generateObject({
      temperature: 0.7,
      model: google("gemini-2.0-flash-exp"),
      system:
        "You are an expert trend researcher and content strategist. Based on the given search term, generate trending topics in a structured format: multiple categories with 4-6 topics each, and a list of 5 featured trending topics. The output must match the provided JSON schema.",
      schema: topicsSchema,
      messages: [
        {
          role: "user",
          content: `Generate trending topics based on this term: "${searchTerm}".`,
        },
      ],
    });

    return result.toJsonResponse();
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: `Failed to generate topics: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      }),
      { status: 400 }
    );
  }
}
