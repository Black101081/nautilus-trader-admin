import { cn } from "@/lib/utils";
import { useLocation } from "wouter";
import {
  Server,
  Users,
  FileCheck,
  Settings,
  Database,
  Activity,
  Shield,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";

interface NavItem {
  title: string;
  icon: any;
  href: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    title: "System Management",
    items: [
      { title: "System Overview", icon: Server, href: "/admin/system" },
      { title: "Core Management", icon: Activity, href: "/admin/core" },
      { title: "Component Health", icon: Activity, href: "/admin/health" },
      { title: "Data Feeds", icon: Database, href: "/admin/feeds" },
      { title: "Database Management", icon: Database, href: "/admin/database" },
    ],
  },
  {
    title: "User Management",
    items: [
      { title: "Users & Roles", icon: Users, href: "/admin/users" },
      { title: "Access Control", icon: Shield, href: "/admin/access" },
      { title: "API Keys", icon: Settings, href: "/admin/api-keys" },
    ],
  },
  {
    title: "Monitoring & Compliance",
    items: [
      { title: "Audit Logs", icon: FileCheck, href: "/admin/logs" },
      { title: "Risk Controls", icon: Shield, href: "/admin/risk" },
      { title: "Analytics", icon: BarChart3, href: "/admin/analytics" },
    ],
  },
  {
    title: "Configuration",
    items: [
      { title: "System Settings", icon: Settings, href: "/admin/settings" },
      { title: "Broker Integration", icon: Database, href: "/admin/brokers" },
    ],
  },
];

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
              <p className="text-xs text-muted-foreground">System Management</p>
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
          {navSections.map((section, sectionIdx) => (
            <div key={sectionIdx} className="py-2">
              {!collapsed && (
                <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {section.title}
                </p>
              )}
              <div className="space-y-1">
                {section.items.map((item, itemIdx) => {
                  const Icon = item.icon;
                  const isActive = location === item.href;
                  return (
                    <button
                      key={itemIdx}
                      onClick={() => setLocation(item.href)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-blue-500/10 text-blue-500"
                          : "text-muted-foreground hover:bg-accent hover:text-foreground"
                      )}
                    >
                      <Icon className={cn("h-5 w-5 flex-shrink-0", isActive && "text-blue-500")} />
                      {!collapsed && <span>{item.title}</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
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

