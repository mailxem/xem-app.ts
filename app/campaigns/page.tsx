"use client";

import { CampaignsList } from "@/components/campaigns/campaigns-list";
import { TemplatesProvider } from "../providers/templates-provider";
import { MailingListProvider } from "../providers/mailinglist-provider";
import { SMTPProvider } from "../providers/smtp-provider";
import { CampaignsProvider } from "../providers/campaigns-provider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FullScreenCalendar } from "@/components/ui/full-screen-calendar";
export default function CampaignsPage() {
  return (
    <div className="flex-1">
      <TemplatesProvider>
        <MailingListProvider>
          <SMTPProvider>
            <CampaignsProvider>
              <Tabs defaultValue="all">
                <TabsList className="h-auto rounded-none border-b border-border bg-transparent p-0">
                  <TabsTrigger
                    className="relative rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary"
                    value="all"
                  >
                    List
                  </TabsTrigger>
                  <TabsTrigger
                    className="relative rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary"
                    value="scheduled"
                  >
                    Calendar
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="all">
                  <CampaignsList />
                </TabsContent>
                <TabsContent value="scheduled">
                  <FullScreenCalendar data={[]} />
                </TabsContent>
              </Tabs>
            </CampaignsProvider>
          </SMTPProvider>
        </MailingListProvider>
      </TemplatesProvider>
    </div>
  );
}
