#!/bin/bash
# Test Server Script for Cloudflare Worker
# This script starts the Wrangler dev server and runs integration tests against it

set -e  # Exit on error

echo "🚀 Starting Cloudflare Worker Test Environment"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo -e "${BLUE}📦 Installing dependencies...${NC}"
    npm install
    echo ""
fi

# Check if wrangler.toml has ORIGIN_HOSTNAME configured
if ! grep -q "ORIGIN_HOSTNAME.*=" wrangler.toml; then
    echo -e "${RED}⚠️  WARNING: ORIGIN_HOSTNAME not set in wrangler.toml${NC}"
    echo "Please configure ORIGIN_HOSTNAME in wrangler.toml before testing"
    echo ""
fi

echo -e "${BLUE}🧪 Running unit tests...${NC}"
npm test
echo ""

echo -e "${BLUE}🔍 Running linter...${NC}"
npm run lint
echo ""

echo -e "${GREEN}✅ All tests passed!${NC}"
echo ""
echo "To test with local dev server:"
echo "  1. Start dev server: npm run dev"
echo "  2. In another terminal: npm run test:integration"
echo "  3. Test manually: curl -I http://localhost:8787"
echo ""
