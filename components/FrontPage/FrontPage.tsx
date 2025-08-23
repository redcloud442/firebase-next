"use client";

import { getDashboardDataService } from "@/service/dashboard/dashboard";
import type { DashboardData } from "@/utils/types";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  LabelList,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { DashboardCard } from "../ui/dashboard-card";
import { Skeleton } from "../ui/skeleton";

const FrontPage = () => {
  const [data, setData] = useState<DashboardData>();

  const fetchData = async () => {
    const dashboard = await getDashboardDataService();

    setData(dashboard);
  };

  useEffect(() => {
    fetchData();
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

  return (
    <div className="space-y-8">
      <div className="rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md p-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold">📊 Dashboard Overview</h1>
        <span className="text-sm opacity-80">Real-time Stats</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard title="Total Users" value={data?.totalUsers ?? 0} />
        <DashboardCard
          title="Active Players"
          value={data?.activePlayers ?? 0}
        />
        <DashboardCard
          title="Quiz Attempts"
          value={data?.totalQuizAttempts ?? 0}
        />
        <DashboardCard
          title="Success Rate"
          value={`${data?.successRate ? data.successRate.toFixed(2) : "0.00"}%`}
        />
        <DashboardCard
          title="Avg. Quiz Score"
          value={
            data?.averageQuizScore ? data.averageQuizScore.toFixed(2) : "0.00"
          }
        />
      </div>

      <div className="rounded-xl border shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">Game Stage Completion</h2>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart className="text-black" data={stageChartData}>
              <XAxis dataKey="stage" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                className="text-black"
                dataKey="value"
                fill="#4F46E5"
                radius={[8, 8, 0, 0]}
              >
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
