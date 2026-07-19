"use client";

import * as React from "react";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

import { cn } from "@/lib/utils";
import { Sheet, SheetContent } from "@/components/ui/sheet";

const SIDEBAR_COOKIE_NAME = "sidebar_state";
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

type SidebarContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  isMobile: boolean;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
};

const SidebarContext = React.createContext<SidebarContextValue | null>(null);

function useSidebar() {
  const ctx = React.useContext(SidebarContext);
  if (!ctx) throw new Error("useSidebar must be used within a SidebarProvider.");
  return ctx;
}

function SidebarProvider({
  defaultOpen = true,
  children,
}: {
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpenState] = React.useState(defaultOpen);
  const [openMobile, setOpenMobile] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const setOpen = React.useCallback((value: boolean) => {
    setOpenState(value);
    document.cookie = `${SIDEBAR_COOKIE_NAME}=${value}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
  }, []);

  const toggleSidebar = React.useCallback(() => {
    if (isMobile) setOpenMobile((v) => !v);
    else setOpen(!open);
  }, [isMobile, open, setOpen]);

  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "b" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggleSidebar();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggleSidebar]);

  return (
    <SidebarContext.Provider value={{ open, setOpen, toggleSidebar, isMobile, openMobile, setOpenMobile }}>
      <div className="flex min-h-screen w-full">{children}</div>
    </SidebarContext.Provider>
  );
}

function Sidebar({ children }: { children: React.ReactNode }) {
  const { isMobile, open, openMobile, setOpenMobile } = useSidebar();

  if (isMobile) {
    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile}>
        <SheetContent side="left" className="w-64 border-sidebar-border bg-sidebar p-0 text-sidebar-foreground">
          <div className="flex h-full flex-col">{children}</div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <aside
      className={cn(
        "sticky top-0 hidden h-screen shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-[width] duration-200 md:flex",
        open ? "w-64" : "w-[4.5rem]"
      )}
    >
      {children}
    </aside>
  );
}

function SidebarInset({ children }: { children: React.ReactNode }) {
  return <div className="flex min-h-screen flex-1 flex-col bg-background">{children}</div>;
}

/** Collapse/expand toggle, meant to live inside the sidebar header next to the logo. */
function SidebarToggle({ className }: { className?: string }) {
  const { open, isMobile, toggleSidebar } = useSidebar();
  if (isMobile) return null;

  return (
    <button
      type="button"
      onClick={toggleSidebar}
      aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
      className={cn(
        "inline-flex size-7 shrink-0 items-center justify-center rounded-md border border-sidebar-border bg-sidebar-accent text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent/70 hover:text-sidebar-foreground",
        className
      )}
    >
      {open ? <PanelLeftClose className="size-3.5" /> : <PanelLeftOpen className="size-3.5" />}
    </button>
  );
}

/** Hamburger trigger for mobile, meant to live in the top bar. */
function SidebarTrigger({ className }: { className?: string }) {
  const { toggleSidebar } = useSidebar();
  return (
    <button
      type="button"
      onClick={toggleSidebar}
      aria-label="Toggle sidebar"
      className={cn(
        "inline-flex size-8 items-center justify-center rounded-md hover:bg-muted md:hidden",
        className
      )}
    >
      <PanelLeftOpen className="size-4" />
    </button>
  );
}

function SidebarHeader({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("flex flex-col gap-2 p-3", className)}>{children}</div>;
}

function SidebarFooter({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("flex flex-col gap-1 border-t border-sidebar-border p-3", className)}>{children}</div>
  );
}

function SidebarContent({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("flex flex-1 flex-col gap-1 overflow-auto p-3", className)}>{children}</div>;
}

function SidebarGroupLabel({ children }: { children: React.ReactNode }) {
  const { open, isMobile } = useSidebar();
  if (!open && !isMobile) return null;
  return (
    <div className="px-3 pb-2 pt-4 text-xs font-semibold uppercase tracking-wider text-sidebar-muted-foreground first:pt-0">
      {children}
    </div>
  );
}

function SidebarMenu({ children }: { children: React.ReactNode }) {
  return <ul className="flex flex-col gap-1">{children}</ul>;
}

function SidebarMenuItem({ children }: { children: React.ReactNode }) {
  return <li>{children}</li>;
}

type SidebarMenuButtonProps = {
  asChild?: boolean;
  isActive?: boolean;
  onClick?: () => void;
  label?: string;
  className?: string;
  children: React.ReactNode;
};

function SidebarMenuButton({ asChild, isActive, onClick, label, className, children }: SidebarMenuButtonProps) {
  const { open, isMobile } = useSidebar();
  const collapsed = !open && !isMobile;

  const classes = cn(
    "flex h-10 w-full items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors [&_svg]:size-[18px] [&_svg]:shrink-0",
    isActive
      ? "bg-sidebar-primary text-sidebar-primary-foreground"
      : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground",
    collapsed && "justify-center px-0",
    className
  );

  const title = collapsed ? label : undefined;

  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<{ className?: string; title?: string }>;
    return React.cloneElement(child, {
      className: cn(classes, child.props.className),
      title,
    });
  }

  return (
    <button type="button" title={title} onClick={onClick} className={classes}>
      {children}
    </button>
  );
}

export {
  SidebarProvider,
  Sidebar,
  SidebarInset,
  SidebarToggle,
  SidebarTrigger,
  SidebarHeader,
  SidebarFooter,
  SidebarContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
};
