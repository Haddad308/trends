"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";

interface RelatedSearchesProps {
  searchTerm: string;
  onRelatedSearchClick: (term: string) => void;
}

export function RelatedSearches({
  searchTerm,
  onRelatedSearchClick,
}: RelatedSearchesProps) {
  // Generate related searches based on the search term
  const generateRelatedSearches = (term: string): string[] => {
    const baseTerms = [
      `${term} tutorial`,
      `${term} examples`,
      `best ${term}`,
      `${term} alternatives`,
      `${term} vs competitors`,
      `how to use ${term}`,
      `${term} for beginners`,
      `${term} advanced techniques`,
    ];

    // Add AI-specific related searches if the term contains "ai"
    if (term.toLowerCase().includes("ai")) {
      return [
        ...baseTerms,
        `${term} for content creation`,
        `free ${term} tools`,
        `${term} without coding`,
        `${term} prompt engineering`,
        `${term} for business`,
      ].slice(0, 8); // Limit to 8 items
    }

    return baseTerms.slice(0, 8); // Limit to 8 items
  };

  const relatedSearches = generateRelatedSearches(searchTerm);

  return (
    <Card className="bg-slate-800/70 border-slate-700 mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Search className="h-4 w-4 text-purple-400" />
          <span className="text-purple-300">Related Searches</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {relatedSearches.map((search, index) => (
            <Badge
              key={index}
              variant="outline"
              className="px-3 py-1.5 bg-purple-900/20 hover:bg-purple-900/30 cursor-pointer transition-colors border-purple-800/50 text-purple-300"
              onClick={() => onRelatedSearchClick(search)}
            >
              {search}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
