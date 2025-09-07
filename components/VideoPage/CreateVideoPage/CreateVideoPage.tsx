"use client";

import { Button } from "@/components/ui/button";
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

export type CreateVideo = {
  name: string;
  video_url: string;
  lesson_type: "car" | "motorcycle";
  lessonLanguage: "english" | "tagalog";
};

type FormValues = {
  video: CreateVideo[];
};

const zodSchema = z.object({
  video: z.array(
    z.object({
      name: z.string().trim().min(1, "Name is required"),
      video_url: z.string().trim().url("Please upload a valid video"),
      lesson_type: z.enum(["car", "motorcycle"]),
      lessonLanguage: z.enum(["english", "tagalog"]),
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
          video_url: "",
          lesson_type: "car",
          lessonLanguage: "english",
        },
      ],
    },
    resolver: zodResolver(zodSchema),
    mode: "onSubmit",
  });

  const { control, handleSubmit, reset } = form;

  const {
    fields: videoFields,
    append: appendVideo,
    remove: removeVideo,
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
          createdAt: serverTimestamp(),
          id: videoRef.id,
          is_deleted: false,
        });
      });

      await batch.commit();
      toast.success("Video Lesson(s) created successfully");
      reset({
        video: [
          {
            name: "",
            video_url: "",
            lesson_type: "car",
            lessonLanguage: "english",
          },
        ],
      });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to create videos");
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
            remove={() => removeVideo(index)}
          />
        ))}

        <div className="flex justify-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              appendVideo({
                name: "",
                video_url: "",
                lesson_type: "car", // keep consistent
                lessonLanguage: "english", // keep consistent
              })
            }
          >
            <PlusIcon className="mr-2 h-4 w-4" /> Add Video
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
