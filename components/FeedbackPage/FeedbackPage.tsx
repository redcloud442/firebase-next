"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { deleteDoc, doc, getFirestore } from "firebase/firestore";
import { MessageSquare, User } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import DeleteModal from "./DeleteModal";

type FeedbackItem = {
  id: string;
  parentId: string;
  parentCollection: string;
  message: string;
};

const FeedbackPage = () => {
  const [feedbackItems, setFeedbackItems] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [lastDocCursor, setLastDocCursor] = useState<{
    lastDocId: string | null;
    lastDocParentId: string | null;
    lastDocCollectionName: string | null;
  }>({
    lastDocId: null,
    lastDocParentId: null,
    lastDocCollectionName: null,
  });

  const [hasNextPage, setHasNextPage] = useState(true);
  const [page, setPage] = useState(1);

  const fetchFeedback = async (reset = false) => {
    setLoading(true);

    const params = new URLSearchParams();
    if (!reset && lastDocCursor.lastDocId) {
      params.append("lastDocId", lastDocCursor.lastDocId);
      params.append("lastDocParentId", lastDocCursor.lastDocParentId!);
      params.append(
        "lastDocCollectionName",
        lastDocCursor.lastDocCollectionName!
      );
    }

    const res = await fetch(`/api/feedback?${params.toString()}`);
    const data = await res.json();

    if (res.ok) {
      if (reset) {
        setFeedbackItems(data.comments);
      } else {
        setFeedbackItems(data.comments);
      }

      setLastDocCursor({
        lastDocId: data.lastDocId,
        lastDocParentId: data.lastDocParentId,
        lastDocCollectionName: data.lastDocCollectionName,
      });

      setHasNextPage(data.comments.length > 0);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchFeedback(true);
  }, []);

  const handleNext = () => {
    if (hasNextPage) {
      fetchFeedback();
      setPage((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (page > 1) {
      fetchFeedback();
      setPage((prev) => prev - 1);
    }
  };

  const handleDelete = async (id: string, email: string) => {
    try {
      console.log(id, email);

      setIsDeleting(true);
      const db = getFirestore();
      await deleteDoc(doc(db, "feedback", email, "comments_feedback", id));

      setFeedbackItems((prev) => prev.filter((item) => item.id !== id));

      toast.success("Feedback deleted successfully");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold">Feedback</h1>
        <p>
          This is the feedback page. Here you can see the feedback of the users.
        </p>
      </div>

      <section className="min-h-screen">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <MessageSquare className="w-6 h-6 text-primary" />
                Feedback
              </CardTitle>
              <CardDescription>
                {feedbackItems.length} feedback item
                {feedbackItems.length !== 1 ? "s" : ""}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {feedbackItems.map((item) => (
                  <Card
                    key={item.id}
                    className="hover:shadow-md transition-shadow hover:scale-105 duration-300 bg-gray-200/20 relative"
                  >
                    <DeleteModal
                      onDelete={() => handleDelete(item.id, item.parentId)}
                      isDeleting={isDeleting}
                    />
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <CardTitle className="text-sm font-medium">
                          {item.parentId.split("@")[0]}
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-foreground">{item.message}</p>
                      <p className="text-[11px] text-muted-foreground break-all">
                        {item.parentId}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              {loading && (
                <p className="text-sm text-muted-foreground mt-4">Loading...</p>
              )}
            </CardContent>
          </Card>

          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={handlePrev}
                  className={
                    page === 1
                      ? "cursor-not-allowed opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink isActive>{page}</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  onClick={handleNext}
                  className={
                    !hasNextPage ? "cursor-not-allowed opacity-50" : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </section>
    </div>
  );
};

export default FeedbackPage;
