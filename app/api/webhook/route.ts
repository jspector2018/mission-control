import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, data } = body;

    // Validate API key if you want to add one
    // const apiKey = request.headers.get("x-api-key");
    // if (apiKey !== process.env.API_KEY) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    switch (action) {
      case "update_agent_status":
        await client.mutation(api.agents.updateStatus, {
          id: data.agentId,
          status: data.status,
          currentTaskId: data.currentTaskId,
        });
        break;

      case "create_task":
        await client.mutation(api.tasks.create, {
          title: data.title,
          description: data.description,
          priority: data.priority || "medium",
          missionId: data.missionId,
        });
        break;

      case "update_task_status":
        await client.mutation(api.tasks.updateStatus, {
          id: data.taskId,
          status: data.status,
        });
        break;

      case "assign_task":
        await client.mutation(api.tasks.assignAgent, {
          taskId: data.taskId,
          agentId: data.agentId,
        });
        break;

      case "update_mission_revenue":
        await client.mutation(api.missions.updateRevenue, {
          id: data.missionId,
          revenue: data.revenue,
        });
        break;

      case "update_trade_status":
        await client.mutation(api.trades.updateTradeStatus, {
          id: data.tradeId,
          status: data.status,
          profit: data.profit,
        });
        break;

      default:
        return NextResponse.json(
          { error: "Unknown action" },
          { status: 400 }
        );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

// Example curl commands:
//
// Update agent status:
// curl -X POST https://your-domain.vercel.app/api/webhook \
//   -H "Content-Type: application/json" \
//   -d '{"action":"update_agent_status","data":{"agentId":"...","status":"active"}}'
//
// Create task:
// curl -X POST https://your-domain.vercel.app/api/webhook \
//   -H "Content-Type: application/json" \
//   -d '{"action":"create_task","data":{"title":"New task","description":"Task description","priority":"high"}}'
//
// Update task status:
// curl -X POST https://your-domain.vercel.app/api/webhook \
//   -H "Content-Type: application/json" \
//   -d '{"action":"update_task_status","data":{"taskId":"...","status":"done"}}'
