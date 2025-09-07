"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { storage } from "@/utils/firebase/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Trash2Icon } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { toast } from "sonner";
import type { CreateVideo } from "./CreateVideoPage";

interface Props {
  index: number;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  remove: () => void;
}

export default function VideoItem({ index, remove, setIsLoading }: Props) {
  const { control, register, setValue, getValues } = useFormContext<{
    video: CreateVideo[];
  }>();

  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  // Keep preview in sync if the form already has a value (e.g., after editing)
  useEffect(() => {
    const current = getValues(`video.${index}.video_url`);
    if (current) setVideoUrl(current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleVideoFile = async (file: File, idx: number) => {
    setIsLoading(true);
    const storageRef = ref(storage, `quiz/videos/${Date.now()}-${file.name}`);
    try {
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setVideoUrl(url);
      setValue(`video.${idx}.video_url`, url, {
        shouldDirty: true,
        shouldTouch: true,
      });
      toast.success("Video uploaded successfully");
    } catch (e) {
      toast.error(
        e instanceof Error ? e.message : "Could not upload video file."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="relative">
      <CardHeader className="flex flex-row justify-between">
        <CardTitle>Video {index + 1}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex justify-center">
          {videoUrl ? (
            <video src={videoUrl} width={500} height={500} controls />
          ) : (
            <p className="text-muted-foreground">No video uploaded</p>
          )}
        </div>

        <Input
          type="file"
          accept="video/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleVideoFile(file, index);
          }}
        />

        <Input
          {...register(`video.${index}.name` as const)}
          placeholder="Name"
        />

        {/* Language Select (controlled via Controller) */}
        <Controller
          control={control}
          name={`video.${index}.lessonLanguage` as const}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="english">English</SelectItem>
                <SelectItem value="tagalog">Tagalog</SelectItem>
              </SelectContent>
            </Select>
          )}
        />

        {/* Lesson Type Select (controlled via Controller) */}
        <Controller
          control={control}
          name={`video.${index}.lesson_type` as const}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Lesson Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="car">Car</SelectItem>
                <SelectItem value="motorcycle">Motorcycle</SelectItem>
              </SelectContent>
            </Select>
          )}
        />

        <Button
          variant="destructive"
          type="button"
          onClick={remove}
          className="absolute top-4 right-4"
        >
          <Trash2Icon className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}
