"use client";

import { useState, useEffect, use } from "react";
import { Input } from "@/components/ui/input";
import { Mail, Lock, EyeIcon, EyeOffIcon } from "lucide-react";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import GoogleIcon from "@/components/icon/GoogleIcon";

export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error: string; code: string }>;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showError, setShowError] = useState(false);
  const [showEmailLogin, setShowEmailLogin] = useState(false);
  const router = useRouter();
  const { error, code } = use(searchParams);
  const [showPassword, setShowPassword] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    if (error === "CredentialsSignin" && code === "credentials") {
      setShowError(true);
      // Clear the URL parameters
      router.replace("/auth/login");
    }
  }, [error, code, router]);

  if (session) {
    redirect("/");
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    return await signIn("credentials", {
      email,
      password,
      redirect: true,
      callbackUrl: "/",
    });
  };

  return (
    <div className="flex items-center justify-center bg-transparent w-full md:w-1/2 mx-auto">
      <div className="w-full bg-transparent p-8">
        <div className="mb-8 grid gap-4">
          <div className="grid">
            <h1 className="text-4xl text-center dark:dark:text-foreground text-white text-white">
              Welcome back
            </h1>
            <div className="text-center">
              <div
                className="cursor-pointer flex mx-auto justify-center text-sm items-center w-fit !rounded-xl border border-white bg-background gap-2 px-5 py-2 mt-8"
                onClick={() => signIn("google")}
              >
                <GoogleIcon />
                <span>Login with Google</span>
              </div>
            </div>

            <div className="mx-auto w-[400px] mt-4">
              {showError && (
                <div className="mb-4 p-3 text-sm text-red-500 bg-red-50 rounded-md">
                  Invalid email or password. Please try again.
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      className="pl-9 !rounded-xl !border-none"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-foreground" />
                    <Input
                      placeholder="Enter your password"
                      id="password"
                      type={showPassword ? "text" : "password"}
                      className="pl-9 !rounded-xl !border-none"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <div
                      className="absolute right-2 top-3 cursor-pointer"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {!showPassword ? (
                        <EyeIcon size={20} className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <EyeOffIcon
                          size={20}
                          className="h-4 w-4 text-muted-foreground"
                        />
                      )}
                    </div>
                  </div>
                </div>
                <button type="submit">Sign in</button>
              </form>
              <div className="flex items-center justify-center gap-4 mt-2">
                <Link
                  className="text-left text-sm dark:text-foreground text-white w-full hover:underline"
                  href="/auth/forgot-password"
                >
                  Forgot password?
                </Link>
                <div className="text-right text-sm dark:text-foreground text-white w-full">

                </div>
              </div>
              <div className="text-center mt-4">
                <span className="text-sm dark:text-foreground text-white">
                  Don't have an account?{" "}
                  <Link href="/auth/register" className="text-sm hover:underline">
                    Sign up
                  </Link>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
