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
import AdminDashboard from "./pages/AdminDashboard";
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
import AdminSystem from "./pages/AdminSystem";
import AdminCoreManagement from "./pages/AdminCoreManagement";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Landing} />
      <Route path={"/dashboard"} component={Dashboard} />
      <Route path={"/home"} component={Home} />
      <Route path={"/demo"} component={Demo} />
      <Route path={"/strategies"} component={StrategyBuilder} />
      <Route path={"/reports"} component={Reports} />
      <Route path={"/docs"} component={Docs} />
      <Route path={"/admin"} component={AdminDashboard} />
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
      <Route path={"/builder"} component={StrategyBuilder} />
      <Route path={"/admin/system"} component={AdminSystem} />
      <Route path={"/admin/core"} component={AdminCoreManagement} />
      <Route path={"/404"} component={NotFound} />
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
