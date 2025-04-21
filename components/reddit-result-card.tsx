"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowBigUp,
  ArrowBigDown,
  ExternalLink,
  MessageSquare,
} from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface RedditResultProps {
  post: {
    title: string;
    content: string;
    url: string;
    subreddit: string;
    author: string;
    upvotes: number;
    commentCount: number;
    awards: string[];
    thumbnail?: string;
    isTextPost: boolean;
    createdAt: string;
  };
}

export function RedditResultCard({ post }: RedditResultProps) {
  const [expanded, setExpanded] = useState(false);

  // Format upvotes for display
  const formatUpvotes = (count: number) => {
    if (count >= 10000) {
      return `${(count / 1000).toFixed(1)}k`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  return (
    <Card className="overflow-hidden transition-all duration-300 border-slate-700 bg-slate-800/50 hover:bg-slate-800/80">
      <CardContent className="p-0">
        <div className="flex">
          {/* Voting sidebar */}
          <div className="p-4 flex flex-col items-center bg-slate-800/80">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full text-slate-400 hover:text-orange-400"
            >
              <ArrowBigUp className="h-5 w-5" />
            </Button>
            <span className="font-medium text-sm text-slate-300">
              {formatUpvotes(post.upvotes)}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full text-slate-400 hover:text-slate-300"
            >
              <ArrowBigDown className="h-5 w-5" />
            </Button>
          </div>

          {/* Main content */}
          <div className="flex-1 p-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-medium text-orange-400">
                r/{post.subreddit}
              </span>
              <span className="text-xs text-slate-500">
                Posted by u/{post.author} • {post.createdAt}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              {post.title}
            </h3>
            {post.awards.length > 0 && (
              <div className="flex gap-1 mb-2">
                {post.awards.map((award, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="bg-orange-900/20 text-orange-300 border-orange-800/50 text-xs"
                  >
                    {award}
                  </Badge>
                ))}
              </div>
            )}

            {post.thumbnail && !post.isTextPost ? (
              <div className="flex gap-4 mb-3">
                <div className="flex-1">
                  <p
                    className={`text-slate-300 ${
                      expanded ? "" : "line-clamp-3"
                    }`}
                  >
                    {post.content}
                  </p>
                  {post.content.length > 150 && (
                    <Button
                      variant="link"
                      className="p-0 h-auto text-orange-400 hover:text-orange-300"
                      onClick={() => setExpanded(!expanded)}
                    >
                      {expanded ? "Show less" : "Read more"}
                    </Button>
                  )}
                </div>
                <div className="relative w-24 h-24 rounded-md overflow-hidden flex-shrink-0">
                  <Image
                    src={
                      post.thumbnail || "/placeholder.svg?height=96&width=96"
                    }
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            ) : (
              <div className="mb-3">
                <p
                  className={`text-slate-300 ${expanded ? "" : "line-clamp-4"}`}
                >
                  {post.content}
                </p>
                {post.content.length > 200 && (
                  <Button
                    variant="link"
                    className="p-0 h-auto text-orange-400 hover:text-orange-300"
                    onClick={() => setExpanded(!expanded)}
                  >
                    {expanded ? "Show less" : "Read more"}
                  </Button>
                )}
              </div>
            )}

            <div className="flex justify-between">
              <Button
                variant="ghost"
                size="sm"
                className="gap-1 text-slate-400 hover:text-slate-300 hover:bg-slate-700"
              >
                <MessageSquare className="h-4 w-4" />
                {post.commentCount} comments
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 border-slate-700 bg-slate-800 hover:bg-slate-700"
                onClick={() => window.open(post.url, "_blank")}
              >
                View on Reddit <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
