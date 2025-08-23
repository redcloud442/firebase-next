"use client";

import { Button } from "@/components/ui/button";
import { CreateVideo } from "@/utils/types";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  collection,
  doc,
  getFirestore,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import VideoItem from "./VideoItem";

type FormValues = {
  video: CreateVideo[];
};

const zodSchema = z.object({
  video: z.array(
    z.object({
      name: z.string().trim(),
      video_url: z.string().trim(),
      lesson_type: z.string().trim(),
      lessonLanguage: z.string().trim(),
    })
  ),
});

export default function CreateQuizPage() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    defaultValues: {
      video: [
        {
          name: "",
          lesson_type: "car",
          video_url: "",
          lessonLanguage: "motorcycle",
        },
      ],
    },
    resolver: zodResolver(zodSchema),
  });

  const { control, handleSubmit, reset } = form;

  const {
    fields: videoFields,
    append: appendQuiz,
    remove: removeQuiz,
  } = useFieldArray({
    control,
    name: "video",
  });

  const onSubmit = async (data: FormValues) => {
    try {
      const db = getFirestore();
      const batch = writeBatch(db);

      data.video.forEach((video) => {
        const videoRef = doc(collection(db, "video"));
        batch.set(videoRef, {
          ...video,
          name: video.name,
          video_url: video.video_url,
          createdAt: serverTimestamp(),
          lessonLanguage: video.lessonLanguage,
          id: videoRef.id,
          is_deleted: false,
        });
      });

      reset();

      await batch.commit();
      toast.success("Video Lesson created successfully");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to create quiz");
    }
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {videoFields.map((field, index) => (
          <VideoItem
            key={field.id}
            index={index}
            setIsLoading={setIsLoading}
            remove={() => removeQuiz(index)}
          />
        ))}

        <div className="flex justify-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              appendQuiz({
                name: "",
                video_url: "",
                lesson_type: "car",
                lessonLanguage: "motorcycle",
              })
            }
          >
            <PlusIcon /> Add Video
          </Button>
        </div>

        <Button
          disabled={form.formState.isSubmitting || isLoading}
          className="w-full"
          type="submit"
        >
          Submit All
        </Button>
      </form>
    </FormProvider>
  );
}
