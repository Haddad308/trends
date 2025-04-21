"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { History, X, Clock } from "lucide-react";

interface SearchHistoryProps {
  history: string[];
  onHistoryItemClick: (term: string) => void;
}

export function SearchHistory({
  history,
  onHistoryItemClick,
}: SearchHistoryProps) {
  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-4">
        <Clock className="h-12 w-12 text-slate-600 mb-4" />
        <h3 className="text-lg font-medium text-slate-300 mb-2">
          No search history
        </h3>
        <p className="text-slate-400">Your recent searches will appear here</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="h-4 w-4 text-slate-400" />
          <h3 className="font-medium text-slate-300">Recent Searches</h3>
        </div>
      </div>

      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-0">
          <div className="divide-y divide-slate-700">
            {history.map((term, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 hover:bg-slate-700/50 cursor-pointer transition-colors"
                onClick={() => onHistoryItemClick(term)}
              >
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-slate-500" />
                  <span className="text-slate-300">{term}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 rounded-full opacity-0 group-hover:opacity-100 hover:bg-slate-600 hover:text-slate-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    // In a real app, you would remove the item from history
                  }}
                >
                  <X className="h-3.5 w-3.5" />
                  <span className="sr-only">Remove</span>
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
