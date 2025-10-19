import { cn } from "@/lib/utils";
import { useLocation } from "wouter";
import {
  LayoutDashboard,
  Package,
  Layers,
  Plug,
  Activity,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Server,
  Database,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";

interface NavItem {
  title: string;
  icon: any;
  href: string;
  description: string;
  badge?: string;
  badgeVariant?: "default" | "success" | "warning" | "error";
}

/**
 * Simplified Admin Navigation - 6 Core Pages
 * Based on NEW_ADMIN_DESIGN_PROPOSAL.md
 */
const navItems: NavItem[] = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/admin",
    description: "System overview & quick actions",
    badge: "Live",
    badgeVariant: "success",
  },
  {
    title: "Components",
    icon: Package,
    href: "/admin/components-page",
    description: "Manage 6 core components",
    badge: "6",
    badgeVariant: "default",
  },
  {
    title: "Features & Services",
    icon: Layers,
    href: "/admin/features",
    description: "64 features + 126 services",
    badge: "190",
    badgeVariant: "default",
  },
  {
    title: "Adapters",
    icon: Plug,
    href: "/admin/adapters",
    description: "Data & execution connections",
    badge: "14",
    badgeVariant: "default",
  },
  {
    title: "Monitoring",
    icon: Activity,
    href: "/admin/monitoring",
    description: "Logs, metrics & diagnostics",
  },
  {
    title: "Database",
    icon: Database,
    href: "/admin/database",
    description: "PostgreSQL, Parquet, Redis",
    badge: "3",
    badgeVariant: "default",
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/admin/settings-page",
    description: "System config & user management",
  },
];

// Badge variant colors
const badgeColors = {
  default: "bg-blue-500/20 text-blue-500",
  success: "bg-green-500/20 text-green-500",
  warning: "bg-yellow-500/20 text-yellow-500",
  error: "bg-red-500/20 text-red-500",
};

export function AdminSidebar() {
  const [location, setLocation] = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile and auto-collapse
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setCollapsed(true);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen border-r border-border/40 bg-background/95 backdrop-blur transition-all duration-300",
        collapsed ? "w-16" : "w-64",
        isMobile && !collapsed && "shadow-2xl"
      )}
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-between border-b border-border/40 px-4">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600">
              <Server className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold">Admin Panel</p>
              <p className="text-xs text-muted-foreground">Nautilus Trader</p>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <div className="flex flex-col h-[calc(100vh-4rem)]">
        <nav className="flex-1 space-y-1 overflow-y-auto p-2">
          {!collapsed && (
            <div className="mb-4 px-3 py-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Main Navigation
              </p>
            </div>
          )}
          
          <div className="space-y-1">
            {navItems.map((item, idx) => {
              const Icon = item.icon;
              const isActive = location === item.href;
              
              return (
                <button
                  key={idx}
                  onClick={() => setLocation(item.href)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                    isActive
                      ? "bg-blue-500/10 text-blue-500 shadow-sm"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                  title={collapsed ? item.title : undefined}
                >
                  <Icon className={cn("h-5 w-5 flex-shrink-0", isActive && "text-blue-500")} />
                  {!collapsed && (
                    <>
                      <div className="flex-1 text-left">
                        <div className="font-medium">{item.title}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {item.description}
                        </div>
                      </div>
                      {item.badge && (
                        <span className={cn(
                          "rounded-full px-2 py-0.5 text-xs font-medium",
                          badgeColors[item.badgeVariant || "default"]
                        )}>
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </button>
              );
            })}
          </div>

          {/* Component Showcase Link (Dev Only) */}
          {!collapsed && (
            <div className="mt-6 px-3 py-2 border-t border-border/40">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Development
              </p>
              <button
                onClick={() => setLocation("/admin/components")}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
              >
                <Package className="h-4 w-4" />
                <span>Component Showcase</span>
              </button>
            </div>
          )}
        </nav>

        {/* Footer */}
        <div className="border-t border-border/40 p-2">
          <button
            onClick={() => setLocation("/")}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            {!collapsed && <span>Exit Admin</span>}
          </button>
        </div>
      </div>
    </aside>
  );
}

