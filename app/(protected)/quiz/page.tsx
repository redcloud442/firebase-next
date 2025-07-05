import QuizPage from "@/components/QuizPage/QuizPage";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

const page = () => {
  return (
    <div className="space-y-10 mx-auto p-4 ">
      <header className="flex justify-between items-center">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold">Quiz</h1>
          <p>This is the quiz page. Here you can see the quiz of the users.</p>
        </div>
        <div className="flex justify-center">
          <Link href="/quiz/create">
            <Button variant="outline">
              <PlusIcon /> Add Quiz
            </Button>
          </Link>
        </div>
      </header>

      <Suspense fallback={<Skeleton className="h-[500px] w-full" />}>
        <QuizPage />
      </Suspense>
    </div>
  );
};

export default page;
