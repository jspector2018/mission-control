import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getByTask = query({
  args: { taskId: v.id("tasks") },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_task", (q) => q.eq("taskId", args.taskId))
      .order("asc")
      .collect();

    return await Promise.all(
      messages.map(async (msg) => {
        const agent = msg.fromAgentId
          ? await ctx.db.get(msg.fromAgentId)
          : null;
        return { ...msg, agent };
      })
    );
  },
});

export const send = mutation({
  args: {
    taskId: v.id("tasks"),
    content: v.string(),
    fromAgentId: v.optional(v.id("agents")),
  },
  handler: async (ctx, args) => {
    const task = await ctx.db.get(args.taskId);
    if (!task) throw new Error("Task not found");

    await ctx.db.insert("messages", {
      taskId: args.taskId,
      fromAgentId: args.fromAgentId,
      content: args.content,
      createdAt: Date.now(),
    });

    const agent = args.fromAgentId
      ? await ctx.db.get(args.fromAgentId)
      : null;

    await ctx.db.insert("activities", {
      type: "task_comment",
      agentId: args.fromAgentId,
      message: `${agent?.name || "Someone"} commented on "${task.title}"`,
      missionId: task.missionId,
      createdAt: Date.now(),
    });
  },
});
