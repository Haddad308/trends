"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Loader2, TrendingUp, Sparkles } from "lucide-react";
import { generateTopicsBasedOnSearch } from "@/lib/api";
import { useTrendingTopics } from "@/store/useTrendingTopics";

interface TrendingTopicsProps {
  onTopicClick: (topic: string) => void;
  searchTerm: string;
}

export function TrendingTopics({
  onTopicClick,
  searchTerm,
}: TrendingTopicsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { categories, featured, setTrendingTopics } = useTrendingTopics();

  useEffect(() => {
    const fetchTrendingTopics = async () => {
      if (searchTerm.length < 2) return;

      setIsLoading(true);
      try {
        // In a real app, you would fetch from an API
        // Here we'll generate topics based on the search term
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Generate topics based on search term
        const topics = await generateTopicsBasedOnSearch(searchTerm);
        setTrendingTopics(topics);
      } catch (error) {
        console.error("Error fetching trending topics:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrendingTopics();
  }, [searchTerm, setTrendingTopics]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
        <span className="ml-2 text-slate-400">Loading trending topics...</span>
      </div>
    );
  }

  // If search term is too short, show a prompt
  if (searchTerm.length < 2) {
    return (
      <div className="space-y-4 overflow-y-auto">
        <div className="text-center py-4">
          <Sparkles className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
          <h3 className="text-lg font-medium text-slate-300 mb-2">
            Discover Trending Topics
          </h3>
          <p className="text-slate-400 mb-4">
            Enter a search term to see related trending topics
          </p>
        </div>

        {/* Show some general trending topics */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-yellow-500" />
            <h3 className="font-medium text-yellow-300">Popular Searches</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              "AI tools",
              "Web development",
              "Data science",
              "Machine learning",
              "UX design",
            ].map((topic, index) => (
              <Badge
                key={index}
                variant="outline"
                className="px-3 py-1.5 bg-yellow-900/20 hover:bg-yellow-900/30 cursor-pointer transition-colors border-yellow-800/50 text-yellow-300"
                onClick={() => onTopicClick(topic)}
              >
                {topic}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 overflow-y-auto">
      {/* Featured Topics */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-yellow-500" />
          <h3 className="font-medium text-yellow-300">
            Featured Topics for &ldquo;{searchTerm}&ldquo;
          </h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {featured.map((topic, index) => (
            <Badge
              key={index}
              variant="outline"
              className="px-3 py-1.5 bg-yellow-900/20 hover:bg-yellow-900/30 cursor-pointer transition-colors border-yellow-800/50 text-yellow-300"
              onClick={() => onTopicClick(topic)}
            >
              {topic}
            </Badge>
          ))}
        </div>
      </div>

      {/* Categories */}
      {categories.map((category, categoryIndex) => (
        <div key={categoryIndex} className="space-y-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-purple-400" />
            <h3 className="font-medium text-purple-300">{category.name}</h3>
          </div>
          <div className="bg-slate-900 rounded-lg overflow-hidden">
            <div className="divide-y divide-slate-800">
              {category.topics.map((topic, topicIndex) => (
                <div
                  key={topicIndex}
                  className="p-3 hover:bg-slate-800 cursor-pointer transition-colors"
                  onClick={() => onTopicClick(topic)}
                >
                  {topic}
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
