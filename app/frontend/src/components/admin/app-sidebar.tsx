"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Dumbbell, LogOut } from "lucide-react";

import { adminNav } from "@/lib/nav";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarToggle,
  useSidebar,
} from "@/components/ui/sidebar";

function Logo() {
  return (
    <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
      <Dumbbell className="size-4" />
    </div>
  );
}

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { open, isMobile, toggleSidebar } = useSidebar();
  const collapsed = !open && !isMobile;

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <Sidebar>
      <SidebarHeader>
        {collapsed ? (
          <button
            type="button"
            onClick={toggleSidebar}
            className="flex items-center justify-center py-1"
            aria-label="Expand sidebar"
          >
            <Logo />
          </button>
        ) : (
          <div className="flex items-center justify-between gap-2">
            <Link href="/dashboard" className="flex min-w-0 items-center gap-2">
              <Logo />
              <div className="grid min-w-0 flex-1 text-left leading-tight">
                <span className="truncate text-sm font-semibold">GMS Admin</span>
                <span className="truncate text-xs text-sidebar-muted-foreground">Gym Management</span>
              </div>
            </Link>
            <SidebarToggle />
          </div>
        )}
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroupLabel>Menu</SidebarGroupLabel>
        <SidebarMenu>
          {adminNav.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton asChild isActive={isActive} label={item.title}>
                  <Link href={item.href}>
                    <item.icon />
                    <span className={collapsed ? "sr-only" : ""}>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout} label="Logout">
              <LogOut />
              <span className={collapsed ? "sr-only" : ""}>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
