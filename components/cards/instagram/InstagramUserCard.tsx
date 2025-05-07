"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import Image from "next/image";
import { InstagramUser } from "@/app/types";

interface InstagramUserCardProps {
  user: InstagramUser;
}

export function InstagramUserCard({ user }: InstagramUserCardProps) {
  return (
    <Card className="overflow-hidden transition-all duration-300 border-slate-700 bg-slate-800/50 hover:bg-slate-800/80 h-full flex flex-col">
      <CardContent className="p-4 flex-grow flex flex-col">
        <div className="flex items-start gap-3 mb-4">
          <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
            <Image
              src={user.profilePicUrl || "/placeholder.svg?height=48&width=48"}
              alt={user.fullName}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h3 className="font-semibold text-white">
              {user.fullName}
              {user.isVerified && <span className="ml-2 text-blue-400">✔</span>}
            </h3>
            <span className="text-sm text-slate-400">@{user.username}</span>
          </div>
        </div>

        <div className="mt-auto">
          <Button
            variant="outline"
            className="w-full gap-2 border-slate-700 bg-slate-800 hover:bg-slate-700"
            onClick={() =>
              window.open(
                `https://www.instagram.com/${user.username}`,
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
