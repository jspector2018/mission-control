"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, getStatusColor, cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

export default function TradingPage() {
  const trades = useQuery(api.trades.list);
  const openTrades = useQuery(api.trades.getOpenTrades);
  const totalProfit = useQuery(api.trades.getTotalProfit);

  if (!trades || !openTrades || totalProfit === undefined) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const wonTrades = trades.filter((t) => t.status === "won");
  const lostTrades = trades.filter((t) => t.status === "lost");
  const totalRisk = openTrades.reduce(
    (sum, t) => sum + t.contracts * t.price,
    0
  );
  const potentialReturn = openTrades.reduce(
    (sum, t) => sum + t.contracts * (1 - t.price),
    0
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Kalshi Trading</h1>
        <p className="text-muted-foreground mt-2">
          Portfolio overview and position tracking
        </p>
      </div>

      {/* Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total P&L</CardTitle>
            {totalProfit >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
          </CardHeader>
          <CardContent>
            <div
              className={cn(
                "text-2xl font-bold",
                totalProfit >= 0 ? "text-green-500" : "text-red-500"
              )}
            >
              {formatCurrency(totalProfit)}
            </div>
            <p className="text-xs text-muted-foreground">
              {wonTrades.length} wins, {lostTrades.length} losses
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Positions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{openTrades.length}</div>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(totalRisk)} at risk
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Potential Return</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {formatCurrency(potentialReturn)}
            </div>
            <p className="text-xs text-muted-foreground">
              If all positions win
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {wonTrades.length + lostTrades.length > 0
                ? `${Math.round(
                    (wonTrades.length /
                      (wonTrades.length + lostTrades.length)) *
                      100
                  )}%`
                : "—"}
            </div>
            <p className="text-xs text-muted-foreground">
              {wonTrades.length + lostTrades.length} closed trades
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Open Positions */}
      <Card>
        <CardHeader>
          <CardTitle>Open Positions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {openTrades.map((trade) => {
              const cost = trade.contracts * trade.price;
              const maxReturn = trade.contracts * (1 - trade.price);
              const roi = (maxReturn / cost) * 100;

              return (
                <div
                  key={trade._id}
                  className="p-4 rounded-lg border bg-card/50 flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <div className="font-medium">{trade.market}</div>
                    <div className="text-sm text-muted-foreground">
                      {trade.side} × {trade.contracts} @ {formatCurrency(trade.price)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Resolves {trade.resolveDate}
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <div className="text-sm font-medium">
                      Cost: {formatCurrency(cost)}
                    </div>
                    <div className="text-sm text-green-500">
                      Max: {formatCurrency(maxReturn)}
                    </div>
                    <Badge variant="outline" className="text-primary">
                      {roi.toFixed(0)}% ROI
                    </Badge>
                  </div>
                </div>
              );
            })}

            {openTrades.length === 0 && (
              <div className="text-center p-8 text-muted-foreground">
                No open positions
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Trade History */}
      <Card>
        <CardHeader>
          <CardTitle>Trade History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {trades
              .filter((t) => t.status !== "open")
              .map((trade) => {
                const cost = trade.contracts * trade.price;
                const profit = trade.profit || 0;
                const roi = (profit / cost) * 100;

                return (
                  <div
                    key={trade._id}
                    className="p-4 rounded-lg border bg-card/50 flex items-center justify-between"
                  >
                    <div className="space-y-1">
                      <div className="font-medium">{trade.market}</div>
                      <div className="text-sm text-muted-foreground">
                        {trade.side} × {trade.contracts} @ {formatCurrency(trade.price)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Resolved {trade.resolveDate}
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <Badge
                        variant="outline"
                        className={cn(getStatusColor(trade.status))}
                      >
                        {trade.status}
                      </Badge>
                      <div
                        className={cn(
                          "text-sm font-medium",
                          profit >= 0 ? "text-green-500" : "text-red-500"
                        )}
                      >
                        {formatCurrency(profit)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {roi.toFixed(0)}% ROI
                      </div>
                    </div>
                  </div>
                );
              })}

            {trades.filter((t) => t.status !== "open").length === 0 && (
              <div className="text-center p-8 text-muted-foreground">
                No trade history yet
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
