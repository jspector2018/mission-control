import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  agents: defineTable({
    name: v.string(),
    role: v.string(),
    status: v.union(v.literal("idle"), v.literal("active"), v.literal("blocked")),
    emoji: v.string(),
    sessionKey: v.optional(v.string()),
    currentTaskId: v.optional(v.id("tasks")),
    lastActive: v.number(),
  }),

  tasks: defineTable({
    title: v.string(),
    description: v.string(),
    status: v.union(
      v.literal("inbox"),
      v.literal("assigned"),
      v.literal("in_progress"),
      v.literal("review"),
      v.literal("done"),
      v.literal("blocked")
    ),
    assigneeIds: v.array(v.id("agents")),
    missionId: v.optional(v.id("missions")),
    priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_mission", ["missionId"])
    .index("by_status", ["status"]),

  missions: defineTable({
    name: v.string(),
    status: v.union(v.literal("active"), v.literal("parked")),
    description: v.string(),
    goal: v.string(),
    revenue: v.number(),
  }),

  messages: defineTable({
    taskId: v.id("tasks"),
    fromAgentId: v.optional(v.id("agents")),
    content: v.string(),
    createdAt: v.number(),
  }).index("by_task", ["taskId"]),

  activities: defineTable({
    type: v.string(),
    agentId: v.optional(v.id("agents")),
    message: v.string(),
    missionId: v.optional(v.id("missions")),
    createdAt: v.number(),
  }).index("by_created", ["createdAt"]),

  trades: defineTable({
    market: v.string(),
    side: v.union(v.literal("YES"), v.literal("NO")),
    contracts: v.number(),
    price: v.number(),
    status: v.union(v.literal("open"), v.literal("won"), v.literal("lost")),
    profit: v.optional(v.number()),
    resolveDate: v.string(),
  }).index("by_status", ["status"]),
});
