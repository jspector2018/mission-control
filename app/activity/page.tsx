"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatRelativeTime } from "@/lib/utils";

const activityTypeColors: Record<string, string> = {
  task_created: "bg-blue-500/20 text-blue-500",
  task_updated: "bg-purple-500/20 text-purple-500",
  task_assigned: "bg-green-500/20 text-green-500",
  trade_opened: "bg-yellow-500/20 text-yellow-500",
  trade_closed: "bg-orange-500/20 text-orange-500",
  agent_status: "bg-gray-500/20 text-gray-500",
  mission_update: "bg-pink-500/20 text-pink-500",
};

export default function ActivityPage() {
  const activities = useQuery(api.activities.listWithDetails, { limit: 100 });

  if (!activities) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  // Group activities by date
  const groupedActivities = activities.reduce((acc, activity) => {
    const date = new Date(activity.createdAt).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(activity);
    return acc;
  }, {} as Record<string, typeof activities>);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Activity Feed</h1>
        <p className="text-muted-foreground mt-2">
          Complete chronological log of all operations
        </p>
      </div>

      <div className="space-y-8">
        {Object.entries(groupedActivities).map(([date, dayActivities]) => (
          <div key={date} className="space-y-3">
            <h2 className="text-lg font-semibold text-muted-foreground sticky top-0 bg-background py-2">
              {date}
            </h2>
            <div className="space-y-2">
              {dayActivities.map((activity, index) => (
                <Card key={activity._id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        {activity.agent && (
                          <span className="text-2xl flex-shrink-0">
                            {activity.agent.emoji}
                          </span>
                        )}
                        <div className="flex-1 space-y-2">
                          <div className="flex items-start justify-between">
                            <p className="text-sm font-medium leading-relaxed">
                              {activity.message}
                            </p>
                          </div>
                          <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                            {activity.agent && (
                              <span>{activity.agent.name}</span>
                            )}
                            {activity.mission && (
                              <>
                                <span>•</span>
                                <span>{activity.mission.name}</span>
                              </>
                            )}
                            <span>•</span>
                            <span>{formatDate(activity.createdAt)}</span>
                            <span>•</span>
                            <span>{formatRelativeTime(activity.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className={
                          activityTypeColors[activity.type] ||
                          "bg-gray-500/20 text-gray-500"
                        }
                      >
                        {activity.type.replace(/_/g, " ")}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}

        {activities.length === 0 && (
          <div className="text-center p-12 text-muted-foreground">
            No activity yet
          </div>
        )}
      </div>
    </div>
  );
}
