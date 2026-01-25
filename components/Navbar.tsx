"use client";
import { useAuth } from "@/firebase/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Settings, LogOut, CreditCard, Crown, Loader2 } from "lucide-react";
import { getUserSubscription } from "@/firebase/subscription"; // Adjust this import to match your actual function

const Navbar = () => {
  const { signOut, user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [hasLifetimeAccess, setHasLifetimeAccess] = useState(false);

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!user?.displayName) return "U";
    const nameParts = user.displayName.split(" ");
    if (nameParts.length >= 2) {
      return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
    }
    return nameParts[0][0].toUpperCase();
  };

  useEffect(() => {
    if (!user) {
      router.push("/signin");
      return;
    }

    const fetchSubscription = async () => {
      try {
        setIsLoading(true);
        const subscription = await getUserSubscription(user.uid);
        setHasLifetimeAccess(
          subscription?.planId === "lifetime" &&
            subscription?.status === "active"
        );
      } catch (error) {
        console.error("Error fetching subscription:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubscription();
  }, [user, router]);

  return (
    <header className="bg-slate-900 border-b border-slate-700 dark:border-slate-700 p-4">
      <div className="max-w-7xl mx-auto flex sm:justify-between items-center flex-wrap justify-center">
        <h1 className="text-2xl font-bold">
          <span className="text-purple-400">Omni</span>
          <span className="text-pink-400">Search</span>
        </h1>

        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-800 transition-colors outline-none">
            <Avatar className="h-8 w-8 border border-slate-700">
              <AvatarImage
                src={user?.photoURL || ""}
                alt={user?.displayName || "User"}
              />
              <AvatarFallback className="bg-purple-600 text-white">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
            <span className="text-slate-200 hidden sm:inline-block">
              {user?.displayName || "User"}
            </span>
            {hasLifetimeAccess && (
              <Crown className="h-4 w-4 text-yellow-400 ml-1" />
            )}
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-56 bg-slate-800 border-slate-700 text-slate-200"
          >
            <DropdownMenuItem
              className="flex items-center gap-2 cursor-pointer hover:bg-slate-700 focus:bg-slate-700"
              onClick={() => router.push("/config")}
            >
              <Settings className="h-4 w-4 text-slate-400" />
              <span>Config</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              className={`flex items-center gap-2 cursor-pointer hover:bg-slate-700 focus:bg-slate-700 ${
                hasLifetimeAccess ? "text-yellow-400" : ""
              }`}
              onClick={() => router.push("/subscribe")}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 text-slate-400 animate-spin" />
                  <span>Loading...</span>
                </>
              ) : hasLifetimeAccess ? (
                <>
                  <Crown className="h-4 w-4" />
                  <span>Your Pro Access</span>
                </>
              ) : (
                <>
                  <CreditCard className="h-4 w-4 text-slate-400" />
                  <span>Subscribe</span>
                </>
              )}
            </DropdownMenuItem>

            <DropdownMenuSeparator className="bg-slate-700" />

            <DropdownMenuItem
              className="flex items-center gap-2 cursor-pointer text-red-400 hover:bg-red-500/20 focus:bg-red-500/20 hover:text-red-300 focus:text-red-300"
              onClick={signOut}
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Navbar;
