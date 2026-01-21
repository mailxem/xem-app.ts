"use client";

import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import Link from "next/link";
import { useApi } from "@/hooks/use-api";

export default function ForgotPasswordPage() {
  // 🔐 Form schema for forgot password
  const forgotPasswordSchema = z.object({
    email: z.string().email(),
  });

  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    defaultValues: {
      email: "",
    },
    mode: "onBlur",
    resolver: zodResolver(forgotPasswordSchema),
  });

  const { apiFetch } = useApi();

  // 📧 Handle forgot password submission
  const handleForgotPassword = async (
    data: z.infer<typeof forgotPasswordSchema>
  ) => {
    try {
      const response = await apiFetch("auth/password-reset", {
        method: "POST",
        requireAuth: false,
        body: JSON.stringify(data),
      });
      const result = await response.json();
      toast.success("Password reset email sent", {
        description: "Please check your email for instructions",
      });
    } catch (error) {
      toast.error("Error sending reset email", {
        description: "Please try again later",
      });
    }
  };

  return (
    <div className="flex items-center justify-center bg-transparent w-full md:w-1/2 mx-auto">
      <div className="w-full bg-transparent p-8">
        <div className="mb-8 grid gap-4">
          <div className="grid">
            <h1 className="text-4xl text-center dark:text-foreground text-white">
              Forgot Password 🫡
            </h1>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleForgotPassword)}
                className="space-y-6 mx-auto w-[400px] mt-4"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Enter your email"
                          type="email"
                          {...field}
                          className="!rounded-xl dark:text-foreground text-white !border-none"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <button type="submit"></button>
              </form>
            </Form>
            <div className="flex items-center justify-center w-[400px] mx-auto gap-4 mt-2">
              <Link
                className="text-left text-sm dark:text-foreground text-white w-full hover:underline"
                href={"/auth/login"}
              >
               login
              </Link>
              <div className="text-right text-sm dark:text-foreground text-white w-full">
                press ⏎ to confirm{" "}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
