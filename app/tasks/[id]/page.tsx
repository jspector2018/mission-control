"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  formatDate,
  formatRelativeTime,
  getStatusColor,
  cn,
} from "@/lib/utils";
import {
  ArrowLeft,
  Clock,
  Flag,
  FolderOpen,
  Users,
  MessageSquare,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const statusFlow = [
  "inbox",
  "assigned",
  "in_progress",
  "review",
  "done",
] as const;

const statusLabels: Record<string, string> = {
  inbox: "Inbox",
  assigned: "Assigned",
  in_progress: "In Progress",
  review: "Review",
  done: "Done",
  blocked: "Blocked",
};

const priorityConfig = {
  low: { color: "bg-gray-500/20 text-gray-400", label: "Low" },
  medium: { color: "bg-yellow-500/20 text-yellow-400", label: "Medium" },
  high: { color: "bg-red-500/20 text-red-400", label: "High" },
};

export default function TaskDetailPage() {
  const params = useParams();
  const router = useRouter();
  const taskId = params.id as Id<"tasks">;

  const task = useQuery(api.tasks.get, { id: taskId });
  const messages = useQuery(api.messages.getByTask, { taskId });
  const agents = useQuery(api.agents.list);

  const updateStatus = useMutation(api.tasks.updateStatus);
  const sendMessage = useMutation(api.messages.send);

  const [newMessage, setNewMessage] = useState("");
  const [selectedAgent, setSelectedAgent] = useState<string>("");

  if (task === undefined || messages === undefined || agents === undefined) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (task === null) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <p className="text-muted-foreground">Task not found</p>
        <Link
          href="/tasks"
          className="text-primary hover:underline flex items-center space-x-1"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Tasks</span>
        </Link>
      </div>
    );
  }

  const currentStatusIndex = statusFlow.indexOf(
    task.status as (typeof statusFlow)[number]
  );

  const handleStatusChange = async (
    newStatus: (typeof statusFlow)[number] | "blocked"
  ) => {
    await updateStatus({ id: taskId, status: newStatus });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    await sendMessage({
      taskId,
      content: newMessage,
      fromAgentId: selectedAgent
        ? (selectedAgent as Id<"agents">)
        : undefined,
    });
    setNewMessage("");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back button */}
      <Link
        href="/tasks"
        className="inline-flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Task Board</span>
      </Link>

      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <h1 className="text-3xl font-bold tracking-tight">{task.title}</h1>
          <Badge
            variant="outline"
            className={cn(
              "text-sm px-3 py-1",
              getStatusColor(task.status)
            )}
          >
            {statusLabels[task.status]}
          </Badge>
        </div>
        <p className="text-muted-foreground text-lg">{task.description}</p>
      </div>

      {/* Status Pipeline */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Status Pipeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            {statusFlow.map((status, index) => {
              const isActive = task.status === status;
              const isPast = currentStatusIndex > index;
              const isBlocked = task.status === "blocked";

              return (
                <div key={status} className="flex items-center">
                  <button
                    onClick={() => handleStatusChange(status)}
                    className={cn(
                      "px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-lg scale-105"
                        : isPast
                          ? "bg-primary/20 text-primary"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                    )}
                  >
                    {statusLabels[status]}
                  </button>
                  {index < statusFlow.length - 1 && (
                    <ChevronRight className="h-4 w-4 text-muted-foreground mx-1 flex-shrink-0" />
                  )}
                </div>
              );
            })}
            <div className="ml-4 border-l pl-4">
              <button
                onClick={() => handleStatusChange("blocked")}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer",
                  task.status === "blocked"
                    ? "bg-red-500/30 text-red-400 shadow-lg"
                    : "bg-muted text-muted-foreground hover:bg-red-500/10 hover:text-red-400"
                )}
              >
                Blocked
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Details */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Priority */}
            <div className="space-y-1.5">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Flag className="h-4 w-4" />
                <span>Priority</span>
              </div>
              <Badge
                variant="outline"
                className={cn("ml-6", priorityConfig[task.priority].color)}
              >
                {priorityConfig[task.priority].label}
              </Badge>
            </div>

            {/* Mission */}
            {task.mission && (
              <div className="space-y-1.5">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <FolderOpen className="h-4 w-4" />
                  <span>Mission</span>
                </div>
                <div className="ml-6 text-sm font-medium">
                  {task.mission.name}
                </div>
              </div>
            )}

            {/* Assignees */}
            <div className="space-y-1.5">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>Assignees</span>
              </div>
              <div className="ml-6 space-y-2">
                {task.assignees.length > 0 ? (
                  task.assignees.map((agent: any) => (
                    <div
                      key={agent._id}
                      className="flex items-center space-x-2"
                    >
                      <span className="text-lg">{agent.emoji}</span>
                      <span className="text-sm font-medium">{agent.name}</span>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[10px]",
                          getStatusColor(agent.status)
                        )}
                      >
                        {agent.status}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground italic">
                    Unassigned
                  </span>
                )}
              </div>
            </div>

            {/* Timestamps */}
            <div className="space-y-1.5">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Timeline</span>
              </div>
              <div className="ml-6 space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created</span>
                  <span>{formatRelativeTime(task.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Updated</span>
                  <span>{formatRelativeTime(task.updatedAt)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Thread / Comments */}
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5" />
              <CardTitle className="text-lg">
                Thread ({messages.length})
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Messages */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {messages.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  No comments yet. Start the conversation.
                </div>
              ) : (
                messages.map((msg: any) => (
                  <div
                    key={msg._id}
                    className="p-3 rounded-lg border bg-card/50"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {msg.agent ? (
                          <>
                            <span className="text-lg">{msg.agent.emoji}</span>
                            <span className="text-sm font-medium">
                              {msg.agent.name}
                            </span>
                          </>
                        ) : (
                          <span className="text-sm font-medium text-muted-foreground">
                            System
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(msg.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  </div>
                ))
              )}
            </div>

            {/* New message form */}
            <form onSubmit={handleSendMessage} className="space-y-3">
              <div className="flex items-center space-x-2">
                <label className="text-sm text-muted-foreground">As:</label>
                <select
                  value={selectedAgent}
                  onChange={(e) => setSelectedAgent(e.target.value)}
                  className="bg-muted text-foreground text-sm rounded-lg px-3 py-1.5 border border-input"
                >
                  <option value="">System</option>
                  {agents.map((agent) => (
                    <option key={agent._id} value={agent._id}>
                      {agent.emoji} {agent.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-1 bg-muted text-foreground text-sm rounded-lg px-4 py-2.5 border border-input placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="px-4 py-2.5 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Send
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
