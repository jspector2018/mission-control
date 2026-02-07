"use client";

import { useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatRelativeTime, cn } from "@/lib/utils";

const columns = [
  { id: "inbox", name: "Inbox", color: "text-gray-500" },
  { id: "assigned", name: "Assigned", color: "text-blue-500" },
  { id: "in_progress", name: "In Progress", color: "text-purple-500" },
  { id: "review", name: "Review", color: "text-orange-500" },
  { id: "done", name: "Done", color: "text-green-500" },
];

const priorityColors = {
  low: "bg-gray-500/20 text-gray-500",
  medium: "bg-yellow-500/20 text-yellow-500",
  high: "bg-red-500/20 text-red-500",
};

export default function TasksPage() {
  const router = useRouter();
  const tasks = useQuery(api.tasks.list);
  const agents = useQuery(api.agents.list);
  const missions = useQuery(api.missions.list);

  if (!tasks || !agents || !missions) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Task Board</h1>
        <p className="text-muted-foreground mt-2">
          Kanban view of all agent tasks
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {columns.map((column) => {
          const columnTasks = tasks.filter(
            (t) => t.status === column.id
          );

          return (
            <div key={column.id} className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className={cn("font-semibold", column.color)}>
                  {column.name}
                </h2>
                <Badge variant="outline" className={column.color}>
                  {columnTasks.length}
                </Badge>
              </div>

              <div className="space-y-3">
                {columnTasks.map((task) => {
                  const mission = task.missionId
                    ? missions.find((m) => m._id === task.missionId)
                    : null;
                  const taskAgents = agents.filter((a) =>
                    task.assigneeIds.includes(a._id)
                  );

                  return (
                    <Card
                      key={task._id}
                      className="cursor-pointer hover:border-primary transition-colors"
                      onClick={() => router.push(`/tasks/${task._id}`)}
                    >
                      <CardContent className="p-4 space-y-3">
                        <div>
                          <h3 className="font-medium text-sm leading-tight mb-1">
                            {task.title}
                          </h3>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {task.description}
                          </p>
                        </div>

                        <div className="flex items-center justify-between text-xs">
                          <Badge
                            variant="outline"
                            className={priorityColors[task.priority]}
                          >
                            {task.priority}
                          </Badge>
                          <span className="text-muted-foreground">
                            {formatRelativeTime(task.updatedAt)}
                          </span>
                        </div>

                        {mission && (
                          <div className="text-xs text-muted-foreground">
                            📋 {mission.name}
                          </div>
                        )}

                        {taskAgents.length > 0 && (
                          <div className="flex items-center space-x-1">
                            {taskAgents.map((agent) => (
                              <span
                                key={agent._id}
                                className="text-sm"
                                title={agent.name}
                              >
                                {agent.emoji}
                              </span>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}

                {columnTasks.length === 0 && (
                  <div className="text-center p-8 text-muted-foreground text-sm border-2 border-dashed rounded-lg">
                    No tasks
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
