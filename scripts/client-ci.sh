#!/bin/bash
# Local CI script for Bingeo Client

set -e

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Get the script directory and find the client path
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CLIENT_DIR="$SCRIPT_DIR/../client"

echo -e "${GREEN}Starting Local CI for Client...${NC}"

# Ensure we are in the client directory
cd "$CLIENT_DIR"

# 1. Cleanup old test results
echo -e "${YELLOW}1. Cleaning up old test results...${NC}"
rm -rf coverage/ playwright-report/ test-results/

# 2. Install dependencies
echo -e "${GREEN}2. Installing dependencies...${NC}"
pnpm install --frozen-lockfile

# 3. Linting and formatting check
echo -e "${GREEN}3. Running Linting (Biome)...${NC}"
pnpm lint

# 4. Unit & Integration Tests (Vitest)
echo -e "${GREEN}4. Running Unit/Integration Tests...${NC}"
# Run with CI flag if your environment uses it
pnpm test

# 5. End-to-End Tests (Playwright)
echo -e "${GREEN}5. Running E2E Tests (Chromium, Firefox, Webkit)...${NC}"
# Note: This runs all projects defined in playwright.config.ts
pnpm test:e2e

echo -e "${GREEN}✅ Local CI completed successfully!${NC}"
