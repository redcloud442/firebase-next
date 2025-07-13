"use client";

import { UserData } from "@/utils/types";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

type UserPerformanceChartProps = {
  user: UserData;
};

export const UserPerformanceChart = ({ user }: UserPerformanceChartProps) => {
  const progress = user.progress ?? {};
  const data = Object.entries(progress).map(([lessonName, value]) => {
    if (typeof value === "object" && "CurrentStars" in value) {
      return {
        lesson: lessonName,
        current: value?.CurrentStars ?? 0,
        total: value?.TotalStars ?? 0,
      };
    }
    return null;
  });

  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active: boolean;
    payload: { name: string; value: number }[];
    label: string;
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-md border border-border bg-background p-3 shadow-md">
          <p className="text-sm font-semibold">{label}</p>
          {payload.map(
            (entry: { name: string; value: number }, index: number) => (
              <p
                key={index}
                className={`text-sm ${
                  entry.name === "Current Stars"
                    ? "text-blue-500"
                    : "text-muted-foreground"
                }`}
              >
                {entry.name} : {entry.value}
              </p>
            )
          )}
        </div>
      );
    }

    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Player Progress Overview</CardTitle>
        <CardDescription>
          Shows the star progress in each lesson or quiz
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="lesson" tick={{ fontSize: 12 }} />
            <YAxis allowDecimals={false} />
            <Tooltip
              content={<CustomTooltip active={false} payload={[]} label={""} />}
            />
            <Legend />
            <Bar dataKey="current" fill="#3b82f6" name="Current Stars" />
            <Bar dataKey="total" fill="#d1d5db" name="Total Stars" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
