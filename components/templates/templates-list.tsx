"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PaginationState } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  MoreHorizontal,
  Pencil,
  Trash,
  Copy,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { useTeam } from "@/app/providers/team-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EmailTemplate } from "@/lib";
import { Input } from "../ui/input";
import { toast } from "sonner";
import { useApi } from "@/hooks/use-api";
import { useQuery } from "@tanstack/react-query";
import { useTemplates } from "@/app/providers/templates-provider";

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  status: "draft" | "published";
  lastModified: string;
  teamId: string;
}

export function TemplatesList() {
  const [totalCount, setTotalCount] = useState<number>(0);
  const router = useRouter();
  const { team } = useTeam();
  const { apiFetch } = useApi();
  const { templates, isLoading, error, refetch, pagination, setPagination } =
    useTemplates();

  const deleteTemplate = async (id: string) => {
    try {
      const response = await apiFetch(`templates/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete template");

      toast.success("Template deleted successfully");

      await refetch();
    } catch (error) {
      toast.error("Failed to delete template");
    }
  };

  const duplicateTemplate = async (data: EmailTemplate) => {
    try {
      const createResponse = await apiFetch("templates", {
        method: "POST",
        body: JSON.stringify({
          ...data,
          id: undefined,
          name: `${data.name} - Copy`,
          duplicate: true,
        }),
      });

      if (!createResponse.ok) throw new Error("Failed to duplicate template");

      toast.success("Template duplicated successfully");

      await refetch();
    } catch (error) {
      toast.error("Failed to duplicate template");
    }
  };

  useQuery({
    queryKey: ["templates", team?.id, pagination.page, pagination.limit],
    queryFn: refetch,
    enabled: !!team?.id,
  });

  return (
    <div className="space-y-4 pb-12">
      {isLoading ? (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin  h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : templates?.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <p className="text-muted-foreground">No templates found</p>
        </div>
      ) : (
        <div className="grid">
          {templates?.map((template) => (
            <div
              key={template.id}
              className="flex items-center justify-between p-4 border border-muted rounded-lg"
            >
              <div className="flex items-center gap-4">
                <div>
                  <h3 className="font-medium">{template.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    Last updated{" "}
                    {new Date(template.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem
                    onClick={() => {
                      navigator.clipboard.writeText(template.id);
                      toast.success("Template ID copied to clipboard");
                    }}
                  >
                    Copy template ID
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() =>
                      router.push(`/templates/${template.id}/edit`)
                    }
                  >
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => duplicateTemplate(template)}>
                    <Copy className="mr-2 h-4 w-4" />
                    Duplicate
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-red-600"
                    onClick={() => deleteTemplate(template.id)}
                  >
                    <Trash className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}

          {pagination && (
            <div className="flex justify-between items-center mt-4 text-sm text-[#606060]">
              <div>
                Showing results {pagination.page} -{" "}
                {pagination.page * pagination.limit} of {totalCount}
              </div>
              <div className="flex items-center gap-2">
                <span>Page</span>
                <Input
                  className="w-12 h-8 text-center rounded-sm"
                  value={pagination.page}
                  readOnly
                />
                <span>of {Math.ceil(totalCount / pagination.limit)}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-[#403F3F]"
                  onClick={() => {
                    setPagination({
                      page: pagination.page - 1,
                      limit: pagination.limit,
                      total: pagination.total,
                    });
                  }}
                  disabled={pagination.page === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-[#403F3F]"
                  onClick={() => {
                    setPagination({
                      page: pagination.page + 1,
                      limit: pagination.limit,
                      total: pagination.total,
                    });
                  }}
                  disabled={pagination.page === totalCount}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
