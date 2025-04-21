/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { CommandPalette } from "@/components/command-palette";
import { ResultsPanel } from "@/components/results-panel";
import { PlatformStats } from "@/components/platform-stats";
import { ModeToggle } from "@/components/mode-toggle";
import { Sparkles, History, BarChart3 } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import { TrendingTopics } from "./trending-topics";
import { SearchHistory } from "./search-history";

export function SearchDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("trending");
  const [results, setResults] = useState<{
    google: any[];
    youtube: any[];
    reddit: any[];
  }>({
    google: [],
    youtube: [],
    reddit: [],
  });

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    const fetchResults = async () => {
      if (debouncedSearchTerm.length < 3) {
        setResults({ google: [], youtube: [], reddit: [] });
        return;
      }

      setIsSearching(true);

      try {
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(debouncedSearchTerm)}`
        );
        const data = await response.json();
        setResults(data);

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
  }, [debouncedSearchTerm, searchHistory]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setActiveTab("trending");
  };

  const handleHistoryItemClick = (term: string) => {
    setSearchTerm(term);
    setActiveTab("trending");
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="bg-background border-b border-slate-700 dark:border-slate-700 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">
            <span className="text-purple-400">Omni</span>
            <span className="text-pink-400">Search</span>
          </h1>
          <div className="flex items-center gap-4">
            <ModeToggle />
          </div>
        </div>
      </header>

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
    </div>
  );
}
