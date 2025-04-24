import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GoogleResultCard } from "@/components/google-result-card";
import { YoutubeResultCard } from "@/components/youtube-result-card";
import { RedditResultCard } from "@/components/reddit-result-card";
import { Loader2 } from "lucide-react";
import { GoogleResult, RedditResult, YoutubeResult } from "@/app/types";

interface SearchResultsProps {
  results: {
    google: GoogleResult[];
    youtube: YoutubeResult[];
    reddit: RedditResult[];
  };
  searchTerm: string;
  isLoading: boolean;
}

export function SearchResults({
  results,
  searchTerm,
  isLoading,
}: SearchResultsProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  const hasResults =
    results.google.length > 0 ||
    results.youtube.length > 0 ||
    results.reddit.length > 0;

  if (!hasResults && searchTerm.length >= 3) {
    return (
      <Card className="p-8 text-center">
        <p className="text-lg text-muted-foreground">
          No results found for &rdquo;{searchTerm}&rdquo;
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="all">All Results</TabsTrigger>
          <TabsTrigger value="google">Google</TabsTrigger>
          <TabsTrigger value="youtube">YouTube</TabsTrigger>
          <TabsTrigger value="reddit">Reddit</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-8">
          {/* Google Results */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-indigo-900 flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-blue-500"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <circle cx="12" cy="12" r="4"></circle>
              </svg>
              Google Results
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {results.google.map((result, index) => (
                <GoogleResultCard key={`google-${index}`} result={result} />
              ))}
              {results.google.length === 0 && (
                <div className="p-4 text-center text-muted-foreground">
                  No Google results to display
                </div>
              )}
            </div>
          </div>

          {/* YouTube Results */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-indigo-900 flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-red-500"
              >
                <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"></path>
                <path d="m10 15 5-3-5-3z"></path>
              </svg>
              YouTube Results
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {results.youtube.map((result, index) => (
                <YoutubeResultCard key={`youtube-${index}`} video={result} />
              ))}
              {results.youtube.length === 0 && (
                <div className="col-span-3 p-4 text-center text-muted-foreground">
                  No YouTube results to display
                </div>
              )}
            </div>
          </div>

          {/* Reddit Results */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-indigo-900 flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-orange-500"
              >
                <circle cx="12" cy="8" r="5"></circle>
                <path d="M20 21a8 8 0 1 0-16 0"></path>
              </svg>
              Reddit Results
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {results.reddit.map((result, index) => (
                <RedditResultCard key={`reddit-${index}`} post={result} />
              ))}
              {results.reddit.length === 0 && (
                <div className="p-4 text-center text-muted-foreground">
                  No Reddit results to display
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="google">
          <div className="grid grid-cols-1 gap-4">
            {results.google.map((result, index) => (
              <GoogleResultCard key={`google-tab-${index}`} result={result} />
            ))}
            {results.google.length === 0 && (
              <div className="p-8 text-center text-muted-foreground">
                No Google results to display
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="youtube">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {results.youtube.map((result, index) => (
              <YoutubeResultCard key={`youtube-tab-${index}`} video={result} />
            ))}
            {results.youtube.length === 0 && (
              <div className="col-span-3 p-8 text-center text-muted-foreground">
                No YouTube results to display
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="reddit">
          <div className="grid grid-cols-1 gap-4">
            {results.reddit.map((result, index) => (
              <RedditResultCard key={`reddit-tab-${index}`} post={result} />
            ))}
            {results.reddit.length === 0 && (
              <div className="p-8 text-center text-muted-foreground">
                No Reddit results to display
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
