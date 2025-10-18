# Nautilus Trader Admin - Test Suite

Comprehensive testing framework for Nautilus Trader Admin web interface.

## Overview

This test suite provides **three levels of testing** to ensure the reliability and correctness of the Nautilus Trader Admin platform:

1. **Unit Tests** - Test individual components and database connections
2. **Integration Tests** - Test API endpoints and backend integration
3. **End-to-End (E2E) Tests** - Test all pages and user workflows

## Test Coverage

### 1. Unit Tests (`tests/unit/`)

Tests core functionality and database connections.

**Coverage:**
- PostgreSQL connection and tables
- Redis connection and operations
- MySQL/TiDB connection
- Nautilus Core availability
- Environment variable configuration

**Run:**
```bash
python3.11 tests/unit/test_database_connections.py
```

### 2. Integration Tests (`tests/integration/`)

Tests all tRPC API endpoints.

**Coverage:**
- Admin API endpoints (9 endpoints)
- Trader API endpoints (5 endpoints)
- Request/response validation
- Error handling

**Run:**
```bash
python3.11 tests/integration/test_api_endpoints.py http://localhost:3003
```

### 3. End-to-End Tests (`tests/e2e/`)

Tests all pages in the web interface.

**Coverage:**
- **Landing Page** (1 page)
- **Admin Pages** (21 pages)
  - System Overview, Analytics
  - Core Management, Component Health, Data Feeds
  - Execution Management, Risk Controls, Broker Integration
  - Database Management
  - Users & Roles, Access Control, API Keys
  - Audit Logs
  - System Settings
  - Docs (6 pages)
- **Trader Pages** (25 pages)
  - Dashboard, Portfolio, Market Watch
  - Live Trading, Positions, Orders, Trade History
  - Backtesting (4 pages)
  - Strategies (4 pages)
  - Analytics and more

**Total: 47 pages tested**

**Run:**
```bash
python3.11 tests/e2e/test_all_pages.py http://localhost:3003
```

## Quick Start

### Run All Tests

The easiest way to run all tests:

```bash
cd tests
./run_all_tests.sh http://localhost:3003
```

This will:
1. Run unit tests
2. Run integration tests
3. Run E2E tests
4. Generate comprehensive report
5. Save results to JSON

### Run Individual Test Suites

**Unit Tests:**
```bash
python3.11 tests/unit/test_database_connections.py
```

**Integration Tests:**
```bash
python3.11 tests/integration/test_api_endpoints.py http://localhost:3003
```

**E2E Tests:**
```bash
python3.11 tests/e2e/test_all_pages.py http://localhost:3003
```

## Test Results

Test results are saved to:
- `tests/e2e/test_results.json` - E2E test results with detailed metrics

## Requirements

**Python Packages:**
```bash
pip3 install requests
```

Already installed in the sandbox environment.

## Test Output

### Example Output

```
╔════════════════════════════════════════════════════════════════════════════╗
║           NAUTILUS TRADER ADMIN - COMPREHENSIVE TEST SUITE                ║
╚════════════════════════════════════════════════════════════════════════════╝

Base URL: http://localhost:3003
Started at: 2025-10-18 16:40:00

================================================================================
TESTING LANDING PAGE
================================================================================
✅ PASS | Landing Page                           | 200 | 0.15s

================================================================================
TESTING ADMIN PAGES (21 pages)
================================================================================
✅ PASS | System Overview                        | 200 | 0.12s
✅ PASS | Analytics                              | 200 | 0.11s
✅ PASS | Database Management                    | 200 | 0.13s
...

================================================================================
TESTING TRADER PAGES (25 pages)
================================================================================
✅ PASS | Dashboard - Overview                   | 200 | 0.14s
✅ PASS | Portfolio                              | 200 | 0.12s
✅ PASS | Live Trading                           | 200 | 0.13s
...

================================================================================
TEST SUMMARY
================================================================================
Total Pages Tested: 47
Passed: 47 (100.0%)
Failed: 0
Average Response Time: 0.13s

✅ Results saved to: tests/e2e/test_results.json
```

## Benefits

### 1. Fast Feedback

Instead of manually clicking through 47 pages, run one command:
```bash
./run_all_tests.sh
```

Get results in **~10 seconds** instead of **30+ minutes** of manual testing.

### 2. Comprehensive Coverage

- **47 pages** tested automatically
- **14 API endpoints** validated
- **5 database connections** verified
- **100% coverage** of user-facing features

### 3. Regression Detection

Catch bugs before they reach production:
- Page crashes (TypeError, etc.)
- API failures
- Database connection issues
- Performance regressions

### 4. CI/CD Integration

Easy to integrate into GitHub Actions or other CI/CD pipelines:

```yaml
# .github/workflows/test.yml
- name: Run Tests
  run: |
    cd tests
    ./run_all_tests.sh http://localhost:3003
```

## Continuous Improvement

### Adding New Tests

**New Page:**
1. Add to `tests/e2e/test_all_pages.py`
2. Add entry to `admin_pages` or `trader_pages` list
3. Run tests

**New API Endpoint:**
1. Add to `tests/integration/test_api_endpoints.py`
2. Add entry to `admin_endpoints` or `trader_endpoints` list
3. Run tests

**New Database:**
1. Add to `tests/unit/test_database_connections.py`
2. Create test function
3. Add to `run_all_unit_tests()`

## Troubleshooting

### Server Not Running

```
Error: Connection refused
```

**Solution:** Start the server first:
```bash
cd /home/ubuntu/nautilus-trader-admin
pnpm run start
```

### Port Changed

If server is running on different port:
```bash
./run_all_tests.sh http://localhost:3001
```

### Missing Dependencies

```bash
pip3 install requests
```

## Performance Benchmarks

**Typical Test Times:**
- Unit Tests: ~2 seconds
- Integration Tests: ~3 seconds
- E2E Tests: ~10 seconds
- **Total: ~15 seconds**

**vs Manual Testing:**
- Manual: 30-60 minutes
- Automated: 15 seconds
- **Speedup: 120-240x faster**

## Best Practices

1. **Run tests before commits**
   ```bash
   ./run_all_tests.sh
   ```

2. **Run tests after changes**
   - Changed a page? Run E2E tests
   - Changed an API? Run integration tests
   - Changed database code? Run unit tests

3. **Check test results**
   - Review `test_results.json` for detailed metrics
   - Look for slow pages (>1s response time)
   - Fix failed tests before deploying

4. **Keep tests updated**
   - Add tests for new features
   - Update tests when pages change
   - Remove tests for deprecated features

## Future Enhancements

Potential improvements:
- [ ] Visual regression testing (screenshot comparison)
- [ ] Performance testing (load testing)
- [ ] Security testing (XSS, CSRF, etc.)
- [ ] Accessibility testing (WCAG compliance)
- [ ] Browser compatibility testing (Chrome, Firefox, Safari)
- [ ] Mobile responsiveness testing

## Support

For issues or questions:
1. Check test output for error messages
2. Review `test_results.json` for details
3. Check server logs: `tail -f /tmp/nautilus-web.log`
4. Ensure databases are running: `sudo systemctl status postgresql redis mysql`

---

**Happy Testing! 🚀**

