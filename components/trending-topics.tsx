"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Loader2, TrendingUp, Sparkles } from "lucide-react";

interface TrendingTopicsProps {
  onTopicClick: (topic: string) => void;
  searchTerm: string;
}

export function TrendingTopics({
  onTopicClick,
  searchTerm,
}: TrendingTopicsProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [trendingTopics, setTrendingTopics] = useState<{
    categories: { name: string; topics: string[] }[];
    featured: string[];
  }>({
    categories: [],
    featured: [],
  });

  useEffect(() => {
    const fetchTrendingTopics = async () => {
      setIsLoading(true);
      try {
        // In a real app, you would fetch from an API
        // Here we'll generate topics based on the search term
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Generate topics based on search term
        const topics = generateTopicsBasedOnSearch(searchTerm);
        setTrendingTopics(topics);
      } catch (error) {
        console.error("Error fetching trending topics:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrendingTopics();
  }, [searchTerm]);

  const generateTopicsBasedOnSearch = (term: string) => {
    // Default topics for empty search
    if (!term || term.length < 2) {
      return {
        categories: [
          {
            name: "Technology",
            topics: [
              "AI image generation",
              "ChatGPT alternatives",
              "Web development frameworks",
              "Machine learning tools",
              "Coding assistants",
            ],
          },
          {
            name: "Business",
            topics: [
              "Remote work tools",
              "Productivity apps",
              "AI for small business",
              "Digital marketing trends",
              "Automation software",
            ],
          },
          {
            name: "Creative",
            topics: [
              "AI art generators",
              "Video editing software",
              "Content creation tools",
              "Design inspiration",
              "Creative workflows",
            ],
          },
        ],
        featured: [
          "Best AI tools 2025",
          "How to use AI for content creation",
          "Top free AI alternatives",
          "AI vs human creativity",
          "Future of AI technology",
        ],
      };
    }

    // AI-related search terms
    if (
      term.toLowerCase().includes("ai") ||
      term.toLowerCase().includes("artificial intelligence")
    ) {
      return {
        categories: [
          {
            name: "AI Tools",
            topics: [
              `${term} tools for beginners`,
              `Best ${term} generators`,
              `Free ${term} alternatives`,
              `${term} for content creation`,
              `${term} coding assistants`,
            ],
          },
          {
            name: "AI Learning",
            topics: [
              `How to use ${term} effectively`,
              `${term} prompt engineering`,
              `${term} courses online`,
              `Learn ${term} basics`,
              `${term} certification`,
            ],
          },
          {
            name: "AI Applications",
            topics: [
              `${term} in healthcare`,
              `${term} for business`,
              `${term} in education`,
              `${term} for creative work`,
              `${term} ethics and safety`,
            ],
          },
        ],
        featured: [
          `Best ${term} tools 2025`,
          `How to use ${term} for productivity`,
          `${term} vs human expertise`,
          `Future of ${term} technology`,
          `${term} trends to watch`,
        ],
      };
    }

    // Technology-related search terms
    if (
      term.toLowerCase().includes("tech") ||
      term.toLowerCase().includes("software") ||
      term.toLowerCase().includes("app") ||
      term.toLowerCase().includes("code") ||
      term.toLowerCase().includes("programming")
    ) {
      return {
        categories: [
          {
            name: "Development",
            topics: [
              `${term} best practices`,
              `${term} frameworks`,
              `${term} for beginners`,
              `Advanced ${term} techniques`,
              `${term} documentation`,
            ],
          },
          {
            name: "Tools",
            topics: [
              `Best ${term} tools`,
              `Free ${term} resources`,
              `${term} alternatives`,
              `Open source ${term}`,
              `${term} for teams`,
            ],
          },
          {
            name: "Learning",
            topics: [
              `${term} tutorials`,
              `Learn ${term} online`,
              `${term} certification`,
              `${term} books`,
              `${term} communities`,
            ],
          },
        ],
        featured: [
          `${term} trends 2025`,
          `How to get started with ${term}`,
          `${term} career opportunities`,
          `${term} vs competitors`,
          `Future of ${term}`,
        ],
      };
    }

    // Default for other search terms
    return {
      categories: [
        {
          name: "Learn More",
          topics: [
            `${term} tutorials`,
            `${term} for beginners`,
            `Advanced ${term} techniques`,
            `${term} courses online`,
            `${term} certification`,
          ],
        },
        {
          name: "Tools & Resources",
          topics: [
            `Best ${term} tools`,
            `Free ${term} resources`,
            `${term} alternatives`,
            `${term} software`,
            `${term} apps`,
          ],
        },
        {
          name: "Community",
          topics: [
            `${term} forums`,
            `${term} experts to follow`,
            `${term} events`,
            `${term} communities`,
            `${term} social media groups`,
          ],
        },
      ],
      featured: [
        `${term} trends 2025`,
        `How to get started with ${term}`,
        `${term} best practices`,
        `${term} vs alternatives`,
        `Future of ${term}`,
      ],
    };
  };

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
            Featured Topics for "{searchTerm}"
          </h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {trendingTopics.featured.map((topic, index) => (
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
      {trendingTopics.categories.map((category, categoryIndex) => (
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
