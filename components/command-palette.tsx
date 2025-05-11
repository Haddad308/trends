import type * as React from "react";
import { useState, useRef, useEffect } from "react";
import {
  Search,
  Youtube,
  Globe,
  MessageCircle,
  X,
  ArrowRight,
  History,
  LucideTwitter,
  InstagramIcon,
  LinkedinIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import TiktokIcon from "./icons/TiktokIcon";

interface CommandPaletteProps {
  searchTerm: string;
  onSearch: (term: string) => void;
  isSearching: boolean;
  searchHistory: string[];
}

export function CommandPalette({
  searchTerm,
  onSearch,
  isSearching,
  searchHistory,
}: CommandPaletteProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(searchTerm);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync the internal value with the external searchTerm
  useEffect(() => {
    setValue(searchTerm);
  }, [searchTerm]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(value);
    setOpen(false);
  };

  const handleClear = () => {
    setValue("");
    onSearch("");
    inputRef.current?.focus();
  };

  return (
    <div className="p-4">
      <div className="relative">
        <form onSubmit={handleSubmit}>
          <div
            className={cn(
              "flex items-center gap-2 p-2 rounded-lg border transition-all",
              open
                ? "border-purple-500 bg-slate-900/90 shadow-[0_0_0_1px] shadow-purple-500/20"
                : "border-slate-700 bg-slate-800/90"
            )}
            onClick={() => {
              setOpen(true);
              inputRef.current?.focus();
            }}
          >
            <div className="flex items-center gap-2 px-2">
              <Search
                className={cn(
                  "h-5 w-5",
                  isSearching
                    ? "text-purple-400 animate-pulse"
                    : "text-slate-400"
                )}
              />
            </div>

            <input
              ref={inputRef}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none placeholder:text-slate-400 text-white"
              placeholder="Search across platforms or type / for commands..."
              onFocus={() => setOpen(true)}
              onBlur={() => setTimeout(() => setOpen(false), 100)}
            />

            {value && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-slate-400 hover:text-white"
                onClick={handleClear}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Clear</span>
              </Button>
            )}

            <Button
              type="submit"
              size="sm"
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              <ArrowRight className="h-4 w-4" />
              <span className="sr-only">Search</span>
            </Button>
          </div>
        </form>

        {open && value && (
          <div className=" inset-x-0 top-full mt-2 bg-slate-900 border border-slate-700 rounded-lg shadow-xl z-90 overflow-hidden">
            <div className="py-2 px-1">
              <div className="px-2 py-1.5 text-xs font-semibold text-slate-400 uppercase">
                PLATFORMS
              </div>
              <div className="space-y-1">
                <div
                  onClick={() => {
                    onSearch(`${value} site:youtube.com`);
                    setOpen(false);
                  }}
                  className="flex items-center gap-2 p-2 rounded hover:bg-slate-800 cursor-pointer"
                >
                  <Youtube className="h-4 w-4 text-red-500" />
                  <span>Search YouTube for {value || "..."}</span>
                </div>
                <div
                  onClick={() => {
                    onSearch(`${value} site:reddit.com`);
                    setOpen(false);
                  }}
                  className="flex items-center gap-2 p-2 rounded hover:bg-slate-800 cursor-pointer"
                >
                  <MessageCircle className="h-4 w-4 text-orange-500" />
                  <span>Search Reddit for {value || "..."}</span>
                </div>
                <div
                  onClick={() => {
                    onSearch(`${value} site:google.com`);
                    setOpen(false);
                  }}
                  className="flex items-center gap-2 p-2 rounded hover:bg-slate-800 cursor-pointer"
                >
                  <Globe className="h-4 w-4 text-blue-500" />
                  <span>Search Google for {value || "..."}</span>
                </div>
                <div
                  onClick={() => {
                    onSearch(`${value} site:x.com`);
                    setOpen(false);
                  }}
                  className="flex items-center gap-2 p-2 rounded hover:bg-slate-800 cursor-pointer"
                >
                  <LucideTwitter className="h-4 w-4 text-slate-500" />
                  <span>Search X for {value || "..."}</span>
                </div>
                <div
                  onClick={() => {
                    onSearch(`${value} site:instagram.com`);
                    setOpen(false);
                  }}
                  className="flex items-center gap-2 p-2 rounded hover:bg-slate-800 cursor-pointer"
                >
                  <InstagramIcon className="h-4 w-4 text-pink-500" />
                  <span>Search Instagram for {value || "..."}</span>
                </div>
                <div
                  onClick={() => {
                    onSearch(`${value} site:tiktok.com`);
                    setOpen(false);
                  }}
                  className="flex items-center gap-2 p-2 rounded hover:bg-slate-800 cursor-pointer"
                >
                  <TiktokIcon />
                  <span>Search Tiktok for {value || "..."}</span>
                </div>
                <div
                  onClick={() => {
                    onSearch(`${value} site:linkedin.com`);
                    setOpen(false);
                  }}
                  className="flex items-center gap-2 p-2 rounded hover:bg-slate-800 cursor-pointer"
                >
                  <LinkedinIcon className="h-4 w-4 text-blue-400" />
                  <span>Search LinkedIn for {value || "..."}</span>
                </div>
              </div>

              {searchHistory.length > 0 && (
                <>
                  <div className="px-2 py-1.5 text-xs font-semibold text-slate-400 uppercase mt-2">
                    Recent Searches
                  </div>
                  <div className="space-y-1">
                    {searchHistory.slice(0, 3).map((term, index) => (
                      <div
                        key={index}
                        onClick={() => {
                          onSearch(term);
                          setOpen(false);
                        }}
                        className="flex items-center gap-2 p-2 rounded hover:bg-slate-800 cursor-pointer"
                      >
                        <History className="h-4 w-4 text-slate-400" />
                        <span>{term}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mt-4">
        <Button
          variant="outline"
          size="sm"
          className="bg-slate-800/50 border-slate-700 hover:bg-slate-700 text-slate-300"
          onClick={() => onSearch("best ai tools")}
        >
          Best AI Tools
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="bg-slate-800/50 border-slate-700 hover:bg-slate-700 text-slate-300"
          onClick={() => onSearch("ai for content creation")}
        >
          AI for Content
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="bg-slate-800/50 border-slate-700 hover:bg-slate-700 text-slate-300"
          onClick={() => onSearch("trending tech 2025")}
        >
          Trending Tech
        </Button>
      </div>
    </div>
  );
}
