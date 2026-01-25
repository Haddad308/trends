import { Card } from "@/components/ui/card";
import { InstagramHashtag } from "@/app/types";

interface Props {
  hashtag: InstagramHashtag;
}

export function InstagramHashtagCard({ hashtag }: Props) {
  return (
    <a
      href={`https://www.instagram.com/explore/tags/${hashtag.name}/`}
      target="_blank"
      rel="noopener noreferrer"
    >
      <Card className="p-4 bg-slate-800/50 hover:bg-slate-800/80 border-slate-700 transition-colors">
        <h3 className="text-white font-semibold text-lg">#{hashtag.name}</h3>
        <p className="text-slate-400 text-sm">
          {hashtag.mediaCount.toLocaleString()} posts
        </p>
      </Card>
    </a>
  );
}
