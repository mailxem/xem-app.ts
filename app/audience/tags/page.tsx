"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tag } from "lucide-react";
import { format } from "date-fns";
import { DataTable } from "@/components/ui/data-table";

interface Tag {
  id: string;
  name: string;
  createdAt: Date;
  _count: {
    contacts: number;
  };
}

export default function TagsPage() {
  const [isCreateTagOpen, setIsCreateTagOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [sortBy, setSortBy] = useState("Date created");

  // Mock data - replace with actual API call
  const tags: Tag[] = [
    {
      id: "1",
      name: "random",
      createdAt: new Date(),
      _count: {
        contacts: 0,
      },
    },
  ];

  return (
    <div className="container mx-auto">

      <DataTable
        data={tags}
        columns={[
          {
            header: "Tag",
            accessorKey: "name",
          },
          {
            header: "Contacts",
            accessorKey: "_count",
            cell: ({ row }: any) => row?.original?._count?.contacts || 0,
          },
          {
            header: "Created Date",
            accessorKey: "createdAt",
            cell: ({ row }: any) =>
              format(row.original.createdAt, "MMM d, yyyy"),
          },
        ]}
      />

      {/* Automate Tagging Card */}
      <div className="mt-8 bg-card rounded-lg border border-muted p-6">
        <div className="flex items-start gap-6">
          <div className="h-16 w-16 rounded-lg bg-pink-50 flex items-center justify-center">
            <svg
              className="h-8 w-8 text-pink-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-medium mb-2">Automate Tagging</h3>
            <p className="text-muted-foreground mb-4">
              You can automate tagging your contacts with our API
            </p>
            <Button variant="outline">Automate Your Tagging</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
