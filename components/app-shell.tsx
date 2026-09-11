"use client";
import { workspaceClassName } from "@/lib/workspace-styles";
// Adapted from @efferd/dashboard-3: a shared sidebar, header and scrollable content shell.
import { AppHeader } from "@/components/app-header";
import { ReactNode, useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  LayoutGrid,
  Sparkles,
  Mail,
  Send,
  Workflow,
  Users,
  ChartNoAxesCombined,
  PanelsTopLeft,
  FilePenLine,
  Settings,
  Search,
  ChevronDown,
  PanelLeftClose,
  Menu,
  Newspaper,
  Command,
  LogOut,
  ArrowUpRight,
  ShieldCheck,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Modal } from "@/components/marketing/shared";
const navigation = [
  { name: "Ask Xem", href: "/", icon: Sparkles },
  { name: "Overview", href: "/dashboard", icon: LayoutGrid },
  { name: "Getting started", href: "/onboarding", icon: Sparkles },
  { name: "Inbox", href: "/inbox", icon: Mail },
  { name: "Outbox", href: "/developer/logs/emails", icon: Send },
  { name: "Campaigns", href: "/campaigns", icon: Mail },
  { name: "Newsletters", href: "/newsletters", icon: Newspaper },
  { name: "Automations", href: "/automations", icon: Workflow },
  { name: "Contact lists", href: "/audience/lists", icon: Users },
  { name: "CRM", href: "/crm", icon: Users },
  { name: "Analytics", href: "/analytics", icon: ChartNoAxesCombined },
  { name: "Templates", href: "/templates", icon: PanelsTopLeft },
  { name: "Forms", href: "/forms", icon: FilePenLine },
];
const settingsNavigation = [
  { name: "Managed sending", href: "/settings/sending", icon: Send },
  { name: "SMTP senders", href: "/settings/smtp", icon: Settings },
  { name: "IMAP mailboxes", href: "/settings/imap", icon: Settings },
  { name: "API keys", href: "/settings/api-keys", icon: Settings },
  { name: "Webhooks", href: "/settings/webhooks", icon: Settings },
  { name: "Tags", href: "/audience/tags", icon: Settings },
  { name: "Team", href: "/team", icon: Settings },
  { name: "Billing", href: "/settings/billing", icon: Settings },
  { name: "Account", href: "/settings", icon: Settings },
];
export function AppShell({
  children,
  previewPage,
  onPreviewNavigate,
}: {
  children: ReactNode;
  previewPage?: string;
  onPreviewNavigate?: (page: string) => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [mobile, setMobile] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [collapsed, setCollapsed] = useState(false);
  const active = previewPage || pathname;
  const sharedHeading = [
    "/campaigns",
    "/analytics",
    "/analytics/campaigns",
    "/analytics/audience",
    "/analytics/team",
    "/analytics/trends",
    "/settings",
    "/settings/billing",
    "/settings/api-keys",
    "/settings/smtp",
    "/settings/imap",
    "/team",
  ].includes(active);
  useEffect(() => {
    function keydown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        setSearchOpen((value) => !value);
      }
    }
    window.addEventListener("keydown", keydown);
    return () => window.removeEventListener("keydown", keydown);
  }, []);
  const current = navigation.find((n) =>
    n.href === "/" ? active === "/" : n.href === "/analytics" ? active.startsWith("/analytics") || active === "/audience/dashboard" : active.startsWith(n.href),
  );
  const currentSetting = settingsNavigation.find(
    (n) =>
      active === n.href ||
      (n.href !== "/settings" && active.startsWith(`${n.href}/`)),
  );
  if (
    pathname.startsWith("/f/") ||
    pathname.startsWith("/auth/") ||
    (pathname === "/preview" && !previewPage)
  )
    return <>{children}</>;
  const name =
    session?.user?.name || (previewPage ? "Alex Morgan" : "Your workspace");
  const go = (href: string) => {
    setMobile(false);
    setSearchOpen(false);
    onPreviewNavigate ? onPreviewNavigate(href) : router.push(href);
  };
  const sidebar = (
    <>
      <div className={workspaceClassName("brand")}>
        <button
          type="button"
          className="flex shrink-0 items-center rounded-lg"
          aria-label={collapsed ? "Expand sidebar" : "Xem dashboard"}
          onClick={() => (collapsed ? setCollapsed(false) : go("/"))}
        >
          <img
            src="/android-chrome-512x512.png"
            alt="Xem"
            className="h-9 w-9 object-contain"
          />
        </button>
        {!collapsed && <span>Xem</span>}
        <button
          className={workspaceClassName("collapse-sidebar")}
          aria-label="Collapse sidebar"
          onClick={() => setCollapsed(!collapsed)}
        >
          <PanelLeftClose size={18} />
        </button>
      </div>
      <nav aria-label="Main navigation">
        {navigation.map(({ name, href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            title={collapsed ? name : undefined}
            onClick={(e) => {
              if (onPreviewNavigate) {
                e.preventDefault();
                go(href);
              } else setMobile(false);
            }}
            className={workspaceClassName(
              `product-nav-item ${current?.href === href ? "active" : ""}`,
            )}
            aria-current={current?.href === href ? "page" : undefined}
          >
            <Icon size={19} strokeWidth={1.65} />
            {!collapsed && <span>{name}</span>}
            {!collapsed && name === "Newsletters" && <small>NEW</small>}
          </Link>
        ))}
        {!collapsed && (
          <details
            key={currentSetting?.href || "workspace"}
            open={!!currentSetting}
            className={workspaceClassName("product-nav-settings")}
          >
            <summary className={workspaceClassName("product-nav-item")}>
              <Settings size={19} />
              Settings & workspace
            </summary>
            {settingsNavigation.map(({ name, href }) => (
              <Link
                key={href}
                href={href}
                aria-current={
                  currentSetting?.href === href ? "page" : undefined
                }
                className={workspaceClassName(
                  `product-nav-item pl-10 ${currentSetting?.href === href ? "active" : ""}`,
                )}
                onClick={(e) => {
                  if (onPreviewNavigate) {
                    e.preventDefault();
                    go(href);
                  } else setMobile(false);
                }}
              >
                {name}
              </Link>
            ))}
          </details>
        )}
        {collapsed && (
          <Link
            href="/settings"
            title="Settings & workspace"
            aria-label="Settings & workspace"
            className={workspaceClassName(
              `product-nav-item ${currentSetting ? "active" : ""}`,
            )}
          >
            <Settings size={19} strokeWidth={1.65} />
          </Link>
        )}
      </nav>
      <div className={workspaceClassName("sidebar-bottom")}>
        {!collapsed && (
          <div className={workspaceClassName("workspace-note")}>
            <span className={workspaceClassName("workspace-dot")} />
            Your next great connection
            <br />
            <strong>starts with an email.</strong>
          </div>
        )}
      </div>
    </>
  );
  return (
    <div
      className={workspaceClassName(
        `product-frame ${collapsed ? "sidebar-collapsed" : ""}`,
      )}
    >
      <aside className={workspaceClassName("product-sidebar")}>{sidebar}</aside>
      <Sheet open={mobile} onOpenChange={setMobile}>
        <SheetContent
          side="left"
          className={workspaceClassName("mobile-sidebar")}
        >
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          {sidebar}
        </SheetContent>
      </Sheet>
      <div className={workspaceClassName("product-main")}>
        <header className={workspaceClassName("product-topbar")}>
          <button
            className={workspaceClassName("mobile-menu icon-button")}
            aria-label="Open navigation"
            onClick={() => setMobile(true)}
          >
            <Menu size={20} />
          </button>
          <button
            aria-label="Search your workspace"
            className={workspaceClassName("workspace-search")}
            onClick={() => setSearchOpen(true)}
          >
            <Search size={19} />
            <span>Search your workspace…</span>
            <kbd>⌘ K</kbd>
          </button>
          <div className={workspaceClassName("topbar-actions ml-auto")}>
            <Link
              className={workspaceClassName("topbar-quick")}
              href="/templates"
              onClick={(e) => {
                if (onPreviewNavigate) {
                  e.preventDefault();
                  go("/templates");
                }
              }}
            >
              <PanelsTopLeft size={17} />
              Template library
              <ArrowUpRight size={15} />
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  aria-label={`Account menu for ${name}`}
                  className="flex h-11 min-w-0 items-center gap-2.5 rounded-xl border border-border bg-white px-2.5 text-left transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring max-[780px]:size-10 max-[780px]:justify-center max-[780px]:border-0 max-[780px]:bg-transparent max-[780px]:p-0"
                >
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-violet-100 text-xs font-semibold text-violet-700">
                    {name
                      .split(" ")
                      .map((s) => s[0])
                      .slice(0, 2)
                      .join("")}
                  </span>
                  <span className="max-w-36 truncate text-sm font-medium max-[1100px]:hidden">
                    {name}
                  </span>
                  <ChevronDown
                    size={14}
                    className="shrink-0 text-muted-foreground max-[780px]:hidden"
                  />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="bottom"
                align="end"
                sideOffset={8}
                collisionPadding={12}
                className="w-60 rounded-xl border-border p-2"
              >
                <div className="mb-1 border-b border-border px-3 py-2.5">
                  <p className="truncate text-sm font-semibold">{name}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Workspace settings
                  </p>
                </div>
                <DropdownMenuItem
                  className="min-h-10 gap-3 rounded-lg px-3 text-sm"
                  onClick={() => go("/settings")}
                >
                  <Settings className="size-4 text-muted-foreground" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="min-h-10 gap-3 rounded-lg px-3 text-sm"
                  onClick={() => signOut({ callbackUrl: "/auth/login" })}
                >
                  <LogOut className="size-4 text-muted-foreground" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main
          className={workspaceClassName(`product-content ${active === "/" ? "!p-0 !overflow-hidden" : ""}`)}
          data-page={active}
        >
          {sharedHeading && !active.startsWith("/analytics") && !previewPage && <AppHeader />}
          {children}
          {!["/", "/inbox", "/developer/logs/emails", "/automations"].includes(
            active,
          ) && (
            <footer className={workspaceClassName("product-footer")}>
              <span>Xem · Made for meaningful connections</span>
              <span>
                <ShieldCheck size={13} /> Your workspace, connected
              </span>
            </footer>
          )}
        </main>
      </div>
      <Modal
        open={searchOpen}
        onOpenChange={setSearchOpen}
        title="Find your way"
        description="Jump to a workspace page."
      >
        <input
          autoFocus
          className={workspaceClassName("product-input")}
          placeholder="Search pages…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className={workspaceClassName("search-results")}>
          {[...navigation, ...settingsNavigation]
            .filter((n) => n.name.toLowerCase().includes(search.toLowerCase()))
            .map((n) => (
              <button key={n.href} onClick={() => go(n.href)}>
                <n.icon size={18} />
                {n.name}
                <ArrowUpRight size={16} />
              </button>
            ))}
        </div>
      </Modal>
    </div>
  );
}
