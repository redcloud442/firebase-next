"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserData } from "@/utils/types";

const formatTime = (timeStr: string) => {
  return new Date(timeStr).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

export function UserPerformanceCharts({ user }: { user: UserData }) {
  return (
    <div className="grid grid-cols-1 gap-6">
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle>Gameplay Activity Status</CardTitle>
          <CardDescription>
            Each activity is listed under its category with status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="multiple">
            {Object.entries(user.Game_Info || {}).map(([category, games]) => (
              <AccordionItem key={category} value={category}>
                <AccordionTrigger className="text-lg font-medium">
                  {category}
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-4">
                    {Object.entries(games || {}).map(([game, details]) => (
                      <li
                        key={game}
                        className="border p-2 rounded-md flex justify-between items-center"
                      >
                        <div>
                          <p className="font-medium text-lg">
                            {game.replaceAll("_", " ")}
                          </p>
                          <p className="text-muted-foreground text-md">
                            Duration: {details.duration || ""} | Start:{" "}
                            {formatTime(details.start_time || "")} | End:{" "}
                            {formatTime(details.end_time || "")}
                          </p>
                        </div>
                        <Badge
                          variant={`${details.status === "completed" ? "success" : "warning"}`}
                          className="text-white font-medium uppercase"
                        >
                          {details.status || ""}
                        </Badge>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}

export default UserPerformanceCharts;
