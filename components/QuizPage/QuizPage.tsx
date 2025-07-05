"use client";

import { quizService } from "@/service/quiz/quiz";
import { storage } from "@/utils/firebase/firebase";
import { Quiz } from "@/utils/types";
import { doc, getFirestore, updateDoc, writeBatch } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Loader2Icon, Trash2Icon } from "lucide-react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const QuizPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>();
  const [selectedLanguage, setSelectedLanguage] = useState<string>();
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(
    null
  );

  const [quizzes, setQuizzes] = useState<Quiz[] | null>(null);
  const [editedQuizzes, setEditedQuizzes] = useState<Quiz[] | null>(null);
  const [activeEditIndex, setActiveEditIndex] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const searchParams = useSearchParams();

  useEffect(() => {
    const cat = searchParams.get("category") ?? undefined;
    const lang = searchParams.get("language") ?? undefined;
    if (cat) setSelectedCategory(cat);
    if (lang) setSelectedLanguage(lang);
  }, [searchParams]);

  const pushUrl = (cat?: string, lang?: string, diff?: string) => {
    const qs = new URLSearchParams();
    if (cat) qs.set("category", cat);
    if (lang) qs.set("language", lang);
    if (diff) qs.set("difficulty", diff);
    window.history.pushState({}, "", `/quiz?${qs.toString()}`);
  };

  const canProceed = selectedLanguage && selectedCategory;

  const fetchQuizzes = async () => {
    setError(null);
    try {
      const data = await quizService({
        category: selectedCategory ?? "",
        language: selectedLanguage ?? "",
        difficulty: selectedDifficulty ?? "",
      });
      setQuizzes(data);
      setEditedQuizzes(JSON.parse(JSON.stringify(data)));
    } catch (e) {
      if (e instanceof Error) {
        toast.error(e.message);
      } else {
        toast.error("Failed to fetch quizzes. Please try again.");
      }
    }
  };

  const updateQuizAt = (idx: number, newData: Partial<Quiz>) =>
    setEditedQuizzes((prev) =>
      prev ? prev.map((q, i) => (i === idx ? { ...q, ...newData } : q)) : prev
    );

  const fileToDataURL = async (file: File) => {
    const storageRef = ref(storage, `quiz/${file.name}`);

    try {
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);

      return url;
    } catch (e) {
      if (e instanceof Error) {
        toast.error(e.message);
      } else {
        toast.error("Could not read image file.");
      }
    }
  };

  const handleImageFile = async (file: File, idx: number) => {
    try {
      const dataUrl = await fileToDataURL(file);
      if (dataUrl) updateQuizAt(idx, { image: dataUrl });
    } catch (e) {
      if (e instanceof Error) {
        toast.error(e.message);
      } else {
        toast.error("Could not read image file.");
      }
    }
  };

  const handleSaveAllChanges = async () => {
    if (!editedQuizzes) return;
    const db = getFirestore();
    const batch = writeBatch(db);
    editedQuizzes.forEach((q) => batch.set(doc(db, "quiz", q.id), q));

    try {
      await batch.commit();
      setQuizzes(JSON.parse(JSON.stringify(editedQuizzes)));
      setActiveEditIndex(null);
      toast.success("All changes saved!");
    } catch (e) {
      if (e instanceof Error) {
        toast.error(e.message);
      } else {
        toast.error("Failed to save changes.");
      }
    }
  };

  const handleDeleteQuiz = async (idx: number) => {
    if (!editedQuizzes) return;
    setIsDeleting(true);
    try {
      const db = getFirestore();
      await updateDoc(doc(db, "quiz", editedQuizzes[idx].id), {
        is_deleted: true,
      });
      setEditedQuizzes((prev) =>
        prev ? prev.filter((_, i) => i !== idx) : prev
      );
      toast.success("Quiz deleted!");
    } catch (e) {
      if (e instanceof Error) {
        toast.error(e.message);
      } else {
        toast.error("Failed to delete quiz.");
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const handleReset = () => {
    setSelectedCategory(undefined);
    setSelectedLanguage(undefined);
    setEditedQuizzes(null);
  };

  if (quizzes && editedQuizzes) {
    return (
      <section className="space-y-6 max-w-4xl mx-auto p-4">
        <header className="text-center space-y-1">
          <h1 className="text-2xl font-bold">
            {editedQuizzes.length} quiz{quizzes.length === 1 ? "" : "zes"} found
          </h1>
          <p className="text-muted-foreground">
            Category:{" "}
            <strong>{selectedCategory?.replace("_", " ").toUpperCase()}</strong>{" "}
            · Language:{" "}
            <strong>{selectedLanguage?.replace("_", " ").toUpperCase()}</strong>
          </p>
        </header>

        {editedQuizzes.map((q, idx) => {
          const editing = activeEditIndex === idx;
          return (
            <Card key={q.id}>
              <CardHeader className="relative">
                <Button
                  disabled={isDeleting}
                  onClick={() => handleDeleteQuiz(idx)}
                  variant="destructive"
                  className="absolute top-0 right-4 p-2"
                >
                  {isDeleting ? (
                    <Loader2Icon className="animate-spin" />
                  ) : (
                    <Trash2Icon />
                  )}
                </Button>
                <CardTitle>
                  {idx + 1}.{" "}
                  {editing ? (
                    <Input
                      className="mt-4"
                      value={q.question}
                      onChange={(e) =>
                        updateQuizAt(idx, { question: e.target.value })
                      }
                    />
                  ) : (
                    q.question
                  )}
                </CardTitle>
                <CardDescription>
                  {editing ? (
                    <Select
                      value={q.difficulty}
                      onValueChange={(val) =>
                        updateQuizAt(idx, { difficulty: val })
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Easy">Easy</SelectItem>
                        <SelectItem value="Average">Average</SelectItem>
                        <SelectItem value="Hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    q.difficulty
                  )}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4 relative">
                {editing && selectedCategory === "road_sign" ? (
                  <div className="space-y-2">
                    {q.image && (
                      <Image
                        src={q.image}
                        width={500}
                        height={500}
                        alt={`Preview ${idx + 1}`}
                        className="w-full max-h-60 object-contain rounded"
                      />
                    )}

                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageFile(file, idx);
                      }}
                    />
                  </div>
                ) : (
                  q.image && (
                    <Image
                      src={q.image}
                      width={500}
                      height={500}
                      alt={`Question ${idx + 1}`}
                      className="w-full max-h-60 object-contain rounded"
                    />
                  )
                )}

                {/* ───── Choices ───── */}
                <div className="space-y-4">
                  {q.choices.map((choice, i) => {
                    const isCorrect = i === q.correct_answer;
                    return (
                      <Card
                        key={i}
                        role={editing ? "button" : undefined}
                        onClick={() =>
                          editing && updateQuizAt(idx, { correct_answer: i })
                        }
                        className={`${
                          isCorrect ? "border-primary ring-1 ring-primary" : ""
                        } ${editing ? "cursor-pointer" : "cursor-default"}`}
                      >
                        <CardContent className="flex items-center gap-3 py-3">
                          <span
                            className={`relative flex h-4 w-4 items-center justify-center rounded-full border-2 ${
                              isCorrect
                                ? "border-primary"
                                : "border-muted-foreground"
                            }`}
                          >
                            {isCorrect && (
                              <span className="h-2 w-2 rounded-full bg-primary" />
                            )}
                          </span>
                          <span className="text-lg font-bold pl-4">
                            {choice}
                          </span>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {/* ───── Action buttons ───── */}
                <div className="flex justify-end gap-2 pt-2">
                  {editing ? (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setActiveEditIndex(null)}
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => setActiveEditIndex(null)}
                      >
                        Done
                      </Button>
                    </>
                  ) : (
                    <Button size="sm" onClick={() => setActiveEditIndex(idx)}>
                      Edit
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}

        {/* Footer buttons */}
        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={handleReset}>
            Back to filters
          </Button>
          {editedQuizzes.length > 0 && (
            <Button onClick={handleSaveAllChanges}>Save All Changes</Button>
          )}
        </div>
      </section>
    );
  }

  /* ────────────── Filter stepper ────────────── */
  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Filter Quizzes</CardTitle>
        <CardDescription>
          Choose the category and language to filter the quizzes.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <Select
          value={selectedCategory}
          onValueChange={(v) => {
            setSelectedCategory(v);
            pushUrl(v, selectedLanguage);
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="road_sign">Road Sign</SelectItem>
            <SelectItem value="theoretical">Theoretical</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={selectedLanguage}
          onValueChange={(v) => {
            setSelectedLanguage(v);
            pushUrl(selectedCategory, v);
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="english">English</SelectItem>
            <SelectItem value="tagalog">Tagalog</SelectItem>
          </SelectContent>
        </Select>

        {selectedCategory === "theoretical" && (
          <Select
            value={selectedDifficulty ?? undefined}
            onValueChange={(v) => {
              setSelectedDifficulty(v);
              pushUrl(selectedCategory, selectedLanguage, v);
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Easy">Easy</SelectItem>
              <SelectItem value="Average">Average</SelectItem>
              <SelectItem value="Hard">Hard</SelectItem>
            </SelectContent>
          </Select>
        )}
      </CardContent>

      <CardFooter>
        <Button
          onClick={fetchQuizzes}
          disabled={!canProceed}
          className="w-full"
        >
          Find Quizzes
        </Button>
      </CardFooter>

      {error && <p className="text-destructive text-center pb-4">{error}</p>}
    </Card>
  );
};

export default QuizPage;
