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
} from "lucide-react";
import { GoogleResultCard } from "@/components/google-result-card";
import { YoutubeResultCard } from "@/components/youtube-result-card";
import { RedditResultCard } from "@/components/reddit-result-card";
import {
  GoogleResult,
  InstagramResult,
  RedditResult,
  SearchTab,
  XResult,
  YoutubeResult,
} from "@/app/types";
import { PaginationNavigation } from "./PaginationNavigation";
import { XResultCard } from "./cards/XResultCard";
import { InstagramUserCard } from "./cards/instagram/InstagramUserCard";
import { InstagramHashtagCard } from "./cards/instagram/InstagramHashtagCard";
import { InstagramPlaceCard } from "./cards/instagram/InstagramPlaceCard";
import { cn } from "@/lib/utils";

interface ResultsPanelProps {
  results: {
    google: GoogleResult[];
    youtube: YoutubeResult[];
    reddit: RedditResult[];
    x: XResult[];
    instagram: InstagramResult;
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
  const [activeTab, setActiveTab] = useState<SearchTab>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const itemsPerPage = activeTab === "youtube" ? 6 : 5; // Number of items to display per page

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
          YouTube, and Reddit.
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

  const hasResults =
    results.google.length > 0 ||
    results.youtube.length > 0 ||
    results.reddit.length > 0;

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
      <div className="p-4 border-b border-slate-700 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">
            Results for &rdquo;{searchTerm}&rdquo;
          </h2>
          <div className="flex items-center gap-2 mt-1">
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
            <Badge variant="outline" className="bg-slate-900 border-black">
              <TwitterIcon className="h-3 w-3 mr-1" />
              {results.x.length}
            </Badge>
            <Badge variant="outline" className="bg-pink-950/95 border-pink-900">
              <InstagramIcon className="h-3 w-3 mr-1" />
              {results.instagram.users.length +
                results.instagram.hashtags.length +
                results.instagram.places.length}
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
          <TabsList className="grid grid-cols-3 md:grid-cols-6 bg-slate-900 !h-fit">
            {[
              { value: "all", label: "All Results", bg: "bg-slate-800" },
              {
                value: "google",
                label: "Google",
                icon: <Globe className="h-4 w-4" />,
                bg: "bg-blue-900/30",
                text: "text-blue-300",
              },
              {
                value: "youtube",
                label: "YouTube",
                icon: <Youtube className="h-4 w-4" />,
                bg: "bg-red-900/30",
                text: "text-red-300",
              },
              {
                value: "reddit",
                label: "Reddit",
                icon: <MessageCircle className="h-4 w-4" />,
                bg: "bg-orange-900/30",
                text: "text-orange-300",
              },
              {
                value: "x",
                label: "X",
                icon: <LucideTwitter className="h-4 w-4" />,
                bg: "bg-slate-950/90",
              },
              {
                value: "instagram",
                label: "Instagram",
                icon: <InstagramIcon className="h-4 w-4" />,
                bg: "bg-pink-950/90",
                text: "text-pink-300",
              },
            ].map(({ value, label, icon, bg = "", text = "" }) => (
              <TabsTrigger
                key={value}
                value={value}
                className={cn(
                  "flex items-center justify-center gap-2 w-full h-full data-[state=active]:text-white",
                  bg && `data-[state=active]:${bg}`,
                  text && `data-[state=active]:${text}`
                )}
              >
                {icon}
                {label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <TabsContent value="all" className="h-full mt-0 space-y-6">
            {/* Related Searches
            <RelatedSearches
              searchTerm={searchTerm}
              onRelatedSearchClick={onRelatedSearchClick}
            /> */}

            {/* Google Results */}
            {results.google.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-blue-500" />
                  <h3 className="text-lg font-semibold text-blue-300">
                    Google Results
                  </h3>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {results.google.map((result, index) => (
                    <GoogleResultCard key={`google-${index}`} result={result} />
                  ))}
                </div>
              </div>
            )}

            {/* YouTube Results */}
            {results.youtube.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Youtube className="h-5 w-5 text-red-500" />
                  <h3 className="text-lg font-semibold text-red-300">
                    YouTube Results
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {results.youtube.map((result, index) => (
                    <YoutubeResultCard
                      key={`youtube-${index}`}
                      video={result}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Reddit Results */}
            {results.reddit.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-orange-500" />
                  <h3 className="text-lg font-semibold text-orange-300">
                    Reddit Results
                  </h3>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {results.reddit.map((result, index) => (
                    <RedditResultCard key={`reddit-${index}`} post={result} />
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

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
              {results.instagram.hashtags.slice(
                (currentPage - 1) * itemsPerPage,
                currentPage * itemsPerPage
              ).length > 0 && (
                <h3 className="text-lg font-semibold text-blue-300">
                  Hastags Related to your search
                </h3>
              )}
              {results.instagram.hashtags
                .slice(
                  (currentPage - 1) * itemsPerPage,
                  currentPage * itemsPerPage
                )
                .map((hashtag, index) => (
                  <InstagramHashtagCard
                    key={`instagram-hashtag-tab-${index}`}
                    hashtag={hashtag}
                  />
                ))}
              {results.instagram.users.slice(
                (currentPage - 1) * itemsPerPage,
                currentPage * itemsPerPage
              ).length > 0 && (
                <h3 className="text-lg font-semibold text-blue-300">
                  Users Related to your search
                </h3>
              )}
              {results.instagram.users
                .slice(
                  (currentPage - 1) * itemsPerPage,
                  currentPage * itemsPerPage
                )
                .map((user, index) => (
                  <InstagramUserCard
                    key={`instagram-user-tab-${index}`}
                    user={user}
                  />
                ))}
              {results.instagram.places.slice(
                (currentPage - 1) * itemsPerPage,
                currentPage * itemsPerPage
              ).length > 0 && (
                <h3 className="text-lg font-semibold text-blue-300">
                  Places Related to your search
                </h3>
              )}
              {results.instagram.places
                .slice(
                  (currentPage - 1) * itemsPerPage,
                  currentPage * itemsPerPage
                )
                .map((place, index) => (
                  <InstagramPlaceCard
                    key={`instagram-place-tab-${index}`}
                    place={place}
                  />
                ))}
              {results.instagram.users.length +
                results.instagram.hashtags.length +
                results.instagram.places.length ===
                0 && (
                <Card className="p-8 text-center bg-slate-800/50 border-slate-700">
                  <p className="text-slate-400">
                    No Instagram results to display
                  </p>
                </Card>
              )}
            </div>
          </TabsContent>
        </div>
        {activeTab !== "all" &&
          activeTab !== "instagram" &&
          results[activeTab].length > 5 && (
            <PaginationNavigation
              currentPage={currentPage}
              totalItems={results[activeTab].length}
              itemsPerPage={itemsPerPage}
              onPageChange={(page) => setCurrentPage(page)}
            />
          )}
        {activeTab === "instagram" &&
          results[activeTab].users.length +
            results[activeTab].hashtags.length +
            results[activeTab].places.length >
            5 && (
            <PaginationNavigation
              currentPage={currentPage}
              totalItems={
                results[activeTab].users.length +
                results[activeTab].hashtags.length +
                results[activeTab].places.length
              }
              itemsPerPage={itemsPerPage}
              onPageChange={(page) => setCurrentPage(page)}
            />
          )}
      </Tabs>
    </div>
  );
}
