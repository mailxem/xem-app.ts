"use client";

import { workspaceClassName } from "@/lib/workspace-styles";
import { Overview } from "@/components/overview";
import { Stats } from "@/components/stats";
import { Button } from "@/components/ui/button";
import { Download, Plus } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { useEffect, useState } from "react";
import { useTeam } from "@/app/providers/team-provider";
import { downloadReport } from "@/app/lib/reports";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { subDays } from "date-fns";
import { PageHeader } from "@/components/page-header";
import Link from "next/link";

export default function Home() {
  const [campaignMetrics, setCampaignMetrics] = useState<
    Array<{
      id: string;
      name: string;
      total: number;
      openRate: number;
      clickRate: number;
      bounceRate: number;
      date: string;
    }>
  >([]);
  const { team } = useTeam();
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const fetchCampaignMetrics = async () => {
      try {
        const response = await fetch(
          `/api/analytics/team/overview?teamId=${team?.id}`,
        );
        if (!response.ok) {
          throw new Error("Failed to fetch analytics overview");
        }
        const { data } = await response.json();

        // Transform top campaigns data to match table structure
        const transformedData = data?.topCampaigns?.map((campaign: any) => ({
          id: campaign.campaignId,
          name: campaign.name,
          total: campaign.totalEmails || 0,
          openRate: campaign.openRate / 100, // Convert from percentage
          clickRate: campaign.clickRate / 100,
          bounceRate: campaign.bounceRate ? campaign.bounceRate / 100 : 0,
          date: campaign.lastUpdated || new Date().toISOString(),
        }));

        setCampaignMetrics(transformedData);
      } catch (error) {
        console.error("Failed to fetch campaign metrics:", error);
      }
    };

    if (team?.id) {
      fetchCampaignMetrics();
    }
  }, [team?.id]);

  const handleDownloadReport = async (
    period: "week" | "month" | "all",
    format: "csv" | "json",
  ) => {
    if (!team?.id || isDownloading) return;

    setIsDownloading(true);
    try {
      const startDate =
        period === "week"
          ? subDays(new Date(), 7)
          : period === "month"
            ? subDays(new Date(), 30)
            : subDays(new Date(), 90);

      await downloadReport({
        teamId: team.id,
        startDate,
        format,
        groupBy: "day",
      });
    } catch (error) {
      console.error("Failed to download report:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  const columns = [
    {
      accessorKey: "name",
      header: "Campaign Name",
    },
    {
      accessorKey: "total",
      header: "Total Sent",
    },
    {
      accessorKey: "openRate",
      header: "Open Rate",
      cell: ({ row }) => {
        const value = row.getValue("openRate") as number;
        return `${(value * 100).toFixed(1)}%`;
      },
    },
    {
      accessorKey: "clickRate",
      header: "Click Rate",
      cell: ({ row }) => {
        const value = row.getValue("clickRate") as number;
        return `${(value * 100).toFixed(1)}%`;
      },
    },
    {
      accessorKey: "bounceRate",
      header: "Bounce Rate",
      cell: ({ row }) => {
        const value = row.getValue("bounceRate") as number;
        return `${(value * 100).toFixed(1)}%`;
      },
    },
    {
      accessorKey: "date",
      header: "Last Updated",
      cell: ({ row }) => {
        const date = new Date(row.getValue("date") as string);
        return date.toLocaleDateString();
      },
    },
  ];

  return (
    <div className={workspaceClassName("workspace-page")}>
      <div className={workspaceClassName("workspace-page-body space-y-6")}>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Stats />
        </div>

        <div className="grid gap-4 lg:grid-cols-7">
          <div className={workspaceClassName("col-span-7 product-panel")}>
            <h2 className="text-2xl font-medium mb-2">Overview</h2>
            <p className="text-muted-foreground mb-4">
              Campaign performance over time
            </p>
            <div className="mt-5">
              <Overview />
            </div>
          </div>
        </div>

        {campaignMetrics?.length > 0 && (
          <div className={workspaceClassName("product-panel grid gap-4")}>
            <span className="text-2xl font-medium">
              Campaign performance
            </span>
            <span className="text-muted-foreground">
              Detailed metrics for your email campaigns
            </span>
            {
              <DataTable
                columns={columns}
                data={campaignMetrics}
                searchKey="name"
              />
            }
          </div>
        )}
      </div>
    </div>
  );
}
