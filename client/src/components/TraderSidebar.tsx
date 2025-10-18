import { cn } from "@/lib/utils";
import { useLocation } from "wouter";
import {
  LayoutDashboard,
  TrendingUp,
  Activity,
  Target,
  ShoppingCart,
  History,
  Zap,
  FlaskConical,
  TrendingDown,
  Settings as SettingsIcon,
  Code,
  BookOpen,
  Library,
  Rocket,
  BarChart3,
  Shield,
  FileText,
  BookMarked,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

interface NavItem {
  title: string;
  icon: any;
  href: string;
  badge?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
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
      { title: "Live Trading", icon: Zap, href: "/live", badge: "Live" },
      { title: "Positions", icon: Target, href: "/positions" },
      { title: "Orders", icon: ShoppingCart, href: "/orders" },
      { title: "Trade History", icon: History, href: "/trades" },
    ],
  },
  {
    title: "Backtesting",
    items: [
      { title: "Quick Backtest", icon: Zap, href: "/demo" },
      { title: "Advanced Backtest", icon: FlaskConical, href: "/advanced-backtest" },
      { title: "Walk-Forward", icon: TrendingDown, href: "/walk-forward" },
      { title: "Optimization", icon: SettingsIcon, href: "/optimization" },
    ],
  },
  {
    title: "Strategies",
    items: [
      { title: "My Strategies", icon: Code, href: "/strategies" },
      { title: "Strategy Builder", icon: Code, href: "/builder" },
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
      { title: "Trade Journal", icon: BookMarked, href: "/journal" },
    ],
  },
  {
    title: "Resources",
    items: [
      { title: "Documentation", icon: BookOpen, href: "/docs" },
    ],
  },
];

export function TraderSidebar() {
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
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-green-600">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold">Trading Platform</p>
              <p className="text-xs text-muted-foreground">v1.220.0</p>
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
                          ? "bg-green-500/10 text-green-500"
                          : "text-muted-foreground hover:bg-accent hover:text-foreground"
                      )}
                    >
                      <Icon className={cn("h-5 w-5 flex-shrink-0", isActive && "text-green-500")} />
                      {!collapsed && (
                        <span className="flex-1 text-left">{item.title}</span>
                      )}
                      {!collapsed && item.badge && (
                        <Badge variant="outline" className="ml-auto bg-green-500/20 text-green-500 text-xs">
                          {item.badge}
                        </Badge>
                      )}
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
            {!collapsed && <span>Exit Platform</span>}
          </button>
        </div>
      </div>
    </aside>
  );
}

