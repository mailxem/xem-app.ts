"use client";
import { TeamAnalytics } from "@/components/analytics/team-analytics";
import { useTeam } from "@/app/providers/team-provider";
import { PageHeader } from "@/components/page-header";
import { workspaceClassName } from "@/lib/workspace-styles";
export default function TeamAnalyticsPage() {
 const { team } = useTeam();
 return <div className={workspaceClassName("workspace-page")}><PageHeader heading="Team analytics" description="Email performance across your workspace."/>{team && <TeamAnalytics teamId={team.id}/>}</div>;
}
