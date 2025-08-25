"use client";

import { getDashboardDataService } from "@/service/dashboard/dashboard";
import type { DashboardData } from "@/utils/types";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { DashboardCard } from "../ui/dashboard-card";
import { Skeleton } from "../ui/skeleton";

const clampPercent = (v?: number) => {
  if (v == null || Number.isNaN(v)) return 0;
  return Math.min(100, Math.max(0, v));
};

const formatSeconds = (s?: number) => {
  if (s == null || Number.isNaN(s)) return "0s";
  if (s > 0 && s < 1) return "<1s";
  const sec = Math.floor(s);
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const ss = sec % 60;
  if (h)
    return `${h}:${String(m).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;
  if (m) return `${m}:${String(ss).padStart(2, "0")}`;
  return `${ss}s`;
};

const FrontPage = () => {
  const [data, setData] = useState<DashboardData>();

  useEffect(() => {
    (async () => {
      const dashboard = await getDashboardDataService();
      setData(dashboard);
    })();
  }, []);

  if (!data) {
    return (
      <div className="space-y-4 w-full">
        <Skeleton className="w-full h-[100px] rounded-lg" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Skeleton className="w-full h-[200px] rounded-lg" />
          <Skeleton className="w-full h-[200px] rounded-lg" />
          <Skeleton className="w-full h-[200px] rounded-lg" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Skeleton className="w-full h-[200px] rounded-lg" />
          <Skeleton className="w-full h-[200px] rounded-lg" />
          <Skeleton className="w-full h-[200px] rounded-lg" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Skeleton className="w-full h-[600px] rounded-lg" />
          <Skeleton className="w-full h-[600px] rounded-lg" />
        </div>
      </div>
    );
  }

  // prefer new aliases if present; fallback to old fields
  const avgScore = data.avgScore ?? data.averageQuizScore ?? 0;
  const avgTimeSpent = data.avgTimeSpent ?? data.avgSecondsConsumed ?? 0;
  const successRateClamped = clampPercent(data.successRate);

  const stageChartData = [
    {
      name: "Most Completed Stage",
      stage: data.mostCompletedStage,
      value: data.mostCompletedStageStars,
    },
    {
      name: "Least Completed Stage",
      stage: data.leastCompletedStage,
      value: data.leastCompletedStageStars,
    },
  ];

  const scoreBucketData = [
    { name: "0-5", value: data.scoreBuckets["0-10"] },
    { name: "6-10", value: data.scoreBuckets["11-20"] },
    { name: "11-15", value: data.scoreBuckets["21-30"] },
    { name: "16-above", value: data.scoreBuckets["31-40"] },
  ];

  const pieColors = ["#F59E0B", "#3B82F6", "#8B5CF6", "#10B981"];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md p-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold">📊 Dashboard Overview</h1>
        <span className="text-sm opacity-80">Real-time Stats</span>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <DashboardCard title="Total Users" value={data.totalUsers} />
        <DashboardCard title="Active Players" value={data.activePlayers} />
        <DashboardCard title="Quiz Attempts" value={data.totalQuizAttempts} />
        <DashboardCard
          title="Success Rate"
          value={`${successRateClamped.toFixed(2)}%`}
          hint="Clamped to 100% for display"
        />
        <DashboardCard
          title="Avg. Quiz Score"
          value={avgScore.toFixed(2)}
          hint="Check backend max score if this looks high"
        />
        <DashboardCard
          title="Avg. Time Spent"
          value={formatSeconds(avgTimeSpent)}
          hint="Average time per quiz"
        />
        <DashboardCard
          title="Avg. Time / Question"
          value={formatSeconds(data.avgTimePerQuestion)}
        />
        <DashboardCard
          title="Fast Exit Rate"
          value={`${(data.fastExitRate ?? 0).toFixed(1)}%`}
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Attempts last 7 days */}
        <div className="rounded-xl border shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Attempts (Last 7 Days)</h2>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.attemptsByDay}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="attempts" fill="#4F46E5" radius={[8, 8, 0, 0]}>
                  <LabelList dataKey="attempts" position="top" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Avg Score last 7 days */}
        <div className="rounded-xl border shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">
            Avg Score (Last 7 Days)
          </h2>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.avgScoreByDay}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, "auto"]} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="avgScore"
                  stroke="#10B981"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Score Distribution */}
        <div className="rounded-xl border shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Score Distribution</h2>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip />
                <Legend />
                <Pie
                  dataKey="value"
                  nameKey="name"
                  data={scoreBucketData}
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={3}
                  label
                >
                  {scoreBucketData.map((_, idx) => (
                    <Cell key={idx} fill={pieColors[idx % pieColors.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Stage Completion */}
      <div className="rounded-xl border shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">Game Stage Completion</h2>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stageChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="stage" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#6366F1" radius={[8, 8, 0, 0]}>
                <LabelList dataKey="name" position="top" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default FrontPage;
