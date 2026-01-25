import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

const CreateContentSection = () => {
  const router = useRouter();
  const [showAllButtons, setShowAllButtons] = useState(false);

  const contentOptions = [
    {
      name: "Blog Generator",
      path: "/content-creation/blog-generator",
    },
    {
      name: "Hashtag Generator",
      path: "/content-creation/hashtag-generator",
    },
    {
      name: "Hook Generator",
      path: "/content-creation/hook-generator",
    },
    {
      name: "Script Generator",
      path: "/content-creation/script-generator",
    },
    {
      name: "Post Generator",
      path: "/content-creation/post-generator",
    },
  ];

  return (
    <section className="flex justify-center w-full max-w-3xl mx-auto px-4">
      <Card className="w-full bg-slate-900 border-slate-800">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-white">
            <Sparkles className="h-5 w-5 text-purple-500" />
            Content Creation
          </CardTitle>
        </CardHeader>
        <CardContent>
          {showAllButtons ? (
            <div className="flex flex-col items-center gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 w-full">
                {contentOptions.map((option) => (
                  <Button
                    key={option.name}
                    className="bg-purple-600 hover:bg-purple-700 w-full"
                    onClick={() => router.push(option.path)}
                  >
                    {option.name}
                  </Button>
                ))}
              </div>
              <Button
                variant="ghost"
                className="text-purple-400 hover:text-white hover:bg-purple-900/50 mt-2"
                onClick={() => setShowAllButtons(false)}
              >
                Cancel
              </Button>
            </div>
          ) : (
            <Button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 w-full"
              onClick={() => setShowAllButtons(true)}
            >
              Create Content
            </Button>
          )}
        </CardContent>
      </Card>
    </section>
  );
};

export default CreateContentSection;
