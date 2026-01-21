"use client";

import { TemplateEditor } from "@/components/templates/template-editor";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetTitle,
  SheetHeader,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { QuestionMarkCircledIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";

export default function NewTemplatePage() {
  const router = useRouter();
  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center gap-4 justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="text-gray-600 hover:"
          >
            ←
          </Button>
          <h1 className="text-xl font-medium">New Template</h1>
        </div>
        <div className="flex items-center gap-3">
          <Sheet>
            <SheetTrigger>
              <Button variant="outline">
                <QuestionMarkCircledIcon className="h-4 w-4" />
                Default Variables
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader className="mb-4">
                <SheetTitle>Default Variables</SheetTitle>
              </SheetHeader>
              <div className="space-y-4 text-sm">
                {[
                  "email",
                  "first_name",
                  "last_name",
                  "name",
                  "full_name",
                  "company",
                  "country",
                  "city",
                  "state",
                  "zip",
                  "address",
                  "phone",
                  "linkedin",
                  "twitter",
                  "facebook",
                  "instagram",
                ].map((variable) => (
                  <div className="flex items-center gap-2">
                    <span className="text-sm rounded-md bg-accent text-accent-foreground px-2 py-1 ">
                      {`{{ ${variable} }}`}
                    </span>
                  </div>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      <TemplateEditor templateId="new" />
    </div>
  );
}
