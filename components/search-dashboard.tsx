/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { CommandPalette } from "@/components/command-palette";
import { ResultsPanel } from "@/components/results-panel";
import { PlatformStats } from "@/components/platform-stats";
import { Sparkles, History, BarChart3 } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import { TrendingTopics } from "./trending-topics";
import { SearchHistory } from "./search-history";
import Navbar from "./Navbar";
import { LinkedInResult } from "@/app/types";
import { SubscriptionModal } from "@/components/modals/SubscriptionModal";
import { useAuth } from "@/firebase/auth-context";
import { updateFreeSearchCount } from "@/firebase/firestore";

export function SearchDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("trending");
  const [results, setResults] = useState<{
    google: any[];
    youtube: any[];
    reddit: any[];
    x: any[];
    instagram: any;
    tiktok: any[];
    linkedIn: LinkedInResult[];
  }>({
    google: [],
    youtube: [],
    reddit: [],
    x: [],
    instagram: { hashtags: [], users: [], places: [] },
    tiktok: [],
    linkedIn: [],
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user, setUser } = useAuth();
  const freeSearchCount = user?.freeSearchCount;

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    const fetchResults = async () => {
      // Return if the user has used all free searches
      if (freeSearchCount === 0) {
        setIsModalOpen(true);
        return;
      }
      // Return if the search term is less than 3 characters
      if (debouncedSearchTerm.length < 3) {
        setResults({
          google: [],
          youtube: [],
          reddit: [],
          x: [],
          instagram: { hashtags: [], users: [], places: [] },
          tiktok: [],
          linkedIn: [],
        });
        return;
      }

      setIsSearching(true);

      try {
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(debouncedSearchTerm)}`
        );
        const data = await response.json();
        setResults(data);

        // Deduct one free search count
        if (user && freeSearchCount !== undefined) {
          const isUpdated = await updateFreeSearchCount(
            user.uid,
            freeSearchCount - 1
          );
          if (isUpdated) {
            setUser((prev) => {
              if (!prev) return null;
              return {
                ...prev,
                freeSearchCount: freeSearchCount - 1,
              };
            });
          }
        }
        // Add to search history if not already present
        if (
          debouncedSearchTerm.trim() &&
          !searchHistory.includes(debouncedSearchTerm)
        ) {
          setSearchHistory((prev) =>
            [debouncedSearchTerm, ...prev].slice(0, 10)
          );
        }
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        setIsSearching(false);
      }
    };

    fetchResults();
  }, [debouncedSearchTerm, setSearchHistory]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setActiveTab("trending");
  };

  const handleHistoryItemClick = (term: string) => {
    setSearchTerm(term);
    setActiveTab("trending");
  };

  return (
    <section className="flex flex-col bg-background">
      {/* Subscription Modal */}
      {isModalOpen && (
        <SubscriptionModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
      <Navbar />
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
            {/* Left Panel - Now 5 columns wide */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              {/* Command Palette */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 shadow-xl">
                <CommandPalette
                  searchTerm={searchTerm}
                  onSearch={handleSearch}
                  isSearching={isSearching}
                  searchHistory={searchHistory}
                />
              </div>

              {/* Tabs for Left Panel */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 shadow-xl flex-1 overflow-hidden flex flex-col">
                <Tabs
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="flex-1 flex flex-col"
                >
                  <div className="px-4 pt-4">
                    <TabsList className="grid grid-cols-3 w-full bg-slate-900">
                      <TabsTrigger
                        value="trending"
                        className="flex items-center gap-2 data-[state=active]:bg-slate-800"
                      >
                        <Sparkles className="h-4 w-4" />
                        <span className="hidden sm:inline">Trending</span>
                      </TabsTrigger>
                      <TabsTrigger
                        value="history"
                        className="flex items-center gap-2 data-[state=active]:bg-slate-800"
                      >
                        <History className="h-4 w-4" />
                        <span className="hidden sm:inline">History</span>
                      </TabsTrigger>
                      <TabsTrigger
                        value="stats"
                        className="flex items-center gap-2 data-[state=active]:bg-slate-800"
                      >
                        <BarChart3 className="h-4 w-4" />
                        <span className="hidden sm:inline">Stats</span>
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 h-[calc(100vh-240px)]">
                    <TabsContent value="trending" className="h-full mt-0">
                      <TrendingTopics
                        onTopicClick={handleSearch}
                        searchTerm={searchTerm}
                      />
                    </TabsContent>
                    <TabsContent value="history" className="h-full mt-0">
                      <SearchHistory
                        history={searchHistory}
                        onHistoryItemClick={handleHistoryItemClick}
                      />
                    </TabsContent>
                    <TabsContent value="stats" className="h-full mt-0">
                      <PlatformStats
                        searchTerm={debouncedSearchTerm}
                        results={results}
                      />
                    </TabsContent>
                  </div>
                </Tabs>
              </div>
            </div>

            {/* Right Panel - Results - Now 7 columns wide */}
            <div className="lg:col-span-7 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 shadow-xl overflow-hidden">
              <ResultsPanel
                results={results}
                searchTerm={debouncedSearchTerm}
                isLoading={isSearching}
                onRelatedSearchClick={handleSearch}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
