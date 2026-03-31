"use client";

import { AutomationsList } from "@/components/automations/automations-list";
import { useRouter } from "next/navigation";

export default function AutomationsPage() {
  const router = useRouter();
  return (
    <div className="flex-1 space-y-4">
      <AutomationsList />
    </div>
  );
}
