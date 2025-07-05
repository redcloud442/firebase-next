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
import { useFieldArray, useFormContext } from "react-hook-form";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface Props {
  index: number;
  remove: () => void;
}

export default function QuizItem({ index, remove }: Props) {
  const { register, control, setValue, watch } = useFormContext();

  const {
    fields: choiceFields,
    append: appendChoice,
    remove: removeChoice,
  } = useFieldArray({
    control,
    name: `quizzes.${index}.choices`,
  });

  const correctAnswer = watch(`quizzes.${index}.correct_answer`);

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
    const dataUrl = await fileToDataURL(file);
    if (dataUrl) setValue(`quizzes.${idx}.image`, dataUrl);
  };

  const imageUrl = watch(`quizzes.${index}.image`);
  const quizType = watch(`quizzes.${index}.quiz_type`);

  const handleQuizTypeChange = (val: string) => {
    setValue(`quizzes.${index}.quiz_type`, val);
    if (val === "road_sign") {
      setValue(`quizzes.${index}.choices`, [
        { value: "" },
        { value: "" },
        { value: "" },
        { value: "" },
      ]);
    } else {
      setValue(`quizzes.${index}.choices`, [
        { value: "" },
        { value: "" },
        { value: "" },
      ]);
    }
  };

  const roadSignChoiceLength = quizType === "road_sign" ? 4 : 3;

  return (
    <Card className="relative">
      <CardHeader className="flex flex-row justify-between">
        <CardTitle>Question {index + 1}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {imageUrl &&
          (quizType === "road_sign" ? (
            <div className="flex justify-center">
              <img src={imageUrl} alt="quiz image" width={500} height={500} />
            </div>
          ) : null)}

        {quizType === "road_sign" && (
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleImageFile(file, index);
            }}
          />
        )}

        <Input
          {...register(`quizzes.${index}.question`)}
          placeholder="Question"
        />

        <Select
          onValueChange={(val) => setValue(`quizzes.${index}.difficulty`, val)}
          defaultValue="Easy"
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Easy">Easy</SelectItem>
            <SelectItem value="Average">Average</SelectItem>
            <SelectItem value="Hard">Hard</SelectItem>
          </SelectContent>
        </Select>

        <Select onValueChange={handleQuizTypeChange} defaultValue="road_sign">
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Quiz Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="road_sign">Road Sign</SelectItem>
            <SelectItem value="theoretical">Theoretical</SelectItem>
          </SelectContent>
        </Select>

        <Select
          onValueChange={(val) =>
            setValue(`quizzes.${index}.quizLanguage`, val)
          }
          defaultValue="english"
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="english">English</SelectItem>
            <SelectItem value="tagalog">Tagalog</SelectItem>
          </SelectContent>
        </Select>

        <div className="space-y-2">
          <h3 className="text-sm font-medium">Choices</h3>
          {choiceFields.map((choice, choiceIdx) => (
            <div key={choice.id} className="flex items-center gap-2">
              <Input
                {...register(`quizzes.${index}.choices.${choiceIdx}.value`)}
                placeholder={`Choice ${choiceIdx + 1}`}
              />
              <Button
                type="button"
                variant={correctAnswer === choiceIdx ? "default" : "outline"}
                onClick={() =>
                  setValue(`quizzes.${index}.correct_answer`, choiceIdx)
                }
              >
                {correctAnswer === choiceIdx ? "✔" : "Mark as Correct"}
              </Button>
              {choiceFields.length > 1 && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => removeChoice(choiceIdx)}
                >
                  <Trash2Icon />
                </Button>
              )}
            </div>
          ))}
          <div className="flex justify-center">
            {choiceFields.length < roadSignChoiceLength && (
              <Button type="button" onClick={() => appendChoice("")}>
                Add Choice
              </Button>
            )}
          </div>
        </div>

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
