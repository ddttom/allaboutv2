#!/bin/bash
# Manual Testing Script for Cloudflare Worker
# Tests the worker through the Wrangler dev server (localhost:8787)

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

DEV_SERVER="http://localhost:8787"

echo -e "${BLUE}🧪 Cloudflare Worker Manual Test Suite${NC}"
echo ""

# Check if dev server is running
if ! curl -s -f -o /dev/null "$DEV_SERVER"; then
    echo -e "${YELLOW}⚠️  Dev server not running at $DEV_SERVER${NC}"
    echo "Start it with: npm run dev"
    echo "Then run this script again"
    exit 1
fi

echo -e "${GREEN}✓ Dev server is running${NC}"
echo ""

# Test 1: Basic request
echo -e "${BLUE}Test 1: Basic GET request${NC}"
curl -s -I "$DEV_SERVER/" | head -n 1
echo ""

# Test 2: CORS headers
echo -e "${BLUE}Test 2: CORS headers presence${NC}"
CORS_ORIGIN=$(curl -s -I "$DEV_SERVER/" | grep -i "access-control-allow-origin" | tr -d '\r')
if [ -n "$CORS_ORIGIN" ]; then
    echo -e "${GREEN}✓ $CORS_ORIGIN${NC}"
else
    echo -e "${YELLOW}⚠️  CORS headers not found${NC}"
fi
echo ""

# Test 3: OPTIONS preflight
echo -e "${BLUE}Test 3: OPTIONS preflight request${NC}"
curl -s -I -X OPTIONS "$DEV_SERVER/" \
    -H "Origin: https://example.com" \
    -H "Access-Control-Request-Method: GET" | grep -i "access-control"
echo ""

# Test 4: Media request with query params
echo -e "${BLUE}Test 4: Media request query parameter handling${NC}"
MEDIA_URL="${DEV_SERVER}/media_1234567890abcdef1234567890abcdef12345678.png?format=webp&foo=bar&width=800"
echo "Requesting: $MEDIA_URL"
curl -s -I "$MEDIA_URL" | head -n 1
echo ""

# Test 5: JSON request with query params
echo -e "${BLUE}Test 5: JSON request query parameter handling${NC}"
JSON_URL="${DEV_SERVER}/data.json?limit=10&foo=bar&offset=5"
echo "Requesting: $JSON_URL"
curl -s -I "$JSON_URL" | head -n 1
echo ""

# Test 6: Draft request (should be 404)
echo -e "${BLUE}Test 6: Draft request blocking${NC}"
DRAFT_URL="${DEV_SERVER}/drafts/test-page"
echo "Requesting: $DRAFT_URL"
curl -s -I "$DRAFT_URL" | head -n 1
echo ""

# Test 7: Port redirect
echo -e "${BLUE}Test 7: Port redirect handling${NC}"
PORT_URL="http://localhost:8787:8080/"
echo "Testing: $PORT_URL (should redirect)"
# This test may not work locally, but demonstrates the pattern
echo "(Port redirect test - may require production environment)"
echo ""

echo -e "${GREEN}✅ Manual test suite complete!${NC}"
echo ""
echo "Additional tests:"
echo "  - Deploy to staging: npm run deploy --env staging"
echo "  - View production logs: npm run tail"
echo ""
echo -e "${BLUE}JSON-LD Trigger Testing:${NC}"
echo "The worker supports three trigger mechanisms:"
echo ""
echo "  1. Legacy EDS error (backward compatibility):"
echo "     <script type=\"application/ld+json\" data-error=\"error in json-ld: ...\\\"article\\\"...\"></script>"
echo ""
echo "  2. NEW: Clean metadata (recommended authoring practice):"
echo "     <meta name=\"jsonld\" content=\"article\">"
echo "     (No EDS error - cleaner markup)"
echo ""
echo "  3. Legacy perfect JSON-LD (if Adobe fixes backend):"
echo "     <script type=\"application/ld+json\">{...}</script>"
echo "     (Worker regenerates from fresh metadata for consistency)"
echo ""
echo "All three triggers will:"
echo "  - Extract metadata from og:title, author, description, etc."
echo "  - Generate fresh JSON-LD from current metadata"
echo "  - Remove/replace the trigger element"
echo ""
