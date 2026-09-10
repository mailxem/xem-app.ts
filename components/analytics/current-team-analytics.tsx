"use client";
import { useTeam } from "@/app/providers/team-provider";
import { TeamAnalytics } from "./team-analytics";
export function CurrentTeamAnalytics() {
 const { team } = useTeam();
 return team?.id ? <TeamAnalytics teamId={team.id}/> : <p role="status" className="p-6 text-muted-foreground">Loading workspace…</p>;
}
