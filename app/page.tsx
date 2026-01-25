"use client";

import CreateContentSection from "@/components/CreateContentSection";
import { SearchDashboard } from "@/components/search-dashboard";
import { useAuth } from "@/firebase/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      router.push("/signin");
      return;
    }
  }, [user, router]);

  return (
    <main className="pb-10 min-h-screen bg-slate-900 text-white space-y-2">
      <SearchDashboard />
      <CreateContentSection />
    </main>
  );
}
