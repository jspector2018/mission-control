import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("tasks").order("desc").collect();
  },
});

export const getByStatus = query({
  args: { status: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("tasks")
      .withIndex("by_status", (q) => q.eq("status", args.status as any))
      .collect();
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
    missionId: v.optional(v.id("missions")),
  },
  handler: async (ctx, args) => {
    const taskId = await ctx.db.insert("tasks", {
      title: args.title,
      description: args.description,
      status: "inbox",
      assigneeIds: [],
      priority: args.priority,
      missionId: args.missionId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    
    await ctx.db.insert("activities", {
      type: "task_created",
      message: `New task: ${args.title}`,
      missionId: args.missionId,
      createdAt: Date.now(),
    });
    
    return taskId;
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("tasks"),
    status: v.union(
      v.literal("inbox"),
      v.literal("assigned"),
      v.literal("in_progress"),
      v.literal("review"),
      v.literal("done"),
      v.literal("blocked")
    ),
  },
  handler: async (ctx, args) => {
    const task = await ctx.db.get(args.id);
    if (!task) throw new Error("Task not found");
    
    await ctx.db.patch(args.id, {
      status: args.status,
      updatedAt: Date.now(),
    });
    
    await ctx.db.insert("activities", {
      type: "task_updated",
      message: `Task "${task.title}" moved to ${args.status}`,
      missionId: task.missionId,
      createdAt: Date.now(),
    });
  },
});

export const assignAgent = mutation({
  args: {
    taskId: v.id("tasks"),
    agentId: v.id("agents"),
  },
  handler: async (ctx, args) => {
    const task = await ctx.db.get(args.taskId);
    if (!task) throw new Error("Task not found");
    
    const agent = await ctx.db.get(args.agentId);
    if (!agent) throw new Error("Agent not found");
    
    const assigneeIds = task.assigneeIds.includes(args.agentId)
      ? task.assigneeIds
      : [...task.assigneeIds, args.agentId];
    
    await ctx.db.patch(args.taskId, {
      assigneeIds,
      status: "assigned",
      updatedAt: Date.now(),
    });
    
    await ctx.db.insert("activities", {
      type: "task_assigned",
      agentId: args.agentId,
      message: `${agent.name} assigned to "${task.title}"`,
      missionId: task.missionId,
      createdAt: Date.now(),
    });
  },
});
