"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Bar,
  BarChart,
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import {
  ArrowUpRight,
  BarChart3,
  Clock3,
  Mail,
  MousePointer2,
  RefreshCw,
  Plus,
  Send,
  ShieldAlert,
} from "lucide-react";
import { AnalyticsWorkspace } from "./analytics-workspace";
import { useTeam } from "@/app/providers/team-provider";
import { useAnalytics } from "@/lib/analytics/use-analytics";
import { EmailReport, formatRate } from "@/lib/analytics/types";
import { PageHeading, QueryState } from "@/components/marketing/shared";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

const number = (n: number) => n.toLocaleString();
const compact = (n: number) =>
  Intl.NumberFormat("en", { notation: "compact" }).format(n);
const chartConfig = {
  sent: { label: "Sent", color: "#9676d9" },
  queued: { label: "Pending", color: "#6d97cc" },
  failed: { label: "Failed", color: "#eca878" },
  drafts: { label: "Drafts", color: "#c0b9cc" },
  unknown: { label: "Unknown", color: "#64748b" },
  opened: { label: "Opened", color: "#9676d9" },
  clicked: { label: "Clicked", color: "#52b5a1" },
};
function dateString(d: Date) {
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
}
function period(days: number) {
  const to = new Date();
  const from = new Date();
  from.setUTCDate(from.getUTCDate() - days + 1);
  return { from: dateString(from), to: dateString(to) };
}
function nextDay(value: string) {
  const d = new Date(`${value}T12:00:00Z`);
  if (Number.isNaN(d.getTime())) return "";
  d.setUTCDate(d.getUTCDate() + 1);
  return dateString(d);
}

export function DashboardHome() {
  const search = useSearchParams();
  const router = useRouter();
  const tab = search.get("tab") === "campaigns" ? "campaigns" : "email";
  const [dates, setDates] = useState(() => period(30));
  const [days, setDays] = useState("30");
  return (
    <div className="space-y-6 pb-6">
      <PageHeading
        title="Dashboard"
        description="Your email activity and campaign performance, in one place."
        action={
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" asChild>
              <Link href="/developer/logs/emails">
                Open outbox
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild>
              <Link href="/campaigns/new">
                <Plus className="mr-2 h-4 w-4" />
                Create campaign
              </Link>
            </Button>
          </div>
        }
      />
      <Tabs
        value={tab}
        onValueChange={(value) => {
          const q = new URLSearchParams(search);
          q.set("tab", value);
          router.replace(`/?${q}`, { scroll: false });
        }}
      >
        <TabsList aria-label="Dashboard analytics" className="mb-6 h-11">
          <TabsTrigger value="email" className="gap-2 px-5 py-2">
            <Mail className="h-4 w-4" />
            Email
          </TabsTrigger>
          <TabsTrigger value="campaigns" className="gap-2 px-5 py-2">
            <BarChart3 className="h-4 w-4" />
            Campaigns
          </TabsTrigger>
        </TabsList>
        <TabsContent value="email" className="mt-0">
          <EmailActivity
            dates={dates}
            setDates={setDates}
            days={days}
            setDays={setDays}
          />
        </TabsContent>
        <TabsContent value="campaigns" className="mt-0">
          <AnalyticsWorkspace view="campaigns" embedded />
        </TabsContent>
      </Tabs>
    </div>
  );
}
function EmailActivity({
  dates,
  setDates,
  days,
  setDays,
}: {
  dates: { from: string; to: string };
  setDates: (dates: { from: string; to: string }) => void;
  days: string;
  setDays: (days: string) => void;
}) {
  const params = useMemo(
    () =>
      new URLSearchParams({
        from: dates.from,
        to: nextDay(dates.to),
        timezone: "UTC",
      }),
    [dates],
  );
  const valid = !!dates.from && !!dates.to && dates.from <= dates.to;
  const query = useAnalytics<EmailReport>("email-overview", params, valid);
  const r = query.data;
  const {
    team,
    loading: teamLoading,
    error: teamError,
    refreshTeam,
  } = useTeam();
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end gap-3 rounded-xl border bg-card p-4">
        <label className="space-y-1.5 text-xs font-medium">
          <span>Period</span>
          <Select
            value={days}
            onValueChange={(v) => {
              setDays(v);
              if (v !== "custom") setDates(period(Number(v)));
            }}
          >
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[7, 30, 90].map((n) => (
                <SelectItem key={n} value={String(n)}>
                  Last {n} days
                </SelectItem>
              ))}
              <SelectItem value="custom">Custom range</SelectItem>
            </SelectContent>
          </Select>
        </label>
        <label className="space-y-1.5 text-xs font-medium">
          <span>From</span>
          <Input
            type="date"
            aria-label="Email from date"
            className="w-40"
            value={dates.from}
            onChange={(e) => {
              setDays("custom");
              setDates({ ...dates, from: e.target.value });
            }}
          />
        </label>
        <label className="space-y-1.5 text-xs font-medium">
          <span>To</span>
          <Input
            type="date"
            aria-label="Email to date"
            className="w-40"
            value={dates.to}
            onChange={(e) => {
              setDays("custom");
              setDates({ ...dates, to: e.target.value });
            }}
          />
        </label>
        <span className="pb-2 text-xs text-muted-foreground">
          All email sources · UTC
        </span>
        <Button
          variant="outline"
          className="ml-auto"
          disabled={!valid || query.isFetching}
          onClick={() => void query.refetch()}
        >
          <RefreshCw
            className={`mr-2 h-4 w-4 ${query.isFetching ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>
      {!valid && (
        <p role="alert" className="text-sm text-destructive">
          Choose an end date on or after the start date.
        </p>
      )}
      <QueryState
        loading={teamLoading || (valid && !!team && query.isPending)}
        error={teamError || query.error}
        retry={() => void (teamError ? refreshTeam() : query.refetch())}
      />
      {!teamLoading && !team && !teamError && (
        <p className="text-sm text-muted-foreground">
          Select a workspace to view email activity.
        </p>
      )}
      {valid && team && r && !query.isError && (
        <>
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
            <p>
              API, outbox, automation, campaign, and newsletter emails. Test
              sends are excluded.
            </p>
            <span>
              Through{" "}
              {new Date(r.asOf).toLocaleString([], {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                timeZone: "UTC",
                timeZoneName: "short",
              })}
            </span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Stat
              label="Emails sent"
              value={number(r.summary.sent)}
              detail="Accepted by SMTP in this period."
              icon={Send}
            />
            <Stat
              label="Pending emails"
              value={number(r.summary.queued)}
              detail="Queued, scheduled, or sending; created in this period."
              icon={Clock3}
            />
            <Stat
              label="Click rate"
              value={formatRate(r.clickRate)}
              detail={`${number(r.summary.clicked)} clicked messages / ${number(r.summary.sent)} sent.`}
              icon={MousePointer2}
            />
            <Stat
              label="Failed emails"
              value={number(r.summary.failed)}
              detail="Current failed status; created in this period."
              icon={ShieldAlert}
            />
          </div>
          {r.summary.total === 0 && (
            <Card className="rounded-2xl border-dashed shadow-none">
              <CardContent className="flex flex-wrap items-center justify-between gap-4 p-6">
                <div>
                  <h2 className="font-semibold">
                    No email activity in this period
                  </h2>
                  <p className="mt-1 max-w-xl text-sm text-muted-foreground">
                    Try a wider date range, or send an email from the outbox or
                    API. You don’t need a campaign to see activity here.
                  </p>
                </div>
                <Button asChild>
                  <Link href="/developer/logs/emails">
                    Go to outbox
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
          <Card className="rounded-2xl shadow-none">
            <CardHeader>
              <CardTitle className="text-base">Email activity</CardTitle>
              <CardDescription>
                Sent emails by send date; all other records by creation date.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-5 flex flex-wrap gap-4 text-xs text-muted-foreground">
                {(
                  ["sent", "queued", "failed", "drafts", "unknown"] as const
                ).map((k) => (
                  <span key={k} className="inline-flex items-center gap-1.5">
                    <svg width="9" height="9" aria-hidden="true">
                      <circle
                        cx="4.5"
                        cy="4.5"
                        r="4.5"
                        fill={chartConfig[k].color}
                      />
                    </svg>
                    {chartConfig[k].label}
                  </span>
                ))}
              </div>
              <ChartContainer
                config={chartConfig}
                className="h-[300px] w-full"
                role="img"
                aria-label="Daily email records by status"
              >
                <BarChart
                  accessibilityLayer
                  data={r.series}
                  margin={{ left: 0, right: 8, top: 8, bottom: 0 }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(d) => d.slice(5)}
                    tickLine={false}
                    axisLine={false}
                    minTickGap={24}
                  />
                  <YAxis
                    allowDecimals={false}
                    tickFormatter={compact}
                    tickLine={false}
                    axisLine={false}
                    width={42}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  {(
                    ["sent", "queued", "failed", "drafts", "unknown"] as const
                  ).map((k) => (
                    <Bar
                      key={k}
                      dataKey={k}
                      stackId="status"
                      fill={`var(--color-${k})`}
                      maxBarSize={36}
                      isAnimationActive={false}
                    />
                  ))}
                </BarChart>
              </ChartContainer>
              <details className="mt-4 text-xs text-muted-foreground">
                <summary className="cursor-pointer">View daily counts</summary>
                <div className="mt-3 max-h-64 overflow-auto">
                  <table className="w-full text-left tabular-nums">
                    <thead>
                      <tr>
                        {[
                          "Date",
                          "Sent",
                          "Pending",
                          "Failed",
                          "Drafts",
                          "Unknown",
                        ].map((s) => (
                          <th key={s} className="p-2">
                            {s}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {r.series.map((d) => (
                        <tr key={d.date} className="border-t">
                          <td className="p-2">{d.date}</td>
                          {(
                            [
                              "sent",
                              "queued",
                              "failed",
                              "drafts",
                              "unknown",
                            ] as const
                          ).map((k) => (
                            <td key={k} className="p-2">
                              {number(d[k])}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </details>
            </CardContent>
          </Card>
          <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
            <Card className="rounded-2xl shadow-none">
              <CardHeader>
                <CardTitle className="text-base">Email engagement</CardTitle>
                <CardDescription>
                  Unique opened and clicked messages, grouped by send date.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={chartConfig}
                  className="h-[230px] w-full"
                  role="img"
                  aria-label="Opened and clicked emails by send date"
                >
                  <AreaChart accessibilityLayer data={r.series}>
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(d) => d.slice(5)}
                      tickLine={false}
                      axisLine={false}
                      minTickGap={24}
                    />
                    <YAxis
                      allowDecimals={false}
                      width={40}
                      tickFormatter={compact}
                      axisLine={false}
                      tickLine={false}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area
                      dataKey="opened"
                      type="monotone"
                      stroke="var(--color-opened)"
                      fill="var(--color-opened)"
                      fillOpacity={0.12}
                      strokeWidth={2}
                      isAnimationActive={false}
                    />
                    <Area
                      dataKey="clicked"
                      type="monotone"
                      stroke="var(--color-clicked)"
                      fill="var(--color-clicked)"
                      fillOpacity={0.16}
                      strokeWidth={2}
                      isAnimationActive={false}
                    />
                  </AreaChart>
                </ChartContainer>
                <p className="mt-4 text-xs leading-5 text-muted-foreground">
                  Open tracking is directional. Clicks can include scanners.
                  Missing tracking does not prove a message was unread.
                </p>
              </CardContent>
            </Card>
            <Card className="rounded-2xl shadow-none">
              <CardHeader>
                <CardTitle className="text-base">At a glance</CardTitle>
                <CardDescription>
                  All email sources, including standalone sends.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-0">
                {[
                  ["Open rate", formatRate(r.openRate)],
                  [
                    "Known bounces",
                    `${number(r.summary.bounced)} (${formatRate(r.bounceRate)})`,
                  ],
                  ["Campaign-linked sends", number(r.summary.campaigns)],
                  ["Other email sends", number(r.summary.other)],
                  ["Drafts", number(r.summary.drafts)],
                  ["Unknown outcomes", number(r.summary.unknown)],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="flex items-center justify-between gap-3 border-b py-3 text-sm last:border-0"
                  >
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-medium tabular-nums">{value}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
          <p className="text-xs leading-5 text-muted-foreground">
            Counts are email records, not individual recipients in CC/BCC. Sent
            means accepted by SMTP, not verified inbox delivery. Bounces are a
            subset of sent emails. Statuses reflect the latest recorded state.
          </p>
        </>
      )}
    </div>
  );
}
function Stat({
  label,
  value,
  detail,
  icon: Icon,
}: {
  label: string;
  value: string;
  detail: string;
  icon: typeof Mail;
}) {
  return (
    <Card className="rounded-2xl shadow-none">
      <CardContent className="p-5">
        <div className="flex items-center justify-between gap-3 text-sm text-muted-foreground">
          <span>{label}</span>
          <span className="rounded-lg bg-violet-50 p-2 text-violet-600 dark:bg-violet-950/40 dark:text-violet-300">
            <Icon className="h-4 w-4" />
          </span>
        </div>
        <p className="mt-4 text-3xl font-semibold tracking-tight tabular-nums">
          {value}
        </p>
        <p className="mt-2 text-xs leading-5 text-muted-foreground">{detail}</p>
      </CardContent>
    </Card>
  );
}
