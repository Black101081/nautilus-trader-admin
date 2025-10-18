"""
End-to-End Tests for Nautilus Trader Admin
Tests all pages: Landing, Admin (21 pages), Trader (25 pages)
"""

import requests
import time
from typing import Dict, List, Tuple
from dataclasses import dataclass
import json

@dataclass
class TestResult:
    page: str
    url: str
    status_code: int
    passed: bool
    error: str = ""
    response_time: float = 0.0

class NautilusE2ETester:
    """Comprehensive E2E tester for all Nautilus pages"""
    
    def __init__(self, base_url: str = "http://localhost:3003"):
        self.base_url = base_url
        self.results: List[TestResult] = []
        
    def test_page(self, name: str, path: str) -> TestResult:
        """Test a single page"""
        url = f"{self.base_url}{path}"
        start_time = time.time()
        
        try:
            response = requests.get(url, timeout=10)
            response_time = time.time() - start_time
            
            # Check if page loads (200) or redirects (302)
            passed = response.status_code in [200, 302]
            
            # Additional checks
            if passed and response.status_code == 200:
                # Check for error indicators in response
                if "An unexpected error occurred" in response.text:
                    passed = False
                    error = "Page crashed with error"
                elif "TypeError" in response.text:
                    passed = False
                    error = "JavaScript TypeError detected"
                else:
                    error = ""
            else:
                error = ""
            
            return TestResult(
                page=name,
                url=url,
                status_code=response.status_code,
                passed=passed,
                error=error,
                response_time=response_time
            )
        except requests.exceptions.Timeout:
            return TestResult(
                page=name,
                url=url,
                status_code=0,
                passed=False,
                error="Timeout after 10s",
                response_time=10.0
            )
        except Exception as e:
            return TestResult(
                page=name,
                url=url,
                status_code=0,
                passed=False,
                error=str(e),
                response_time=time.time() - start_time
            )
    
    def test_landing_page(self):
        """Test Landing Page"""
        print("\n" + "="*80)
        print("TESTING LANDING PAGE")
        print("="*80)
        
        result = self.test_page("Landing Page", "/")
        self.results.append(result)
        self._print_result(result)
    
    def test_admin_pages(self):
        """Test all 21 Admin pages"""
        print("\n" + "="*80)
        print("TESTING ADMIN PAGES (21 pages)")
        print("="*80)
        
        admin_pages = [
            # Dashboard
            ("System Overview", "/admin/system"),
            ("Analytics", "/admin/analytics"),
            
            # Nautilus Core
            ("Core Management", "/admin/core"),
            ("Component Health", "/admin/health"),
            ("Data Feeds", "/admin/feeds"),
            
            # Trading Operations
            ("Execution Management", "/admin/execution"),
            ("Risk Controls", "/admin/risk"),
            ("Broker Integration", "/admin/brokers"),
            
            # Data & Storage
            ("Database Management", "/admin/database"),
            
            # User & Access
            ("Users & Roles", "/admin/users"),
            ("Access Control", "/admin/access"),
            ("API Keys", "/admin/api-keys"),
            
            # Monitoring
            ("Audit Logs", "/admin/logs"),
            
            # Configuration
            ("System Settings", "/admin/settings"),
            
            # Docs (6 pages)
            ("Docs - Overview", "/docs"),
            ("Docs - Quick Start", "/docs/quickstart"),
            ("Docs - Architecture", "/docs/architecture"),
            ("Docs - API Reference", "/docs/api"),
            ("Docs - Database Schema", "/docs/database"),
            ("Docs - Deployment", "/docs/deployment"),
        ]
        
        for name, path in admin_pages:
            result = self.test_page(name, path)
            self.results.append(result)
            self._print_result(result)
            time.sleep(0.5)  # Avoid rate limiting
    
    def test_trader_pages(self):
        """Test all 25 Trader pages"""
        print("\n" + "="*80)
        print("TESTING TRADER PAGES (25 pages)")
        print("="*80)
        
        trader_pages = [
            # Dashboard
            ("Dashboard - Overview", "/dashboard"),
            ("Portfolio", "/portfolio"),
            ("Market Watch", "/market-watch"),
            
            # Trading
            ("Live Trading", "/live-trading"),
            ("Positions", "/positions"),
            ("Orders", "/orders"),
            ("Trade History", "/trades"),
            
            # Backtesting
            ("Quick Backtest", "/backtest"),
            ("Advanced Backtest", "/backtest/advanced"),
            ("Walk-Forward Analysis", "/backtest/walk-forward"),
            ("Optimization", "/backtest/optimization"),
            
            # Strategies
            ("My Strategies", "/strategies"),
            ("Strategy Builder", "/strategies/builder"),
            ("Strategy Library", "/strategies/library"),
            ("Deploy Strategy", "/strategies/deploy"),
            
            # Analytics
            ("Performance Analytics", "/analytics"),
            
            # Additional Trader Pages
            ("Live Trading New", "/live-trading-new"),
            ("Portfolio Analysis", "/portfolio-analysis"),
            ("Risk Dashboard", "/risk-dashboard"),
            ("Account Summary", "/account"),
            ("Instruments", "/instruments"),
            ("Calendar", "/calendar"),
            ("Alerts", "/alerts"),
            ("Settings", "/settings"),
            ("Help", "/help"),
        ]
        
        for name, path in trader_pages:
            result = self.test_page(name, path)
            self.results.append(result)
            self._print_result(result)
            time.sleep(0.5)  # Avoid rate limiting
    
    def _print_result(self, result: TestResult):
        """Print test result"""
        status = "✅ PASS" if result.passed else "❌ FAIL"
        print(f"{status} | {result.page:40} | {result.status_code:3} | {result.response_time:.2f}s")
        if result.error:
            print(f"       Error: {result.error}")
    
    def print_summary(self):
        """Print test summary"""
        print("\n" + "="*80)
        print("TEST SUMMARY")
        print("="*80)
        
        total = len(self.results)
        passed = sum(1 for r in self.results if r.passed)
        failed = total - passed
        pass_rate = (passed / total * 100) if total > 0 else 0
        
        print(f"Total Pages Tested: {total}")
        print(f"Passed: {passed} ({pass_rate:.1f}%)")
        print(f"Failed: {failed}")
        
        avg_time = sum(r.response_time for r in self.results) / total if total > 0 else 0
        print(f"Average Response Time: {avg_time:.2f}s")
        
        if failed > 0:
            print("\n" + "-"*80)
            print("FAILED PAGES:")
            print("-"*80)
            for result in self.results:
                if not result.passed:
                    print(f"❌ {result.page}")
                    print(f"   URL: {result.url}")
                    print(f"   Status: {result.status_code}")
                    print(f"   Error: {result.error}")
                    print()
        
        # Save results to JSON
        self.save_results()
    
    def save_results(self):
        """Save test results to JSON file"""
        results_data = {
            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
            "base_url": self.base_url,
            "total": len(self.results),
            "passed": sum(1 for r in self.results if r.passed),
            "failed": sum(1 for r in self.results if not r.passed),
            "results": [
                {
                    "page": r.page,
                    "url": r.url,
                    "status_code": r.status_code,
                    "passed": r.passed,
                    "error": r.error,
                    "response_time": r.response_time
                }
                for r in self.results
            ]
        }
        
        with open("/home/ubuntu/nautilus-trader-admin/tests/e2e/test_results.json", "w") as f:
            json.dump(results_data, f, indent=2)
        
        print(f"\n✅ Results saved to: tests/e2e/test_results.json")
    
    def run_all_tests(self):
        """Run all E2E tests"""
        print("\n" + "="*80)
        print("NAUTILUS TRADER ADMIN - E2E TEST SUITE")
        print("="*80)
        print(f"Base URL: {self.base_url}")
        print(f"Started at: {time.strftime('%Y-%m-%d %H:%M:%S')}")
        
        # Test Landing Page
        self.test_landing_page()
        
        # Test Admin Pages
        self.test_admin_pages()
        
        # Test Trader Pages
        self.test_trader_pages()
        
        # Print Summary
        self.print_summary()
        
        return sum(1 for r in self.results if not r.passed) == 0


def main():
    """Main test runner"""
    import sys
    
    # Get base URL from command line or use default
    base_url = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:3003"
    
    tester = NautilusE2ETester(base_url)
    success = tester.run_all_tests()
    
    # Exit with appropriate code
    sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()

