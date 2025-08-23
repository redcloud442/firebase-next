import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import VideoPage from "@/components/VideoPage/VideoPage";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

const page = () => {
  return (
    <div className="space-y-10 mx-auto p-4 ">
      <header className="flex justify-between items-center">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold">Video</h1>
          <p>
            This is the video page. Here you can create a video for the users.
          </p>
        </div>
        <div className="flex justify-center">
          <Link href="/video/create">
            <Button variant="outline">
              <PlusIcon /> Add Video
            </Button>
          </Link>
        </div>
      </header>

      <Suspense fallback={<Skeleton className="h-[500px] w-full" />}>
        <VideoPage />
      </Suspense>
    </div>
  );
};

export default page;
