"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import Link from "next/link";
import { toast } from "sonner";
import { PageHeader } from "@/components/page-header";
import { APIKey } from "@/lib";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Tooltip } from "@/components/ui/tooltip";
import { TooltipContent } from "@/components/ui/tooltip";
import { PopoverContent } from "@/components/ui/popover";
import { PopoverTrigger } from "@/components/ui/popover";
import { FormControl, FormMessage } from "@/components/ui/form";
import { FormLabel } from "@/components/ui/form";
import { FormField } from "@/components/ui/form";
import { FormItem, Form } from "@/components/ui/form";
import { Popover } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { DataTable } from "@/components/ui/data-table";
import { useApi } from "@/hooks/use-api";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  expiresAt: z
    .date()
    .optional()
    .refine((date) => date && date > new Date(), {
      message: "Expiration date must be in the future",
    }),
});

export default function APIKeysPage() {
  const [isCreateKeyOpen, setIsCreateKeyOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      expiresAt: new Date(new Date().setDate(new Date().getDate() + 9000)),
    },
  });

  const router = useRouter();
  const { apiFetch } = useApi();
  const { data: session } = useSession();
  const [apiKeys, setApiKeys] = useState<APIKey[]>([]);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const deleteApiKey = async (id: string) => {
    try {
      const response = await apiFetch(`api-keys/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete API key");

      setApiKeys(apiKeys.filter((key) => key.id !== id));
      toast.success("API key deleted successfully");
    } catch (error) {
      toast.error("Failed to delete API key");
    }
  };

  const toggleApiKey = async (id: string, isActive: boolean) => {
    try {
      const response = await apiFetch(`api-keys/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isDeleted: !isActive }),
      });

      if (!response.ok) throw new Error("Failed to update API key");

      setApiKeys(
        apiKeys?.map((key) => (key.id === id ? { ...key, isActive } : key))
      );
      toast.success(
        `API key ${isActive ? "activated" : "deactivated"} successfully`
      );
    } catch (error) {
      toast.error("Failed to update API key");
    }
  };

  const fetchApiKeys = async () => {
    try {
      const response = await apiFetch("api-keys");
      if (!response.ok) throw new Error("Failed to fetch API keys");
      const data = await response.json();
      setApiKeys(data.data);
      if (data.total > 0) {
        setSelectedKey(data.data[0].id);
      }
    } catch (error) {
      console.error(error, "Failed to fetch API keys");
      toast.error("Failed to fetch API keys");
    }
  };

  useQuery({
    queryKey: ["api-keys"],
    queryFn: () => fetchApiKeys(),
    enabled: !!session?.user,
  });

  const createApiKey = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const response = await apiFetch("api-keys", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) throw new Error("Failed to create API key");

      const newKey = await response.json();
      setApiKeys([...apiKeys, newKey]);
      toast.success("API key created successfully");
    } catch (error) {
      toast.error("Failed to create API key");
    } finally {
      setIsCreateKeyOpen(false);
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  return (
    <div className="flex-1">
      <PageHeader heading="API keys">
        <Sheet open={isCreateKeyOpen} onOpenChange={setIsCreateKeyOpen}>
          <SheetTrigger asChild>
            <Button variant="default">Create A Key</Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Create New API Key</SheetTitle>
              <SheetDescription>
                Give your API key a name to help you identify its use.
              </SheetDescription>
            </SheetHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(createApiKey)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="My API Key" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="expiresAt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expiration Date (Optional)</FormLabel>
                      <FormControl>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full justify-start text-left font-normal"
                              )}
                            >
                              {field.value ? (
                                format(new Date(field.value), "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={
                                field.value
                                  ? new Date(
                                    new Date(field.value).setDate(
                                      new Date(field.value).getDate() + 90
                                    )
                                  )
                                  : undefined
                              }
                              onSelect={field.onChange}
                            />
                          </PopoverContent>
                        </Popover>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <SheetFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsCreateKeyOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button variant="default" type={isLoading ? "button" : "submit"}>
                    {isLoading ? "Creating..." : "Create Key"}
                  </Button>
                </SheetFooter>
              </form>
            </Form>
          </SheetContent>
        </Sheet>
      </PageHeader>

      {/* Three Column Section */}
      <div className="grid gap-4 p-8">
        {/* About the API */}
        <div className="space-y-4 grid">
          <h2 className="text-2xl">About the API</h2>
          <div className="flex items-center space-x-4">
            <p className="text-muted-foreground">
              The Xem API makes it easy for programmers to integrate Xem's
              features into other applications.
            </p>
          </div>
          <a href="https://docs.xem.email/api-reference/email/send-an-email" target="_blank"><Button variant="outline" className="w-max justify-start">
            Read The API Documentation
          </Button></a>
        </div>
      </div>

      {/* Your API keys section */}
      <div className="space-y-4 py-8 px-8">
        <h2 className="text-2xl font-medium">Your API keys</h2>
        <p className="text-muted-foreground">
          You can review, revoke or generate new API keys below.{" "}
          <Link href="#" className="text-primary hover:underline">
            Learn more about generating, revoking, and accessing API keys here
          </Link>
          .
        </p>

        <DataTable
          columns={[
            {
              header: "Name",
              accessorKey: "name",
            },
            {
              header: "Key",
              accessorKey: "key",
              cell: ({ row }) => (
                <div onClick={() => copyToClipboard(row.original.key)} className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" className="cursor-pointer">
                    ••••••••••••••••
                  </Button>
                </div>
              ),
            },
            {
              header: "Status",
              accessorKey: "isDeleted",
              cell: ({ row }) => (
                <Badge variant={row.original.isDeleted ? "destructive" : "default"}>
                  {row.original.isDeleted ? "Disabled" : "Enabled"}
                </Badge>
              ),
            },
            {
              header: "Actions",
              accessorKey: "actions",
              cell: ({ row }) => (
                <div className="space-x-2">
                  <Button
                    onClick={() =>
                      router.push(`/settings/api-keys/${row.original.id}`)
                    }
                    variant="outline"
                    size="sm"
                  >
                    Stats
                  </Button>
                  <Button
                    onClick={() => deleteApiKey(row.original.id)}
                    variant="destructive"
                    size="sm"
                  >
                    Delete
                  </Button>
                </div>
              ),
            },
          ]}
          data={apiKeys}
        />
      </div>
    </div>
  );
}
