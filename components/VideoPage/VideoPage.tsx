"use client";

import { videoService } from "@/service/video/video";
import { storage } from "@/utils/firebase/firebase";
import { Video } from "@/utils/types";
import { doc, getFirestore, updateDoc, writeBatch } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Loader2Icon, Trash2Icon } from "lucide-react";
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
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const VideoPage = () => {
  const [selectedLessonType, setSelectedLessonType] = useState<string>();
  const [selectedLanguage, setSelectedLanguage] = useState<string>();

  const [videos, setVideos] = useState<Video[] | null>(null);
  const [editedVideos, setEditedVideos] = useState<Video[] | null>(null);
  const [activeEditIndex, setActiveEditIndex] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const searchParams = useSearchParams();

  useEffect(() => {
    const lessonType = searchParams.get("lessonType") ?? undefined;
    const language = searchParams.get("language") ?? undefined;
    if (language) setSelectedLanguage(language);
    if (lessonType) setSelectedLessonType(lessonType);
  }, [searchParams]);

  const pushUrl = (lessonType?: string, language?: string) => {
    const qs = new URLSearchParams();
    if (lessonType) qs.set("lessonType", lessonType);
    if (language) qs.set("language", language);
    window.history.pushState({}, "", `/video?${qs.toString()}`);
  };

  const canProceed = selectedLessonType;

  const fetchVideos = async () => {
    setError(null);
    try {
      const data = await videoService({
        lessonType: selectedLessonType ?? "",
        language: selectedLanguage ?? "",
      });
      setVideos(data);
      setEditedVideos(JSON.parse(JSON.stringify(data)));
    } catch (e) {
      if (e instanceof Error) {
        toast.error(e.message);
      } else {
        toast.error("Failed to fetch quizzes. Please try again.");
      }
    }
  };

  const updateVideoAt = (idx: number, newData: Partial<Video>) =>
    setEditedVideos((prev) =>
      prev ? prev.map((q, i) => (i === idx ? { ...q, ...newData } : q)) : prev
    );

  const fileToDataURL = async (file: File) => {
    const storageRef = ref(storage, `video/${file.name}`);

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
      if (dataUrl) updateVideoAt(idx, { video_url: dataUrl });
    } catch (e) {
      if (e instanceof Error) {
        toast.error(e.message);
      } else {
        toast.error("Could not read image file.");
      }
    }
  };

  const handleSaveAllChanges = async () => {
    if (!editedVideos) return;
    const db = getFirestore();
    const batch = writeBatch(db);
    editedVideos.forEach((v) => batch.set(doc(db, "video", v.id), v));

    try {
      await batch.commit();
      setVideos(JSON.parse(JSON.stringify(editedVideos)));
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
    if (!editedVideos) return;
    setIsDeleting(true);
    try {
      const db = getFirestore();
      await updateDoc(doc(db, "video", editedVideos[idx].id), {
        is_deleted: true,
      });
      setEditedVideos((prev) =>
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
    setEditedVideos(null);
  };

  if (videos && editedVideos) {
    return (
      <section className="space-y-6 max-w-4xl mx-auto p-4">
        <header className="text-center space-y-1">
          <h1 className="text-2xl font-bold">
            {editedVideos.length} video{videos.length === 1 ? "" : "s"} found
          </h1>
        </header>

        {editedVideos.map((v, idx) => {
          const editing = activeEditIndex === idx;
          return (
            <Card key={v.id}>
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
                  {idx + 1} . {v.name}
                </CardTitle>
                <CardDescription></CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {editing ? (
                  <div className="space-y-2 flex flex-col items-center">
                    {v.video_url && (
                      <video
                        src={v.video_url}
                        width={500}
                        height={500}
                        controls
                      />
                    )}

                    <Input
                      type="file"
                      accept="video/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageFile(file, idx);
                      }}
                    />
                  </div>
                ) : (
                  v.video_url && (
                    <div className="space-y-2 flex flex-col items-center">
                      <video
                        src={v.video_url}
                        width={500}
                        height={500}
                        controls
                      />
                    </div>
                  )
                )}

                <div className="space-y-4">
                  <Label>Name</Label>
                  {v.name && (
                    <Input
                      type="text"
                      value={v.name}
                      onChange={(e) => {
                        updateVideoAt(idx, { name: e.target.value });
                      }}
                    />
                  )}

                  <Label>Lesson Type</Label>
                  {v.lesson_type && (
                    <Select
                      onValueChange={(val) => {
                        updateVideoAt(idx, { lesson_type: val });
                      }}
                      value={v.lesson_type}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Category Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="car">Car</SelectItem>
                        <SelectItem value="motorcycle">Motorcycle</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </div>

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
          {editedVideos.length > 0 && (
            <Button onClick={handleSaveAllChanges}>Save All Changes</Button>
          )}
        </div>
      </section>
    );
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Filter Video</CardTitle>
        <CardDescription>
          Choose the category to filter the videos.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <Select
          value={selectedLessonType ?? undefined}
          onValueChange={(v) => {
            setSelectedLessonType(v);
            pushUrl(v);
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Lesson Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="car">Car</SelectItem>
            <SelectItem value="motorcycle">Motorcycle</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={selectedLanguage ?? undefined}
          onValueChange={(v) => {
            setSelectedLanguage(v);
            pushUrl(selectedLessonType, v);
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="english">English</SelectItem>
            <SelectItem value="tagalog">Tagalog</SelectItem>
          </SelectContent>
        </Select>
      </CardContent>

      <CardFooter>
        <Button onClick={fetchVideos} disabled={!canProceed} className="w-full">
          Find Quizzes
        </Button>
      </CardFooter>

      {error && <p className="text-destructive text-center pb-4">{error}</p>}
    </Card>
  );
};

export default VideoPage;
