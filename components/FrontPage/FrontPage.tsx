"use client";

import { Card, CardContent } from "@/components/ui/card";
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
      <div className="max-w-6xl mx-auto p-6">
        <p className="text-center text-muted-foreground animate-pulse">
          Loading dashboard...
        </p>
      </div>
    );
  }

  const stageChartData = [
    {
      name: "Most Completed Stage",
      stage: data.mostCompletedStage,
      value: 1,
    },
    {
      name: "Least Completed Stage",
      stage: data.leastCompletedStage,
      value: 1,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md p-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold">📊 Dashboard Overview</h1>
        <span className="text-sm opacity-80">Real-time Stats</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard title="Total Users" value={data.totalUsers} />
        <DashboardCard title="Active Players" value={data.activePlayers} />
        <DashboardCard title="Quiz Attempts" value={data.totalQuizAttempts} />
        <DashboardCard
          title="Success Rate"
          value={`${data.successRate.toFixed(2)}%`}
        />
        <DashboardCard
          title="Avg. Quiz Score"
          value={data.averageQuizScore.toFixed(2)}
        />
        <DashboardCard
          title="Avg. Time Spent"
          value={`${(data.averageTimeSpent / 60).toFixed(2)} mins`}
        />
      </div>

      <div className="rounded-xl border shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">Game Stage Completion</h2>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stageChartData}>
              <XAxis dataKey="stage" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#4F46E5" radius={[8, 8, 0, 0]}>
                <LabelList dataKey="name" position="top" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

// 👇 Clean reusable card component
const DashboardCard = ({
  title,
  value,
}: {
  title: string;
  value: number | string;
}) => (
  <Card className="transition-all hover:shadow-md hover:scale-[1.02] duration-200">
    <CardContent className="p-5 space-y-1">
      <p className="text-sm text-muted-foreground">{title}</p>
      <p className="text-2xl font-semibold">{value}</p>
    </CardContent>
  </Card>
);

export default FrontPage;
