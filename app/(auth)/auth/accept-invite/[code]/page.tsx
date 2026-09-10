"use client";
import { useState } from "react";
import { useApi } from "@/hooks/use-api";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { QueryState } from "@/components/marketing/shared";
import { toast } from "sonner";
interface Invite {valid:boolean;expires_at:string;name:string;team_name:string}
export default function AcceptInvitePage(){
 const {code}=useParams<{code:string}>();const router=useRouter();const {apiFetch}=useApi();
 const [password,setPassword]=useState("");const [confirm,setConfirm]=useState("");const [busy,setBusy]=useState(false);
 const query=useQuery<Invite>({queryKey:["invite",code],enabled:!!code,retry:1,queryFn:async({signal})=>{
  const response=await apiFetch(`auth/invite/${encodeURIComponent(code)}`,{requireAuth:false,signal});
  if(!response.ok)throw new Error("This invitation is unavailable or has expired.");
  return response.json();
 }});
 const accept=async(event:React.FormEvent)=>{
  event.preventDefault();if(password!==confirm){toast.error("Passwords do not match");return;}setBusy(true);
  try{const response=await apiFetch(`auth/accept/${encodeURIComponent(code)}`,{method:"POST",requireAuth:false,body:JSON.stringify({password})});const result=await response.json();if(!response.ok)throw new Error(result.error || "Unable to accept invitation");toast.success("Invitation accepted. Sign in to your workspace.");router.push("/auth/login");}catch(error){toast.error((error as Error).message);}finally{setBusy(false);}
 };
 if(query.isPending || query.error)return <div className="p-6"><QueryState loading={query.isPending} error={query.error} retry={()=>void query.refetch()}/><Button variant="link" asChild><Link href="/auth/login">Back to sign in</Link></Button></div>;
 if(!query.data.valid || Date.parse(query.data.expires_at)<=Date.now())return <div className="space-y-4 p-8 text-center"><h1>Invitation expired</h1><p className="text-sm text-muted-foreground">Ask your workspace administrator for a new invitation.</p><Button variant="outline" asChild><Link href="/auth/login">Back to sign in</Link></Button></div>;
 return <div className="space-y-6 p-6 sm:p-8"><div className="space-y-2 text-center"><h1>Join {query.data.team_name}</h1><p className="text-sm text-muted-foreground">Welcome, {query.data.name}. Set a password to accept your invitation.</p></div><form onSubmit={accept} className="space-y-4"><div className="space-y-2"><Label htmlFor="invite-password">Password</Label><Input id="invite-password" type="password" autoComplete="new-password" required minLength={8} maxLength={72} value={password} onChange={e=>setPassword(e.target.value)}/></div><div className="space-y-2"><Label htmlFor="invite-confirm">Confirm password</Label><Input id="invite-confirm" type="password" autoComplete="new-password" required minLength={8} maxLength={72} value={confirm} onChange={e=>setConfirm(e.target.value)}/></div><Button type="submit" disabled={busy}>{busy?"Joining workspace…":"Accept invitation"}</Button></form><Button variant="link" asChild className="w-full"><Link href="/auth/login">Back to sign in</Link></Button></div>;
}
