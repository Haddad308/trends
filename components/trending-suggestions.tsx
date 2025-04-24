"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useDebounce } from "@/hooks/use-debounce";
import { Loader2, Search, Youtube, Globe } from "lucide-react";

interface TrendingSuggestionsProps {
  searchTerm: string;
  onSuggestionClick: (suggestion: string) => void;
}

interface SuggestionCategories {
  questions: string[];
  prepositions: string[];
  comparisons: string[];
  alphabetical: Record<string, string[]>;
  trending: string[];
}

export function TrendingSuggestions({
  searchTerm,
  onSuggestionClick,
}: TrendingSuggestionsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<{
    google: SuggestionCategories | null;
    youtube: SuggestionCategories | null;
  }>({
    google: null,
    youtube: null,
  });

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedSearchTerm.length < 2) {
        setSuggestions({ google: null, youtube: null });
        return;
      }

      setIsLoading(true);

      try {
        const response = await fetch(
          `/api/trending?q=${encodeURIComponent(debouncedSearchTerm)}`
        );
        const data = await response.json();
        setSuggestions(data);
      } catch (error) {
        console.error("Error fetching trending suggestions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuggestions();
  }, [debouncedSearchTerm]);

  if (debouncedSearchTerm.length < 2) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <Card className="mt-6 border-indigo-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center gap-2">
          <Search className="h-5 w-5 text-indigo-600" />
          Trending Suggestions for &rdquo;{debouncedSearchTerm}&rdquo;
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="google" className="w-full">
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="google" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Google Trends
            </TabsTrigger>
            <TabsTrigger value="youtube" className="flex items-center gap-2">
              <Youtube className="h-4 w-4" />
              YouTube Trends
            </TabsTrigger>
          </TabsList>

          <TabsContent value="google">
            {suggestions.google ? (
              <div className="space-y-6">
                {/* Trending Section */}
                {suggestions.google.trending.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-indigo-800">
                      Trending Searches
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {suggestions.google.trending.map((suggestion, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="px-3 py-1 bg-indigo-50 hover:bg-indigo-100 cursor-pointer transition-colors border-indigo-200 text-indigo-800"
                          onClick={() => onSuggestionClick(suggestion)}
                        >
                          {suggestion}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Questions Section */}
                {suggestions.google.questions.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-indigo-800">
                      Questions People Ask
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {suggestions.google.questions.map((question, index) => (
                        <div
                          key={index}
                          className="p-2 rounded-md bg-indigo-50 hover:bg-indigo-100 cursor-pointer transition-colors"
                          onClick={() => onSuggestionClick(question)}
                        >
                          {question}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Prepositions Section */}
                {suggestions.google.prepositions.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-indigo-800">
                      Prepositions
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                      {suggestions.google.prepositions.map(
                        (preposition, index) => (
                          <div
                            key={index}
                            className="p-2 rounded-md bg-blue-50 hover:bg-blue-100 cursor-pointer transition-colors"
                            onClick={() => onSuggestionClick(preposition)}
                          >
                            {preposition}
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

                {/* Comparisons Section */}
                {suggestions.google.comparisons.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-indigo-800">
                      Comparisons
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {suggestions.google.comparisons.map(
                        (comparison, index) => (
                          <div
                            key={index}
                            className="p-2 rounded-md bg-purple-50 hover:bg-purple-100 cursor-pointer transition-colors"
                            onClick={() => onSuggestionClick(comparison)}
                          >
                            {comparison}
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

                {/* Alphabetical Section */}
                {Object.keys(suggestions.google.alphabetical).length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-indigo-800">
                      Alphabetical
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {Object.entries(suggestions.google.alphabetical).map(
                        ([letter, words]) => (
                          <div key={letter} className="space-y-2">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">
                                {letter}
                              </div>
                              <div className="h-px flex-grow bg-indigo-200"></div>
                            </div>
                            <div className="space-y-1 pl-10">
                              {words.map((word, wordIndex) => (
                                <div
                                  key={wordIndex}
                                  className="p-1 rounded hover:bg-indigo-50 cursor-pointer transition-colors"
                                  onClick={() => onSuggestionClick(word)}
                                >
                                  {word}
                                </div>
                              ))}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No trending suggestions available for Google
              </div>
            )}
          </TabsContent>

          <TabsContent value="youtube">
            {suggestions.youtube ? (
              <div className="space-y-6">
                {/* Trending Section */}
                {suggestions.youtube.trending.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-red-800">
                      Trending on YouTube
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {suggestions.youtube.trending.map((suggestion, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="px-3 py-1 bg-red-50 hover:bg-red-100 cursor-pointer transition-colors border-red-200 text-red-800"
                          onClick={() => onSuggestionClick(suggestion)}
                        >
                          {suggestion}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Questions Section */}
                {suggestions.youtube.questions.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-red-800">
                      Popular YouTube Questions
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {suggestions.youtube.questions.map((question, index) => (
                        <div
                          key={index}
                          className="p-2 rounded-md bg-red-50 hover:bg-red-100 cursor-pointer transition-colors"
                          onClick={() => onSuggestionClick(question)}
                        >
                          {question}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Prepositions Section */}
                {suggestions.youtube.prepositions.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-red-800">
                      YouTube Topics
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                      {suggestions.youtube.prepositions.map(
                        (preposition, index) => (
                          <div
                            key={index}
                            className="p-2 rounded-md bg-orange-50 hover:bg-orange-100 cursor-pointer transition-colors"
                            onClick={() => onSuggestionClick(preposition)}
                          >
                            {preposition}
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

                {/* Comparisons Section */}
                {suggestions.youtube.comparisons.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-red-800">
                      YouTube Comparisons
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {suggestions.youtube.comparisons.map(
                        (comparison, index) => (
                          <div
                            key={index}
                            className="p-2 rounded-md bg-yellow-50 hover:bg-yellow-100 cursor-pointer transition-colors"
                            onClick={() => onSuggestionClick(comparison)}
                          >
                            {comparison}
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

                {/* Alphabetical Section */}
                {Object.keys(suggestions.youtube.alphabetical).length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-red-800">
                      YouTube Categories
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {Object.entries(suggestions.youtube.alphabetical).map(
                        ([letter, words]) => (
                          <div key={letter} className="space-y-2">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold">
                                {letter}
                              </div>
                              <div className="h-px flex-grow bg-red-200"></div>
                            </div>
                            <div className="space-y-1 pl-10">
                              {words.map((word, wordIndex) => (
                                <div
                                  key={wordIndex}
                                  className="p-1 rounded hover:bg-red-50 cursor-pointer transition-colors"
                                  onClick={() => onSuggestionClick(word)}
                                >
                                  {word}
                                </div>
                              ))}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No trending suggestions available for YouTube
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
