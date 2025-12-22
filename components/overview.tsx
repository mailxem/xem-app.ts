"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useMemo, useState } from "react";
import { subDays } from "date-fns";
import { useTeam } from "@/app/providers/team-provider";
import { MetricsData } from "@/lib/stats";

type TrendPoint = {
  date: string;
  openRate: number;
  clickRate: number;
  bounceRate: number;
  devices: Record<string, number>;
  locations: Record<string, number>;
  total?: number;
};

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

export function Overview() {
  const [metricsData, setMetricsData] = useState<MetricsData[]>([]);
  const [deviceData, setDeviceData] = useState<
    Array<{ name: string; value: number }>
  >([]);
  const [timeframe, setTimeframe] = useState<"week" | "month" | "all">("week");
  const { team } = useTeam();

  const fetchMetrics = async () => {
    if (!team?.id) return;

    const startDate =
      timeframe === "week"
        ? subDays(new Date(), 7)
        : timeframe === "month"
          ? subDays(new Date(), 30)
          : subDays(new Date(), 90);

    try {
      // Fetch analytics trends data
      const response = await fetch(
        `/api/analytics/trends?teamId=${team?.id}&startDate=${startDate.toISOString()}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch analytics trends");
      }
      const { data } = await response.json();

      console.log(data, "data trends pain");

      // Process device data for pie chart
      const deviceBreakdown: Record<string, number> = {};

      // Data comes pre-transformed from the trends API
      const transformedData = data
        ?.map((point: TrendPoint) => {
          // Aggregate device data
          if (point.devices) {
            Object.entries(point.devices).forEach(([device, count]) => {
              deviceBreakdown[device] = (deviceBreakdown[device] || 0) + count;
            });
          }

          // Calculate total from devices if not provided
          const deviceTotal = point.devices
            ? Object.values(point.devices).reduce(
                (sum: number, count: number) => sum + count,
                0
              )
            : 0;
          const locationTotal = point.locations
            ? Object.values(point.locations).reduce(
                (sum: number, count: number) => sum + count,
                0
              )
            : 0;
          const total = point.total || Math.max(deviceTotal, locationTotal);
          const openRate = total > 0 ? point.openRate / total : 0;
          const clickRate = total > 0 ? point.clickRate / total : 0;
          const bounceRate = total > 0 ? point.bounceRate / total : 0;

          return {
            date: point.date,
            openRate: openRate,
            clickRate: clickRate,
            bounceRate: bounceRate,
            total: total,
          };
        })
        .sort(
          (a: any, b: any) =>
            new Date(a.date).getTime() - new Date(b.date).getTime()
        );

      // Transform device data for pie chart
      const deviceChartData = Object.entries(deviceBreakdown).map(
        ([device, count]) => ({
          name: device.charAt(0).toUpperCase() + device.slice(1),
          value: count,
        })
      );

      setMetricsData(transformedData);
      setDeviceData(deviceChartData);
    } catch (error) {
      console.error("Failed to fetch metrics:", error);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, [timeframe, team?.id]);

  const chartData = useMemo(
    () =>
      metricsData?.map((metric) => ({
        date: metric.date,
        openRate: metric.openRate * 100, // Convert to percentage for display
        clickRate: metric.clickRate * 100, // Convert to percentage for display
        bounceRate: metric.bounceRate * 100, // Convert to percentage for display
        total: metric.total,
      })),
    [metricsData]
  );

  const renderCustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border bg-background p-2 shadow-sm">
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col">
              <span className="text-[0.70rem] uppercase text-muted-foreground">
                {new Date(label).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
          <div className="grid gap-2">
            {payload.map((entry: any, index: number) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-sm">
                  {entry.name}:{" "}
                  {entry.dataKey === "total"
                    ? entry.value
                    : `${entry.value?.toFixed(1)}%`}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  const renderPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="rounded-lg border bg-background p-2 shadow-sm">
          <span className="text-sm">
            {data.name}: {data.value} (
            {(
              (data.value /
                deviceData.reduce((sum, item) => sum + item.value, 0)) *
              100
            ).toFixed(1)}
            %)
          </span>
        </div>
      );
    }
    return null;
  };

  return (
    <Tabs
      defaultValue="week"
      className="space-y-4"
      onValueChange={(value) => setTimeframe(value as "week" | "month" | "all")}
    >
      <div className="flex items-center justify-between">
        <TabsList>
          <TabsTrigger value="week">This Week</TabsTrigger>
          <TabsTrigger value="month">This Month</TabsTrigger>
          <TabsTrigger value="all">All Time</TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value={timeframe} className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Device Breakdown Pie Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Device Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={deviceData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {deviceData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={renderPieTooltip} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Trends Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient
                        id="fillOpenRate"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="hsl(var(--chart-1))"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="hsl(var(--chart-1))"
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                      <linearGradient
                        id="fillClickRate"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="hsl(var(--chart-2))"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="hsl(var(--chart-2))"
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                      <linearGradient
                        id="fillTotal"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="hsl(var(--chart-4))"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="hsl(var(--chart-4))"
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="date"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      minTickGap={32}
                      tickFormatter={(value) => {
                        const date = new Date(value);
                        return date.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        });
                      }}
                    />
                    <YAxis
                      yAxisId="percentage"
                      orientation="left"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      tickFormatter={(value) => `${value}%`}
                    />
                    <YAxis
                      yAxisId="total"
                      orientation="right"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                    />
                    <Tooltip content={renderCustomTooltip} cursor={false} />
                    <Area
                      yAxisId="percentage"
                      dataKey="openRate"
                      type="natural"
                      fill="url(#fillOpenRate)"
                      stroke="hsl(var(--chart-1))"
                      strokeWidth={2}
                      name="Open Rate"
                    />
                    <Area
                      yAxisId="percentage"
                      dataKey="clickRate"
                      type="natural"
                      fill="url(#fillClickRate)"
                      stroke="hsl(var(--chart-2))"
                      strokeWidth={2}
                      name="Click Rate"
                    />
                    <Area
                      yAxisId="total"
                      dataKey="total"
                      type="natural"
                      fill="url(#fillTotal)"
                      stroke="hsl(var(--chart-4))"
                      strokeWidth={2}
                      name="Total Emails"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  );
}
