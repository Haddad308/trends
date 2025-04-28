import { z } from "zod";

// نفس schema اللي موجود في backend
const topicsSchema = z.object({
  categories: z.array(
    z.object({
      name: z.string(),
      topics: z.array(z.string()),
    })
  ),
  featured: z.array(z.string()),
});

export async function generateTopicsBasedOnSearch(searchTerm: string) {
  try {
    const response = await fetch("/api/generate-topics", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ searchTerm }),
    });

    const data = await response.json();

    const parsed = topicsSchema.safeParse(data);

    if (!parsed.success) {
      console.error("Validation Error:", parsed.error);
      throw new Error("Invalid response format from API.");
    }

    return parsed.data;
  } catch (error) {
    console.error("Failed to fetch trending topics:", error);
    throw error;
  }
}
