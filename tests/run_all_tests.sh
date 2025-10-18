#!/bin/bash
#
# Comprehensive Test Runner for Nautilus Trader Admin
# Runs all tests: Unit, Integration, E2E
#

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Get base URL from argument or use default
BASE_URL=${1:-"http://localhost:3003"}

echo -e "${BLUE}╔════════════════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                                                                            ║${NC}"
echo -e "${BLUE}║           NAUTILUS TRADER ADMIN - COMPREHENSIVE TEST SUITE                ║${NC}"
echo -e "${BLUE}║                                                                            ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${YELLOW}Base URL: ${BASE_URL}${NC}"
echo -e "${YELLOW}Started at: $(date '+%Y-%m-%d %H:%M:%S')${NC}"
echo ""

# Track test results
UNIT_PASSED=0
INTEGRATION_PASSED=0
E2E_PASSED=0

# ==============================================================================
# 1. UNIT TESTS
# ==============================================================================
echo -e "${BLUE}╔════════════════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  STEP 1: UNIT TESTS                                                        ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════════════════════╝${NC}"
echo ""

cd "$(dirname "$0")"

if python3.11 unit/test_database_connections.py; then
    echo -e "\n${GREEN}✅ Unit Tests PASSED${NC}\n"
    UNIT_PASSED=1
else
    echo -e "\n${RED}❌ Unit Tests FAILED${NC}\n"
fi

# ==============================================================================
# 2. INTEGRATION TESTS
# ==============================================================================
echo -e "${BLUE}╔════════════════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  STEP 2: INTEGRATION TESTS (API Endpoints)                                 ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════════════════════╝${NC}"
echo ""

if python3.11 integration/test_api_endpoints.py "$BASE_URL"; then
    echo -e "\n${GREEN}✅ Integration Tests PASSED${NC}\n"
    INTEGRATION_PASSED=1
else
    echo -e "\n${RED}❌ Integration Tests FAILED${NC}\n"
fi

# ==============================================================================
# 3. E2E TESTS
# ==============================================================================
echo -e "${BLUE}╔════════════════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  STEP 3: E2E TESTS (All Pages)                                             ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════════════════════╝${NC}"
echo ""

if python3.11 e2e/test_all_pages.py "$BASE_URL"; then
    echo -e "\n${GREEN}✅ E2E Tests PASSED${NC}\n"
    E2E_PASSED=1
else
    echo -e "\n${RED}❌ E2E Tests FAILED${NC}\n"
fi

# ==============================================================================
# FINAL SUMMARY
# ==============================================================================
echo -e "${BLUE}╔════════════════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  FINAL TEST SUMMARY                                                        ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════════════════════╝${NC}"
echo ""

TOTAL_SUITES=3
PASSED_SUITES=$((UNIT_PASSED + INTEGRATION_PASSED + E2E_PASSED))
FAILED_SUITES=$((TOTAL_SUITES - PASSED_SUITES))

echo "Test Suites:"
if [ $UNIT_PASSED -eq 1 ]; then
    echo -e "  ${GREEN}✅ Unit Tests${NC}"
else
    echo -e "  ${RED}❌ Unit Tests${NC}"
fi

if [ $INTEGRATION_PASSED -eq 1 ]; then
    echo -e "  ${GREEN}✅ Integration Tests${NC}"
else
    echo -e "  ${RED}❌ Integration Tests${NC}"
fi

if [ $E2E_PASSED -eq 1 ]; then
    echo -e "  ${GREEN}✅ E2E Tests${NC}"
else
    echo -e "  ${RED}❌ E2E Tests${NC}"
fi

echo ""
echo "Summary:"
echo "  Total Suites: $TOTAL_SUITES"
echo "  Passed: $PASSED_SUITES"
echo "  Failed: $FAILED_SUITES"
echo ""

if [ $FAILED_SUITES -eq 0 ]; then
    echo -e "${GREEN}╔════════════════════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║                                                                            ║${NC}"
    echo -e "${GREEN}║                      🎉 ALL TESTS PASSED! 🎉                               ║${NC}"
    echo -e "${GREEN}║                                                                            ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════════════════════════════════════════╝${NC}"
    exit 0
else
    echo -e "${RED}╔════════════════════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${RED}║                                                                            ║${NC}"
    echo -e "${RED}║                    ⚠️  SOME TESTS FAILED ⚠️                                 ║${NC}"
    echo -e "${RED}║                                                                            ║${NC}"
    echo -e "${RED}╚════════════════════════════════════════════════════════════════════════════╝${NC}"
    exit 1
fi

