import { mutation } from "./_generated/server";

export const seedData = mutation({
  handler: async (ctx) => {
    // Clear existing data
    const agents = await ctx.db.query("agents").collect();
    const tasks = await ctx.db.query("tasks").collect();
    const missions = await ctx.db.query("missions").collect();
    const activities = await ctx.db.query("activities").collect();
    const trades = await ctx.db.query("trades").collect();
    
    for (const agent of agents) await ctx.db.delete(agent._id);
    for (const task of tasks) await ctx.db.delete(task._id);
    for (const mission of missions) await ctx.db.delete(mission._id);
    for (const activity of activities) await ctx.db.delete(activity._id);
    for (const trade of trades) await ctx.db.delete(trade._id);

    // Seed Agents
    const mike = await ctx.db.insert("agents", {
      name: "Mike",
      role: "Orchestrator",
      status: "active",
      emoji: "⚡",
      lastActive: Date.now(),
    });

    const scout = await ctx.db.insert("agents", {
      name: "Scout",
      role: "Market Research",
      status: "active",
      emoji: "🔍",
      lastActive: Date.now() - 3600000,
    });

    const lab = await ctx.db.insert("agents", {
      name: "Lab",
      role: "Food Data R&D",
      status: "idle",
      emoji: "🔬",
      lastActive: Date.now() - 7200000,
    });

    const hustler = await ctx.db.insert("agents", {
      name: "Hustler",
      role: "Opportunity Scanner",
      status: "active",
      emoji: "💼",
      lastActive: Date.now() - 1800000,
    });

    const builder = await ctx.db.insert("agents", {
      name: "Builder",
      role: "Project Builder",
      status: "active",
      emoji: "🏗️",
      lastActive: Date.now(),
    });

    const analyst = await ctx.db.insert("agents", {
      name: "Analyst",
      role: "Performance Tracker",
      status: "idle",
      emoji: "📊",
      lastActive: Date.now() - 5400000,
    });

    const trader = await ctx.db.insert("agents", {
      name: "Trader",
      role: "Kalshi Trading",
      status: "active",
      emoji: "📈",
      lastActive: Date.now() - 900000,
    });

    // Seed Missions
    const kalshiMission = await ctx.db.insert("missions", {
      name: "Kalshi Trading",
      status: "active",
      description: "Generate returns from prediction markets",
      goal: "$50 seed → grow through weather trades",
      revenue: 0,
    });

    const freelanceMission = await ctx.db.insert("missions", {
      name: "AI Freelancing",
      status: "active",
      description: "$500+/mo from freelance services",
      goal: "Build client pipeline, automate delivery",
      revenue: 0,
    });

    const freshrMission = await ctx.db.insert("missions", {
      name: "Freshr",
      status: "active",
      description: "Food waste app, Pro tier monetization",
      goal: "Launch Pro tier, get 100 paying users",
      revenue: 0,
    });

    const saasMission = await ctx.db.insert("missions", {
      name: "New SaaS Opportunity",
      status: "active",
      description: "Scanning for next build",
      goal: "Identify and validate next product",
      revenue: 0,
    });

    const podifyMission = await ctx.db.insert("missions", {
      name: "PodifyAI",
      status: "parked",
      description: "Can't compete with NotebookLM",
      goal: "Archive or pivot",
      revenue: 0,
    });

    // Seed Tasks
    const task1 = await ctx.db.insert("tasks", {
      title: "Build Mission Control Dashboard",
      description: "Create real-time dashboard for monitoring agent fleet",
      status: "in_progress",
      assigneeIds: [builder],
      missionId: saasMission,
      priority: "high",
      createdAt: Date.now() - 3600000,
      updatedAt: Date.now(),
    });

    await ctx.db.insert("tasks", {
      title: "Monitor NYC weather trades",
      description: "Track positions resolving Feb 7",
      status: "in_progress",
      assigneeIds: [trader],
      missionId: kalshiMission,
      priority: "high",
      createdAt: Date.now() - 7200000,
      updatedAt: Date.now() - 900000,
    });

    await ctx.db.insert("tasks", {
      title: "Research Upwork opportunities",
      description: "Find AI automation gigs $500+",
      status: "assigned",
      assigneeIds: [hustler],
      missionId: freelanceMission,
      priority: "medium",
      createdAt: Date.now() - 10800000,
      updatedAt: Date.now() - 3600000,
    });

    await ctx.db.insert("tasks", {
      title: "Design Freshr Pro tier pricing",
      description: "Analyze competitors, set pricing strategy",
      status: "review",
      assigneeIds: [analyst, mike],
      missionId: freshrMission,
      priority: "medium",
      createdAt: Date.now() - 14400000,
      updatedAt: Date.now() - 5400000,
    });

    await ctx.db.insert("tasks", {
      title: "Scan Reddit for pain points",
      description: "Find unmet needs in r/SaaS, r/entrepreneur",
      status: "inbox",
      assigneeIds: [],
      missionId: saasMission,
      priority: "low",
      createdAt: Date.now() - 18000000,
      updatedAt: Date.now() - 18000000,
    });

    // Seed Trades
    await ctx.db.insert("trades", {
      market: "NYC High ≤23°F",
      side: "YES",
      contracts: 62,
      price: 0.04,
      status: "open",
      resolveDate: "2026-02-07",
    });

    await ctx.db.insert("trades", {
      market: "NYC High 24-25°F",
      side: "YES",
      contracts: 35,
      price: 0.07,
      status: "open",
      resolveDate: "2026-02-07",
    });

    await ctx.db.insert("trades", {
      market: "LA High 74-75°F",
      side: "YES",
      contracts: 50,
      price: 0.04,
      status: "open",
      resolveDate: "2026-02-07",
    });

    await ctx.db.insert("trades", {
      market: "LA High 76°+",
      side: "YES",
      contracts: 25,
      price: 0.07,
      status: "open",
      resolveDate: "2026-02-07",
    });

    // Seed Activities
    await ctx.db.insert("activities", {
      type: "trade_opened",
      agentId: trader,
      message: "Opened NYC ≤23°F YES × 62 @ 4¢ ($2.65 cost)",
      missionId: kalshiMission,
      createdAt: Date.now() - 7200000,
    });

    await ctx.db.insert("activities", {
      type: "trade_opened",
      agentId: trader,
      message: "Opened NYC 24-25°F YES × 35 @ 7¢ ($2.61 cost)",
      missionId: kalshiMission,
      createdAt: Date.now() - 6600000,
    });

    await ctx.db.insert("activities", {
      type: "trade_opened",
      agentId: trader,
      message: "Opened LA 74-75°F YES × 50 @ 4¢ ($2.17 cost)",
      missionId: kalshiMission,
      createdAt: Date.now() - 3600000,
    });

    await ctx.db.insert("activities", {
      type: "trade_opened",
      agentId: trader,
      message: "Opened LA 76°+ YES × 25 @ 7¢ ($1.84 cost)",
      missionId: kalshiMission,
      createdAt: Date.now() - 3000000,
    });

    await ctx.db.insert("activities", {
      type: "task_updated",
      agentId: builder,
      message: "Mission Control dashboard deployed to Vercel",
      missionId: saasMission,
      createdAt: Date.now() - 1800000,
    });

    await ctx.db.insert("activities", {
      type: "agent_status",
      agentId: hustler,
      message: "Completed first opportunity scan — 5 revenue paths identified",
      missionId: freelanceMission,
      createdAt: Date.now() - 14400000,
    });

    await ctx.db.insert("activities", {
      type: "mission_update",
      message: "Kalshi account funded: $50 seed capital. 4 weather trades placed.",
      missionId: kalshiMission,
      createdAt: Date.now() - 10800000,
    });

    await ctx.db.insert("activities", {
      type: "agent_status",
      agentId: mike,
      message: "PodifyAI MVP deployed to Vercel — full pipeline working",
      createdAt: Date.now() - 18000000,
    });

    return { success: true, message: "Database seeded successfully!" };
  },
});
