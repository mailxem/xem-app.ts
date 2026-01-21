"use client";

import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useApi } from "@/hooks/use-api";
import { TeamInviteVerifyResponse } from "@/lib";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function AcceptInvitePage() {
  const { code } = useParams();
  const { apiFetch } = useApi();

  const { data: inviteData, isLoading } = useQuery<TeamInviteVerifyResponse>({
    queryKey: ["invite", code],
    queryFn: () => apiFetch(`auth/invite/${code}`, {
      method: "GET",
      requireAuth: false,
    }).then(res => res.json()),
    enabled: !!code,
    select: (data) => data,
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!inviteData?.valid || inviteData?.expires_at < new Date()) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-[400px]">
          <CardHeader>
            <CardTitle>Invalid Invitation</CardTitle>
            <CardDescription>
              This invitation link is invalid or has expired.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center bg-transparent w-full md:w-1/2 mx-auto">
      <div className="w-full bg-transparent p-8">
        <div className="mb-8 grid gap-4">
          <div className="grid">
            <h1 className="text-2xl text-center dark:text-foreground text-white">
              hey {inviteData?.name}, <br /> <span className="text-base">accept the invite to join <span className="font-medium text-primary">{inviteData?.team_name}</span></span>
            </h1>
            {inviteData?.valid && <div className="text-center text-muted-foreground ">
              <Link href={"/auth/register"}>
                <div className="cursor-pointer flex mx-auto justify-center items-center w-fit !rounded-xl bg-background gap-2 text-sm dark:text-foreground px-5 py-2 mt-8">
                  <div>Accept Invite</div>
                </div>
              </Link>
              <Link href={"/auth/login"}>
                <div className="cursor-pointer flex mx-auto justify-center items-center w-fit gap-2 text-sm dark:text-foreground text-white mt-2">
                  <div>reject invite</div>
                </div>
              </Link>
            </div>}
          </div>
        </div>
      </div>
    </div>
  );
}
