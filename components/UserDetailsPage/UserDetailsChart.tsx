"use client";

import { TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Label,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { UserData } from "@/utils/types";

export function UserPerformanceCharts({ user }: { user: UserData }) {
  const correctAnswers = user.Quiz_Info?.correct_answers || 0;
  const wrongAnswers = user.Quiz_Info?.wrong_answers || 0;
  const totalQuestions = user.Quiz_Info?.total_questions || 0;

  const timeToSeconds = (duration = "00:00:00") => {
    const parts = duration.split(":").map(Number);
    if (parts.length === 3) {
      const [h, m, s] = parts;
      return h * 3600 + m * 60 + s;
    } else if (parts.length === 2) {
      const [m, s] = parts;
      return m * 60 + s;
    }
    return 0;
  };

  const carGames = user.Game_Info?.Cars || {};
  const motorcycleGames = user.Game_Info?.Motorcycle || {};

  const carDurationData = Object.entries(carGames).map(([label, value]) => {
    const val = value as { duration: string };
    return {
      name: label.replaceAll("_", " "),
      duration: timeToSeconds(val.duration),
    };
  });

  const motorcycleDurationData = Object.entries(motorcycleGames).map(
    ([label, value]) => {
      const val = value as { duration: string };
      return {
        name: label.replaceAll("_", " "),
        duration: timeToSeconds(val.duration),
      };
    }
  );

  const totalGames =
    Object.keys(carGames).length + Object.keys(motorcycleGames).length;

  const testDuration = timeToSeconds(user.Quiz_Info?.duration || "00:00:00");

  const playerPerformanceData = [
    { metric: "Correct Answers", value: correctAnswers, fill: "#4f46e5" },
    { metric: "Wrong Answers", value: wrongAnswers, fill: "#ef4444" },
    { metric: "Games Finished", value: totalGames, fill: "#f59e0b" },
  ];

  const testDurationData = [{ name: "Test Duration", duration: testDuration }];

  const playerChartConfig = {
    "Correct Answers": { label: "Correct", color: "#4f46e5" },
    "Wrong Answers": { label: "Wrong", color: "#ef4444" },
    "Games Finished": { label: "Games", color: "#f59e0b" },
  } satisfies ChartConfig;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Player Performance Chart */}
      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle>Player Performance</CardTitle>
          <CardDescription>Score breakdown</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <ChartContainer
            config={playerChartConfig}
            className="mx-auto aspect-square max-h-[250px]"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={playerPerformanceData}
                dataKey="value"
                nameKey="metric"
                innerRadius={60}
                strokeWidth={5}
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-3xl font-bold"
                          >
                            {correctAnswers.toLocaleString()} / 20
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground"
                          >
                            Total Points
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col gap-2 text-sm">
          <div className="flex items-center gap-2 font-medium leading-none">
            Games finished: {totalGames} <TrendingUp className="h-4 w-4" />
          </div>
          <div className="leading-none text-muted-foreground">
            Player answered {totalQuestions} questions
          </div>
        </CardFooter>
      </Card>

      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle>Quiz Completion Time</CardTitle>
          <CardDescription>
            How long the player took to finish the quiz
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart className="dark:text-black" data={testDurationData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis
                label={{
                  value: "Seconds",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <Tooltip />
              <Bar dataKey="duration" fill="#f43f5e" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
        <CardFooter className="text-muted-foreground text-sm">
          Test duration was calculated based on quiz metadata.
        </CardFooter>
      </Card>

      {/* Car Game Duration Chart */}
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle>Car Game Durations</CardTitle>
          <CardDescription>Time spent per car game</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart className="dark:text-black" data={carDurationData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis
                label={{ value: "Seconds", angle: -90, position: "insideLeft" }}
              />
              <Tooltip />
              <Bar dataKey="duration" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
        <CardFooter className="text-muted-foreground text-sm">
          Each bar shows time spent on a car driving task.
        </CardFooter>
      </Card>

      {/* Motorcycle Game Duration Chart */}
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle>Motorcycle Game Durations</CardTitle>
          <CardDescription>Time spent per motorcycle game</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart className="dark:text-black" data={motorcycleDurationData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis
                label={{ value: "Seconds", angle: -90, position: "insideLeft" }}
              />
              <Tooltip />
              <Bar dataKey="duration" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
        <CardFooter className="text-muted-foreground text-sm">
          Each bar shows time spent on a motorcycle driving task.
        </CardFooter>
      </Card>
    </div>
  );
}

export default UserPerformanceCharts;
