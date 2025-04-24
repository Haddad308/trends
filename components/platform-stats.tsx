"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Youtube, Globe, MessageCircle } from "lucide-react";

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
  };
}

export function PlatformStats({ searchTerm, results }: PlatformStatsProps) {
  // Calculate total results
  const totalResults =
    results.google.length + results.youtube.length + results.reddit.length;

  // Calculate percentages
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
            </div>

            <div className="flex justify-between mt-2">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                <span className="text-xs text-slate-400">
                  Google ({googlePercentage}%)
                </span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                <span className="text-xs text-slate-400">
                  YouTube ({youtubePercentage}%)
                </span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-orange-600 rounded-full"></div>
                <span className="text-xs text-slate-400">
                  Reddit ({redditPercentage}%)
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
        </div>
      </div>
    </div>
  );
}
