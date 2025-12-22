"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Download, Trash } from "lucide-react";
import { useTeam } from "@/app/providers/team-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMailingLists } from "@/app/providers/mailinglist-provider";
import {
  SheetDescription,
  SheetTitle,
  SheetContent,
  SheetHeader,
  SheetTrigger,
  SheetFooter,
} from "../ui/sheet";
import { Sheet } from "../ui/sheet";
import { format } from "date-fns";
import { PageHeader } from "../page-header";
import { DataTable } from "../ui/data-table";
import { toast } from "sonner";
import { useApi } from "@/hooks/use-api";

export function ContactLists() {
  const [newList, setNewList] = useState({ name: "", description: "" });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();
  const { team } = useTeam();
  const { lists, isLoading, error, refetch, pagination, setPagination } =
    useMailingLists();
  const { apiFetch } = useApi();
  const createList = async () => {
    try {
      const response = await apiFetch("mailing-list", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newList, teamId: team?.id }),
      });

      if (!response.ok) throw new Error("Failed to create list");

      await refetch();
      setNewList({ name: "", description: "" });
      setIsDialogOpen(false);
      toast.success("Contact list created successfully");
    } catch (error) {
      toast.error("Failed to create contact list");
    }
  };

  const deleteList = async (id: string) => {
    try {
      const response = await apiFetch(`mailing-list/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete list");

      await refetch();
      toast.success("Contact list deleted successfully");
    } catch (error) {
      toast.error("Failed to delete contact list");
    }
  };

  const confirmDeleteList = async (id: string) => {
    if (confirm("Are you sure you want to delete this list?")) {
      await deleteList(id);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        heading="Contact Lists"
        description="Manage your contact lists and their subscribers"
      >
        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="border-gray-200">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem>Export as CSV</DropdownMenuItem>
              <DropdownMenuItem>Export as Excel</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Sheet open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <SheetTrigger asChild>
              <Button className="text-white">
                <Plus className="h-4 w-4 mr-2" />
                New List
              </Button>
            </SheetTrigger>
            <SheetContent className="sm:max-w-[500px]">
              <SheetHeader className="space-y-4 pb-6 border-b">
                <SheetTitle className="text-2xl font-semibold text-[#241C15]">
                  Create New Contact List
                </SheetTitle>
                <SheetDescription className="text-base text-gray-600">
                  Create a new list to organize your contacts and manage your
                  audience more effectively.
                </SheetDescription>
              </SheetHeader>
              <div className="space-y-6 py-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium ">
                    List Name
                  </label>
                  <Input
                    id="name"
                    value={newList.name}
                    onChange={(e) =>
                      setNewList({ ...newList, name: e.target.value })
                    }
                    placeholder="e.g., Newsletter Subscribers"
                    className="border-gray-200"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-medium ">
                    Description
                  </label>
                  <Textarea
                    id="description"
                    value={newList.description}
                    onChange={(e) =>
                      setNewList({ ...newList, description: e.target.value })
                    }
                    placeholder="Add a description to help you remember what this list is for..."
                    className="min-h-[100px] border-gray-200"
                  />
                </div>
              </div>
              <SheetFooter className="pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  disabled={isLoading}
                  className="border-gray-200"
                >
                  Cancel
                </Button>
                <Button
                  onClick={createList}
                  disabled={isLoading}
                  className="bg-[#007C89] text-white hover:bg-[#005F6B]"
                >
                  Create List
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </PageHeader>
      {/* Table */}
      <div className="px-6">
        <DataTable
          data={lists}
          columns={[
            {
              header: "Name",
              accessorKey: "name",
            },
            {
              header: "Description",
              accessorKey: "description",
            },
            {
              header: "Contacts",
              accessorKey: "subscribersCount",
              cell: ({ row }: any) => row?.original?.subscribersCount || 0,
            },
            {
              header: "Created Date",
              accessorKey: "createdAt",
              cell: ({ row }: any) =>
                format(row.original.createdAt, "MMM d, yyyy"),
            },
            {
              header: "Updated Date",
              accessorKey: "updatedAt",
              cell: ({ row }: any) =>
                format(row.original.updatedAt, "MMM d, yyyy"),
            },
            {
              header: "Actions",
              accessorKey: "actions",
              cell: ({ row }: any) => (
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() =>
                      router.push(`/audience/lists/${row.original.id}`)
                    }
                    variant="outline"
                  >
                    View
                  </Button>
                  <Button
                    onClick={() => confirmDeleteList(row.original.id)}
                    variant="destructive"
                    className="text-white cursor-pointer bg-red-500 hover:bg-red-600"
                  >
                    <Trash className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              ),
            },
          ]}
          pageIndex={pagination.page}
          pageSize={pagination.limit}
          totalRows={pagination.total}
          onPaginationChange={(_pagination: {
            pageIndex: number;
            pageSize: number;
          }) =>
            setPagination({
              total: pagination.total,
              page: _pagination.pageIndex,
              limit: _pagination.pageSize,
            })
          }
        />
      </div>
    </div>
  );
}
