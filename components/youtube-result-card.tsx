"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Play } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface YoutubeResultProps {
  video: {
    title: string;
    description: string;
    url: string;
    thumbnail: string;
    channelName: string;
    channelIcon: string;
    viewCount: string;
    publishedAt: string;
    duration: string;
    videoId: string;
  };
}

export function YoutubeResultCard({ video }: YoutubeResultProps) {
  const [showEmbed, setShowEmbed] = useState(false);

  return (
    <Card className="overflow-hidden transition-all duration-300 border-slate-700 bg-slate-800/50 hover:bg-slate-800/80 h-full flex flex-col">
      {showEmbed ? (
        <div className="relative w-full pt-[56.25%]">
          <iframe
            className="absolute top-0 left-0 w-full h-full"
            src={`https://www.youtube.com/embed/${video.videoId}?autoplay=1`}
            title={video.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      ) : (
        <div
          className="relative w-full aspect-video cursor-pointer"
          onClick={() => setShowEmbed(true)}
        >
          <Image
            src={video.thumbnail || "/placeholder.svg?height=160&width=320"}
            alt={video.title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-transparent  bg-opacity-40 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center">
              <Play className="h-6 w-6 text-white fill-white" />
            </div>
          </div>
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-1 py-0.5 rounded">
            {video.duration}
          </div>
        </div>
      )}
      <CardContent className="p-4 flex-grow flex flex-col">
        <div className="flex items-start gap-2 mb-2">
          <div className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
            <Image
              src={video.channelIcon || "/placeholder.svg?height=32&width=32"}
              alt={video.channelName}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h3 className="font-semibold text-white line-clamp-2">
              {video.title}
            </h3>
            <div className="flex flex-col mt-1">
              <span className="text-sm text-slate-400">
                {video.channelName}
              </span>
              <span className="text-xs text-slate-500">
                {video.viewCount} • {video.publishedAt}
              </span>
            </div>
          </div>
        </div>
        <p className="line-clamp-2 text-sm text-slate-400 mb-4">
          {video.description}
        </p>
        <div className="flex gap-2 mt-auto">
          <Button
            variant="outline"
            className="gap-2 flex-1 border-slate-700 bg-slate-800 hover:bg-slate-700"
            onClick={() => window.open(video.url, "_blank")}
          >
            Watch on YouTube <ExternalLink className="h-4 w-4" />
          </Button>
          <Button
            variant={showEmbed ? "default" : "outline"}
            className="gap-2 flex-1 border-slate-700 bg-slate-800 hover:bg-slate-700"
            onClick={() => setShowEmbed(!showEmbed)}
          >
            {showEmbed ? "Hide Embed" : "Play Here"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
