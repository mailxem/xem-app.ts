"use client";

import { AudienceInsights } from "@/components/analytics/audience-insights";
import { useTeam } from "@/app/providers/team-provider";

export default function AudienceAnalyticsPage() {
  const { team } = useTeam();

  return (
    <div className="flex-1 space-y-4">
      <div className="grid gap-4 p-4 pt-4">
        {team?.id && <AudienceInsights teamId={team.id} />}
      </div>
    </div>
  );
}
