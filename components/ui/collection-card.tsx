import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";

/** Shared collection layout for templates, contact lists, and campaigns. */
export function CollectionCard({ icon, badge, title, href, description, children, action, menu, onAction }: {
  icon: ReactNode;
  badge?: ReactNode;
  title: string;
  href?: string;
  onAction?: () => void;
  description?: string;
  children?: ReactNode;
  action: string;
  menu?: ReactNode;
}) {
  return <article className="group flex min-w-0 flex-col rounded-[20px] border border-border bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
    <div className="mb-5 flex items-center justify-between gap-3">
      <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-violet-100 bg-violet-50 text-violet-500">{icon}</span>
      {badge && <span className="rounded-full bg-muted px-2.5 py-1 text-[11px] text-muted-foreground">{badge}</span>}
    </div>
    <div className="flex-1">
      <h3 className="mb-1 break-words text-base font-semibold tracking-tight">{href ? <Link href={href} className="hover:text-primary">{title}</Link> : title}</h3>
      {description && <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>}
      {children}
    </div>
    <div className="mt-5 flex items-center justify-between gap-3 border-t border-border pt-4">
      {href ? <Link href={href} className="inline-flex items-center gap-2 text-xs font-medium text-primary">{action}<ArrowUpRight size={14}/></Link> : <button type="button" onClick={onAction} className="inline-flex items-center gap-2 text-xs font-medium text-primary">{action}<ArrowUpRight size={14}/></button>}
      {menu}
    </div>
  </article>;
}
