"use client";
import { useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { PreviewTransport, type Transport } from "@/lib/marketing/api";
import { Onboarding } from "@/components/sending/onboarding";
import { SendingDashboard } from "@/components/sending/dashboard";
import type { SendingState, SendingDomain } from "@/lib/sending/types";

function initial(): SendingState {
  return {
    enabled: true,
    account: {
      approved: true,
      suspended: false,
      paused: false,
      dailyLimit: 200,
      monthlyLimit: 1000,
      monthlyBudgetMicros: 1000000,
      dailyUsed: 0,
      monthlyUsed: 0,
      budgetUsedMicros: 0,
      sendingMode: "",
      onboardingDismissed: false,
    },
    domains: [],
    credentials: [],
    messages: [],
    smtp: {
      enabled: true,
      host: "smtp.example.test",
      port: 587,
      security: "STARTTLS",
    },
    costPerRecipientMicros: 1000,
    maxMessageBytes: 5242880,
    journey: {
      byoSenders: 0,
      campaigns: 0,
      acceptedEmails: 0,
      testedDomainIds: [],
    },
  };
}
function domain(name: string): SendingDomain {
  return {
    id: "preview-domain",
    name,
    token: "xem-managed=preview-ownership-token",
    ownership: false,
    provisioned: false,
    identityStatus: "NOT_STARTED",
    dkimStatus: "NOT_STARTED",
    mailFromStatus: "NOT_STARTED",
    dmarcStatus: "NOT_CHECKED",
    ready: false,
    checkedAt: null,
    smtpConfigId: "",
    fromEmail: "",
    records: [
      {
        type: "TXT",
        name: `_xem.${name}`,
        value: "xem-managed=preview-ownership-token",
      },
    ],
  };
}
export function SendingPreview({ dashboard = false }: { dashboard?: boolean }) {
  const state = useRef(initial());
  const [scenario, setScenario] = useState("fresh");
  const [version, setVersion] = useState(0);
  const client = useQueryClient();
  function preset(name: string) {
    const s = initial();
    if (name !== "fresh") {
      s.account.sendingMode = "MANAGED";
      s.domains = [domain("updates.studionorth.com")];
      if (name === "ready" || name === "complete") {
        const d = s.domains[0];
        d.ownership = d.provisioned = d.ready = true;
        d.identityStatus = d.dkimStatus = d.mailFromStatus = "SUCCESS";
        d.dmarcStatus = "VALID";
        d.smtpConfigId = "preview-sender";
        d.fromEmail = "hello@updates.studionorth.com";
      }
      if (name === "complete") {
        s.journey.campaigns = 1;
        s.journey.acceptedEmails = 1;
        s.journey.testedDomainIds = [s.domains[0].id];
        s.messages = [
          {
            id: "preview-message",
            domainId: s.domains[0].id,
            isTest: true,
            from: s.domains[0].fromEmail,
            recipients: "alex@example.com",
            subject: "Your Xem sending test",
            status: "DELIVERED",
            detail: "SES reported Delivery.",
            createdAt: new Date().toISOString(),
          },
        ];
      }
    }
    if (name === "disabled") {
      s.enabled = false;
      s.account.sendingMode = "";
      s.domains = [];
    }
    state.current = s;
    setScenario(name);
    client.removeQueries({ queryKey: ["marketing", "preview", "sending"] });
    setVersion((v) => v + 1);
  }
  const transport: Transport = async <T,>(
    path: string,
    method = "GET",
    body?: unknown,
  ) => {
    const s = state.current;
    const b = body as Record<string, unknown> | undefined;
    if (path === "sending" && method === "GET") return structuredClone(s) as T;
    if (path === "sending/onboarding") {
      s.account.sendingMode = String(b?.mode);
      s.account.onboardingDismissed = !!b?.dismissed;
      return null as T;
    }
    if (path === "sending/domains") {
      const d = domain(String(b?.name));
      s.domains.push(d);
      return d as T;
    }
    if (path.endsWith("/check")) {
      const d = s.domains[0];
      d.ownership = d.provisioned = true;
      d.identityStatus = "PENDING";
      d.records.push(
        {
          type: "CNAME",
          name: `preview._domainkey.${d.name}`,
          value: "preview.dkim.amazonses.com",
        },
        {
          type: "MX",
          name: `bounce.${d.name}`,
          value: "10 feedback-smtp.us-east-1.amazonses.com",
        },
      );
      return d as T;
    }
    if (path.endsWith("/sender")) {
      s.domains[0].fromEmail = String(b?.from);
      s.domains[0].smtpConfigId = "preview-sender";
      return null as T;
    }
    if (path === "sending/test") {
      const m = {
        id: "preview-message",
        domainId: s.domains[0].id,
        isTest: true,
        from: String(b?.from),
        recipients: "alex@example.com",
        subject: "Your Xem sending test",
        status: "SENT",
        detail: "Preview only. No email was sent.",
        createdAt: new Date().toISOString(),
      };
      s.messages.push(m);
      s.journey.testedDomainIds = [s.domains[0].id];
      s.account.dailyUsed++;
      return m as T;
    }
    if (path === "sending/pause") {
      s.account.paused = !!b?.paused;
      return null as T;
    }
    if (path === "sending/credentials") {
      const credential = {
        id: "preview-credential",
        name: String(b?.name),
        domainId: String(b?.domainId),
        expiresAt: new Date(Date.now() + 90 * 86400000).toISOString(),
        revokedAt: null,
      };
      s.credentials.push(credential);
      return {
        credential,
        password: "preview-only-this-is-not-a-real-credential",
      } as T;
    }
    if (path.endsWith("/events"))
      return [
        {
          id: "sample",
          kind: "Delivery",
          detail: "Preview event. No email was sent.",
          createdAt: new Date().toISOString(),
        },
      ] as T;
    throw new Error("This action is not available in the local preview.");
  };
  return (
    <PreviewTransport.Provider value={transport}>
      <div className="mb-6 flex flex-wrap items-center gap-3 rounded-xl border border-dashed p-3 text-xs">
        <label htmlFor="sending-scenario">Local sample scenario</label>
        <select
          id="sending-scenario"
          value={scenario}
          onChange={(e) => preset(e.target.value)}
          className="rounded border bg-background px-3 py-2"
        >
          <option value="fresh">Fresh workspace</option>
          <option value="pending">Waiting for DNS</option>
          <option value="ready">Domain ready</option>
          <option value="complete">Checklist complete</option>
          <option value="disabled">Managed sending disabled</option>
        </select>
        <span className="text-muted-foreground">
          Simulated data only. No email or credentials leave this browser.
        </span>
      </div>
      {dashboard ? (
        <SendingDashboard key={version} />
      ) : (
        <Onboarding key={version} />
      )}
    </PreviewTransport.Provider>
  );
}
