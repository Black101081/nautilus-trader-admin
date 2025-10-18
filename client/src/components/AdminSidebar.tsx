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
  Zap,
  Key,
  AlertTriangle,
  TrendingUp,
  Cpu,
  Wifi,
  Lock,
  BookOpen,
  FileText,
  GitBranch,
  Layers,
  Home,
  Cog,
  Package,
  HardDrive,
  Archive,
  CloudCog,
  BarChart2,
  FileBarChart,
  UserCog,
  ShieldCheck,
  Terminal,
  Globe,
  HelpCircle,
  Wrench,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";

interface NavItem {
  title: string;
  icon: any;
  href: string;
  badge?: string;
  badgeVariant?: "default" | "success" | "warning" | "error";
}

interface NavSection {
  title: string;
  icon?: any;
  items: NavItem[];
  priority?: "critical" | "high" | "medium" | "low";
}

// Reorganized navigation based on BA document and audit report
const navSections: NavSection[] = [
  // DASHBOARD
  {
    title: "Dashboard",
    icon: Home,
    priority: "critical",
    items: [
      { 
        title: "System Overview", 
        icon: Server, 
        href: "/admin/system",
        badge: "Live",
        badgeVariant: "success"
      },
    ],
  },
  
  // NAUTILUS CORE MANAGEMENT (Priority 1 - CRITICAL)
  {
    title: "Nautilus Core",
    icon: Cpu,
    priority: "critical",
    items: [
      { 
        title: "Core Components", 
        icon: Package, 
        href: "/admin/system",
        badge: "6",
        badgeVariant: "default"
      },
      { 
        title: "Features & Services", 
        icon: Cog, 
        href: "/admin/core",
        badge: "New",
        badgeVariant: "warning"
      },
      { 
        title: "Component Health", 
        icon: Activity, 
        href: "/admin/health",
        badge: "New",
        badgeVariant: "warning"
      },
      { 
        title: "System Configuration", 
        icon: Wrench, 
        href: "/admin/settings"
      },
    ],
  },
  
  // TRADING INFRASTRUCTURE (Priority 2 - HIGH)
  {
    title: "Trading Infrastructure",
    icon: TrendingUp,
    priority: "high",
    items: [
      { 
        title: "Data Feeds", 
        icon: Wifi, 
        href: "/admin/feeds",
        badge: "14+",
        badgeVariant: "default"
      },
      { 
        title: "Execution Engine", 
        icon: Zap, 
        href: "/admin/execution"
      },
      { 
        title: "Risk Management", 
        icon: Shield, 
        href: "/admin/risk",
        badge: "Critical",
        badgeVariant: "error"
      },
      { 
        title: "Broker Integration", 
        icon: Layers, 
        href: "/admin/brokers",
        badge: "14+",
        badgeVariant: "default"
      },
    ],
  },
  
  // DATA & STORAGE (Priority 3 - MEDIUM)
  {
    title: "Data & Storage",
    icon: Database,
    priority: "medium",
    items: [
      { 
        title: "Database Management", 
        icon: HardDrive, 
        href: "/admin/database",
        badge: "4",
        badgeVariant: "default"
      },
      { 
        title: "Data Archive", 
        icon: Archive, 
        href: "/admin/archive"
      },
      { 
        title: "Cache Management", 
        icon: CloudCog, 
        href: "/admin/cache"
      },
    ],
  },
  
  // ANALYTICS & MONITORING (Priority 3 - MEDIUM)
  {
    title: "Analytics & Monitoring",
    icon: BarChart3,
    priority: "medium",
    items: [
      { 
        title: "System Analytics", 
        icon: BarChart2, 
        href: "/admin/analytics"
      },
      { 
        title: "Trading Analytics", 
        icon: FileBarChart, 
        href: "/admin/trading-analytics"
      },
      { 
        title: "Audit Logs", 
        icon: FileCheck, 
        href: "/admin/logs"
      },
    ],
  },
  
  // USER & ACCESS (Priority 4 - LOW)
  {
    title: "User & Access",
    icon: Users,
    priority: "low",
    items: [
      { 
        title: "Users & Roles", 
        icon: UserCog, 
        href: "/admin/users"
      },
      { 
        title: "Access Control", 
        icon: ShieldCheck, 
        href: "/admin/access"
      },
      { 
        title: "API Keys", 
        icon: Key, 
        href: "/admin/api-keys"
      },
    ],
  },
  
  // DOCUMENTATION (Priority 5 - LOW)
  {
    title: "Documentation",
    icon: BookOpen,
    priority: "low",
    items: [
      { 
        title: "Getting Started", 
        icon: BookOpen, 
        href: "/docs/getting-started"
      },
      { 
        title: "Architecture", 
        icon: GitBranch, 
        href: "/docs/architecture"
      },
      { 
        title: "API Reference", 
        icon: Terminal, 
        href: "/docs/api"
      },
      { 
        title: "User Guide", 
        icon: FileText, 
        href: "/docs/user-guide"
      },
      { 
        title: "Troubleshooting", 
        icon: AlertTriangle, 
        href: "/docs/troubleshooting"
      },
      { 
        title: "FAQ", 
        icon: HelpCircle, 
        href: "/docs/faq"
      },
    ],
  },
];

// Priority colors
const priorityColors = {
  critical: "text-red-500",
  high: "text-orange-500",
  medium: "text-yellow-500",
  low: "text-gray-500",
};

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
              <p className="text-xs text-muted-foreground">NautilusTrader</p>
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
          {navSections.map((section, sectionIdx) => {
            const SectionIcon = section.icon;
            return (
              <div key={sectionIdx} className="py-2">
                {!collapsed && (
                  <div className="mb-2 px-3 flex items-center gap-2">
                    {SectionIcon && (
                      <SectionIcon className={cn(
                        "h-3.5 w-3.5",
                        section.priority && priorityColors[section.priority]
                      )} />
                    )}
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {section.title}
                    </p>
                  </div>
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
                        {!collapsed && (
                          <>
                            <span className="flex-1 text-left">{item.title}</span>
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
              </div>
            );
          })}
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

