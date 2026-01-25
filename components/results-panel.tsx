"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  Youtube,
  Globe,
  MessageCircle,
  RefreshCw,
  Search,
  LucideTwitter,
  TwitterIcon,
  InstagramIcon,
  LinkedinIcon,
} from "lucide-react";
import { GoogleResultCard } from "@/components/google-result-card";
import { YoutubeResultCard } from "@/components/youtube-result-card";
import { LinkedInResultCard } from "@/components/cards/LinkedInResultCard";
import { RedditResultCard } from "@/components/reddit-result-card";
import {
  GoogleResult,
  InstagramHashtag,
  InstagramPlace,
  InstagramResult,
  InstagramUser,
  LinkedInResult,
  RedditResult,
  SearchTab,
  TikTokResult,
  XResult,
  YoutubeResult,
} from "@/app/types";
import { PaginationNavigation } from "./PaginationNavigation";
import { XResultCard } from "./cards/XResultCard";
import { InstagramUserCard } from "./cards/instagram/InstagramUserCard";
import { InstagramHashtagCard } from "./cards/instagram/InstagramHashtagCard";
import { InstagramPlaceCard } from "./cards/instagram/InstagramPlaceCard";
import TiktokIcon from "./icons/TiktokIcon";
import TikTokResultCard from "./cards/TiktokResultCard";

interface ResultsPanelProps {
  results: {
    google: GoogleResult[];
    youtube: YoutubeResult[];
    reddit: RedditResult[];
    x: XResult[];
    instagram: InstagramResult;
    tiktok: TikTokResult[];
    linkedIn: LinkedInResult[];
  };
  searchTerm: string;
  isLoading: boolean;
  onRelatedSearchClick: (term: string) => void;
}

export function ResultsPanel({
  results,
  searchTerm,
  isLoading,
  onRelatedSearchClick,
}: ResultsPanelProps) {
  const [activeTab, setActiveTab] = useState<SearchTab>("google");
  const [currentPage, setCurrentPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const itemsPerPage =
    activeTab === "youtube" ? 6 : activeTab === "instagram" ? 10 : 5; // Number of items to display per page

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // In a real app, you would re-fetch the data here
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  if (searchTerm.length < 3) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <div className="mb-4">
          <Search className="h-16 w-16 text-slate-600 mx-auto" />
        </div>
        <h2 className="text-2xl font-bold text-slate-300 mb-2">
          Start searching
        </h2>
        <p className="text-slate-400 max-w-md">
          Enter a search term in the command palette to see results from Google,
          YouTube, Reddit, and more.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <Loader2 className="h-12 w-12 animate-spin text-purple-500 mb-4" />
        <p className="text-slate-400">Searching across platforms...</p>
      </div>
    );
  }

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = currentPage * itemsPerPage;

  const allInstagramResults = [
    ...results.instagram.hashtags.map((hashtag) => ({
      type: "hashtag",
      data: hashtag,
    })),
    ...results.instagram.users.map((user) => ({
      type: "user",
      data: user,
    })),
    ...results.instagram.places.map((place) => ({
      type: "place",
      data: place,
    })),
  ];

  const instagramPaginatedResults = allInstagramResults.slice(
    startIndex,
    endIndex
  );

  const instagramTotalResults =
    results.instagram.hashtags.length +
    results.instagram.users.length +
    results.instagram.places.length;

  const hasResults =
    results.google.length > 0 ||
    results.youtube.length > 0 ||
    results.reddit.length > 0 ||
    results.x.length > 0 ||
    instagramTotalResults > 0 ||
    results.tiktok.length > 0 ||
    results.linkedIn.length > 0;

  if (!hasResults) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <h2 className="text-2xl font-bold text-slate-300 mb-4">
          No results found
        </h2>
        <p className="text-slate-400 mb-6">
          We couldn&rdquo;t find any results for &rdquo;{searchTerm}&rdquo;
        </p>
        <Button onClick={() => onRelatedSearchClick("")}>
          Try a different search
        </Button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-slate-700 flex items-center sm:justify-between flex-wrap justify-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">
            Results for &rdquo;{searchTerm}&rdquo;
          </h2>
          <div className="flex items-center gap-2 mt-1 flex-wrap justify-center">
            <Badge
              variant="outline"
              className="bg-blue-900/20 text-blue-400 border-blue-800"
            >
              <Globe className="h-3 w-3 mr-1" />
              {results.google.length}
            </Badge>
            <Badge
              variant="outline"
              className="bg-red-900/20 text-red-400 border-red-800"
            >
              <Youtube className="h-3 w-3 mr-1" />
              {results.youtube.length}
            </Badge>
            <Badge
              variant="outline"
              className="bg-orange-900/20 text-orange-400 border-orange-800"
            >
              <MessageCircle className="h-3 w-3 mr-1" />
              {results.reddit.length}
            </Badge>
            <Badge
              variant="outline"
              className="bg-slate-900 border-black text-slate-400"
            >
              <TwitterIcon className="h-3 w-3 mr-1" />
              {results.x.length}
            </Badge>
            <Badge
              variant="outline"
              className="bg-pink-950/95 border-pink-900 text-pink-400"
            >
              <InstagramIcon className="h-3 w-3 mr-1" />
              {results.instagram.users.length +
                results.instagram.hashtags.length +
                results.instagram.places.length}
            </Badge>
            <Badge
              variant="outline"
              className="bg-slate-900 border-black text-slate-400"
            >
              <TiktokIcon />
              {results.tiktok.length}
            </Badge>
            <Badge
              variant="outline"
              className="bg-blue-900 border-blue text-blue-400"
            >
              <LinkedinIcon />
              {results.linkedIn.length}
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="border-slate-700 bg-slate-800 hover:bg-slate-700"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(value: string) => {
          const tab = value as SearchTab;
          setActiveTab(tab);
          setCurrentPage(1);
        }}
        className="flex-1 flex flex-col"
      >
        <div className="px-4 pt-4 flex justify-center">
          <TabsList className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 bg-slate-900 !h-fit">
            <TabsTrigger
              value="google"
              className="flex items-center justify-center gap-2 data-[state=active]:bg-blue-900/30 data-[state=active]:text-blue-300"
            >
              <Globe className="h-4 w-4" />
              Google
            </TabsTrigger>
            <TabsTrigger
              value="youtube"
              className="flex items-center justify-center gap-2 data-[state=active]:bg-red-900/30 data-[state=active]:text-red-300"
            >
              <Youtube className="h-4 w-4" />
              YouTube
            </TabsTrigger>
            <TabsTrigger
              value="reddit"
              className="flex items-center justify-center gap-2 data-[state=active]:bg-orange-900/30 data-[state=active]:text-orange-300"
            >
              <MessageCircle className="h-4 w-4" />
              Reddit
            </TabsTrigger>
            <TabsTrigger
              value="x"
              className="flex items-center justify-center gap-2 data-[state=active]:bg-slate-950/90"
            >
              <LucideTwitter className="h-4 w-4" />X
            </TabsTrigger>
            <TabsTrigger
              value="instagram"
              className="flex items-center justify-center gap-2 data-[state=active]:bg-pink-950/90 data-[state=active]:text-pink-300"
            >
              <InstagramIcon className="h-4 w-4" />
              Instagram
            </TabsTrigger>
            <TabsTrigger
              value="tiktok"
              className="flex items-center justify-center gap-2 data-[state=active]:bg-slate-950/90"
            >
              <TiktokIcon />
              Tiktok
            </TabsTrigger>
            <TabsTrigger
              value="linkedIn"
              className="flex items-center justify-center gap-2 data-[state=active]:bg-blue-950/90"
            >
              <LinkedinIcon />
              LinkedIn
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <TabsContent value="google" className="h-full mt-0">
            <div className="grid grid-cols-1 gap-4">
              {results.google
                .slice(
                  (currentPage - 1) * itemsPerPage,
                  currentPage * itemsPerPage
                )
                .map((result, index) => (
                  <GoogleResultCard
                    key={`google-tab-${index}`}
                    result={result}
                  />
                ))}

              {results.google.length === 0 && (
                <Card className="p-8 text-center bg-slate-800/50 border-slate-700">
                  <p className="text-slate-400">No Google results to display</p>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="youtube" className="h-full mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {results.youtube
                .slice(
                  (currentPage - 1) * itemsPerPage,
                  currentPage * itemsPerPage
                )
                .map((result, index) => (
                  <YoutubeResultCard
                    key={`youtube-tab-${index}`}
                    video={result}
                  />
                ))}
              {results.youtube.length === 0 && (
                <Card className="col-span-2 p-8 text-center bg-slate-800/50 border-slate-700">
                  <p className="text-slate-400">
                    No YouTube results to display
                  </p>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="reddit" className="h-full mt-0">
            <div className="grid grid-cols-1 gap-4">
              {results.reddit
                .slice(
                  (currentPage - 1) * itemsPerPage,
                  currentPage * itemsPerPage
                )
                .map((result, index) => (
                  <RedditResultCard key={`reddit-tab-${index}`} post={result} />
                ))}
              {results.reddit.length === 0 && (
                <Card className="p-8 text-center bg-slate-800/50 border-slate-700">
                  <p className="text-slate-400">No Reddit results to display</p>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="x" className="h-full mt-0">
            <div className="grid grid-cols-1 gap-4">
              {results.x
                .slice(
                  (currentPage - 1) * itemsPerPage,
                  currentPage * itemsPerPage
                )
                .map((result, index) => (
                  <XResultCard key={`x-tab-${index}`} tweet={result} />
                ))}
              {results.x.length === 0 && (
                <Card className="p-8 text-center bg-slate-800/50 border-slate-700">
                  <p className="text-slate-400">No X results to display</p>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="instagram" className="h-full mt-0">
            <div className="grid grid-cols-1 gap-4">
              {
                <>
                  {instagramPaginatedResults.map((item, index) => {
                    if (item.type === "hashtag") {
                      return (
                        <InstagramHashtagCard
                          key={`instagram-hashtag-tab-${index}`}
                          hashtag={item.data as InstagramHashtag}
                        />
                      );
                    } else if (item.type === "user") {
                      return (
                        <InstagramUserCard
                          key={`instagram-user-tab-${index}`}
                          user={item.data as InstagramUser}
                        />
                      );
                    } else if (item.type === "place") {
                      return (
                        <InstagramPlaceCard
                          key={`instagram-place-tab-${index}`}
                          place={item.data as InstagramPlace}
                        />
                      );
                    }
                    return null;
                  })}
                  {instagramPaginatedResults.length === 0 && (
                    <Card className="p-8 text-center bg-slate-800/50 border-slate-700">
                      <p className="text-slate-400">
                        No Instagram results to display
                      </p>
                    </Card>
                  )}
                </>
              }
            </div>
          </TabsContent>

          <TabsContent value="tiktok" className="h-full mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {results.tiktok
                .slice(
                  (currentPage - 1) * itemsPerPage,
                  currentPage * itemsPerPage
                )
                .map((result, index) => (
                  <TikTokResultCard key={`tiktok-tab-${index}`} item={result} />
                ))}
            </div>
            {results.tiktok.length === 0 && (
              <Card className="p-8 text-center bg-slate-800/50 border-slate-700">
                <p className="text-slate-400">No Tiktok results to display</p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="linkedIn" className="h-full mt-0">
            <div className="grid grid-cols-1 gap-4">
              {results.linkedIn
                .slice(
                  (currentPage - 1) * itemsPerPage,
                  currentPage * itemsPerPage
                )
                .map((result, index) => (
                  <LinkedInResultCard
                    key={`linkedIn-tab-${index}`}
                    post={result}
                  />
                ))}
              {results.linkedIn.length === 0 && (
                <Card className="p-8 text-center bg-slate-800/50 border-slate-700">
                  <p className="text-slate-400">
                    No LinkedIn results to display
                  </p>
                </Card>
              )}
            </div>
          </TabsContent>
        </div>
        {activeTab !== "instagram" && results[activeTab].length > 5 && (
          <PaginationNavigation
            currentPage={currentPage}
            totalItems={results[activeTab].length}
            itemsPerPage={itemsPerPage}
            onPageChange={(page) => setCurrentPage(page)}
          />
        )}
        {activeTab === "instagram" && instagramTotalResults > 5 && (
          <PaginationNavigation
            currentPage={currentPage}
            totalItems={instagramTotalResults}
            itemsPerPage={itemsPerPage}
            onPageChange={(page) => setCurrentPage(page)}
          />
        )}
      </Tabs>
    </div>
  );
}
