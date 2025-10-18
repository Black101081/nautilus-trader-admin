import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Demo from "./pages/Demo";
import Docs from "./pages/Docs";
import StrategyBuilder from "./pages/StrategyBuilder";
import Reports from "./pages/Reports";
import AdminDashboard from "./pages/AdminDashboard";
import TraderDashboard from "./pages/TraderDashboard";
import LiveTrading from "./pages/LiveTrading";
import AdvancedBacktest from "./pages/AdvancedBacktest";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/demo"} component={Demo} />
      <Route path={"/strategies"} component={StrategyBuilder} />
      <Route path={"/reports"} component={Reports} />
      <Route path={"/docs"} component={Docs} />
      <Route path={"/admin"} component={AdminDashboard} />
      <Route path={"/trader"} component={TraderDashboard} />
      <Route path={"/live"} component={LiveTrading} />
      <Route path={"/advanced-backtest"} component={AdvancedBacktest} />
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
