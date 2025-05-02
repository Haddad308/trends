"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, RefreshCw, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import BlogContent from "../../../components/blog-content";
import { useTrendingTopics } from "@/store/useTrendingTopics";

export default function HashtagGenerator() {
  const [keyword, setKeyword] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [blogContent, setBlogContent] = useState("");
  const [error, setError] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  const { categories, featured } = useTrendingTopics();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword.trim()) return;

    setIsGenerating(true);
    setError("");

    try {
      const response = await fetch("/api/generate-blog", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ transcriptionText: keyword }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate blog content");
      }

      const data = await response.json();
      setBlogContent(data.content);
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
            Generate Blog Content
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
                "Generate Blog"
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

      {(isGenerating || blogContent) && (
        <Card className="bg-[#151F33] border-gray-800">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white">Blog Results</h2>
              {blogContent && (
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

            <Tabs defaultValue="preview" className="w-full">
              <TabsList className="bg-[#1a2236] border-gray-700">
                <TabsTrigger
                  value="preview"
                  className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
                >
                  Preview
                </TabsTrigger>
                <TabsTrigger
                  value="markdown"
                  className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
                >
                  Markdown
                </TabsTrigger>
              </TabsList>
              <TabsContent value="preview" className="mt-4">
                {isGenerating ? (
                  <div className="flex justify-center items-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
                    <span className="ml-3 text-gray-400">
                      Generating blog content...
                    </span>
                  </div>
                ) : (
                  <BlogContent content={blogContent} />
                )}
              </TabsContent>
              <TabsContent value="markdown" className="mt-4">
                {isGenerating ? (
                  <div className="flex justify-center items-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
                    <span className="ml-3 text-gray-400">
                      Generating blog content...
                    </span>
                  </div>
                ) : (
                  <div className="relative">
                    <pre className="bg-[#1a2236] p-4 rounded-md overflow-auto text-gray-300 text-sm">
                      {blogContent}
                    </pre>
                    {/* Add state at the top of your component: const [isCopied, setIsCopied] = useState(false); */}
                    <Button
                      onClick={() => {
                        navigator.clipboard.writeText(blogContent);
                        setIsCopied(true);
                        setTimeout(() => setIsCopied(false), 2000);
                      }}
                      className="absolute top-4 right-4 bg-purple-600 hover:bg-purple-700"
                      size="sm"
                    >
                      {isCopied ? "Copied!" : "Copy"}
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </Card>
      )}
    </div>
  );
}
