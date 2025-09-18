"use client";

import { StudyBlock } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Bell, Calendar, TrendingUp } from "lucide-react";
import { isToday, isThisWeek, isAfter } from "date-fns";

interface StudyStatsProps {
  studyBlocks: StudyBlock[];
}

export const ReminderStats = ({ studyBlocks }: StudyStatsProps) => {
  const now = new Date();

  const todayBlocks = studyBlocks.filter((block) =>
    isToday(new Date(block.startTime))
  );
  const thisWeekBlocks = studyBlocks.filter((block) =>
    isThisWeek(new Date(block.startTime))
  );
  const upcomingBlocks = studyBlocks.filter((block) =>
    isAfter(new Date(block.startTime), now)
  );

  const totalTodayMinutes = todayBlocks.reduce(
    (acc, block) => acc + block.duration,
    0
  );
  const totalWeekMinutes = thisWeekBlocks.reduce(
    (acc, block) => acc + block.duration,
    0
  );

  const formatHours = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const stats = [
    {
      title: "Today's Sessions",
      value: todayBlocks.length.toString(),
      description:
        totalTodayMinutes > 0 ? formatHours(totalTodayMinutes) : "No sessions",
      icon: Calendar,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      title: "This Week",
      value: thisWeekBlocks.length.toString(),
      description:
        totalWeekMinutes > 0 ? formatHours(totalWeekMinutes) : "No sessions",
      icon: TrendingUp,
      color: "text-green-600",
      bg: "bg-green-100",
    },
    // {
    //   title: "Total Hours Planned",
    //   value: formatHours(
    //     studyBlocks.reduce((acc, block) => acc + block.duration, 0)
    //   ),
    //   description: `${studyBlocks.length} sessions`,
    //   icon: Clock,
    //   color: "text-purple-600",
    //   bg: "bg-purple-100",
    // },
    {
      title: "Upcoming",
      value: upcomingBlocks.length.toString(),
      description: "Sessions scheduled",
      icon: Bell,
      color: "text-orange-600",
      bg: "bg-orange-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card
          key={index}
          className="animate-fade-in hover:shadow-md transition-shadow"
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-muted-foreground">
                  {stat.description}
                </p>
              </div>
              <div className={`p-3 rounded-full ${stat.bg}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
