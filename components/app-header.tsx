"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "./ui/button";
import { PageHeader } from "./page-header";
import { CreateKey } from "./api-keys/create-key";
const pageTitles: Record<string, { title: string; description?: string }> = {
  "/": { title: "Dashboard", description: "Overview of your email campaigns" },
  "/campaigns": {
    title: "Campaigns",
    description: "Manage your email campaigns",
  },
  "/campaigns/new": {
    title: "New Campaign",
    description: "Create a new email campaign",
  },
  "/templates": {
    title: "Templates",
    description: "Manage your email templates",
  },
  "/templates/new": {
    title: "New Template",
    description: "Create a new email template",
  },
  "/audience": {
    title: "Audience",
    description: "Manage your contacts and lists",
  },
  "/audience/lists": {
    title: "Lists",
    description: "Manage your mailing lists",
  },
  "/audience/tags": {
    title: "Tags",
    description: "Organize your contacts with tags",
  },
  "/audience/dashboard": {
    title: "Audience Dashboard",
    description: "View audience analytics",
  },
  "/analytics": {
    title: "Analytics",
    description: "View your campaign performance",
  },
  "/analytics/campaigns": { title: "Campaign Analytics" },
  "/analytics/audience": { title: "Audience Analytics" },
  "/analytics/team": { title: "Team Analytics" },
  "/analytics/trends": { title: "Trends" },
  "/automations": {
    title: "Automations",
    description: "Set up automated workflows",
  },
  "/forms": { title: "Forms", description: "Create and manage forms" },
  "/inbox": { title: "Inbox", description: "Your email inbox" },
  "/settings": {
    title: "Settings",
    description: "Manage your account settings",
  },
  "/settings/billing": {
    title: "Billing & Subscription",
    description: "Manage your subscription and usage",
  },
  "/settings/api-keys": {
    title: "API Keys",
    description: "Manage your API keys",
  },
  "/settings/smtp": {
    title: "SMTP Settings",
    description: "Configure SMTP settings",
  },
  "/settings/imap": {
    title: "IMAP Settings",
    description: "Configure IMAP settings",
  },
  "/settings/webhooks": { title: "Webhooks", description: "Manage webhooks" },
  "/team": { title: "Team", description: "Manage your team members" },
  "/developer/logs/emails": {
    title: "Email Logs",
    description: "View email delivery logs",
  },
  "/forms/new": { title: "New Form", description: "Create a new form" },
};

function getPageTitle(pathname: string): {
  title: string;
  description?: string;
} {
  // Try exact match first
  if (pageTitles[pathname]) {
    return pageTitles[pathname];
  }

  // Try pattern matching for dynamic routes
  if (pathname.startsWith("/campaigns/") && pathname !== "/campaigns/new") {
    return { title: "Campaign Details", description: "View and edit campaign" };
  }
  if (pathname.startsWith("/templates/") && pathname.includes("/edit")) {
    return {
      title: "Edit Template",
      description: "Customize your email template",
    };
  }
  if (pathname.startsWith("/audience/lists/")) {
    return { title: "List Details", description: "Manage list contacts" };
  }
  if (pathname.startsWith("/settings/api-keys/")) {
    return { title: "API Key Details" };
  }
  if (pathname.startsWith("/automations/new/")) {
    return {
      title: "New Automation",
      description: "Create automated workflow",
    };
  }

  // Default fallback
  return { title: "Dashboard" };
}


export function AppHeader() {
 const pathname=usePathname();
 const {title,description}=getPageTitle(pathname);
 const actions:Record<string,[string,string]>={"/":["Create Campaign","/campaigns/new"],"/campaigns":["Create Campaign","/campaigns/new"],"/settings/smtp":["Add SMTP Server","/settings/smtp?dialog=true"],"/settings/imap":["Add IMAP Server","/settings/imap?dialog=true"]};
 const action=actions[pathname];
 return <PageHeader heading={title} description={description}>{action && <Button asChild><Link href={action[1]}><Plus/>{action[0]}</Link></Button>}{pathname === "/settings/api-keys" && <CreateKey/>}</PageHeader>;
}
