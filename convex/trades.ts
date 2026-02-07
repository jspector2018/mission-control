import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("trades").order("desc").collect();
  },
});

export const getOpenTrades = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("trades")
      .withIndex("by_status", (q) => q.eq("status", "open"))
      .collect();
  },
});

export const getTotalProfit = query({
  handler: async (ctx) => {
    const trades = await ctx.db.query("trades").collect();
    return trades.reduce((sum, trade) => sum + (trade.profit || 0), 0);
  },
});

export const updateTradeStatus = mutation({
  args: {
    id: v.id("trades"),
    status: v.union(v.literal("open"), v.literal("won"), v.literal("lost")),
    profit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      status: args.status,
      profit: args.profit,
    });
    
    if (args.status !== "open") {
      await ctx.db.insert("activities", {
        type: "trade_closed",
        message: `Trade ${args.status}: ${args.profit ? `$${args.profit.toFixed(2)}` : ""}`,
        createdAt: Date.now(),
      });
    }
  },
});
