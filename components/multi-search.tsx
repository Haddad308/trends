"use client";

import { useState, useEffect, SetStateAction } from "react";
import { Search } from "lucide-react";
import { SearchResults } from "@/components/search-results";
import { TrendingSuggestions } from "@/components/trending-suggestions";
import { useDebounce } from "@/hooks/use-debounce";
import { Input } from "./ui/input";

export function MultiSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [showTrending, setShowTrending] = useState(false);
  interface SearchResult {
    title: string;
    link: string;
    snippet: string;
  }

  const [results, setResults] = useState<{
    google: SearchResult[];
    youtube: SearchResult[];
    reddit: SearchResult[];
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
        // In a real application, you would use actual API calls with proper API keys
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(debouncedSearchTerm)}`
        );
        const data = await response.json();
        setResults(data);
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        setIsSearching(false);
      }
    };

    fetchResults();
  }, [debouncedSearchTerm]);

  // Show trending suggestions when search term is entered but not long enough for full search
  useEffect(() => {
    setShowTrending(searchTerm.length >= 2 && searchTerm.length < 3);
  }, [searchTerm]);

  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion);
  };

  return (
    <div className="space-y-6">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="h-5 w-5 text-indigo-500" />
        </div>
        <Input
          type="search"
          placeholder="Search across platforms..."
          className="pl-10 py-6 text-lg rounded-xl border-indigo-200 focus:border-indigo-500 shadow-lg"
          value={searchTerm}
          onChange={(e: { target: { value: SetStateAction<string> } }) =>
            setSearchTerm(e.target.value)
          }
        />
      </div>

      {/* Show trending suggestions when search term is short */}
      {(showTrending || debouncedSearchTerm.length >= 3) && (
        <TrendingSuggestions
          searchTerm={searchTerm}
          onSuggestionClick={handleSuggestionClick}
        />
      )}

      {/* Show search results when search term is long enough */}
      {debouncedSearchTerm.length >= 3 && (
        <SearchResults
          results={results}
          searchTerm={debouncedSearchTerm}
          isLoading={isSearching}
        />
      )}
    </div>
  );
}
