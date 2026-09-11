import { checklist, SendingState } from "@/lib/sending/types";

function state(): SendingState {
  return {
    enabled: true,
    account: {
      sendingMode: "MANAGED",
      approved: true,
      suspended: false,
      paused: false,
      onboardingDismissed: false,
      dailyLimit: 200,
      monthlyLimit: 1000,
      monthlyBudgetMicros: 1000000,
      dailyUsed: 0,
      monthlyUsed: 0,
      budgetUsedMicros: 0,
    },
    domains: [
      {
        id: "domain-a",
        name: "example.com",
        ready: true,
        smtpConfigId: "sender",
        fromEmail: "hello@example.com",
        token: "",
        ownership: true,
        provisioned: true,
        identityStatus: "SUCCESS",
        dkimStatus: "SUCCESS",
        mailFromStatus: "SUCCESS",
        dmarcStatus: "VALID",
        checkedAt: null,
        records: [],
      },
    ],
    credentials: [],
    messages: [],
    smtp: {
      enabled: true,
      host: "smtp.example.com",
      port: 587,
      security: "STARTTLS",
    },
    costPerRecipientMicros: 1000,
    maxMessageBytes: 5242880,
    journey: {
      byoSenders: 1,
      campaigns: 0,
      acceptedEmails: 20,
      testedDomainIds: [],
    },
  };
}
test("earlier BYO mail and another domain's test do not complete managed setup", () => {
  const s = state();
  s.journey.testedDomainIds = ["domain-b"];
  expect(checklist(s)[3].done).toBe(false);
  s.journey.testedDomainIds.push("domain-a");
  expect(checklist(s)[3].done).toBe(true);
  expect(checklist(s).every((step) => step.done)).toBe(false);
  s.journey.campaigns = 1;
  expect(checklist(s).every((step) => step.done)).toBe(true);
});
test("a fresh workspace offers a neutral choice; disabled managed sending preserves BYO progress", () => {
  const s = state();
  s.account.sendingMode = "";
  expect(checklist(s)).toHaveLength(1);
  expect(checklist(s)[0].done).toBe(false);
  s.enabled = false;
  s.account.sendingMode = "BYO";
  expect(checklist(s)).toHaveLength(4);
  expect(checklist(s)[1].done).toBe(true);
});
