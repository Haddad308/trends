import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { useState } from "react";

const CreateContentSection = () => {
  const router = useRouter();
  const [showAllButtons, setShowAllButtons] = useState(false);

  return (
    <section className="flex justify-center">
      {showAllButtons ? (
        <div className="flex flex-col items-center gap-2">
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              className="bg-purple-600 hover:bg-purple-700"
              onClick={() => router.push("/content-creation/blog-generator")}
            >
              Blog Generator
            </Button>
            <Button
              className="bg-purple-600 hover:bg-purple-700"
              onClick={() => router.push("/content-creation/hashtag-generator")}
            >
              Hashtag Generator
            </Button>
            <Button
              className="bg-purple-600 hover:bg-purple-700"
              onClick={() => router.push("/content-creation/hooks-generator")}
            >
              Hooks Generator
            </Button>
            <Button
              className="bg-purple-600 hover:bg-purple-700"
              onClick={() => router.push("/content-creation/scripts-generator")}
            >
              Scripts Generator
            </Button>
            <Button
              className="bg-purple-600 hover:bg-purple-700"
              onClick={() => router.push("/content-creation/posts-generator")}
            >
              Posts Generator
            </Button>
          </div>
          <Button
            variant="ghost"
            className="text-purple-600 dark:text-purple-400 hover:text-white hover:bg-purple-100 dark:hover:bg-purple-900"
            onClick={() => setShowAllButtons(false)}
          >
            Cancel
          </Button>
        </div>
      ) : (
        <Button
          type="submit"
          className="bg-purple-600 hover:bg-purple-700"
          onClick={() => setShowAllButtons(true)}
        >
          Create Content
        </Button>
      )}
    </section>
  );
};

export default CreateContentSection;
