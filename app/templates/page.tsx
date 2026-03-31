"use client";
import { TemplatesList } from "@/components/templates/templates-list";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { useRouter } from "next/navigation";
import { TemplatesProvider } from "../providers/templates-provider";

export default function TemplatesPage() {
  const router = useRouter();
  return (
    <TemplatesProvider>
      <div className="flex-1 space-y-4">
        <TemplatesList />
      </div>
    </TemplatesProvider>
  );
}
