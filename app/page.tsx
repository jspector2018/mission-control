"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatRelativeTime, getStatusColor, cn } from "@/lib/utils";
import { Activity, DollarSign, ListChecks, TrendingUp } from "lucide-react";

export default function Home() {
  const agents = useQuery(api.agents.list);
  const tasks = useQuery(api.tasks.list);
  const missions = useQuery(api.missions.list);
  const activities = useQuery(api.activities.listWithDetails, { limit: 10 });
  const trades = useQuery(api.trades.getOpenTrades);
  const totalProfit = useQuery(api.trades.getTotalProfit);

  if (!agents || !tasks || !missions || !activities || !trades) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const activeTasks = tasks.filter(t => 
    ["in_progress", "assigned"].includes(t.status)
  ).length;
  
  const totalRevenue = missions.reduce((sum, m) => sum + m.revenue, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Command Center</h1>
        <p className="text-muted-foreground mt-2">
          Real-time fleet monitoring and operations
        </p>
      </div>

      {/* Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              {missions.filter(m => m.status === "active").length} active missions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tasks</CardTitle>
            <ListChecks className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeTasks}</div>
            <p className="text-xs text-muted-foreground">
              {tasks.length} total tasks
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Trades</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{trades.length}</div>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(totalProfit || 0)} total P&L
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Agents</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {agents.filter(a => a.status === "active").length}
            </div>
            <p className="text-xs text-muted-foreground">
              {agents.length} total agents
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Agents */}
        <Card>
          <CardHeader>
            <CardTitle>Agent Fleet</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {agents.map((agent) => {
                const currentTask = agent.currentTaskId 
                  ? tasks.find(t => t._id === agent.currentTaskId)
                  : null;
                
                return (
                  <div
                    key={agent._id}
                    className="flex items-start justify-between p-4 rounded-lg border bg-card/50"
                  >
                    <div className="flex items-start space-x-3">
                      <span className="text-2xl">{agent.emoji}</span>
                      <div>
                        <div className="font-medium">{agent.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {agent.role}
                        </div>
                        {currentTask && (
                          <div className="text-xs text-muted-foreground mt-1">
                            → {currentTask.title}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <Badge
                        variant="outline"
                        className={cn(getStatusColor(agent.status))}
                      >
                        {agent.status}
                      </Badge>
                      <div className="text-xs text-muted-foreground">
                        {formatRelativeTime(agent.lastActive)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Activity Feed */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activities.map((activity) => (
                <div
                  key={activity._id}
                  className="flex items-start space-x-3 text-sm"
                >
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                  <div className="flex-1 space-y-1">
                    <p className="text-foreground">{activity.message}</p>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      {activity.agent && (
                        <span>
                          {activity.agent.emoji} {activity.agent.name}
                        </span>
                      )}
                      {activity.mission && (
                        <span>• {activity.mission.name}</span>
                      )}
                      <span>• {formatRelativeTime(activity.createdAt)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Missions */}
      <Card>
        <CardHeader>
          <CardTitle>Active Missions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {missions
              .filter((m) => m.status === "active")
              .map((mission) => {
                const missionTasks = tasks.filter(
                  (t) => t.missionId === mission._id
                );
                const completedTasks = missionTasks.filter(
                  (t) => t.status === "done"
                ).length;

                return (
                  <div
                    key={mission._id}
                    className="p-4 rounded-lg border bg-card/50"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold">{mission.name}</h3>
                      <Badge variant="outline" className="text-green-500">
                        Active
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {mission.description}
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        {completedTasks}/{missionTasks.length} tasks
                      </span>
                      <span className="font-medium text-primary">
                        {formatCurrency(mission.revenue)}
                      </span>
                    </div>
                  </div>
                );
              })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
