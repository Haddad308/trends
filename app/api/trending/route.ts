import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q") || "";
  const platform = searchParams.get("platform") || "all";

  try {
    let results = {};

    if (platform === "all" || platform === "google") {
      results = {
        ...results,
        google: await fetchGoogleTrendingSuggestions(query),
      };
    }

    if (platform === "all" || platform === "youtube") {
      results = {
        ...results,
        youtube: await fetchYouTubeTrendingSuggestions(query),
      };
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error("Error fetching trending suggestions:", error);
    return NextResponse.json(
      { error: "Failed to fetch trending suggestions" },
      { status: 500 }
    );
  }
}

async function fetchGoogleTrendingSuggestions(query: string) {
  try {
    // For a real implementation, you would use Google Trends API
    // Since we don't have direct access, we'll use Google's autocomplete API
    const response = await fetch(
      `https://suggestqueries.google.com/complete/search?client=firefox&q=${encodeURIComponent(
        query
      )}`,
      { headers: { Accept: "application/json" } }
    );

    if (!response.ok) {
      throw new Error(`Google suggestions API error: ${response.status}`);
    }

    const data = await response.json();
    const suggestions = data[1] || [];

    // Process the suggestions into categories
    return processSuggestions(suggestions, query);
  } catch (error) {
    console.error("Error fetching Google trending suggestions:", error);

    // Fallback to mock data for demonstration
    return getMockGoogleTrendingSuggestions(query);
  }
}

async function fetchYouTubeTrendingSuggestions(query: string) {
  try {
    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) {
      throw new Error("YouTube API key is missing");
    }

    // YouTube doesn't have a direct API for search suggestions
    // We can use the search API with a low maxResults to get trending content
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=${encodeURIComponent(
        query
      )}&type=video&key=${apiKey}`
    );

    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status}`);
    }

    interface YouTubeSearchItem {
      snippet: {
        title: string;
      };
    }

    const data = await response.json();

    // Extract keywords from video titles
    const keywords = data.items.map(
      (item: YouTubeSearchItem) => item.snippet.title
    );

    // Process the keywords into categories
    return processSuggestions(keywords, query);
  } catch (error) {
    console.error("Error fetching YouTube trending suggestions:", error);

    // Fallback to mock data for demonstration
    return getMockYouTubeTrendingSuggestions(query);
  }
}

function processSuggestions(suggestions: string[], query: string) {
  // Categories to organize suggestions
  const categories = {
    questions: [] as string[],
    prepositions: [] as string[],
    comparisons: [] as string[],
    alphabetical: {} as Record<string, string[]>,
    trending: [] as string[],
  };

  const lowerQuery = query.toLowerCase();

  suggestions.forEach((suggestion) => {
    const lowerSuggestion = suggestion.toLowerCase();

    // Skip if it doesn't contain the query
    if (!lowerSuggestion.includes(lowerQuery) && lowerQuery.length > 0) {
      return;
    }

    // Categorize by question words
    if (
      lowerSuggestion.includes(" how ") ||
      lowerSuggestion.includes(" what ") ||
      lowerSuggestion.includes(" why ") ||
      lowerSuggestion.includes(" when ") ||
      lowerSuggestion.includes(" where ") ||
      lowerSuggestion.startsWith("how ") ||
      lowerSuggestion.startsWith("what ") ||
      lowerSuggestion.startsWith("why ") ||
      lowerSuggestion.startsWith("when ") ||
      lowerSuggestion.startsWith("where ")
    ) {
      categories.questions.push(suggestion);
      return;
    }

    // Categorize by prepositions
    if (
      lowerSuggestion.includes(" for ") ||
      lowerSuggestion.includes(" with ") ||
      lowerSuggestion.includes(" without ") ||
      lowerSuggestion.includes(" vs ") ||
      lowerSuggestion.includes(" versus ") ||
      lowerSuggestion.includes(" in ") ||
      lowerSuggestion.includes(" on ") ||
      lowerSuggestion.includes(" to ") ||
      lowerSuggestion.includes(" near ")
    ) {
      categories.prepositions.push(suggestion);
      return;
    }

    // Categorize by comparisons
    if (
      lowerSuggestion.includes(" vs ") ||
      lowerSuggestion.includes(" versus ") ||
      lowerSuggestion.includes(" or ") ||
      lowerSuggestion.includes(" compared ") ||
      lowerSuggestion.includes(" better than ")
    ) {
      categories.comparisons.push(suggestion);
      return;
    }

    // Categorize alphabetically
    const firstChar = lowerSuggestion.charAt(lowerQuery.length).toUpperCase();
    if (/[A-Z]/.test(firstChar)) {
      if (!categories.alphabetical[firstChar]) {
        categories.alphabetical[firstChar] = [];
      }
      categories.alphabetical[firstChar].push(suggestion);
      return;
    }

    // Add to trending if it doesn't fit other categories
    categories.trending.push(suggestion);
  });

  // Sort alphabetical categories
  const sortedAlphabetical: Record<string, string[]> = {};
  Object.keys(categories.alphabetical)
    .sort()
    .forEach((key) => {
      sortedAlphabetical[key] = categories.alphabetical[key];
    });
  categories.alphabetical = sortedAlphabetical;

  return categories;
}

function getMockGoogleTrendingSuggestions(query: string) {
  // If query is empty or very short, provide general AI trends
  if (!query || query.length < 3) {
    return {
      questions: [
        "what is artificial intelligence",
        "how does AI work",
        "what can AI do",
        "how to use AI for business",
        "what is the future of AI",
      ],
      prepositions: [
        "AI for small business",
        "AI in healthcare",
        "AI with python",
        "AI for content creation",
        "AI in education",
      ],
      comparisons: [
        "AI vs machine learning",
        "ChatGPT vs Bard",
        "AI or human writers",
        "GPT-4 vs GPT-3.5",
        "AI compared to human intelligence",
      ],
      alphabetical: {
        A: ["AI art generators", "AI assistants for productivity"],
        B: ["Best AI tools 2025", "Business applications of AI"],
        C: ["ChatGPT alternatives", "Custom AI models"],
        F: ["Free AI tools", "Future of AI technology"],
        T: ["Top AI companies", "Text to image AI"],
      },
      trending: [
        "AI image generator",
        "ChatGPT login",
        "AI video creator",
        "AI detector",
        "AI voice generator",
        "AI writing assistant",
        "AI code helper",
      ],
    };
  }

  // If query is "Best AI" or starts with it, provide specific suggestions
  if (
    query.toLowerCase() === "best ai" ||
    query.toLowerCase().startsWith("best ai")
  ) {
    return {
      questions: [
        "what are the best AI tools for students",
        "how to find the best AI for writing",
        "what is the best AI chatbot",
        "how to choose the best AI for business",
      ],
      prepositions: [
        "best AI for content creation",
        "best AI for coding",
        "best AI for image generation",
        "best AI for video editing",
        "best AI for small business",
        "best AI for writers",
        "best AI for students",
      ],
      comparisons: [
        "best AI vs human writers",
        "best AI chatbots compared",
        "best AI tools or services",
        "best AI image generators compared",
      ],
      alphabetical: {
        A: ["best AI art generators", "best AI assistants 2025"],
        C: ["best AI chatbots", "best AI content writers"],
        F: ["best AI for free", "best AI for beginners"],
        I: ["best AI image generators", "best AI in the market"],
        M: ["best AI models", "best AI music generators"],
        T: ["best AI text to speech", "best AI tools free"],
        V: ["best AI video creators", "best AI voice generators"],
        W: ["best AI writing assistants", "best AI websites"],
      },
      trending: [
        "best AI tools 2025",
        "best AI chatbot alternatives to ChatGPT",
        "best AI image generator free",
        "best AI for writing essays",
        "best AI apps for productivity",
        "best AI video creator no watermark",
        "best AI voice clone",
      ],
    };
  }

  // For other queries, provide relevant suggestions
  return {
    questions: [
      `what is ${query}`,
      `how does ${query} work`,
      `what can ${query} do`,
      `how to use ${query} effectively`,
      `what are the benefits of ${query}`,
    ],
    prepositions: [
      `${query} for beginners`,
      `${query} in business`,
      `${query} with examples`,
      `${query} for free`,
      `${query} in 2025`,
    ],
    comparisons: [
      `${query} vs alternatives`,
      `${query} or competitors`,
      `${query} compared to others`,
      `is ${query} better than others`,
    ],
    alphabetical: {
      A: [`${query} advanced techniques`, `${query} applications`],
      B: [`${query} best practices`, `${query} benefits`],
      C: [`${query} cost`, `${query} courses`],
      F: [`${query} for free`, `${query} features`],
      H: [`${query} how to start`, `${query} help`],
      T: [`${query} tutorial`, `${query} tips`],
    },
    trending: [
      `${query} latest updates`,
      `${query} new features`,
      `${query} review`,
      `${query} alternatives`,
      `${query} pricing`,
      `${query} free trial`,
    ],
  };
}

function getMockYouTubeTrendingSuggestions(query: string) {
  // If query is empty or very short, provide general AI YouTube trends
  if (!query || query.length < 3) {
    return {
      questions: [
        "what is AI explained simply",
        "how does artificial intelligence work",
        "what can AI do in 2025",
        "how to create AI art",
        "what is machine learning vs AI",
      ],
      prepositions: [
        "AI for beginners tutorial",
        "AI in our daily life",
        "AI with no coding",
        "AI for content creators",
        "AI in the future",
      ],
      comparisons: [
        "AI vs human artists",
        "ChatGPT vs Google Bard comparison",
        "AI or human intelligence",
        "Midjourney vs DALL-E",
        "AI compared to human creativity",
      ],
      alphabetical: {
        A: ["AI art tutorial", "AI assistants review"],
        B: ["Best AI tools demonstration", "Build your own AI"],
        C: ["ChatGPT tutorial", "Create AI images"],
        F: ["Free AI tools walkthrough", "Future of AI documentary"],
        H: ["How to use AI for YouTube", "How AI is changing everything"],
        T: ["Top 10 AI tools", "Text to video AI"],
      },
      trending: [
        "I tried using AI for a week",
        "AI tools that will replace your job",
        "How to make money with AI",
        "AI image generation tutorial",
        "The dark side of AI",
        "AI tools every creator needs",
        "Future of AI explained",
      ],
    };
  }

  // If query is "Best AI" or starts with it, provide specific YouTube suggestions
  if (
    query.toLowerCase() === "best ai" ||
    query.toLowerCase().startsWith("best ai")
  ) {
    return {
      questions: [
        "what are the best AI tools in 2025",
        "how to use the best AI image generators",
        "what is the best AI for YouTube creators",
        "how to find the best AI writing assistant",
      ],
      prepositions: [
        "best AI for YouTube",
        "best AI for students",
        "best AI for video editing",
        "best AI for beginners",
        "best AI for content creation",
        "best AI for small creators",
      ],
      comparisons: [
        "best AI vs paid services",
        "best AI chatbots compared live",
        "best AI tools or human assistance",
        "best AI image generators battle",
      ],
      alphabetical: {
        A: ["best AI art tutorial", "best AI assistants review"],
        C: ["best AI chatbots demo", "best AI content tools"],
        F: ["best AI for free walkthrough", "best AI for beginners guide"],
        I: ["best AI image generators comparison", "best AI in 2025"],
        T: ["best AI text to video tools", "best AI tools demonstration"],
        V: ["best AI video editors", "best AI voice over generators"],
      },
      trending: [
        "10 best AI tools you need to try",
        "best AI tools that changed my workflow",
        "best AI for YouTube automation",
        "I tested the best AI image generators so you don't have to",
        "best AI tools that are completely free",
        "best AI apps for students",
        "best AI voice cloning software test",
      ],
    };
  }

  // For other queries, provide YouTube-specific suggestions
  return {
    questions: [
      `what is ${query} explained`,
      `how to use ${query} tutorial`,
      `what can ${query} do for creators`,
      `how to get started with ${query}`,
      `what are the best ${query} techniques`,
    ],
    prepositions: [
      `${query} for beginners`,
      `${query} in action`,
      `${query} with examples`,
      `${query} for YouTube`,
      `${query} in 2025 review`,
    ],
    comparisons: [
      `${query} vs alternatives comparison`,
      `${query} or competitors which is better`,
      `${query} compared to others live test`,
      `is ${query} better than the competition`,
    ],
    alphabetical: {
      A: [`${query} advanced tutorial`, `${query} all features`],
      B: [`${query} best practices guide`, `${query} behind the scenes`],
      C: [`${query} complete walkthrough`, `${query} creator tips`],
      F: [`${query} for free guide`, `${query} full review`],
      H: [`${query} how to master`, `${query} hands-on`],
      T: [`${query} tips and tricks`, `${query} tutorial for beginners`],
    },
    trending: [
      `${query} that will blow your mind`,
      `I tried ${query} for 30 days`,
      `${query} review: the truth`,
      `${query} is changing everything`,
      `${query} secrets nobody tells you`,
      `${query} ultimate guide 2025`,
    ],
  };
}
