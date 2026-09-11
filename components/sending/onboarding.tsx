"use client";
import { useState } from "react";
import { useApi } from "@/hooks/use-api";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  ChevronRight,
  Cloud,
  PlugZap,
  Send,
  Sparkles,
  CheckCheck,
  CircleHelp,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useMarketing, useMarketingQuery } from "@/lib/marketing/api";
import { DomainDNS, DomainForm, SenderSetup } from "./controls";
import { checklist, type SendingState } from "@/lib/sending/types";

export function OnboardingBanner() {
  const { session } = useApi();
  const isAdmin = ["ADMIN", "SUPER_ADMIN"].includes(session?.user?.role || "");
  const q = useMarketingQuery<SendingState>("sending", isAdmin, 15000);
  if (!q.data || q.data.account.onboardingDismissed) return null;
  const steps = checklist(q.data);
  const done = steps.filter((s) => s.done).length;
  if (done === steps.length) return null;
  return (
    <Link
      href="/onboarding"
      className="group flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-violet-200 bg-violet-50/70 px-6 py-5 dark:border-violet-900 dark:bg-violet-950/30"
    >
      <div className="flex items-center gap-4">
        <span className="grid size-11 place-items-center rounded-xl bg-white text-violet-700 shadow-sm dark:bg-violet-900 dark:text-violet-200">
          <Send size={20} />
        </span>
        <div>
          <p className="font-semibold">A good email starts here.</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {done} of {steps.length} steps complete. Pick up where you left off.
          </p>
        </div>
      </div>
      <span className="flex items-center gap-2 text-sm font-medium text-violet-800 dark:text-violet-200">
        Continue setup{" "}
        <ArrowRight
          size={16}
          className="transition-transform group-hover:translate-x-1 motion-reduce:transform-none"
        />
      </span>
    </Link>
  );
}
export function Onboarding() {
  const q = useMarketingQuery<SendingState>("sending", true, 15000);
  const { request, refresh } = useMarketing();
  const [selected, setSelected] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const sync = () => {
    void q.refetch();
    void refresh();
  };
  if (q.isLoading)
    return (
      <div
        role="status"
        className="mx-auto max-w-5xl p-10 text-muted-foreground"
      >
        Getting your welcome checklist ready…
      </div>
    );
  if (q.error || !q.data)
    return (
      <div className="mx-auto max-w-xl space-y-4 rounded-2xl border p-8">
        <h1 className="text-xl font-semibold">
          Let’s get your workspace ready
        </h1>
        <p role="alert" className="text-sm text-muted-foreground">
          {q.error?.message || "Sign in to continue."} A workspace administrator
          can connect your sender.
        </p>
        <Button variant="outline" onClick={() => void q.refetch()}>
          Try again
        </Button>
        <Link href="/" className="ml-4 text-sm underline">
          Back to dashboard
        </Link>
      </div>
    );
  const state = q.data,
    steps = checklist(state),
    done = steps.filter((s) => s.done).length,
    complete = done === steps.length;
  const active =
    selected === null
      ? Math.max(
          0,
          steps.findIndex((s) => !s.done),
        )
      : Math.min(selected, steps.length - 1);
  const managed = state.account.sendingMode === "MANAGED";
  const domain =
    state.domains.find((d) => d.smtpConfigId && d.ready) ||
    state.domains.find((d) => d.ready) ||
    state.domains[0];
  async function choose(mode: string) {
    setBusy(true);
    try {
      await request("sending/onboarding", "PUT", { mode, dismissed: false });
      setSelected(null);
      sync();
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  async function dismiss() {
    if (state.account.sendingMode) {
      try {
        await request("sending/onboarding", "PUT", {
          mode: state.account.sendingMode,
          dismissed: true,
        });
        sync();
      } catch (e) {
        toast.error((e as Error).message);
      }
    }
  }
  return (
    <div className="mx-auto max-w-6xl space-y-8 pb-12">
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back to your workspace
        </Link>
        <Link
          href="/settings/sending"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          Sending settings <ChevronRight size={13} className="inline" />
        </Link>
      </div>
      <header className="relative overflow-hidden rounded-[28px] border border-violet-200/70 bg-gradient-to-br from-violet-50 via-white to-amber-50/70 px-7 py-9 dark:border-violet-900 dark:from-violet-950/40 dark:via-background dark:to-background sm:px-10 sm:py-12">
        <div className="relative z-10 max-w-2xl">
          <p className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[.18em] text-violet-700 dark:text-violet-300">
            <Sparkles size={15} />
            Your first good email
          </p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-[42px] sm:leading-[1.15]">
            {complete
              ? "You’re ready to make an impression."
              : "A little setup.\nA lot of possibility."}
          </h1>
          <p className="mt-4 max-w-lg text-sm leading-7 text-muted-foreground sm:text-base">
            {complete
              ? "Your workspace is connected and your first campaign is taking shape. Here’s to messages people look forward to."
              : "Let’s give your emails a home. We’ll take care of the details together, one small step at a time."}
          </p>
          <div className="mt-7 flex items-center gap-4">
            <div
              role="progressbar"
              aria-label="Onboarding progress"
              aria-valuemin={0}
              aria-valuemax={steps.length}
              aria-valuenow={done}
              className="h-2 w-40 overflow-hidden rounded-full bg-violet-100 dark:bg-violet-900"
            >
              <div
                className="h-full rounded-full bg-violet-600 transition-all duration-500 motion-reduce:transition-none"
                style={{ width: `${(done / steps.length) * 100}%` }}
              />
            </div>
            <span className="text-xs font-medium text-violet-800 dark:text-violet-200">
              {done} of {steps.length} complete
            </span>
          </div>
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-8 top-10 hidden h-52 w-64 rotate-[-9deg] items-center justify-center lg:flex"
        >
          <div className="absolute size-52 rounded-full border border-dashed border-violet-300" />
          <div className="absolute size-40 rounded-full bg-violet-100/60" />
          <div className="relative rounded-2xl border border-violet-200 bg-white p-8 text-violet-600 shadow-xl shadow-violet-200/40">
            <Send size={58} strokeWidth={1} />
            <span className="absolute -right-3 -top-3 rounded-full bg-emerald-100 p-2.5 text-emerald-700">
              <Check size={20} />
            </span>
          </div>
        </div>
      </header>
      <div className="grid items-start gap-6 lg:grid-cols-[290px_minmax(0,1fr)]">
        <aside className="order-2 space-y-5 lg:order-1">
          <nav
            aria-label="Welcome checklist"
            className="rounded-2xl border bg-card p-3"
          >
            <p className="px-3 pb-3 pt-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Your launch checklist
            </p>
            <ol className="space-y-1">
              {steps.map((step, i) => (
                <li key={step.title}>
                  <button
                    onClick={() => setSelected(i)}
                    aria-current={active === i ? "step" : undefined}
                    className={`flex w-full gap-3 rounded-xl p-3 text-left transition-colors ${active === i ? "bg-violet-50 dark:bg-violet-950/50" : "hover:bg-muted"}`}
                  >
                    <span
                      className={`mt-0.5 grid size-7 shrink-0 place-items-center rounded-full text-xs ${step.done ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200" : active === i ? "bg-violet-600 text-white" : "border text-muted-foreground"}`}
                    >
                      {step.done ? <Check size={15} /> : i + 1}
                    </span>
                    <span>
                      <span className="block text-sm font-medium leading-5">
                        {step.title}
                      </span>
                      <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                        {step.done ? "All set" : step.detail}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ol>
          </nav>
          <div className="px-4 text-xs leading-6 text-muted-foreground">
            <CircleHelp size={15} className="mb-2" />
            <p>
              Your progress saves as you go. Explore Xem whenever you like, then
              return here to finish.
            </p>
            <Link
              href="/templates"
              className="mt-2 inline-flex items-center gap-1 font-medium text-foreground"
            >
              Explore email templates <ArrowRight size={13} />
            </Link>
          </div>
        </aside>
        <section
          aria-live="polite"
          className="order-1 min-w-0 rounded-2xl border bg-card p-6 sm:p-8 lg:order-2"
        >
          {complete && selected === null ? (
            <div className="py-8 text-center">
              <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-emerald-50 text-emerald-700">
                <CheckCheck size={30} />
              </span>
              <h2 className="mt-6 text-2xl font-semibold">
                That’s a lovely start.
              </h2>
              <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-muted-foreground">
                Your setup is complete. Review your campaign, make it yours, and
                choose when to send it.
              </p>
              <Button asChild className="mt-6">
                <Link href="/campaigns">
                  Open my campaigns <ArrowRight className="ml-2" size={16} />
                </Link>
              </Button>
            </div>
          ) : (
            <>
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-violet-700 dark:text-violet-300">
                Step {active + 1} of {steps.length}
              </p>
              <h2 className="mb-3 text-2xl font-semibold tracking-tight">
                {steps[active].title}
              </h2>
              <p className="mb-7 text-sm leading-6 text-muted-foreground">
                {steps[active].detail}
              </p>
              {active === 0 ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    {
                      mode: "MANAGED",
                      title: "Let Xem handle delivery",
                      body: "Connect your domain. We’ll provide the sending service and keep delivery details in one place.",
                      icon: Cloud,
                    },
                    {
                      mode: "BYO",
                      title: "Bring your own provider",
                      body: "Already using SES, Postmark, or another SMTP provider? Keep your setup and connect it here.",
                      icon: PlugZap,
                    },
                  ].map((option) => (
                    <button
                      key={option.mode}
                      disabled={
                        busy || (option.mode === "MANAGED" && !state.enabled)
                      }
                      onClick={() => void choose(option.mode)}
                      className={`group rounded-2xl border p-5 text-left transition-all hover:border-violet-400 disabled:opacity-50 ${state.account.sendingMode === option.mode ? "border-violet-400 bg-violet-50/60 dark:bg-violet-950/30" : ""}`}
                    >
                      <option.icon size={24} className="mb-5 text-violet-600" />
                      <span className="block text-base font-semibold">
                        {option.title}
                      </span>
                      <span className="mt-2 block text-sm leading-6 text-muted-foreground">
                        {option.body}
                      </span>
                      <span className="mt-5 flex items-center gap-2 text-sm font-medium text-violet-700 dark:text-violet-300">
                        {option.mode === "MANAGED" && !state.enabled
                          ? "Not enabled on this installation"
                          : "Choose this path"}
                        <ArrowRight size={15} />
                      </span>
                    </button>
                  ))}
                </div>
              ) : managed && active === 1 ? (
                domain ? (
                  <div className="space-y-4">
                    <p className="font-medium break-all">{domain.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Your domain is saved. Let’s connect its DNS records.
                    </p>
                    <Button onClick={() => setSelected(2)}>
                      Continue to DNS <ArrowRight size={15} className="ml-2" />
                    </Button>
                  </div>
                ) : (
                  <DomainForm
                    onDone={() => {
                      sync();
                      setSelected(2);
                    }}
                  />
                )
              ) : managed && active === 2 ? (
                domain ? (
                  <DomainDNS domain={domain} onDone={sync} />
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Add your domain in the previous step to see its DNS records.
                  </p>
                )
              ) : managed && active === 3 ? (
                domain ? (
                  <SenderSetup
                    key={domain.id}
                    domain={domain}
                    approved={
                      state.account.approved &&
                      !state.account.paused &&
                      !state.account.suspended
                    }
                    onDone={sync}
                  />
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Connect your domain first. We’ll prepare your sender here.
                  </p>
                )
              ) : !managed && active === 1 ? (
                <div className="rounded-2xl bg-muted/50 p-6">
                  <PlugZap className="mb-4 text-violet-600" />
                  <p className="mb-5 text-sm leading-7">
                    You’ll need your provider’s SMTP host, port, username, and
                    password. Xem checks the connection before saving it.
                  </p>
                  <Button asChild>
                    <Link href="/settings/smtp">
                      Connect my provider{" "}
                      <ArrowRight size={15} className="ml-2" />
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="rounded-2xl bg-muted/50 p-6">
                  <MailArt />
                  <p className="my-5 text-sm leading-7">
                    {!managed && active === 3
                      ? "Open your campaign, choose your connected sender, and review the audience before sending. Your checklist updates when the provider accepts an email."
                      : "Start with a template or a blank canvas. Save a draft now; you decide when it goes out."}
                  </p>
                  <Button asChild>
                    <Link
                      href={
                        !managed && active === 3
                          ? "/campaigns"
                          : "/campaigns/new"
                      }
                    >
                      {!managed && active === 3
                        ? "Open my campaigns"
                        : "Create my first campaign"}
                      <ArrowRight size={15} className="ml-2" />
                    </Link>
                  </Button>
                </div>
              )}
              <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t pt-5">
                <Link
                  href="/"
                  onClick={() => void dismiss()}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  I’ll finish this later
                </Link>
                {active < steps.length - 1 && (
                  <Button
                    variant="ghost"
                    onClick={() => setSelected(active + 1)}
                  >
                    Next step <ChevronRight size={15} className="ml-1" />
                  </Button>
                )}
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
function MailArt() {
  return (
    <span className="inline-grid size-12 place-items-center rounded-xl border bg-background text-violet-600">
      <Send size={23} strokeWidth={1.4} />
    </span>
  );
}
