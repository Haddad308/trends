"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Globe, BookOpen } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface GoogleResultProps {
  result: {
    title: string;
    content: string;
    url: string;
    favicon: string;
    siteName: string;
    screenshot: string;
  };
}

export function GoogleResultCard({ result }: GoogleResultProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Extract domain from URL for display
  const getDomain = (url: string) => {
    try {
      const domain = new URL(url).hostname;
      return domain;
    } catch (e) {
      return result.siteName;
    }
  };

  // Determine if the screenshot is a book cover
  const isBookCover =
    result.siteName === "books.google.com" &&
    result.screenshot &&
    !result.screenshot.includes("placeholder");

  return (
    <Card
      className="overflow-hidden transition-all duration-300 border-slate-700 bg-slate-800/50 hover:bg-slate-800/80"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/3 p-4">
            <div
              className={`relative w-full ${
                isBookCover ? "aspect-[2/3]" : "aspect-video"
              } rounded-md overflow-hidden border border-slate-700 transition-transform duration-300 ${
                isHovered ? "transform scale-105" : ""
              }`}
            >
              <Image
                src={
                  result.screenshot || "/placeholder.svg?height=160&width=320"
                }
                alt={result.title}
                fill
                className={`${isBookCover ? "object-contain" : "object-cover"}`}
              />
            </div>
          </div>
          <div className="md:w-2/3 flex flex-col p-4 pt-0 md:pt-4 md:pr-4 md:pb-4 md:pl-0">
            <div className="flex items-center gap-2 mb-1">
              {result.favicon ? (
                <Image
                  src={result.favicon || "/placeholder.svg"}
                  alt={result.siteName}
                  width={16}
                  height={16}
                  className="rounded-sm"
                />
              ) : result.siteName.includes("book") ? (
                <BookOpen className="h-4 w-4 text-blue-500" />
              ) : (
                <Globe className="h-4 w-4 text-blue-500" />
              )}
              <span className="text-sm text-blue-400">
                {getDomain(result.url)}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
              {result.title}
            </h3>
            <p className="text-slate-300 line-clamp-3 mb-4 flex-grow">
              {result.content}
            </p>
            <Button
              variant="outline"
              className="gap-2 border-slate-700 bg-slate-800 hover:bg-slate-700 w-fit"
              onClick={() => window.open(result.url, "_blank")}
            >
              Visit Website <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
