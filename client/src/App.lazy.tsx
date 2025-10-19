import React, { Suspense, lazy } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { Loader2 } from "lucide-react";

// Eager load critical pages
import Landing from "./pages/Landing";
import NotFound from "@/pages/NotFound";

// Lazy load all other pages
const Home = lazy(() => import("./pages/Home"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Demo = lazy(() => import("./pages/Demo"));
const Docs = lazy(() => import("./pages/Docs"));
const StrategyBuilder = lazy(() => import("./pages/StrategyBuilder"));
const Reports = lazy(() => import("./pages/Reports"));

// Admin Pages
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminSystem = lazy(() => import("./pages/AdminSystem"));
const AdminCoreManagement = lazy(() => import("./pages/AdminCoreManagement"));
const AdminCoreTest = lazy(() => import("./pages/AdminCoreTest"));
const AdminHealth = lazy(() => import("./pages/AdminHealth"));
const AdminFeeds = lazy(() => import("./pages/AdminFeeds"));
const AdminUsers = lazy(() => import("./pages/AdminUsers"));
const AdminAccess = lazy(() => import("./pages/AdminAccess"));
const AdminAPIKeys = lazy(() => import("./pages/AdminAPIKeys"));
const AdminLogs = lazy(() => import("./pages/AdminLogs"));
const AdminRisk = lazy(() => import("./pages/AdminRisk"));
const AdminAnalytics = lazy(() => import("./pages/AdminAnalytics"));
const AdminSettings = lazy(() => import("./pages/AdminSettings"));
const AdminBrokers = lazy(() => import("./pages/AdminBrokers"));
const AdminDatabase = lazy(() => import("./pages/AdminDatabase"));
const AdminExecution = lazy(() => import("./pages/AdminExecution"));

// Trader Pages
const TraderDashboard = lazy(() => import("./pages/TraderDashboard"));
const LiveTradingNew = lazy(() => import("./pages/LiveTradingNew"));
const LiveTrading = lazy(() => import("./pages/LiveTrading"));
const AdvancedBacktest = lazy(() => import("./pages/AdvancedBacktest"));
const Portfolio = lazy(() => import("./pages/Portfolio"));
const MarketWatch = lazy(() => import("./pages/MarketWatch"));
const Positions = lazy(() => import("./pages/Positions"));
const Orders = lazy(() => import("./pages/Orders"));
const TradeHistory = lazy(() => import("./pages/TradeHistory"));
const WalkForward = lazy(() => import("./pages/WalkForward"));
const Optimization = lazy(() => import("./pages/Optimization"));
const StrategyLibrary = lazy(() => import("./pages/StrategyLibrary"));
const DeployStrategy = lazy(() => import("./pages/DeployStrategy"));
const Performance = lazy(() => import("./pages/Performance"));
const RiskAnalysis = lazy(() => import("./pages/RiskAnalysis"));
const TradeJournal = lazy(() => import("./pages/TradeJournal"));
const NautilusDemo = lazy(() => import("./pages/NautilusDemo"));

// Docs Pages
const DocsGettingStarted = lazy(() => import("./pages/DocsGettingStarted"));
const DocsArchitecture = lazy(() => import("./pages/DocsArchitecture"));
const DocsDatabase = lazy(() => import("./pages/DocsDatabase"));
const DocsAPI = lazy(() => import("./pages/DocsAPI"));
const DocsUserGuide = lazy(() => import("./pages/DocsUserGuide"));
const DocsTroubleshooting = lazy(() => import("./pages/DocsTroubleshooting"));

// Loading component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
    <span className="ml-2 text-muted-foreground">Loading...</span>
  </div>
);

function Router() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        <Route path={"/"} component={Landing} />
        <Route path={"/dashboard"} component={Dashboard} />
        <Route path={"/nautilus-demo"} component={NautilusDemo} />
        <Route path={"/home"} component={Home} />
        <Route path={"/demo"} component={Demo} />
        <Route path={"/strategies"} component={StrategyBuilder} />
        <Route path={"/reports"} component={Reports} />
        <Route path={"/docs"} component={Docs} />
        
        {/* Admin Routes */}
        <Route path={"/admin"} component={AdminDashboard} />
        <Route path={"/admin/system"} component={AdminSystem} />
        <Route path={"/admin/core"} component={AdminCoreManagement} />
        <Route path={"/admin/core-test"} component={AdminCoreTest} />
        <Route path={"/admin/health"} component={AdminHealth} />
        <Route path={"/admin/feeds"} component={AdminFeeds} />
        <Route path={"/admin/users"} component={AdminUsers} />
        <Route path={"/admin/access"} component={AdminAccess} />
        <Route path={"/admin/api-keys"} component={AdminAPIKeys} />
        <Route path={"/admin/logs"} component={AdminLogs} />
        <Route path={"/admin/risk"} component={AdminRisk} />
        <Route path={"/admin/analytics"} component={AdminAnalytics} />
        <Route path={"/admin/settings"} component={AdminSettings} />
        <Route path={"/admin/brokers"} component={AdminBrokers} />
        <Route path={"/admin/database"} component={AdminDatabase} />
        <Route path={"/admin/execution"} component={AdminExecution} />
        
        {/* Trader Routes */}
        <Route path={"/trader"} component={TraderDashboard} />
        <Route path={"/live"} component={LiveTradingNew} />
        <Route path={"/live-old"} component={LiveTrading} />
        <Route path={"/advanced-backtest"} component={AdvancedBacktest} />
        <Route path={"/portfolio"} component={Portfolio} />
        <Route path={"/market"} component={MarketWatch} />
        <Route path={"/positions"} component={Positions} />
        <Route path={"/orders"} component={Orders} />
        <Route path={"/trades"} component={TradeHistory} />
        <Route path={"/walk-forward"} component={WalkForward} />
        <Route path={"/optimization"} component={Optimization} />
        <Route path={"/library"} component={StrategyLibrary} />
        <Route path={"/deploy"} component={DeployStrategy} />
        <Route path={"/performance"} component={Performance} />
        <Route path={"/risk"} component={RiskAnalysis} />
        <Route path={"/journal"} component={TradeJournal} />
        
        {/* Docs Routes */}
        <Route path={"/docs/getting-started"} component={DocsGettingStarted} />
        <Route path={"/docs/architecture"} component={DocsArchitecture} />
        <Route path={"/docs/database"} component={DocsDatabase} />
        <Route path={"/docs/api"} component={DocsAPI} />
        <Route path={"/docs/user-guide"} component={DocsUserGuide} />
        <Route path={"/docs/troubleshooting"} component={DocsTroubleshooting} />
        
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <TooltipProvider>
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

