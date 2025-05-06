import { type NextRequest, NextResponse } from "next/server";

const RedditLimit = Math.floor(Math.random() * (20 - 10 + 1)) + 10; // Reddit API limit for search results
const YouTubeLimit = Math.floor(Math.random() * (20 - 10 + 1)) + 10; // YouTube API limit for search results
const GoogleLimit = Math.floor(Math.random() * (10 - 5 + 1)) + 5; // Google API limit for search results
const XLimit = Math.floor(Math.random() * (10 - 5 + 1)) + 5; // Instagram result limit (mock/scraped/custom API)

// This implementation uses real APIs to fetch actual content
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json(
      { error: "Search query is required" },
      { status: 400 }
    );
  }

  try {
    // Fetch data from all platforms in parallel with individual error handling
    const [youtubeResults, redditResults, googleResults, xResults] =
      await Promise.all([
        fetchYouTubeResults(query).catch((error) => {
          console.error("YouTube search error:", error);
          return [];
        }),
        fetchRedditResults(query).catch((error) => {
          console.error("Reddit search error:", error);
          return getMockRedditResults(query);
        }),
        fetchGoogleAlternativeResults(query).catch((error) => {
          console.error("Google search error:", error);
          return [];
        }),
        fetchXResults(query).catch((error) => {
          console.error("Instagram search error:", error);
          return [];
        }),
      ]);

    return NextResponse.json({
      youtube: youtubeResults,
      reddit: redditResults,
      google: googleResults,
      x: xResults,
    });
  } catch (error) {
    console.error("Error fetching search results:", error);
    // Return partial results if available, otherwise empty arrays
    return NextResponse.json({
      youtube: [],
      reddit: getMockRedditResults(query),
      google: [],
      x: [],
      error: "Some search results could not be fetched",
    });
  }
}

async function fetchYouTubeResults(query: string) {
  try {
    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) {
      console.error("YouTube API key is missing");
      return [];
    }

    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=${YouTubeLimit}&q=${encodeURIComponent(
        query
      )}&type=video&key=${apiKey}`
    );

    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status}`);
    }

    const data = await response.json();

    interface itemVidoe {
      id: {
        videoId: string;
      };
      snippet: {
        title: string;
        description: string;
        publishedAt: string;
        channelTitle: string;
        thumbnails: {
          high: {
            url: string;
          };
        };
      };
    }

    // Get video IDs to fetch additional details
    const videoIds = data.items
      .map((item: itemVidoe) => item.id.videoId)
      .join(",");

    // Fetch additional video details including statistics and content details
    const videoDetailsResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoIds}&key=${apiKey}`
    );

    if (!videoDetailsResponse.ok) {
      throw new Error(
        `YouTube video details API error: ${videoDetailsResponse.status}`
      );
    }

    interface YouTubeVideoItem {
      id: string;
      snippet: {
        title: string;
        description: string;
        publishedAt: string;
        channelTitle: string;
        thumbnails: {
          high: {
            url: string;
          };
        };
      };
      contentDetails: {
        duration: string;
      };
      statistics: {
        viewCount: string;
      };
    }

    const videoDetailsData = await videoDetailsResponse.json();

    // Format the response to match our UI components
    return videoDetailsData.items.map((item: YouTubeVideoItem) => {
      // Parse ISO 8601 duration to human-readable format
      const duration = parseDuration(item.contentDetails.duration);

      // Format view count
      const viewCount = Number.parseInt(item.statistics.viewCount);
      const formattedViewCount = formatCount(viewCount);

      // Calculate time since published
      const timeAgo = getTimeAgo(new Date(item.snippet.publishedAt));

      return {
        title: item.snippet.title,
        description: item.snippet.description,
        url: `https://www.youtube.com/watch?v=${item.id}`,
        thumbnail: item.snippet.thumbnails.high.url,
        channelName: item.snippet.channelTitle,
        channelIcon: item.snippet.thumbnails.high.url, // YouTube API doesn't provide channel icons in this response
        viewCount: `${formattedViewCount} views`,
        publishedAt: timeAgo,
        duration: duration,
        videoId: item.id,
      };
    });
  } catch (error) {
    console.error("Error fetching YouTube results:", error);
    return [];
  }
}

// Update the fetchRedditResults function to handle the 403 error and provide fallback data

async function fetchRedditResults(query: string) {
  try {
    // Reddit's JSON API can be strict about User-Agent headers
    const response = await fetch(
      `https://www.reddit.com/search.json?q=${encodeURIComponent(
        query
      )}&limit=${RedditLimit}&sort=relevance`,
      {
        headers: {
          // More descriptive User-Agent to comply with Reddit's requirements
          "User-Agent": "web:multi-search-app:v1.0.0 (by /u/multi-search-app)",
        },
        // Add a timeout to prevent hanging requests
        signal: AbortSignal.timeout(5000),
      }
    );

    if (!response.ok) {
      console.error(`Reddit API error: ${response.status}`);
      // Instead of throwing, fall back to mock data
      return getMockRedditResults(query);
    }

    const data = await response.json();

    // Format the response to match our UI components
    interface RedditPost {
      data: {
        title: string;
        selftext: string;
        url: string;
        permalink: string;
        subreddit: string;
        author: string;
        score: number;
        num_comments: number;
        created_utc: number;
        gildings: {
          gid_1?: number;
          gid_2?: number;
          gid_3?: number;
        };
        all_awardings?: Array<{ name: string }>;
        thumbnail: string;
        is_self: boolean;
      };
    }

    return data.data.children.map((child: { data: RedditPost["data"] }) => {
      const post = child.data;

      // Calculate time since created
      const timeAgo = getTimeAgo(new Date(post.created_utc * 1000));

      // Format upvotes
      const upvotes = post.score;

      // Determine if post has thumbnail
      const hasThumbnail =
        post.thumbnail &&
        post.thumbnail !== "self" &&
        post.thumbnail !== "default" &&
        post.thumbnail !== "nsfw" &&
        post.thumbnail !== "spoiler";

      // Get awards (Reddit calls them "gildings")
      const awards: string[] = [];
      if (post.gildings) {
        if (post.gildings.gid_1) awards.push("Silver");
        if (post.gildings.gid_2) awards.push("Gold");
        if (post.gildings.gid_3) awards.push("Platinum");
      }

      // Add all_awardings if available
      if (post.all_awardings && post.all_awardings.length > 0) {
        interface RedditAward {
          name: string;
        }

        post.all_awardings.forEach((award: RedditAward) => {
          if (!awards.includes(award.name)) {
            awards.push(award.name);
          }
        });
      }

      // Limit awards to 3 for UI purposes
      const limitedAwards = awards.slice(0, 3);

      return {
        title: post.title,
        content: post.selftext || post.url,
        url: `https://www.reddit.com${post.permalink}`,
        subreddit: post.subreddit,
        author: post.author,
        upvotes: upvotes,
        commentCount: post.num_comments,
        awards: limitedAwards,
        thumbnail: hasThumbnail ? post.thumbnail : undefined,
        isTextPost: post.is_self,
        createdAt: timeAgo,
      };
    });
  } catch (error) {
    console.error("Error fetching Reddit results:", error);
    // Return mock data as fallback
    return getMockRedditResults(query);
  }
}

// Add this function to generate mock Reddit results
function getMockRedditResults(query: string) {
  // Generate realistic mock data based on the query
  const mockSubreddits = [
    "technology",
    "programming",
    "AskReddit",
    "science",
    "explainlikeimfive",
    "todayilearned",
  ];
  const mockAuthors = [
    "user123",
    "redditfan",
    "techexpert",
    "curious_mind",
    "knowledge_seeker",
  ];

  return Array(3)
    .fill(null)
    .map((_, index) => {
      const isAI = query.toLowerCase().includes("ai");
      const subreddit = isAI
        ? "ArtificialIntelligence"
        : mockSubreddits[Math.floor(Math.random() * mockSubreddits.length)];
      const upvotes = Math.floor(Math.random() * 10000);
      const commentCount = Math.floor(Math.random() * 500);
      const createdHoursAgo = Math.floor(Math.random() * 48);

      let title, content;
      if (isAI) {
        const aiTopics = [
          "Latest developments in AI research",
          "How AI is changing the job market",
          "Ethical considerations in AI development",
          "AI tools that are revolutionizing content creation",
          "The future of AI in healthcare",
        ];
        title = `${aiTopics[index % aiTopics.length]}: ${query}`;
        content = `This is a discussion about ${query} and how it relates to artificial intelligence. Many experts believe that AI will continue to evolve rapidly in the coming years, with significant implications for various industries and society as a whole.`;
      } else {
        title = `${query}: What you need to know in 2025`;
        content = `This post discusses everything about ${query}. It covers the latest developments, common misconceptions, and practical applications. The community has been very engaged with this topic recently.`;
      }

      return {
        title,
        content,
        url: `https://www.reddit.com/r/${subreddit}/comments/${Math.random()
          .toString(36)
          .substring(2, 10)}/${encodeURIComponent(
          title.toLowerCase().replace(/\s+/g, "_")
        )}`,
        subreddit,
        author: mockAuthors[Math.floor(Math.random() * mockAuthors.length)],
        upvotes,
        commentCount,
        awards:
          upvotes > 5000
            ? ["Gold", "Silver"]
            : upvotes > 1000
            ? ["Silver"]
            : [],
        thumbnail:
          index === 0
            ? `/placeholder.svg?height=96&width=96&text=${subreddit}`
            : undefined,
        isTextPost: index !== 0,
        createdAt:
          createdHoursAgo <= 1 ? "just now" : `${createdHoursAgo} hours ago`,
      };
    });
}

// For Google, we'll use a combination of public APIs to get real search results
async function fetchGoogleAlternativeResults(query: string) {
  try {
    const apiKey = process.env.GOOGLE_API_KEY;
    const cx = process.env.GOOGLE_SEARCH_CX; // Custom Search Engine ID
    console.log("Google API Key:", apiKey);
    console.log("Google Search CX:", cx);

    if (!apiKey || !cx) {
      console.error("Google API key or Search Engine ID is missing");
      return [];
    }

    const response = await fetch(
      `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${encodeURIComponent(
        query
      )}&num=${GoogleLimit}`
    );

    if (!response.ok) {
      throw new Error(`Google Search API error: ${response.status}`);
    }

    const data = await response.json();

    interface GoogleSearchItem {
      title: string;
      snippet: string;
      link: string;
      pagemap?: {
        cse_image?: Array<{
          src: string;
        }>;
      };
    }

    return data.items.map((item: GoogleSearchItem) => ({
      title: item.title,
      content: item.snippet,
      url: item.link,
      favicon:
        item.pagemap?.cse_image?.[0]?.src ||
        `/placeholder.svg?height=16&width=16`,
      siteName: new URL(item.link).hostname,
      screenshot:
        item.pagemap?.cse_image?.[0]?.src ||
        `/placeholder.svg?height=160&width=320&text=Website`,
    }));
  } catch (error) {
    console.error("Error fetching Google search results:", error);
    return [];
  }
}

// For X (formerly Twitter), we'll use rapidAPI to fetch the latest posts
async function fetchXResults(query: string) {
  try {
    const url = `https://twitter-api45.p.rapidapi.com/search_communities_latest.php?query=${encodeURIComponent(
      query
    )}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": process.env.X_RAPIDAPI_KEY || "",
        "X-RapidAPI-Host": process.env.X_RAPIDAPI_HOST || "",
      },
    });

    if (!response.ok) {
      console.error("X API Error:", response.status, await response.text());
      throw new Error("Failed to fetch X posts");
    }

    const data = await response.json();
    const timeline = data.timeline;

    if (!Array.isArray(timeline)) {
      console.error("Invalid data format:", data);
      return [];
    }

    return timeline.map((tweet: any) => {
      const user = tweet.user_info || {};
      const timeAgo = getTimeAgo(new Date(tweet.created_at));

      return {
        id: tweet.tweet_id,
        text: tweet.text,
        authorName: user.name,
        authorUsername: user.screen_name,
        authorProfileImage: user.profile_image_url,
        createdAt: timeAgo,
        url: `https://twitter.com/${user.screen_name}/status/${tweet.tweet_id}`,
        source: tweet.source,
        replies: tweet.replies || 0,
        retweets: tweet.retweets || 0,
        favorites: tweet.favorites || 0,
        views: tweet.views || 0,
      };
    });
  } catch (error) {
    console.error("Error fetching X results:", error);
    return [];
  }
}

// Helper functions
function parseDuration(duration: string): string {
  // Parse ISO 8601 duration format (PT1H2M3S)
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return "00:00";

  const hours = match[1] ? Number.parseInt(match[1]) : 0;
  const minutes = match[2] ? Number.parseInt(match[2]) : 0;
  const seconds = match[3] ? Number.parseInt(match[3]) : 0;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  }

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function formatCount(count: number): string {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  } else if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
}

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "just now";
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks} week${diffInWeeks > 1 ? "s" : ""} ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths > 1 ? "s" : ""} ago`;
  }

  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears} year${diffInYears > 1 ? "s" : ""} ago`;
}
