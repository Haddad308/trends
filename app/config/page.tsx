"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Settings,
  CheckCircle,
  AlertCircle,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import { useAuth } from "@/firebase/auth-context";
import { Label } from "@/components/ui/label";
import { saveApiKey, getApiKey } from "@/firebase/firestore";

export default function ConfigPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [apiKey, setApiKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [testStatus, setTestStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!user) {
      router.push("/signin");
      return;
    }

    // Load API key from Firebase
    const fetchApiKey = async () => {
      try {
        setIsFetching(true);
        const savedApiKey = await getApiKey(user.uid);
        if (savedApiKey) {
          setApiKey(savedApiKey);
        }
      } catch (error) {
        console.error("Error fetching API key:", error);
      } finally {
        setIsFetching(false);
      }
    };

    fetchApiKey();
  }, [user, router]);

  const validateApiKey = (key: string) => {
    // Basic validation for Google Gemini API keys - they are typically longer than 20 chars
    return key.length >= 20;
  };

  const testApiKey = async () => {
    if (!validateApiKey(apiKey)) {
      setErrorMessage(
        "Invalid API key format. Google Gemini API keys are typically at least 20 characters long"
      );
      setTestStatus("error");
      return;
    }

    setTestStatus("loading");
    setErrorMessage("");

    try {
      // Test the API key by making a simple request to the Google Gemini API
      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" +
          apiKey,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: "Hello" }],
              },
            ],
          }),
        }
      );

      if (response.ok) {
        setTestStatus("success");
      } else {
        throw new Error(`API test failed with status: ${response.status}`);
      }
    } catch (error) {
      console.error("API key test failed:", error);
      setErrorMessage(`API key not valid.`);
      setTestStatus("error");
    }
  };

  const saveApiKeyToFirebase = async () => {
    if (!user) {
      setErrorMessage("You must be logged in to save settings");
      setTestStatus("error");
      return;
    }

    if (!validateApiKey(apiKey)) {
      setErrorMessage(
        "Invalid API key format. Google Gemini API keys are typically at least 20 characters long"
      );
      setTestStatus("error");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      await saveApiKey(user.uid, apiKey);
      setTestStatus("success");

      // Redirect after a short delay
      setTimeout(() => {
        router.push("/");
      }, 1000);
    } catch (error) {
      console.error("Error saving API key:", error);
      setErrorMessage(`Failed to save API key: ${(error as Error).message}`);
      setTestStatus("error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <Button
          variant="ghost"
          className="mb-6 text-purple-600 dark:text-purple-400 hover:text-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900"
          onClick={() => router.push("/")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <div className="text-center mb-8">
          <div className="inline-block mb-4 bg-purple-100 dark:bg-purple-900 p-3 rounded-full">
            <Settings className="h-8 w-8 text-purple-600 dark:text-purple-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Configuration
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage your API keys and application settings
          </p>
        </div>

        <Card className="shadow-lg border-0 bg-white dark:bg-gray-800">
          <CardContent className="pt-6">
            {isFetching ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
                <span className="ml-3 text-gray-600 dark:text-gray-300">
                  Loading your settings...
                </span>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="api-key">API Key</Label>
                  <Input
                    id="api-key"
                    type="password"
                    placeholder="Enter your Google Gemini API key"
                    value={apiKey}
                    onChange={(e) => {
                      setApiKey(e.target.value);
                      setTestStatus("idle");
                    }}
                    className="font-mono dark:bg-gray-700 dark:text-white"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    You can get your API key from the{" "}
                    <a
                      href="https://aistudio.google.com/app/apikey"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-600 dark:text-purple-400 hover:underline"
                    >
                      Google AI Studio
                    </a>
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={testApiKey}
                    disabled={testStatus === "loading" || !apiKey}
                    className="flex-1 dark:bg-gray-700 dark:text-white"
                  >
                    {testStatus === "loading" ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Testing...
                      </>
                    ) : (
                      "Test API Key"
                    )}
                  </Button>
                  <Button
                    onClick={saveApiKeyToFirebase}
                    disabled={testStatus !== "success" || isLoading}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save & Return"
                    )}
                  </Button>
                </div>

                {testStatus === "success" && (
                  <Alert className="bg-green-50 dark:bg-green-900 border-green-200 dark:border-green-800 text-green-800 dark:text-green-100">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <AlertTitle>Success</AlertTitle>
                    <AlertDescription>
                      Your API key has been validated successfully.
                    </AlertDescription>
                  </Alert>
                )}

                {testStatus === "error" && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{errorMessage}</AlertDescription>
                  </Alert>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
