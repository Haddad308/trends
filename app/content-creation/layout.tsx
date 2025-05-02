"use client";

import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Head from "next/head";
import { useRouter } from "next/navigation";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  return (
    <>
      <Head>
        <meta
          name="description"
          content="Create and discover posts, blogs, hashtags, hooks, and scripts effortlessly."
        />
      </Head>
      <Navbar />
      <div className="min-h-screen bg-slate-900 text-white container mx-auto px-4 pt-4">
        <Button
          variant="ghost"
          className="mb-6 text-purple-600 dark:text-purple-400 hover:text-white hover:cursor-pointer hover:bg-purple-100 dark:hover:bg-purple-900"
          onClick={() => router.push("/")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>
        {children}
      </div>
    </>
  );
}
