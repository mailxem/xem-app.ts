import "./globals.css";
import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { auth } from "@/auth";
import { NextAuthProvider } from "./providers/NextAuthProvider";
import { TeamProvider } from "@/app/providers/team-provider";
import { Toaster } from "sonner";
import { cn } from "@/lib/utils";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { QueryProvider } from "./providers/query-provider";
import { AppHeader } from "@/components/app-header";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";

export const metadata: Metadata = {
  keywords: [
    "email",
    "automation",
    "email marketing",
    "email management",
    "email templates",
    "email campaigns",
  ],
  authors: [{ name: "Harsh Vardhan Goswami" }],
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
};

// Move MainLayout to a client component file
async function MainLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session) {
    return <>{children}</>;
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        {/* Sidebar - Fixed on desktop */}
        <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-background hidden lg:block">
          <AppSidebar className="h-full" />
        </aside>

        {/* Main Content Area */}
        <div className="flex flex-col flex-1 lg:ml-64">
          {/* Header */}
          <AppHeader />

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto bg-muted/10">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Xem: AI-Powered Email Marketing for Effortless Engagement</title>
        <meta
          name="description"
          content="Xem is the AI-powered email marketing platform that simplifies your workflow and boosts engagement. Create smarter campaigns and automate your marketing with AI. Start your free trial today!"
        />

        <meta property="og:url" content="https://xem.email" />
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="Xem: AI-Powered Email Marketing for Effortless Engagement"
        />
        <meta
          property="og:description"
          content="Xem is the AI-powered email marketing platform that simplifies your workflow and boosts engagement. Create smarter campaigns and automate your marketing with AI. Start your free trial today!"
        />
        <meta
          property="og:image"
          content="https://framerusercontent.com/images/BIW4segud1fRHZGJB3wIGXKg9DQ.png"
        />

        {/* Twitter Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="xem.email" />
        <meta property="twitter:url" content="https://xem.email" />
        <meta
          name="twitter:title"
          content="Xem: AI-Powered Email Marketing for Effortless Engagement"
        />
        <meta
          name="twitter:description"
          content="Xem is the AI-powered email marketing platform that simplifies your workflow and boosts engagement. Create smarter campaigns and automate your marketing with AI. Start your free trial today!"
        />
        <meta
          name="format-detection"
          content="telephone=no, date=no, email=no, address=no"
        />
        <link href="https://api.fontshare.com/v2/css?f[]=azeret-mono@400,500,600,700&display=swap" rel="stylesheet" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* publoic manifest */}
        <link rel="manifest" href="/site.webmanifest" />
        {/* publoic icons */}
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        {/* favicon */}
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon.ico" />
        {/* theme color */}
        <meta name="theme-color" content="#0065FD" />
      </head>
      <body
        className={cn(
          "antialiased bg-background text-foreground font-azeret text-base lg:text-lg",
          GeistSans.variable,
          GeistMono.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={true}
        >
          <NextAuthProvider>
            <QueryProvider>
              <TeamProvider>
                <MainLayout>{children}</MainLayout>
              </TeamProvider>
            </QueryProvider>
          </NextAuthProvider>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
