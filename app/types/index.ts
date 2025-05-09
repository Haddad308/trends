export type SearchTab =
  | "google"
  | "youtube"
  | "reddit"
  | "x"
  | "instagram"
  | "tiktok";

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

// Raw types from X API
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

export interface XResult {
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

// Raw types from Instagram API
interface InstagramUserRaw {
  position: number;
  user: {
    id: string;
    pk: string;
    username: string;
    full_name: string;
    is_verified: boolean;
    profile_pic_url: string;
  };
}

interface InstagramHashtagRaw {
  position: number;
  hashtag: {
    name: string;
    media_count: number;
    id: string;
  };
}

interface InstagramPlaceRaw {
  position: number;
  place: {
    title: string;
    subtitle: string;
    location: {
      pk: number;
      name: string;
      facebook_places_id: number;
    };
  };
}

export interface InstagramSearchResponse {
  users: InstagramUserRaw[];
  hashtags: InstagramHashtagRaw[];
  places: InstagramPlaceRaw[];
}

// Processed types for easier use in the app
export interface InstagramUser {
  id: string;
  username: string;
  fullName: string;
  isVerified: boolean;
  profilePicUrl: string;
}

export interface InstagramHashtag {
  id: string;
  name: string;
  mediaCount: number;
}

export interface InstagramPlace {
  id: string;
  title: string;
  subtitle: string;
  locationName: string;
}

export interface InstagramResult {
  users: InstagramUser[];
  places: InstagramPlace[];
  hashtags: InstagramHashtag[];
}

export type TikTokRawVideoEntry = {
  type: 1;
  item: {
    id: string;
    desc: string;
    createTime: number;
    video: {
      cover: string;
      playAddr: string;
      duration: number;
      width: number;
      height: number;
    };
  };
};

export type TikTokRawUserEntry = {
  type: 4;
  user_list: {
    user_info: {
      uid: string;
      nickname: string;
      signature: string;
      avatar_thumb: {
        url_list: string[];
      };
      unique_id: string;
      follower_count: number;
    };
  }[];
};

export type TikTokRawEntry = TikTokRawVideoEntry | TikTokRawUserEntry;

export type TikTokVideo = {
  type: "video";
  id: string;
  description: string;
  createTime: number;
  cover: string;
  playUrl: string;
  duration: number;
  width: number;
  height: number;
};

export type TikTokUser = {
  type: "user";
  id: string;
  uniqueId: string;
  nickname: string;
  avatar: string;
  signature: string;
  followerCount: number;
};

export type TikTokMappedItem = TikTokVideo | TikTokUser;
