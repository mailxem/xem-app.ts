export type SendingDomain = {
  id: string;
  name: string;
  token: string;
  ownership: boolean;
  provisioned: boolean;
  identityStatus: string;
  dkimStatus: string;
  mailFromStatus: string;
  dmarcStatus: string;
  ready: boolean;
  checkedAt: string | null;
  smtpConfigId: string;
  fromEmail: string;
  records: { type: string; name: string; value: string }[];
};
export type SendingCredential = {
  id: string;
  domainId: string;
  name: string;
  expiresAt: string;
  revokedAt: string | null;
};
export type SendingMessage = {
  id: string;
  domainId: string;
  isTest: boolean;
  from: string;
  recipients: string;
  subject: string;
  status: string;
  detail: string;
  createdAt: string;
  providerId?: string;
};
export type SendingState = {
  enabled: boolean;
  account: {
    approved: boolean;
    suspended: boolean;
    paused: boolean;
    dailyLimit: number;
    monthlyLimit: number;
    monthlyBudgetMicros: number;
    dailyUsed: number;
    monthlyUsed: number;
    budgetUsedMicros: number;
    sendingMode: string;
    onboardingDismissed: boolean;
  };
  domains: SendingDomain[];
  credentials: SendingCredential[];
  messages: SendingMessage[];
  smtp: { enabled: boolean; host: string; port: number; security: string };
  costPerRecipientMicros: number;
  maxMessageBytes: number;
  journey: {
    byoSenders: number;
    campaigns: number;
    acceptedEmails: number;
    testedDomainIds: string[];
  };
};
export function checklist(state: SendingState) {
  const managed = state.account.sendingMode === "MANAGED";
  const domain =
    state.domains.find((d) => d.smtpConfigId && d.ready) ||
    state.domains.find((d) => d.ready) ||
    state.domains[0];
  const accepted = managed
    ? !!domain && state.journey.testedDomainIds.includes(domain.id)
    : state.journey.acceptedEmails > 0;
  if (!state.account.sendingMode)
    return [
      {
        title: "Choose how you send",
        detail: "Find the right path for your workspace.",
        done: false,
      },
    ];
  return managed
    ? [
        {
          title: "Choose how you send",
          detail: "A sending service that fits your setup.",
          done: true,
        },
        {
          title: "Make it your domain",
          detail: "Your name in every inbox.",
          done: !!domain,
        },
        {
          title: "Give your domain the green light",
          detail: "A few DNS records build trust.",
          done: !!domain?.ready,
        },
        {
          title: "Send yourself a little hello",
          detail: "Choose a sender and test the connection.",
          done: !!domain?.smtpConfigId && accepted,
        },
        {
          title: "Start something worth opening",
          detail: "Create your first campaign draft.",
          done: state.journey.campaigns > 0,
        },
      ]
    : [
        {
          title: "Choose how you send",
          detail: "Keep the provider you already use.",
          done: state.account.sendingMode === "BYO",
        },
        {
          title: "Connect your email provider",
          detail: "Bring your existing SMTP details.",
          done: state.journey.byoSenders > 0,
        },
        {
          title: "Create your first campaign",
          detail: "Start with a template, make it yours.",
          done: state.journey.campaigns > 0,
        },
        {
          title: "Send your first email",
          detail: "See your setup come together.",
          done: accepted,
        },
      ];
}
