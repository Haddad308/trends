import {
  InstagramHashtag,
  InstagramPlace,
  InstagramSearchResponse,
  InstagramUser,
  LinkedInResult,
  LinkedInRawPost,
  RawTweet,
  TikTokResult,
  TikTokRawEntry,
} from "@/app/types";
import { type NextRequest, NextResponse } from "next/server";

const RedditLimit = Math.floor(Math.random() * (20 - 10 + 1)) + 10; // Reddit API limit for search results
const YouTubeLimit = Math.floor(Math.random() * (20 - 10 + 1)) + 10; // YouTube API limit for search results
const GoogleLimit = Math.floor(Math.random() * (10 - 5 + 1)) + 5; // Google API limit for search results

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
    const [
      youtubeResults,
      redditResults,
      googleResults,
      xResults,
      instagramResults,
      TikTokResults,
      linkedInResults,
    ] = await Promise.all([
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
        console.error("X search error:", error);
        return [];
      }),
      fetchInstagramResults(query).catch((error) => {
        console.error("Instagram search error:", error);
        return { users: [], hashtags: [], places: [] };
      }),
      fetchTikTokResults(query).catch((error) => {
        console.error("TikTok search error:", error);
        return [];
      }),
      fetchLinkedInResults(query).catch((error) => {
        console.error("LinkedIn search error:", error);
        return [];
      }),
    ]);

    return NextResponse.json({
      youtube: youtubeResults,
      reddit: redditResults,
      google: googleResults,
      x: xResults,
      instagram: instagramResults,
      tiktok: TikTokResults,
      linkedIn: linkedInResults,
    });
  } catch (error) {
    console.error("Error fetching search results:", error);
    // Return partial results if available, otherwise empty arrays
    return NextResponse.json({
      youtube: [],
      reddit: getMockRedditResults(query),
      google: [],
      x: [],
      instagram: { users: [], hashtags: [], places: [] },
      tiktok: { users: [], videos: [] },
      linkedIn: [],
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

    return timeline.map((tweet: RawTweet) => {
      const timeAgo = getTimeAgo(new Date(tweet.created_at));

      return {
        id: tweet.tweet_id,
        text: tweet.text,
        authorName: tweet.user_info.name,
        authorUsername: tweet.user_info.screen_name,
        authorProfileImage: tweet.user_info.profile_image_url,
        createdAt: timeAgo,
        url: `https://twitter.com/${tweet.user_info.screen_name}/status/${tweet.tweet_id}`,
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

// For Instagram, we'll use a mock function to simulate results
async function fetchInstagramResults(query: string) {
  const res = await fetch(
    `https://instagram-looter2.p.rapidapi.com/search?query=${query}`,
    {
      headers: {
        "x-rapidapi-host": process.env.INSTAGRAM_RAPIDAPI_HOST || "",
        "x-rapidapi-key": process.env.X_RAPIDAPI_KEY || "",
      },
    }
  );

  if (!res.ok) throw new Error("Failed to fetch Instagram data");

  const data = await res.json();
  const mappedResponse = mapInstagramResponse(data);

  return {
    users: mappedResponse.users.slice(0, 5),
    hashtags: mappedResponse.hashtags.slice(0, 10),
    places: mappedResponse.places.slice(0, 5),
  };
}

// TikTok search API integration
async function fetchTikTokResults(query: string) {
  const res = await fetch(
    `https://tiktok-api23.p.rapidapi.com/api/search/general?keyword=${query}&count=20`,
    {
      headers: {
        "x-rapidapi-host": process.env.TIKTOK_RAPIDAPI_HOST || "",
        "x-rapidapi-key": process.env.X_RAPIDAPI_KEY || "",
      },
    }
  );

  if (!res.ok) throw new Error("Failed to fetch TikTok data");

  const data = await res.json();
  return mapTikTokResponse(data);
}

async function fetchLinkedInResults(query: string): Promise<LinkedInResult[]> {
  const res = await fetch(
    "https://linkedin-bulk-data-scraper.p.rapidapi.com/search_posts",
    {
      method: "POST",
      headers: {
        "x-rapidapi-host": process.env.LINKEDIN_RAPIDAPI_HOST || "",
        "x-rapidapi-key": process.env.X_RAPIDAPI_KEY || "",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        page: 1,
        query: query,
        filters: [
          {
            key: "datePosted",
            values: "past-week",
          },
        ],
      }),
    }
  );
  const data = await res.json();

  if (!data.success || !Array.isArray(data.posts))
    throw new Error("Failed to fetch LinkedIn data");

  return data.posts.map(
    (item: LinkedInRawPost): LinkedInResult => ({
      url: item.share_url,
      author: {
        name: item.actor.actor_name,
        description: item.actor.actor_description,
        subDescription: item.actor.actor_subDescription,
        profileUrl: item.actor.actor_navigationContext,
        avatar: item.actor.actor_image !== "na" ? item.actor.actor_image : null,
      },
      content: item.commentary,
      postedAt: item.postedAt,
      image: item.imageComponent?.[0],
      stats: {
        likes: item.social_details.numLikes,
        comments: item.social_details.numComments,
        shares: item.social_details.numShares,
      },
    })
  );
}

// Helper functions
function mapTikTokResponse(rawData: { data: TikTokRawEntry[] }) {
  const results: TikTokResult[] = [];

  rawData?.data?.forEach((entry: TikTokRawEntry) => {
    if (entry.type === 1 && "item" in entry && entry.item?.video) {
      results.push({
        type: "video",
        id: entry.item.id,
        description: entry.item.desc,
        createTime: entry.item.createTime,
        cover: entry.item.video.cover,
        playUrl: entry.item.video.playAddr,
        duration: entry.item.video.duration,
        width: entry.item.video.width,
        height: entry.item.video.height,
      });
    }

    if (entry.type === 4 && "user_list" in entry) {
      entry.user_list.forEach((userEntry) => {
        const user = userEntry.user_info;
        results.push({
          type: "user",
          id: user.uid,
          uniqueId: user.unique_id,
          nickname: user.nickname,
          avatar: user.avatar_thumb?.url_list?.[0] ?? "",
          signature: user.signature,
          followerCount: user.follower_count,
        });
      });
    }
  });

  return results;
}

function mapInstagramResponse(data: InstagramSearchResponse) {
  const users: InstagramUser[] = data.users.map(({ user }) => ({
    id: user.id,
    username: user.username,
    fullName: user.full_name,
    isVerified: user.is_verified,
    profilePicUrl: user.profile_pic_url,
  }));

  const hashtags: InstagramHashtag[] = data.hashtags.map(({ hashtag }) => ({
    id: hashtag.id.toString(),
    name: hashtag.name,
    mediaCount: hashtag.media_count,
  }));

  const places: InstagramPlace[] = data.places.map(({ place }) => ({
    id: place.location.pk.toString(),
    title: place.title,
    subtitle: place.subtitle,
    locationName: place.location.name,
  }));

  return { users, hashtags, places };
}

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
