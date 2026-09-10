import { workspaceClassName } from "@/lib/workspace-styles";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Mail, MousePointerClick, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { MetricsData } from "@/lib/stats";
import { useTeam } from "@/app/providers/team-provider";

export function Stats() {
  const [metricsData, setMetricsData] = useState<MetricsData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { team } = useTeam();

  useEffect(() => {
    if (!team?.id) return;

    const fetchMetrics = async () => {
      try {
        const response = await fetch(
          `/api/analytics/team/overview?teamId=${team?.id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch analytics");
        }
        
        const { data } = await response.json();

        // Transform team overview data for stats
        const currentPeriodData = {
          total: data.totalEmails,
          openRate: data.averageOpenRate / 100,
          clickRate: data.averageClickRate / 100,
          bounceRate: data.bounceRate ? (data.bounceRate / 100) : 0,
        };

        // Get previous period from monthly stats
        const previousPeriodData =
          data?.monthlyStats?.[data?.monthlyStats?.length - 2] || null;
        const transformedPreviousData = previousPeriodData
          ? {
              total: previousPeriodData.totalEmails,
              openRate: previousPeriodData.openRate / 100,
              clickRate: previousPeriodData.clickRate / 100,
              bounceRate: previousPeriodData.bounceRate ? (previousPeriodData.bounceRate / 100) : 0,
            }
          : null;

        setMetricsData(
          [currentPeriodData, transformedPreviousData].filter(Boolean)
        );
      } catch (error) {
        console.error("Failed to fetch metrics:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMetrics();
  }, [team?.id]);

  // Calculate current metrics (most recent data point)
  const currentMetrics = metricsData[0] || null;

  // Calculate trends by comparing with previous period
  const calculateTrend = (current: number, previous: number) => {
    if (!previous) return 0;
    return ((current - previous) / previous) * 100;
  };

  // Get metrics from previous period for comparison
  const previousMetrics = metricsData[1] || null;

  const stats = [
    {
      name: "Total Sent",
      value: currentMetrics?.total || 0,
      icon: Mail,
      change: previousMetrics
        ? calculateTrend(
            currentMetrics?.total || 0,
            previousMetrics.total
          ).toFixed(1) + "%"
        : "0%",
      trend:
        previousMetrics && currentMetrics
          ? currentMetrics.total >= previousMetrics.total
            ? "up"
            : "down"
          : "up",
    },
    {
      name: "Open Rate",
      value: currentMetrics
        ? `${(currentMetrics.openRate * 100).toFixed(1)}%`
        : "0%",
      icon: Users,
      change: previousMetrics
        ? calculateTrend(
            currentMetrics?.openRate || 0,
            previousMetrics.openRate
          ).toFixed(1) + "%"
        : "0%",
      trend:
        previousMetrics && currentMetrics
          ? currentMetrics.openRate >= previousMetrics.openRate
            ? "up"
            : "down"
          : "up",
    },
    {
      name: "Click Rate",
      value: currentMetrics
        ? `${(currentMetrics.clickRate * 100).toFixed(1)}%`
        : "0%",
      icon: MousePointerClick,
      change: previousMetrics
        ? calculateTrend(
            currentMetrics?.clickRate || 0,
            previousMetrics.clickRate
          ).toFixed(1) + "%"
        : "0%",
      trend:
        previousMetrics && currentMetrics
          ? currentMetrics.clickRate >= previousMetrics.clickRate
            ? "up"
            : "down"
          : "up",
    },
    {
      name: "Bounce Rate",
      value: currentMetrics
        ? `${(currentMetrics.bounceRate * 100).toFixed(1)}%`
        : "0%",
      icon: AlertTriangle,
      change: previousMetrics
        ? calculateTrend(
            currentMetrics?.bounceRate || 0,
            previousMetrics.bounceRate
          ).toFixed(1) + "%"
        : "0%",
      trend: "down",
    },
  ];

  return <>{stats.map(stat => <div className={workspaceClassName("metric-card")} key={stat.name}><div className={workspaceClassName("metric-label")}><span className={workspaceClassName("metric-icon")} style={{background:"#f1edff",color:"#8269db"}}><stat.icon/></span>{stat.name}</div><div className={workspaceClassName("metric-value")}><strong>{stat.value}</strong><span style={stat.trend === "down" ? {background:"#faecee",color:"#ba6473"} : undefined}>{stat.change.startsWith("-") ? "" : "+"}{stat.change}</span></div><p className={workspaceClassName("metric-period")}>Compared with the previous period</p></div>)}</>;
}
