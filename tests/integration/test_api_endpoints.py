"""
Integration Tests for tRPC API Endpoints
Tests all backend APIs for Admin and Trader sections
"""

import requests
import json
from typing import Dict, Any, List
from dataclasses import dataclass

@dataclass
class APITestResult:
    endpoint: str
    method: str
    passed: bool
    status_code: int = 0
    error: str = ""

class NautilusAPITester:
    """Test all tRPC API endpoints"""
    
    def __init__(self, base_url: str = "http://localhost:3003"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api/trpc"
        self.results: List[APITestResult] = []
    
    def test_trpc_endpoint(self, router: str, procedure: str, input_data: Dict = None) -> APITestResult:
        """Test a tRPC endpoint"""
        endpoint = f"{router}.{procedure}"
        url = f"{self.api_url}/{router}.{procedure}"
        
        try:
            if input_data:
                # Mutation or query with input
                params = {"input": json.dumps(input_data)}
                response = requests.get(url, params=params, timeout=5)
            else:
                # Simple query
                response = requests.get(url, timeout=5)
            
            passed = response.status_code == 200
            
            if passed:
                try:
                    data = response.json()
                    # Check if response has expected structure
                    if "result" not in data:
                        passed = False
                        error = "Missing 'result' in response"
                    else:
                        error = ""
                except json.JSONDecodeError:
                    passed = False
                    error = "Invalid JSON response"
            else:
                error = f"HTTP {response.status_code}"
            
            return APITestResult(
                endpoint=endpoint,
                method="GET",
                passed=passed,
                status_code=response.status_code,
                error=error
            )
        except Exception as e:
            return APITestResult(
                endpoint=endpoint,
                method="GET",
                passed=False,
                error=str(e)
            )
    
    def test_admin_apis(self):
        """Test Admin API endpoints"""
        print("\n" + "="*80)
        print("TESTING ADMIN API ENDPOINTS")
        print("="*80)
        
        admin_endpoints = [
            ("admin", "getDatabaseStats"),
            ("admin", "getRedisInfo"),
            ("admin", "getRedisKeyspaceStats"),
            ("admin", "getPostgresInfo"),
            ("admin", "getPostgresTables"),
            ("admin", "getParquetOverview"),
            ("admin", "listParquetDirectories"),
            ("nautilus", "version"),
            ("nautilus", "systemInfo"),
        ]
        
        for router, procedure in admin_endpoints:
            result = self.test_trpc_endpoint(router, procedure)
            self.results.append(result)
            self._print_result(result)
            time.sleep(0.5)  # Avoid rate limiting
    
    def test_trader_apis(self):
        """Test Trader API endpoints"""
        print("\n" + "="*80)
        print("TESTING TRADER API ENDPOINTS")
        print("="*80)
        
        trader_endpoints = [
            ("strategies", "list"),
            ("backtests", "list"),
            ("trading", "positions"),
            ("trading", "orders"),
            ("trading", "trades"),
        ]
        
        for router, procedure in trader_endpoints:
            result = self.test_trpc_endpoint(router, procedure)
            self.results.append(result)
            self._print_result(result)
            time.sleep(0.5)  # Avoid rate limiting
    
    def _print_result(self, result: APITestResult):
        """Print API test result"""
        status = "✅ PASS" if result.passed else "❌ FAIL"
        print(f"{status} | {result.endpoint:40} | {result.status_code:3}")
        if result.error:
            print(f"       Error: {result.error}")
    
    def print_summary(self):
        """Print test summary"""
        print("\n" + "="*80)
        print("API TEST SUMMARY")
        print("="*80)
        
        total = len(self.results)
        passed = sum(1 for r in self.results if r.passed)
        failed = total - passed
        pass_rate = (passed / total * 100) if total > 0 else 0
        
        print(f"Total Endpoints Tested: {total}")
        print(f"Passed: {passed} ({pass_rate:.1f}%)")
        print(f"Failed: {failed}")
        
        if failed > 0:
            print("\n" + "-"*80)
            print("FAILED ENDPOINTS:")
            print("-"*80)
            for result in self.results:
                if not result.passed:
                    print(f"❌ {result.endpoint}")
                    print(f"   Error: {result.error}")
    
    def run_all_tests(self):
        """Run all API tests"""
        print("\n" + "="*80)
        print("NAUTILUS TRADER ADMIN - API INTEGRATION TESTS")
        print("="*80)
        print(f"API URL: {self.api_url}")
        
        self.test_admin_apis()
        self.test_trader_apis()
        self.print_summary()
        
        return sum(1 for r in self.results if not r.passed) == 0


def main():
    """Main test runner"""
    import sys
    
    base_url = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:3003"
    
    tester = NautilusAPITester(base_url)
    success = tester.run_all_tests()
    
    sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()

