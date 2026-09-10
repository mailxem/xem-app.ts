"use client";

import { workspaceClassName } from "@/lib/workspace-styles";
import { useTeam } from "@/app/providers/team-provider";
import { TeamAnalytics } from "@/components/analytics/team-analytics";
import { Stats } from "@/components/stats";

export default function AnalyticsPage() {
  const { team } = useTeam();

  return (
    <div className={workspaceClassName("workspace-page")}>
      <div className={workspaceClassName("workspace-page-body space-y-6")}>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Stats />
        </div>

        {/* <div className="grid gap-4">
          <AnalyticsExport teamId={team?.id} />
        </div> */}

        <div className="grid gap-4 lg:grid-cols-7">
          {/* <div className="col-span-7">
            <h2 className="text-2xl font-medium mb-2">Performance Overview</h2>
            <p className="text-muted-foreground mb-4">
              Campaign performance trends over time
            </p>
            <div className="pl-2 bg-primary/5 p-4 rounded-lg">
              <Overview />
            </div>
          </div> */}

          {/* <div className="col-span-3">
            <h2 className="text-2xl font-medium mb-2">Recent Activity</h2>
            <p className="text-muted-foreground mb-4">
              Latest email campaign events and interactions
            </p>
            <div>
              <RecentActivity />
            </div>
          </div> */}
        </div>

        <div className="grid gap-4">
          <h2 className="text-2xl font-medium">Team Analytics</h2>
          <p className="text-muted-foreground">
            Performance metrics across your entire team
          </p>
          <TeamAnalytics teamId={team?.id || ''} />
        </div>
      </div>
    </div>
  );
}
