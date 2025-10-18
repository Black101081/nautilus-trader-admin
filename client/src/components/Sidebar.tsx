import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  TrendingUp,
  Activity,
  ListOrdered,
  History,
  FlaskConical,
  Zap,
  Target,
  Code2,
  Library,
  Rocket,
  BarChart3,
  Shield,
  FileText,
  BookOpen,
  Settings,
  Users,
  Server,
  FileCheck,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { useAuth } from "@/_core/hooks/useAuth";

interface NavItem {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  badge?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
  adminOnly?: boolean;
}

const navSections: NavSection[] = [
  {
    title: "Dashboard",
    items: [
      { title: "Overview", icon: LayoutDashboard, href: "/dashboard" },
      { title: "Portfolio", icon: TrendingUp, href: "/portfolio" },
      { title: "Market Watch", icon: Activity, href: "/market" },
    ],
  },
  {
    title: "Trading",
    items: [
      { title: "Live Trading", icon: Activity, href: "/live", badge: "Live" },
      { title: "Positions", icon: ListOrdered, href: "/positions" },
      { title: "Orders", icon: Target, href: "/orders" },
      { title: "Trade History", icon: History, href: "/trades" },
    ],
  },
  {
    title: "Backtesting",
    items: [
      { title: "Quick Backtest", icon: Zap, href: "/demo" },
      { title: "Advanced Backtest", icon: FlaskConical, href: "/advanced-backtest" },
      { title: "Walk-Forward", icon: Target, href: "/walk-forward" },
      { title: "Optimization", icon: Settings, href: "/optimization" },
    ],
  },
  {
    title: "Strategies",
    items: [
      { title: "My Strategies", icon: Code2, href: "/strategies" },
      { title: "Strategy Builder", icon: Code2, href: "/builder" },
      { title: "Strategy Library", icon: Library, href: "/library" },
      { title: "Deploy Strategy", icon: Rocket, href: "/deploy" },
    ],
  },
  {
    title: "Analytics",
    items: [
      { title: "Performance", icon: BarChart3, href: "/performance" },
      { title: "Risk Analysis", icon: Shield, href: "/risk" },
      { title: "Reports", icon: FileText, href: "/reports" },
      { title: "Trade Journal", icon: BookOpen, href: "/journal" },
    ],
  },
  {
    title: "Admin - System Management",
    adminOnly: true,
    items: [
      { title: "System Overview", icon: Server, href: "/admin/system" },
      { title: "User Management", icon: Users, href: "/admin/users" },
      { title: "Audit Logs", icon: FileCheck, href: "/admin/logs" },
      { title: "Configuration", icon: Settings, href: "/admin/config" },
    ],
  },
  {
    title: "Resources",
    items: [
      { title: "Documentation", icon: BookOpen, href: "/docs" },
      { title: "Tutorials", icon: BookOpen, href: "/tutorials" },
      { title: "API Reference", icon: Code2, href: "/api-docs" },
    ],
  },
];

export function Sidebar() {
  const [location] = useLocation();
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
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

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
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold">NautilusTrader</h1>
              <p className="text-xs text-muted-foreground">v1.220.0</p>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-2">
        {navSections.map((section) => {
          // Skip admin sections if user is not admin
          if (section.adminOnly && !isAdmin) return null;

          return (
            <div key={section.title} className="mb-4">
              {!collapsed && (
                <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {section.title}
                </h3>
              )}
              <div className="space-y-1">
                {section.items.map((item) => {
                  const isActive = location === item.href;
                  const Icon = item.icon;

                  return (
                    <Link key={item.href} href={item.href}>
                      <a
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                          isActive
                            ? "bg-blue-500/10 text-blue-500 font-medium"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                        title={collapsed ? item.title : undefined}
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        {!collapsed && (
                          <>
                            <span className="flex-1">{item.title}</span>
                            {item.badge && (
                              <span className="rounded-full bg-green-500/20 px-2 py-0.5 text-xs font-medium text-green-500">
                                {item.badge}
                              </span>
                            )}
                          </>
                        )}
                      </a>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="border-t border-border/40 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/20 text-sm font-medium text-blue-500">
              {user?.name?.[0] || "U"}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-medium">{user?.name || "User"}</p>
              <p className="truncate text-xs text-muted-foreground">
                {user?.role === "admin" ? "Administrator" : "Trader"}
              </p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}

