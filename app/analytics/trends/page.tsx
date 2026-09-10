"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { useTeam } from "@/app/providers/team-provider";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { QueryState, Empty } from "@/components/marketing/shared";
import { workspaceClassName } from "@/lib/workspace-styles";
type Trend={date:string;openRate:number;clickRate:number;bounceRate:number};
const config={openRate:{label:"Open rate"},clickRate:{label:"Click rate"},bounceRate:{label:"Bounce rate"}};
export default function TrendsPage(){
 const {team}=useTeam();const [days,setDays]=useState("30");
 const query=useQuery<Trend[]>({queryKey:["analytics-trends",team?.id,days],enabled:!!team?.id,queryFn:async({signal})=>{
  const startDate=new Date(Date.now()-Number(days)*86400000).toISOString();
  const response=await fetch(`/api/analytics/trends?teamId=${team!.id}&startDate=${startDate}`,{signal});
  if(!response.ok)throw new Error("Unable to load performance trends");
  return (await response.json()).data || [];
 }});
 const data=(query.data || []).map(point=>({...point,openRate:point.openRate*100,clickRate:point.clickRate*100,bounceRate:point.bounceRate*100}));
 return <section className={workspaceClassName("product-panel")}><div className={workspaceClassName("panel-toolbar")}><div><h2>Performance trends</h2><p className="mt-1 text-sm text-muted-foreground">Compare open, click, and bounce rates over time.</p></div><Select value={days} onValueChange={setDays}><SelectTrigger className="w-44"><SelectValue/></SelectTrigger><SelectContent>{[7,30,90].map(value=><SelectItem key={value} value={String(value)}>Last {value} days</SelectItem>)}</SelectContent></Select></div>
 {query.isPending || query.error ? <QueryState loading={query.isPending} error={query.error} retry={()=>void query.refetch()}/> : !data.length ? <Empty title="No activity in this period" description="Performance will appear as your emails are delivered and opened."/> : <ChartContainer config={config} className="h-[360px] w-full"><BarChart accessibilityLayer data={data}><CartesianGrid vertical={false}/><XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={10} minTickGap={30} tickFormatter={date=>new Date(date).toLocaleDateString(undefined,{month:"short",day:"numeric"})}/><YAxis width={48} tickLine={false} axisLine={false} tickFormatter={value=>`${value}%`}/><ChartTooltip content={<ChartTooltipContent formatter={(value,name)=><span>{config[name as keyof typeof config]?.label}: {Number(value).toFixed(1)}%</span>}/>}/><Bar dataKey="openRate" fill="var(--chart-1)" radius={[4,4,0,0]}/><Bar dataKey="clickRate" fill="var(--chart-2)" radius={[4,4,0,0]}/><Bar dataKey="bounceRate" fill="var(--chart-3)" radius={[4,4,0,0]}/><ChartLegend content={<ChartLegendContent/>}/></BarChart></ChartContainer>}</section>;
}
