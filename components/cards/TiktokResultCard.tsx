import { useState } from "react";
import Image from "next/image";
import { ExternalLink, Play } from "lucide-react";
import { TikTokMappedItem } from "@/app/types";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";

export default function TikTokCard({ item }: { item: TikTokMappedItem }) {
  const [showEmbed, setShowEmbed] = useState(false);

  if (item.type === "video") {
    return (
      <Card className="overflow-hidden transition-all duration-300 border-slate-700 bg-slate-800/50 hover:bg-slate-800/80 h-full flex flex-col">
        {showEmbed ? (
          <div className="relative w-full pt-[56.25%]">
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src={`https://www.tiktok.com/embed/${item.id}`}
              title={item.description}
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        ) : (
          <div
            className="relative w-full aspect-[9/16] max-h-[480px] cursor-pointer"
            onClick={() => setShowEmbed(true)}
          >
            <Image
              src={item.cover}
              alt="video cover"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-pink-600 flex items-center justify-center">
                <Play className="h-6 w-6 text-white fill-white" />
              </div>
            </div>
            <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-1 py-0.5 rounded">
              {item.duration}s
            </div>
          </div>
        )}
        <CardContent className="p-4 flex-grow flex flex-col">
          <p className="text-sm text-slate-200 line-clamp-2 mb-2">
            {item.description}
          </p>
          <div className="flex gap-2 mt-auto">
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

  if (item.type === "user") {
    return (
      <Card className="overflow-hidden transition-all duration-300 border-slate-700 bg-slate-800/50 hover:bg-slate-800/80 h-full flex flex-col">
        <CardContent className="p-4 flex-grow flex flex-col">
          <div className="flex items-start gap-3 mb-4">
            <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
              <Image
                src={item.avatar || "/placeholder.svg?height=48&width=48"}
                alt={item.nickname}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h3 className="font-semibold text-white">{item.nickname}</h3>
              <span className="text-sm text-slate-400">@{item.uniqueId}</span>
            </div>
          </div>

          <p className="text-xs text-slate-500 mb-4">
            {item.followerCount} followers
          </p>

          <div className="mt-auto">
            <Button
              variant="outline"
              className="w-full gap-2 border-slate-700 bg-slate-800 hover:bg-slate-700"
              onClick={() =>
                window.open(
                  `https://www.tiktok.com/@${item.uniqueId}`,
                  "_blank"
                )
              }
            >
              View Profile <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
}
