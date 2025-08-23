"use client";

import { Button } from "@/components/ui/button";
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
import { Dispatch, SetStateAction, useState } from "react";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";

interface Props {
  index: number;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  remove: () => void;
}

export default function QuizItem({ index, remove, setIsLoading }: Props) {
  const { register, setValue } = useFormContext();
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const handleVideoFile = async (file: File, idx: number) => {
    setIsLoading(true);
    const storageRef = ref(storage, `quiz/videos/${file.name}`);
    try {
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setVideoUrl(url);
      setValue(`video.${idx}.video_url`, url);
      toast.success("Video uploaded successfully");
    } catch (e) {
      if (e instanceof Error) {
        toast.error(e.message);
      } else {
        toast.error("Could not upload video file.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectLessonType = (val: string) => {
    setValue(`video.${index}.lesson_type`, val);
  };

  const handleSelectLanguage = (val: string) => {
    setValue(`video.${index}.lessonLanguage`, val);
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

        <Input {...register(`video.${index}.name`)} placeholder="Name" />

        <Select onValueChange={handleSelectLanguage} defaultValue="tagalog">
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="english">English</SelectItem>
            <SelectItem value="tagalog">Tagalog</SelectItem>
          </SelectContent>
        </Select>

        <Select
          onValueChange={handleSelectLessonType}
          defaultValue="motorcycle"
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Lesson Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="car">Car</SelectItem>
            <SelectItem value="motorcycle">Motorcycle</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="destructive"
          type="button"
          onClick={remove}
          className="absolute top-4 right-4"
        >
          <Trash2Icon />
        </Button>
      </CardContent>
    </Card>
  );
}
