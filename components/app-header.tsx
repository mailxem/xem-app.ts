"use client";

import { logger } from "@/app/lib/logger";
import {
  Bell,
  HelpCircle,
  Moon,
  Plus,
  Search,
  Settings,
  Sun,
  ChevronLeft,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useSession, signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ContactsListHeader } from "./contacts/contacts-list-header";
import { TagsPageHeader } from "./tags/tags-page-header";
import { CreateKey } from "./api-keys/create-key";
import { BillingHeader } from "@/app/settings/billing/billing-header";

interface AppHeaderProps {
  className?: string;
}

// Page title configurations
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

export function AppHeader({ className }: AppHeaderProps) {
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();

  const { title, description } = getPageTitle(pathname);

  const isDashboardPage = pathname === "/";

  const isCampaignsPage =
    pathname.startsWith("/campaigns") && pathname !== "/campaigns/new";
  const isTemplatesPage =
    pathname.startsWith("/templates") && pathname !== "/templates/new";
  const isAutomationsPage = pathname.startsWith("/automations");
  const isAudiencePage = pathname.startsWith("/audience");
  const isFormsPage = pathname.startsWith("/forms");
  const isTagsPage = pathname.startsWith("/audience/tags");

  const isApiKeysPage = pathname.startsWith("/settings/api-keys");
  const isBillingPage = pathname.startsWith("/settings/billing");

  const isSmtpPage = pathname.startsWith("/settings/smtp");
  const isImapPage = pathname.startsWith("/settings/imap");

  return (
    <header
      className={cn(
        "sticky top-0 z-30 w-full border-b border-muted bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        className,
      )}
    >
      {/* Top Bar */}
      <div className="flex h-12 items-center px-4 lg:px-6 border-b border-muted">
        <div className="flex items-center gap-3">
          <img
            src="/android-chrome-512x512.png"
            alt="Xem"
            className="h-7 w-7"
          />
          <span className="font-semibold text-sm hidden sm:inline">Xem</span>
        </div>

        <div className="flex flex-1 items-center justify-end gap-2">
          <div className="relative w-full max-w-md hidden md:block">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="pl-9 h-8 bg-muted/40 border-0"
            />
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hidden sm:flex"
          >
            <HelpCircle className="h-4 w-4" />
          </Button>

          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Bell className="h-4 w-4" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 rounded-full p-0">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={`https://api.dicebear.com/9.x/lorelei/svg?seed=${session?.user?.name}`}
                    alt="User"
                  />
                  <AvatarFallback className="text-xs">
                    {session?.user?.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{session?.user?.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {session?.user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              >
                {theme === "light" ? (
                  <Moon className="mr-2 h-4 w-4" />
                ) : (
                  <Sun className="mr-2 h-4 w-4" />
                )}
                {theme === "light" ? "Dark" : "Light"} mode
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => signOut()}>
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Page Title Bar */}
      <div className="flex items-center justify-between px-4 lg:px-6 py-3">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">{title}</h1>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>

        {isAudiencePage && !isTagsPage && <ContactsListHeader />}
        {isTagsPage && <TagsPageHeader />}
        {(isCampaignsPage ||
          isDashboardPage ||
          isTemplatesPage ||
          isAutomationsPage ||
          isFormsPage ||
          isSmtpPage ||
          isImapPage) && (
          <Link
            href={
              isCampaignsPage || isDashboardPage
                ? "/campaigns/new"
                : isTemplatesPage
                  ? "/templates/new"
                  : isAutomationsPage
                    ? "/automations/new/create"
                    : isSmtpPage
                      ? "/settings/smtp?dialog=true"
                      : isImapPage
                        ? "/settings/imap?dialog=true"
                        : "/forms/new"
            }
          >
            <Button>
              <Plus className="mr-2 h-4 w-4" />{" "}
              {isDashboardPage
                ? "Create Campaign"
                : isCampaignsPage
                  ? "Create Campaign"
                  : isTemplatesPage
                    ? "Create Template"
                    : isAutomationsPage
                      ? "Create Automation"
                      : isSmtpPage
                        ? "Add SMTP Server"
                        : isImapPage
                          ? "Add IMAP Server"
                          : "Create Form"}
            </Button>
          </Link>
        )}
        {isApiKeysPage && <CreateKey />}
        {isBillingPage && <BillingHeader />}
      </div>
    </header>
  );
}

export type { AppHeaderProps };
