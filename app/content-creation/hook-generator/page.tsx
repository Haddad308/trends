"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Loader2, RefreshCw, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useTrendingTopics } from "@/store/useTrendingTopics";

const Page = () => {
  const [keyword, setKeyword] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [hooks, setHooks] = useState<string[] | null>(null);
  const [error, setError] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  const { categories, featured } = useTrendingTopics();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword.trim()) return;

    setIsGenerating(true);
    setError("");

    try {
      const response = await fetch("/api/generate-hooks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ transcriptionText: keyword }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate hooks");
      }

      const data = await response.json();
      setHooks(data.content);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-[#151F33] border-gray-800">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            Generate Hooks
          </h2>

          <form onSubmit={handleSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Enter a keyword or topic..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="pl-10 bg-[#1a2236] border-gray-700 text-white"
              />
            </div>

            <Button
              type="submit"
              disabled={isGenerating || !keyword.trim()}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating
                </>
              ) : (
                "Generate Hooks"
              )}
            </Button>
          </form>
          <div className="mt-4 space-y-4">
            <div className="space-y-2">
              {featured.length > 0 && (
                <h3 className="text-sm font-medium text-gray-400">
                  Featured Topics
                </h3>
              )}
              <div className="flex flex-wrap gap-2">
                {featured.map((topic) => (
                  <Badge
                    key={topic}
                    className="cursor-pointer bg-purple-900/20 hover:bg-purple-800/30 text-purple-300 border-purple-800"
                    onClick={() => {
                      setKeyword(topic);
                      handleSubmit({
                        preventDefault: () => {},
                      } as React.FormEvent);
                    }}
                  >
                    {topic}
                  </Badge>
                ))}
              </div>
            </div>

            {categories.map((category) => (
              <div key={category.name} className="space-y-2">
                <h3 className="text-sm font-medium text-gray-400">
                  {category.name}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {category.topics.map((topic) => (
                    <Badge
                      key={topic}
                      className="cursor-pointer bg-purple-900/20 hover:bg-purple-800/30 text-purple-300 border-purple-800"
                      onClick={() => {
                        setKeyword(topic);
                        handleSubmit({
                          preventDefault: () => {},
                        } as React.FormEvent);
                      }}
                    >
                      {topic}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {error && (
        <div className="bg-red-900/20 border border-red-800 text-red-300 p-4 rounded-md">
          {error}
        </div>
      )}

      {(isGenerating || hooks) && (
        <Card className="bg-[#151F33] border-gray-800">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white">
                Hooks Results
              </h2>
              {hooks && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    handleSubmit({
                      preventDefault: () => {},
                    } as React.FormEvent)
                  }
                  disabled={isGenerating}
                  className="border-gray-700 text-gray-300"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh
                </Button>
              )}
            </div>

            <div className="mb-4">
              <Badge
                variant="outline"
                className="bg-purple-900/20 text-purple-300 border-purple-800"
              >
                Keyword: {keyword}
              </Badge>
            </div>

            <div className="w-full">
              <div className="mt-4">
                {isGenerating ? (
                  <div className="flex justify-center items-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
                    <span className="ml-3 text-gray-400">
                      Generating Hooks...
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div>
                      {hooks?.map((hook, index) => (
                        <span
                          key={index}
                          className="inline-block bg-purple-900/20 text-purple-300 border-purple-800 rounded-full px-3 py-1 me-2 mb-2"
                        >
                          {hook}
                        </span>
                      ))}
                    </div>
                    <Button
                      onClick={() => {
                        navigator.clipboard.writeText(hooks?.join("\n") || "");
                        setIsCopied(true);
                        setTimeout(() => setIsCopied(false), 2000);
                      }}
                      className="bg-purple-600 hover:bg-purple-700"
                      size="sm"
                    >
                      {isCopied ? "Copied!" : "Copy"}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Page;
