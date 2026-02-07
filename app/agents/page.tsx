"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatRelativeTime, getStatusColor, cn } from "@/lib/utils";

export default function AgentsPage() {
  const agents = useQuery(api.agents.list);
  const tasks = useQuery(api.tasks.list);
  const activities = useQuery(api.activities.listWithDetails);

  if (!agents || !tasks || !activities) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Agent Fleet</h1>
        <p className="text-muted-foreground mt-2">
          Detailed view of all agents and their work
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {agents.map((agent) => {
          const agentTasks = tasks.filter((t) =>
            t.assigneeIds.includes(agent._id)
          );
          const currentTask = agent.currentTaskId
            ? tasks.find((t) => t._id === agent.currentTaskId)
            : null;
          const agentActivities = activities
            .filter((a) => a.agentId === agent._id)
            .slice(0, 5);

          return (
            <Card key={agent._id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-4xl">{agent.emoji}</span>
                    <div>
                      <CardTitle className="text-xl">{agent.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {agent.role}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={cn(getStatusColor(agent.status))}
                  >
                    {agent.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Last Active</span>
                    <span>{formatRelativeTime(agent.lastActive)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Total Tasks</span>
                    <span>{agentTasks.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Active</span>
                    <span>
                      {
                        agentTasks.filter((t) =>
                          ["in_progress", "assigned"].includes(t.status)
                        ).length
                      }
                    </span>
                  </div>
                </div>

                {currentTask && (
                  <div className="p-3 rounded-lg border bg-card/50">
                    <div className="text-xs text-muted-foreground mb-1">
                      Current Task
                    </div>
                    <div className="text-sm font-medium">{currentTask.title}</div>
                  </div>
                )}

                {agentActivities.length > 0 && (
                  <div>
                    <div className="text-xs text-muted-foreground mb-2">
                      Recent Activity
                    </div>
                    <div className="space-y-2">
                      {agentActivities.map((activity) => (
                        <div
                          key={activity._id}
                          className="text-xs text-muted-foreground flex items-start space-x-2"
                        >
                          <div className="w-1 h-1 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                          <div>
                            <div>{activity.message}</div>
                            <div className="text-[10px]">
                              {formatRelativeTime(activity.createdAt)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
