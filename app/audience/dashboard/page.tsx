"use client";
import Link from "next/link";
import { Users, Tags, Mail } from "lucide-react";
import { useTeam } from "@/app/providers/team-provider";
import { PageHeading } from "@/components/marketing/shared";
import { CollectionCard } from "@/components/ui/collection-card";
import { AudienceInsights } from "@/components/analytics/audience-insights";
import { AudienceBehavior } from "@/components/analytics/audience-behavior";
import { AudiencePreferences } from "@/components/analytics/audience-preferences";
import { Button } from "@/components/ui/button";
export default function AudienceDashboardPage() {
 const { team } = useTeam();
 return <div className="space-y-6"><PageHeading title="Audience" description="Understand and organize the people you reach." action={<Button asChild><Link href="/audience/lists">Manage contact lists</Link></Button>}/>
  <div className="grid gap-4 sm:grid-cols-3"><CollectionCard title="Contact lists" icon={<Users size={22}/>} description="Your audiences for campaigns, newsletters, and forms." href="/audience/lists" action="Open lists"/><CollectionCard title="Tags" icon={<Tags size={22}/>} description="Organize contacts with reusable labels." href="/audience/tags" action="Manage tags"/><CollectionCard title="Inbox" icon={<Mail size={22}/>} description="Read and reply to customer conversations." href="/inbox" action="Open inbox"/></div>
  {team?.id && <><AudienceInsights teamId={team.id}/><div className="grid gap-5 xl:grid-cols-2"><AudienceBehavior teamId={team.id}/><AudiencePreferences teamId={team.id}/></div></>}
 </div>;
}
