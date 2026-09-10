"use client";
import { workspaceClassName } from "@/lib/workspace-styles";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
interface PageHeaderProps { heading:string; description?:string; backButton?:{href:string;label:string}; className?:string; children?:React.ReactNode; }
export function PageHeader({heading,description,backButton,className,children}:PageHeaderProps) {
 return <div className={workspaceClassName(cn("product-heading workspace-page-heading",className))}>
  <div>{backButton && <Link className={workspaceClassName("workspace-back-link")} href={backButton.href}><ChevronLeft size={14}/>{backButton.label}</Link>}<h1>{heading}</h1>{description && <p>{description}</p>}</div>
  {children && <div className={workspaceClassName("workspace-heading-actions")}>{children}</div>}
 </div>;
}
export type {PageHeaderProps};
