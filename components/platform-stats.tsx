"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Youtube,
  Globe,
  MessageCircle,
  TwitterIcon,
  InstagramIcon,
  LinkedinIcon,
} from "lucide-react";
import TiktokIcon from "@/components/icons/TiktokIcon";
import {
  InstagramResult,
  LinkedInResult,
  TikTokResult,
  XResult,
} from "@/app/types";

interface GoogleResult {
  title: string;
  link: string;
  snippet: string;
}

interface YoutubeResult {
  title: string;
  link: string;
  description: string;
  thumbnailUrl: string;
}

interface RedditResult {
  title: string;
  link: string;
  selftext: string;
}

interface PlatformStatsProps {
  searchTerm: string;
  results: {
    google: GoogleResult[];
    youtube: YoutubeResult[];
    reddit: RedditResult[];
    x: XResult[];
    instagram: InstagramResult;
    tiktok: TikTokResult[];
    linkedIn: LinkedInResult[];
  };
}

export function PlatformStats({ searchTerm, results }: PlatformStatsProps) {
  // Calculate total results
  const totalInstagramResults =
    results.instagram.users.length +
    results.instagram.places.length +
    results.instagram.hashtags.length;

  const totalResults =
    results.google.length +
    results.youtube.length +
    results.reddit.length +
    results.x.length +
    totalInstagramResults +
    results.tiktok.length +
    results.linkedIn.length;

  const googlePercentage =
    totalResults > 0
      ? Math.round((results.google.length / totalResults) * 100)
      : 0;
  const youtubePercentage =
    totalResults > 0
      ? Math.round((results.youtube.length / totalResults) * 100)
      : 0;
  const redditPercentage =
    totalResults > 0
      ? Math.round((results.reddit.length / totalResults) * 100)
      : 0;
  const xPercentage =
    totalResults > 0 ? Math.round((results.x.length / totalResults) * 100) : 0;
  const instagramPercentage =
    totalResults > 0
      ? Math.round((totalInstagramResults / totalResults) * 100)
      : 0;
  const tiktokPercentage =
    totalResults > 0
      ? Math.round((results.tiktok.length / totalResults) * 100)
      : 0;
  const linkedinPercentage =
    totalResults > 0
      ? Math.round((results.linkedIn.length / totalResults) * 100)
      : 0;

  if (searchTerm.length < 3) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-4">
        <h3 className="text-lg font-medium text-slate-300 mb-2">
          No stats available
        </h3>
        <p className="text-slate-400">
          Enter a search term to see platform statistics
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="font-medium text-slate-300">Platform Distribution</h3>

      <div className="grid grid-cols-1 gap-4">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">
              Results Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-4 bg-slate-700 rounded-full overflow-hidden flex">
              <div
                className="h-full bg-blue-600"
                style={{ width: `${googlePercentage}%` }}
                title={`Google: ${googlePercentage}%`}
              ></div>
              <div
                className="h-full bg-red-600"
                style={{ width: `${youtubePercentage}%` }}
                title={`YouTube: ${youtubePercentage}%`}
              ></div>
              <div
                className="h-full bg-orange-600"
                style={{ width: `${redditPercentage}%` }}
                title={`Reddit: ${redditPercentage}%`}
              ></div>
              <div
                className="h-full bg-purple-600"
                style={{ width: `${xPercentage}%` }}
                title={`X: ${xPercentage}%`}
              ></div>
              <div
                className="h-full bg-pink-600"
                style={{ width: `${instagramPercentage}%` }}
                title={`Instagram: ${instagramPercentage}%`}
              ></div>
              <div
                className="h-full bg-green-600"
                style={{ width: `${tiktokPercentage}%` }}
                title={`TikTok: ${tiktokPercentage}%`}
              ></div>
              <div
                className="h-full bg-blue-400"
                style={{ width: `${linkedinPercentage}%` }}
                title={`LinkedIn: ${linkedinPercentage}%`}
              ></div>
            </div>

            <div className="flex justify-between mt-2">
              <div className="flex items-center gap-1 flex-wrap justify-center">
                <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                <span className="text-xs text-slate-400">
                  Google ({googlePercentage}%)
                </span>
              </div>
              <div className="flex items-center gap-1 flex-wrap justify-center">
                <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                <span className="text-xs text-slate-400">
                  YouTube ({youtubePercentage}%)
                </span>
              </div>
              <div className="flex items-center gap-1 flex-wrap justify-center">
                <div className="w-3 h-3 bg-orange-600 rounded-full"></div>
                <span className="text-xs text-slate-400">
                  Reddit ({redditPercentage}%)
                </span>
              </div>
              <div className="flex items-center gap-1 flex-wrap justify-center">
                <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
                <span className="text-xs text-slate-400">
                  X ({xPercentage}%)
                </span>
              </div>
              <div className="flex items-center gap-1 flex-wrap justify-center">
                <div className="w-3 h-3 bg-pink-600 rounded-full"></div>
                <span className="text-xs text-slate-400">
                  Instagram ({instagramPercentage}%)
                </span>
              </div>
              <div className="flex items-center gap-1 flex-wrap justify-center">
                <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                <span className="text-xs text-slate-400">
                  TikTok ({tiktokPercentage}%)
                </span>
              </div>
              <div className="flex items-center gap-1 flex-wrap justify-center">
                <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                <span className="text-xs text-slate-400">
                  LinkedIn ({linkedinPercentage}%)
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-3 gap-4">
          <Card className="bg-blue-900/20 border-blue-800/50">
            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
              <Globe className="h-8 w-8 text-blue-400 mb-2" />
              <div className="text-2xl font-bold text-blue-300">
                {results.google.length}
              </div>
              <div className="text-xs text-blue-400">Google Results</div>
            </CardContent>
          </Card>

          <Card className="bg-red-900/20 border-red-800/50">
            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
              <Youtube className="h-8 w-8 text-red-400 mb-2" />
              <div className="text-2xl font-bold text-red-300">
                {results.youtube.length}
              </div>
              <div className="text-xs text-red-400">YouTube Results</div>
            </CardContent>
          </Card>

          <Card className="bg-orange-900/20 border-orange-800/50">
            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
              <MessageCircle className="h-8 w-8 text-orange-400 mb-2" />
              <div className="text-2xl font-bold text-orange-300">
                {results.reddit.length}
              </div>
              <div className="text-xs text-orange-400">Reddit Results</div>
            </CardContent>
          </Card>

          <Card className="bg-purple-900/20 border-purple-800/50">
            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
              <TwitterIcon className="h-8 w-8 text-purple-400 mb-2" />
              <div className="text-2xl font-bold text-purple-300">
                {results.x.length}
              </div>
              <div className="text-xs text-purple-400">X Results</div>
            </CardContent>
          </Card>

          <Card className="bg-pink-900/20 border-pink-800/50">
            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
              <InstagramIcon className="h-8 w-8 text-pink-400 mb-2" />
              <div className="text-2xl font-bold text-pink-300">
                {totalInstagramResults}
              </div>
              <div className="text-xs text-pink-400">Instagram Results</div>
            </CardContent>
          </Card>

          <Card className="bg-green-900/20 border-green-800/50">
            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
              <TiktokIcon className="h-8 w-8 text-green-400 mb-2" />
              <div className="text-2xl font-bold text-green-300">
                {results.tiktok.length}
              </div>
              <div className="text-xs text-green-400">TikTok Results</div>
            </CardContent>
          </Card>

          <Card className="bg-blue-400/20 border-blue-400/50">
            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
              <LinkedinIcon className="h-8 w-8 text-blue-400 mb-2" />
              <div className="text-2xl font-bold text-blue-300">
                {results.linkedIn.length}
              </div>
              <div className="text-xs text-blue-400">LinkedIn Results</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
