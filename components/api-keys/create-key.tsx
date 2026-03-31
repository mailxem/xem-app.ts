"use client";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Form } from "../ui/form";
import { FormField } from "../ui/form";
import { FormItem } from "../ui/form";
import { FormLabel } from "../ui/form";
import { FormControl } from "../ui/form";
import { FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Popover, PopoverContent } from "../ui/popover";
import { PopoverTrigger } from "../ui/popover";
import { useApi } from "@/hooks/use-api";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useState } from "react";
import { Calendar } from "../ui/calendar";

export const CreateKeyFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  expiresAt: z
    .date()
    .optional()
    .refine((date) => date && date > new Date(), {
      message: "Expiration date must be in the future",
    }),
});

export function CreateKey() {
  const [isCreateKeyOpen, setIsCreateKeyOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof CreateKeyFormSchema>>({
    resolver: zodResolver(CreateKeyFormSchema),
    defaultValues: {
      name: "",
      expiresAt: new Date(new Date().setDate(new Date().getDate() + 9000)),
    },
  });

  const { apiFetch } = useApi();

  const createApiKey = async (values: z.infer<typeof CreateKeyFormSchema>) => {
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

      toast.success("API key created successfully");
    } catch (error) {
      toast.error("Failed to create API key");
    } finally {
      setIsCreateKeyOpen(false);
      setIsLoading(false);
    }
  };

  return (
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
                            "w-full justify-start text-left font-normal",
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
                                    new Date(field.value).getDate() + 90,
                                  ),
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
  );
}
