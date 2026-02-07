import { query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 50;
    return await ctx.db
      .query("activities")
      .withIndex("by_created")
      .order("desc")
      .take(limit);
  },
});

export const listWithDetails = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 50;
    const activities = await ctx.db
      .query("activities")
      .withIndex("by_created")
      .order("desc")
      .take(limit);
    
    return await Promise.all(
      activities.map(async (activity) => {
        const agent = activity.agentId
          ? await ctx.db.get(activity.agentId)
          : null;
        const mission = activity.missionId
          ? await ctx.db.get(activity.missionId)
          : null;
        
        return {
          ...activity,
          agent,
          mission,
        };
      })
    );
  },
});
