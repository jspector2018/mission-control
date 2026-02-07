import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("missions").collect();
  },
});

export const get = query({
  args: { id: v.id("missions") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const updateRevenue = mutation({
  args: {
    id: v.id("missions"),
    revenue: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      revenue: args.revenue,
    });
  },
});
