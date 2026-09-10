"use client";

import { useState } from "react";
import { CollectionCard } from "@/components/ui/collection-card";
import { workspaceClassName } from "@/lib/workspace-styles";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { User, Bell, Palette, Globe, CreditCard } from "lucide-react";
import { ProfileSettings } from "./profile-settings";
import { BrandingSettings } from "./branding-settings";
import { CustomDomains } from "./custom-domains";
import { TeamProvider } from "@/app/providers/team-provider";
import dynamic from "next/dynamic";

const BillingWrapper = dynamic(
  () => import("@/app/settings/billing/billing-wrapper"),
  { ssr: false }
);

export function SettingsTabs() {
  const [tab, setTab] = useState("profile");
  return (
    <Tabs value={tab} onValueChange={setTab} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {[
          { id: "profile", title: "Profile", description: "Your account details and personal information.", icon: User },
          { id: "branding", title: "Branding", description: "Workspace name, logo, and brand identity.", icon: Palette },
          { id: "domains", title: "Domains", description: "Connect and manage your custom domains.", icon: Globe },
          { id: "notifications", title: "Notifications", description: "Account updates and campaign notifications.", icon: Bell },
          { id: "billing", title: "Billing", description: "Your subscription, invoices, and usage.", icon: CreditCard },
        ].map(item => <CollectionCard key={item.id} title={item.title} description={item.description} icon={<item.icon size={22}/>} badge={tab === item.id ? "Selected" : undefined} action={`Manage ${item.title.toLowerCase()}`} onAction={() => setTab(item.id)}/>)}
      </div>
      <TabsContent value="profile" className="space-y-4">
        <div className={workspaceClassName("product-panel")}>
          <h3 className="mb-5 text-lg font-semibold tracking-tight">Profile Settings</h3>
          <div className="max-w-2xl">
            <ProfileSettings />
          </div>
        </div>
      </TabsContent>

      <TabsContent value="branding" className="space-y-4">
        <div className="w-full">
          <BrandingSettings />
        </div>
      </TabsContent>

      <TabsContent value="domains" className="space-y-4">
        <div className="w-full">
          <CustomDomains />
        </div>
      </TabsContent>

      <TabsContent value="notifications" className="space-y-4">
        <div className={workspaceClassName("product-panel")}>
          <h3 className="mb-5 text-lg font-semibold tracking-tight">Notification Preferences</h3>
          <p className="max-w-2xl text-sm text-muted-foreground">Notification preferences are not available yet. Campaign delivery and engagement remain available in Analytics; delivery failures are recorded in Outbox.</p>
        </div>
      </TabsContent>

      <TabsContent value="billing" className="space-y-4">
        <BillingWrapper />
      </TabsContent>
    </Tabs>
  );
}
