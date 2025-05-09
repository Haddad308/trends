import { Card } from "@/components/ui/card";
import { InstagramPlace } from "@/app/types";

interface Props {
  place: InstagramPlace;
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");
}

export function InstagramPlaceCard({ place }: Props) {
  const slug = slugify(place.title);

  return (
    <a
      href={`https://www.instagram.com/explore/locations/${place.id}/${slug}/`}
      target="_blank"
      rel="noopener noreferrer"
    >
      <Card className="p-4 bg-slate-800/50 hover:bg-slate-800/80 border-slate-700 transition-colors">
        <h3 className="text-white font-semibold">{place.title}</h3>
        {place.subtitle && (
          <p className="text-slate-400 text-sm">{place.subtitle}</p>
        )}
        <p className="text-slate-500 text-xs">{place.locationName}</p>
      </Card>
    </a>
  );
}
