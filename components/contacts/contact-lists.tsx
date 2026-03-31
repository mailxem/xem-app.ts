"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { useMailingLists } from "@/app/providers/mailinglist-provider";
import { format } from "date-fns";
import { DataTable } from "../ui/data-table";
import { toast } from "sonner";
import { useApi } from "@/hooks/use-api";

export function ContactLists() {
  const router = useRouter();
  const { lists, refetch, pagination, setPagination } = useMailingLists();
  const { apiFetch } = useApi();

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
          cell: ({ row }: any) => format(row.original.createdAt, "MMM d, yyyy"),
        },
        {
          header: "Updated Date",
          accessorKey: "updatedAt",
          cell: ({ row }: any) => format(row.original.updatedAt, "MMM d, yyyy"),
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
  );
}
