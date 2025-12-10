#!/bin/bash
# Local Development Comparison Tool
# Modified version that works with wrangler dev server on port 8787
#
# IMPORTANT: This bypasses the port redirect check for LOCAL TESTING ONLY
# The production worker correctly redirects ports - this is just for dev testing

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
RED='\033[0;31m'
BOLD='\033[1m'
NC='\033[0m' # No Color

WORKER_URL="http://localhost:8787"
ORIGIN_URL="https://main--allaboutv2--ddttom.aem.live"

echo -e "${BOLD}${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BOLD}${BLUE}    Cloudflare Worker Local Development Comparison${NC}"
echo -e "${BOLD}${YELLOW}    (Port redirect bypassed for local testing)${NC}"
echo -e "${BOLD}${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Check if dev server is running
if ! curl -s -f -o /dev/null "$WORKER_URL"; then
    echo -e "${RED}❌ Dev server not running at $WORKER_URL${NC}"
    echo -e "${YELLOW}Start it with: npm run dev${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Dev server is running${NC}"
echo ""

# Test page URL (you can customize this)
TEST_PAGE="/blogs/ddt/creating-an-llms-txt"
if [ ! -z "$1" ]; then
    TEST_PAGE="$1"
fi

echo -e "${CYAN}Test page: ${TEST_PAGE}${NC}"
echo ""

# Create temp directory
TEMP_DIR=$(mktemp -d)
trap "rm -rf $TEMP_DIR" EXIT

BEFORE_HEADERS="$TEMP_DIR/before_headers.txt"
AFTER_HEADERS="$TEMP_DIR/after_headers.txt"
BEFORE_BODY="$TEMP_DIR/before_body.html"
AFTER_BODY="$TEMP_DIR/after_body.html"

echo -e "${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BOLD}1. FETCHING RESPONSES${NC}"
echo -e "${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

echo -e "${YELLOW}Fetching BEFORE (direct origin)...${NC}"
curl -s -D "$BEFORE_HEADERS" "${ORIGIN_URL}${TEST_PAGE}" -o "$BEFORE_BODY"
echo -e "${GREEN}✓ Origin response saved${NC}"
echo ""

echo -e "${YELLOW}Fetching AFTER (through worker - bypassing port redirect)...${NC}"
# Use a custom Host header without port to bypass the redirect check
curl -s -D "$AFTER_HEADERS" \
  -H "Host: allabout.network" \
  "${WORKER_URL}${TEST_PAGE}" -o "$AFTER_BODY"

# Check if we got HTML or a redirect
if grep -q "text/html" "$AFTER_HEADERS"; then
    echo -e "${GREEN}✓ Worker response saved (HTML)${NC}"
else
    echo -e "${YELLOW}⚠️  Got non-HTML response, checking...${NC}"
    cat "$AFTER_BODY"
    echo ""
    echo -e "${RED}❌ Worker returned non-HTML response${NC}"
    echo -e "${YELLOW}This might be due to port redirect logic.${NC}"
    echo ""
    echo -e "${CYAN}Trying alternative approach with X-Forwarded-Proto...${NC}"

    # Try again with more headers to simulate production
    curl -s -D "$AFTER_HEADERS" \
      -H "Host: allabout.network" \
      -H "X-Forwarded-Proto: https" \
      "${WORKER_URL}${TEST_PAGE}" -o "$AFTER_BODY"

    if grep -q "text/html" "$AFTER_HEADERS"; then
        echo -e "${GREEN}✓ Worker response saved (HTML)${NC}"
    else
        echo -e "${RED}❌ Still getting redirect. Worker port logic is active.${NC}"
        echo ""
        echo -e "${YELLOW}Recommendation: Deploy to production for accurate testing.${NC}"
        exit 1
    fi
fi
echo ""

echo -e "${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BOLD}2. HEADERS COMPARISON${NC}"
echo -e "${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

echo -e "${CYAN}${BOLD}BEFORE (Origin):${NC}"
echo -e "${CYAN}────────────────${NC}"
grep -i "access-control\|content-type\|x-robots\|age" "$BEFORE_HEADERS" || echo "(No CORS headers, age, or x-robots-tag)"
echo ""

echo -e "${GREEN}${BOLD}AFTER (Worker):${NC}"
echo -e "${GREEN}───────────────${NC}"
grep -i "access-control\|content-type\|x-robots\|age" "$AFTER_HEADERS" || echo "(Headers removed)"
echo ""

echo -e "${BLUE}${BOLD}🔍 Key Differences:${NC}"
echo -e "${BLUE}──────────────────${NC}"
if grep -qi "access-control-allow-origin" "$AFTER_HEADERS"; then
    echo -e "${GREEN}✓ CORS headers added${NC}"
else
    echo -e "${YELLOW}⚠️  CORS headers not found${NC}"
fi

if ! grep -qi "age:" "$AFTER_HEADERS"; then
    echo -e "${GREEN}✓ 'age' header removed${NC}"
else
    echo -e "${YELLOW}⚠️  'age' header still present${NC}"
fi

if ! grep -qi "x-robots-tag" "$AFTER_HEADERS"; then
    echo -e "${GREEN}✓ 'x-robots-tag' header removed${NC}"
else
    echo -e "${YELLOW}⚠️  'x-robots-tag' header still present${NC}"
fi
echo ""

echo -e "${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BOLD}3. HTML BODY COMPARISON${NC}"
echo -e "${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Check for JSON-LD in BEFORE
BEFORE_JSONLD=$(grep -c 'type="application/ld+json"' "$BEFORE_BODY" || echo "0")
BEFORE_JSONLD_ERROR=$(grep -c 'data-error.*article' "$BEFORE_BODY" || echo "0")

# Check for JSON-LD in AFTER
AFTER_JSONLD=$(grep -c 'type="application/ld+json"' "$AFTER_BODY" || echo "0")
AFTER_JSONLD_VALID=$(grep -c '@context.*schema.org' "$AFTER_BODY" || echo "0")

echo -e "${CYAN}${BOLD}BEFORE (Origin):${NC}"
echo -e "${CYAN}────────────────${NC}"
echo -e "JSON-LD scripts found: ${BEFORE_JSONLD}"
echo -e "JSON-LD error scripts: ${BEFORE_JSONLD_ERROR}"
if [ "$BEFORE_JSONLD_ERROR" -gt 0 ]; then
    echo -e "${YELLOW}Sample error script:${NC}"
    grep -o 'data-error="[^"]*article[^"]*"' "$BEFORE_BODY" | head -n 1
fi
echo ""

echo -e "${GREEN}${BOLD}AFTER (Worker):${NC}"
echo -e "${GREEN}───────────────${NC}"
echo -e "JSON-LD scripts found: ${AFTER_JSONLD}"
echo -e "Valid JSON-LD scripts: ${AFTER_JSONLD_VALID}"
if [ "$AFTER_JSONLD_VALID" -gt 0 ]; then
    echo -e "${GREEN}Sample valid JSON-LD:${NC}"
    grep -A 10 '@context.*schema.org' "$AFTER_BODY" | head -n 12
fi
echo ""

# Check metadata removal
echo -e "${BLUE}${BOLD}Metadata Cleanup:${NC}"
echo -e "${BLUE}─────────────────${NC}"

BEFORE_AUTHOR=$(grep -c 'name="author"' "$BEFORE_BODY" || echo "0")
AFTER_AUTHOR=$(grep -c 'name="author"' "$AFTER_BODY" || echo "0")

BEFORE_LONGDESC=$(grep -c 'name="longdescription"' "$BEFORE_BODY" || echo "0")
AFTER_LONGDESC=$(grep -c 'name="longdescription"' "$AFTER_BODY" || echo "0")

BEFORE_DESC=$(grep -c 'name="description"' "$BEFORE_BODY" || echo "0")
AFTER_DESC=$(grep -c 'name="description"' "$AFTER_BODY" || echo "0")

echo "name=\"author\" meta tags:"
echo "  Before: $BEFORE_AUTHOR"
echo "  After:  $AFTER_AUTHOR"
if [ "$AFTER_AUTHOR" -lt "$BEFORE_AUTHOR" ]; then
    echo -e "  ${GREEN}✓ Removed${NC}"
fi
echo ""

echo "name=\"longdescription\" meta tags:"
echo "  Before: $BEFORE_LONGDESC"
echo "  After:  $AFTER_LONGDESC"
if [ "$AFTER_LONGDESC" -lt "$BEFORE_LONGDESC" ]; then
    echo -e "  ${GREEN}✓ Removed${NC}"
fi
echo ""

echo "name=\"description\" meta tags:"
echo "  Before: $BEFORE_DESC"
echo "  After:  $AFTER_DESC"
if [ "$AFTER_DESC" -lt "$BEFORE_DESC" ]; then
    echo -e "  ${GREEN}✓ Removed${NC}"
fi
echo ""

# Social media tags preserved
BEFORE_OG=$(grep -c 'property="og:' "$BEFORE_BODY" || echo "0")
AFTER_OG=$(grep -c 'property="og:' "$AFTER_BODY" || echo "0")

echo "property=\"og:*\" meta tags:"
echo "  Before: $BEFORE_OG"
echo "  After:  $AFTER_OG"
if [ "$AFTER_OG" -eq "$BEFORE_OG" ]; then
    echo -e "  ${GREEN}✓ Preserved (social media tags kept)${NC}"
fi
echo ""

echo -e "${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BOLD}4. FILE SIZE COMPARISON${NC}"
echo -e "${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

BEFORE_SIZE=$(wc -c < "$BEFORE_BODY")
AFTER_SIZE=$(wc -c < "$AFTER_BODY")
SIZE_DIFF=$((AFTER_SIZE - BEFORE_SIZE))

echo -e "Before: ${CYAN}$BEFORE_SIZE bytes${NC}"
echo -e "After:  ${GREEN}$AFTER_SIZE bytes${NC}"
if [ $SIZE_DIFF -gt 0 ]; then
    echo -e "Change: ${GREEN}+$SIZE_DIFF bytes${NC} (JSON-LD added)"
elif [ $SIZE_DIFF -lt 0 ]; then
    echo -e "Change: ${YELLOW}$SIZE_DIFF bytes${NC} (metadata removed)"
else
    echo -e "Change: ${BLUE}No change${NC}"
fi
echo ""

echo -e "${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BOLD}5. SUMMARY${NC}"
echo -e "${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

echo -e "${BOLD}Transformations Applied:${NC}"
echo ""

# CORS
if grep -qi "access-control-allow-origin" "$AFTER_HEADERS"; then
    echo -e "${GREEN}✓${NC} CORS headers added"
else
    echo -e "${RED}✗${NC} CORS headers NOT added"
fi

# JSON-LD
if [ "$AFTER_JSONLD_VALID" -gt 0 ]; then
    echo -e "${GREEN}✓${NC} JSON-LD generated ($AFTER_JSONLD_VALID scripts)"
else
    if [ "$BEFORE_JSONLD_ERROR" -gt 0 ]; then
        echo -e "${YELLOW}⚠${NC}  JSON-LD not generated (no og:title or trigger missing)"
    else
        echo -e "${BLUE}○${NC} No JSON-LD trigger found in page"
    fi
fi

# Metadata cleanup
REMOVED_COUNT=$((BEFORE_AUTHOR + BEFORE_LONGDESC + BEFORE_DESC - AFTER_AUTHOR - AFTER_LONGDESC - AFTER_DESC))
if [ $REMOVED_COUNT -gt 0 ]; then
    echo -e "${GREEN}✓${NC} Metadata cleaned up ($REMOVED_COUNT meta tags removed)"
else
    echo -e "${BLUE}○${NC} No metadata to clean up"
fi

# Header cleanup
HEADERS_REMOVED=0
if ! grep -qi "age:" "$AFTER_HEADERS"; then
    HEADERS_REMOVED=$((HEADERS_REMOVED + 1))
fi
if ! grep -qi "x-robots-tag" "$AFTER_HEADERS"; then
    HEADERS_REMOVED=$((HEADERS_REMOVED + 1))
fi
if [ $HEADERS_REMOVED -gt 0 ]; then
    echo -e "${GREEN}✓${NC} Headers cleaned up ($HEADERS_REMOVED headers removed)"
fi

# Social media preservation
if [ "$AFTER_OG" -eq "$BEFORE_OG" ] && [ "$BEFORE_OG" -gt 0 ]; then
    echo -e "${GREEN}✓${NC} Social media tags preserved ($AFTER_OG og:* tags)"
fi

echo ""
echo -e "${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

echo -e "${CYAN}💡 Tip: View full HTML files:${NC}"
echo -e "   Before: cat $BEFORE_BODY"
echo -e "   After:  cat $AFTER_BODY"
echo ""
echo -e "${CYAN}💡 Diff the files:${NC}"
echo -e "   diff -u $BEFORE_BODY $AFTER_BODY | less"
echo ""
echo -e "${YELLOW}Note: This is LOCAL testing with port redirect bypassed.${NC}"
echo -e "${YELLOW}Production worker will correctly redirect port requests.${NC}"
echo ""
