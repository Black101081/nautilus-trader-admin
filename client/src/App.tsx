import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Landing from "./pages/Landing";
import Demo from "./pages/Demo";
import Docs from "./pages/Docs";
import StrategyBuilder from "./pages/StrategyBuilder";
import Reports from "./pages/Reports";
// New Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import ComponentsPage from "./pages/admin/ComponentsPage";
import FeaturesPage from "./pages/admin/FeaturesPage";
import ComponentShowcase from "./pages/admin/ComponentShowcase";

// Trader Dashboard
import TraderDashboard from "./pages/TraderDashboard";
import LiveTrading from "./pages/LiveTrading";
import LiveTradingNew from "./pages/LiveTradingNew";
import AdvancedBacktest from "./pages/AdvancedBacktest";
import Portfolio from "./pages/Portfolio";
import MarketWatch from "./pages/MarketWatch";
import Positions from "./pages/Positions";
import Orders from "./pages/Orders";
import TradeHistory from "./pages/TradeHistory";
import WalkForward from "./pages/WalkForward";
import Optimization from "./pages/Optimization";
import StrategyLibrary from "./pages/StrategyLibrary";
import DeployStrategy from "./pages/DeployStrategy";
import Performance from "./pages/Performance";
import RiskAnalysis from "./pages/RiskAnalysis";
import TradeJournal from "./pages/TradeJournal";
// Old admin pages moved to admin-old/ directory
import DocsGettingStarted from "./pages/DocsGettingStarted";
import DocsArchitecture from "./pages/DocsArchitecture";
import DocsDatabase from "./pages/DocsDatabase";
import DocsAPI from "./pages/DocsAPI";
import DocsUserGuide from "./pages/DocsUserGuide";
import DocsTroubleshooting from "./pages/DocsTroubleshooting";
import NautilusDemo from "./pages/NautilusDemo";
// import MyStrategies from "./pages/MyStrategies"; // Disabled - has TypeScript errors
// import QuickBacktest from "./pages/QuickBacktest"; // Disabled - has TypeScript errors

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Landing} />
      <Route path={"/dashboard"} component={Dashboard} />
      <Route path={"/nautilus-demo"} component={NautilusDemo} />
      <Route path={"/home"} component={Home} />
      <Route path={"/demo"} component={Demo} />
      <Route path={"/strategies"} component={StrategyBuilder} />
      <Route path={"/reports"} component={Reports} />
      <Route path={"/docs"} component={Docs} />
      {/* New Admin Routes - 6 Pages */}
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/components-page" component={ComponentsPage} />
      <Route path="/admin/features" component={FeaturesPage} />
      <Route path="/admin/components" component={ComponentShowcase} />
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

      {/* Old admin routes removed - pages moved to admin-old/ */}
      <Route path="/admin/docs/getting-started" component={DocsGettingStarted} />
      <Route path={"/admin/docs/architecture"} component={DocsArchitecture} />
      <Route path={"/admin/docs/database"} component={DocsDatabase} />
      <Route path={"/admin/docs/api"} component={DocsAPI} />
      <Route path={"/admin/docs/user-guide"} component={DocsUserGuide} />
      <Route path={"/admin/docs/troubleshooting"} component={DocsTroubleshooting} />
      {/* <Route path={"/my-strategies"} component={MyStrategies} /> */}
      {/* <Route path={"/quick-backtest"} component={QuickBacktest} /> */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="dark"
        switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
