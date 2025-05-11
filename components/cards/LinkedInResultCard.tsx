import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { LinkedInResult } from "@/app/types";

interface Props {
  post: LinkedInResult;
}

export function LinkedInResultCard({ post }: Props) {
  return (
    <Card className="overflow-hidden border-slate-700 bg-slate-800/50 hover:bg-slate-800/80 flex flex-col">
      <CardContent className="p-4 flex-grow flex flex-col gap-3">
        {/* Author Info */}
        <div className="flex items-start gap-3">
          {post.author.avatar ? (
            <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
              <Image
                src={post.author.avatar}
                alt={post.author.name}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center text-white text-sm">
              {post.author.name[0]}
            </div>
          )}
          <div>
            <h3 className="font-semibold text-white">{post.author.name}</h3>
            <p className="text-sm text-slate-400">{post.author.description}</p>
            <p className="text-xs text-slate-500">
              {post.author.subDescription}
            </p>
          </div>
        </div>

        {/* Post Image */}
        {post.image && (
          <div className="relative w-full h-48 rounded-lg overflow-hidden">
            <Image src={post.image} alt="Post image" fill />
          </div>
        )}

        {/* Post Content */}
        <p className="text-white text-sm line-clamp-5">{post.content}</p>

        {/* Stats */}
        <div className="text-xs text-slate-400 flex gap-4 mt-2">
          <span>👍 {post.stats.likes}</span>
          <span>💬 {post.stats.comments}</span>
          <span>🔁 {post.stats.shares}</span>
        </div>

        {/* Action */}
        <Button
          variant="outline"
          className="mt-auto gap-2 border-slate-700 bg-slate-800 hover:bg-slate-700"
          onClick={() => window.open(post.url, "_blank")}
        >
          View on LinkedIn <ExternalLink className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}
