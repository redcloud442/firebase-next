"use client";

import { Button } from "@/components/ui/button";
import { CreateQuiz } from "@/utils/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { collection, doc, getFirestore, writeBatch } from "firebase/firestore";
import { PlusIcon } from "lucide-react";
import { useEffect } from "react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import QuizItem from "./CreateQuizitem";

type FormValues = {
  quizzes: CreateQuiz[];
};

const zodSchema = z.object({
  quizzes: z.array(
    z.object({
      question: z.string().trim(),
      image: z.string().trim(),
      difficulty: z.string(),
      choices: z.array(z.object({ value: z.string().trim() })),
      correct_answer: z.number(),
      is_deleted: z.boolean(),
      quizLanguage: z.string().trim(),
      quiz_type: z.string().trim(),
    })
  ),
});

export default function CreateQuizPage() {
  const form = useForm<FormValues>({
    defaultValues: {
      quizzes: [],
    },
    resolver: zodResolver(zodSchema),
  });

  const { control, handleSubmit, reset } = form;

  const {
    fields: quizFields,
    append: appendQuiz,
    insert: insertQuiz,
    remove: removeQuiz,
  } = useFieldArray({
    control,
    name: "quizzes",
  });

  const onSubmit = async (data: FormValues) => {
    try {
      const db = getFirestore();
      const batch = writeBatch(db);

      data.quizzes.forEach((quiz) => {
        const quizRef = doc(collection(db, "quiz"));
        batch.set(quizRef, {
          ...quiz,
          id: quizRef.id,
          choices: quiz.choices.map((c) => c.value),
        });
      });

      reset();

      await batch.commit();
      toast.success("Quiz created successfully");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to create quiz");
    }
  };

  useEffect(() => {
    if (quizFields.length === 0) {
      insertQuiz(0, {
        question: "",
        image: "",
        difficulty: "Easy",
        choices: [{ value: "" }, { value: "" }, { value: "" }, { value: "" }],
        correct_answer: 0,
        is_deleted: false,
        quizLanguage: "english",
        quiz_type: "road_sign",
      });
    }
  }, []);

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {quizFields.map((field, index) => (
          <QuizItem
            key={field.id}
            index={index}
            remove={() => removeQuiz(index)}
          />
        ))}

        <div className="flex justify-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              appendQuiz({
                question: "",
                image: "",
                difficulty: "Easy",
                choices: [
                  { value: "" },
                  { value: "" },
                  { value: "" },
                  { value: "" },
                ],
                correct_answer: 0,
                is_deleted: false,
                quizLanguage: "english",
                quiz_type: "road_sign",
              })
            }
          >
            <PlusIcon /> Add Quiz
          </Button>
        </div>

        <Button
          disabled={form.formState.isSubmitting}
          className="w-full"
          type="submit"
        >
          Submit All
        </Button>
      </form>
    </FormProvider>
  );
}
