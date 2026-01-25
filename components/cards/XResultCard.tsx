"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import Image from "next/image";
import { XResult } from "@/app/types";

interface XResultProps {
  tweet: XResult;
}

export function XResultCard({ tweet }: XResultProps) {
  return (
    <Card className="overflow-hidden transition-all duration-300 border-slate-700 bg-slate-800/50 hover:bg-slate-800/80 h-full flex flex-col">
      <CardContent className="p-4 flex-grow flex flex-col">
        {/* Author */}
        <div className="flex items-start gap-3 mb-2">
          <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
            <Image
              src={
                tweet.authorProfileImage ||
                "/placeholder.svg?height=40&width=40"
              }
              alt={tweet.authorName}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h3 className="font-semibold text-white">{tweet.authorName}</h3>
            <span className="text-sm text-slate-400">
              @{tweet.authorUsername} • {tweet.createdAt}
            </span>
          </div>
        </div>

        {/* Tweet text */}
        <p className="text-slate-200 text-sm mb-4 whitespace-pre-line">
          {tweet.text}
        </p>

        {/* Stats */}
        <div className="text-xs text-slate-500 mb-4 flex flex-wrap gap-3">
          <span>💬 {tweet.replies}</span>
          <span>🔁 {tweet.retweets}</span>
          <span>❤️ {tweet.favorites}</span>
          <span>👀 {tweet.views}</span>
        </div>

        {/* Button */}
        <div className="mt-auto">
          <Button
            variant="outline"
            className="w-full gap-2 border-slate-700 bg-slate-800 hover:bg-slate-700"
            onClick={() => window.open(tweet.url, "_blank")}
          >
            View on X <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
