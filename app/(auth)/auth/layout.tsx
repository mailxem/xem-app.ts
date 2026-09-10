"use client";
import { workspaceClassName } from "@/lib/workspace-styles";
import Intercom from "@intercom/messenger-js-sdk";
import { useEffect } from "react";
import Link from "next/link";
export default function AuthLayout({children}:{children:React.ReactNode}) {
 useEffect(() => {Intercom({app_id:"ts43f4k1"});},[]);
 return <div className={workspaceClassName("auth-workspace")}><div className="mb-8 flex items-center justify-center"><Link href="/" aria-label="Xem home" className="inline-flex items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"><img src="/android-chrome-512x512.png" alt="" width={40} height={40} className="size-10 object-contain"/><span className="text-3xl font-semibold tracking-tight text-[#24212B]">Xem</span></Link></div><main className={workspaceClassName("auth-card")}>{children}</main><p className={workspaceClassName("auth-footer")}>Email, newsletters, and customer journeys. Together.</p></div>;
}
