export interface GoogleResult {
  title: string;
  content: string;
  url: string;
  favicon: string;
  siteName: string;
  screenshot: string;
}

export interface YoutubeResult {
  title: string;
  description: string;
  url: string;
  thumbnail: string;
  channelName: string;
  channelIcon: string;
  viewCount: string;
  publishedAt: string;
  duration: string;
  videoId: string;
}

export interface RedditResult {
  title: string;
  content: string;
  url: string;
  subreddit: string;
  author: string;
  upvotes: number;
  commentCount: number;
  awards: string[];
  thumbnail?: string;
  isTextPost: boolean;
  createdAt: string;
}

export interface RawTweet {
  tweet_id: string;
  text: string;
  created_at: string;
  source: string;
  replies?: number;
  retweets?: number;
  favorites?: number;
  views?: number;
  user_info: {
    name: string;
    screen_name: string;
    profile_image_url: string;
  };
}

export interface XResults {
  id: string;
  text: string;
  authorName: string;
  authorUsername: string;
  authorProfileImage: string;
  createdAt: string;
  url: string;
  source: string;
  replies: number;
  retweets: number;
  favorites: number;
  views: number;
}
