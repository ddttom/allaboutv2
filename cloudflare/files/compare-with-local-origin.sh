#!/bin/bash
# Cloudflare Worker Comparison Using Local Origin File
# Compares local origin HTML file with worker-transformed output

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
ORIGIN_FILE="./origintest.html"
TEST_PAGE="/blogs/ddt/ai/building-adobe-eds-components-simple-tools-ai-collaboration"

echo -e "${BOLD}${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BOLD}${BLUE}    Cloudflare Worker Local Origin Comparison${NC}"
echo -e "${BOLD}${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Check if origin file exists
if [ ! -f "$ORIGIN_FILE" ]; then
    echo -e "${RED}❌ Origin file not found: $ORIGIN_FILE${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Origin file found${NC}"

# Check if dev server is running
if ! curl -s -f -o /dev/null "$WORKER_URL"; then
    echo -e "${RED}❌ Dev server not running at $WORKER_URL${NC}"
    echo -e "${YELLOW}Start it with: npm run dev${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Dev server is running${NC}"
echo ""

echo -e "${CYAN}Test page: ${TEST_PAGE}${NC}"
echo -e "${CYAN}Origin file: ${ORIGIN_FILE}${NC}"
echo ""

# Create temp directory
TEMP_DIR=$(mktemp -d)
trap "rm -rf $TEMP_DIR" EXIT

BEFORE_BODY="$ORIGIN_FILE"
AFTER_HEADERS="$TEMP_DIR/after_headers.txt"
AFTER_BODY="$TEMP_DIR/after_body.html"

echo -e "${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BOLD}1. FETCHING WORKER RESPONSE${NC}"
echo -e "${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

echo -e "${YELLOW}Fetching AFTER (through worker)...${NC}"
curl -s -D "$AFTER_HEADERS" "${WORKER_URL}${TEST_PAGE}" -o "$AFTER_BODY"

# Check if we got HTML
if grep -q "text/html" "$AFTER_HEADERS"; then
    echo -e "${GREEN}✓ Worker response saved (HTML)${NC}"
elif grep -q "301\|302" "$AFTER_HEADERS"; then
    echo -e "${RED}❌ Worker returned redirect (port redirect active)${NC}"
    echo ""
    echo -e "${YELLOW}The worker is detecting port 8787 and redirecting.${NC}"
    echo -e "${YELLOW}This is correct production behavior but blocks local testing.${NC}"
    echo ""
    cat "$AFTER_BODY"
    echo ""
    exit 1
else
    echo -e "${YELLOW}⚠️  Got non-HTML response${NC}"
    head -20 "$AFTER_BODY"
fi
echo ""

echo -e "${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BOLD}2. HEADERS COMPARISON${NC}"
echo -e "${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

echo -e "${CYAN}${BOLD}BEFORE (Origin File):${NC}"
echo -e "${CYAN}────────────────${NC}"
echo -e "${CYAN}(Local HTML file - no headers)${NC}"
echo ""

echo -e "${GREEN}${BOLD}AFTER (Worker):${NC}"
echo -e "${GREEN}───────────────${NC}"
grep -i "access-control\|content-type\|x-robots\|age" "$AFTER_HEADERS" || echo "(No relevant headers)"
echo ""

echo -e "${BLUE}${BOLD}🔍 Key Differences:${NC}"
echo -e "${BLUE}──────────────────${NC}"
if grep -qi "access-control-allow-origin" "$AFTER_HEADERS"; then
    echo -e "${GREEN}✓ CORS headers added by worker${NC}"
else
    echo -e "${YELLOW}⚠️  CORS headers not found${NC}"
fi

if ! grep -qi "x-robots-tag" "$AFTER_HEADERS"; then
    echo -e "${GREEN}✓ 'x-robots-tag' not present (would be removed in production)${NC}"
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
    grep -o 'data-error="[^"]*"' "$BEFORE_BODY" | head -n 1
fi
echo ""

echo -e "${GREEN}${BOLD}AFTER (Worker):${NC}"
echo -e "${GREEN}───────────────${NC}"
echo -e "JSON-LD scripts found: ${AFTER_JSONLD}"
echo -e "Valid JSON-LD scripts: ${AFTER_JSONLD_VALID}"
if [ "$AFTER_JSONLD_VALID" -gt 0 ]; then
    echo -e "${GREEN}Sample valid JSON-LD:${NC}"
    grep -A 15 '@context.*schema.org' "$AFTER_BODY" | head -n 17
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
    echo -e "  ${GREEN}✓ Removed (moved to JSON-LD)${NC}"
fi
echo ""

echo "name=\"longdescription\" meta tags:"
echo "  Before: $BEFORE_LONGDESC"
echo "  After:  $AFTER_LONGDESC"
if [ "$AFTER_LONGDESC" -lt "$BEFORE_LONGDESC" ]; then
    echo -e "  ${GREEN}✓ Removed (moved to JSON-LD)${NC}"
fi
echo ""

echo "name=\"description\" meta tags:"
echo "  Before: $BEFORE_DESC"
echo "  After:  $AFTER_DESC"
if [ "$AFTER_DESC" -lt "$BEFORE_DESC" ]; then
    echo -e "  ${GREEN}✓ Removed (moved to JSON-LD)${NC}"
fi
echo ""

# Social media tags preserved
BEFORE_OG=$(grep -c 'property="og:' "$BEFORE_BODY" || echo "0")
AFTER_OG=$(grep -c 'property="og:' "$AFTER_BODY" || echo "0")

echo "property=\"og:*\" meta tags:"
echo "  Before: $BEFORE_OG"
echo "  After:  $AFTER_OG"
if [ "$AFTER_OG" -eq "$BEFORE_OG" ] && [ "$BEFORE_OG" -gt 0 ]; then
    echo -e "  ${GREEN}✓ Preserved (social media tags kept)${NC}"
elif [ "$AFTER_OG" -lt "$BEFORE_OG" ]; then
    echo -e "  ${YELLOW}⚠️  Some tags removed ($((BEFORE_OG - AFTER_OG)) missing)${NC}"
fi
echo ""

# Twitter tags
BEFORE_TWITTER=$(grep -c 'name="twitter:' "$BEFORE_BODY" || echo "0")
AFTER_TWITTER=$(grep -c 'name="twitter:' "$AFTER_BODY" || echo "0")

echo "name=\"twitter:*\" meta tags:"
echo "  Before: $BEFORE_TWITTER"
echo "  After:  $AFTER_TWITTER"
if [ "$AFTER_TWITTER" -eq "$BEFORE_TWITTER" ] && [ "$BEFORE_TWITTER" -gt 0 ]; then
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

echo -e "Before: ${CYAN}$(printf "%'d" $BEFORE_SIZE) bytes${NC}"
echo -e "After:  ${GREEN}$(printf "%'d" $AFTER_SIZE) bytes${NC}"
if [ $SIZE_DIFF -gt 0 ]; then
    echo -e "Change: ${GREEN}+$(printf "%'d" $SIZE_DIFF) bytes${NC} (JSON-LD added)"
elif [ $SIZE_DIFF -lt 0 ]; then
    echo -e "Change: ${YELLOW}$(printf "%'d" $SIZE_DIFF) bytes${NC}"
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
    echo -e "${GREEN}✓${NC} JSON-LD generated ($AFTER_JSONLD_VALID valid scripts)"
    if [ "$BEFORE_JSONLD_ERROR" -gt 0 ]; then
        echo -e "  ${GREEN}✓${NC} Fixed error script from origin"
    fi
else
    if [ "$BEFORE_JSONLD_ERROR" -gt 0 ]; then
        echo -e "${YELLOW}⚠${NC}  JSON-LD not generated (check og:title or trigger)"
    else
        echo -e "${BLUE}○${NC} No JSON-LD trigger found in page"
    fi
fi

# Metadata cleanup
REMOVED_COUNT=$((BEFORE_AUTHOR + BEFORE_LONGDESC + BEFORE_DESC - AFTER_AUTHOR - AFTER_LONGDESC - AFTER_DESC))
if [ $REMOVED_COUNT -gt 0 ]; then
    echo -e "${GREEN}✓${NC} Metadata cleaned up ($REMOVED_COUNT meta tags removed)"
    echo -e "  ${CYAN}→${NC} author, description, longdescription moved to JSON-LD"
else
    echo -e "${BLUE}○${NC} No metadata to clean up"
fi

# Social media preservation
if [ "$AFTER_OG" -eq "$BEFORE_OG" ] && [ "$BEFORE_OG" -gt 0 ]; then
    echo -e "${GREEN}✓${NC} Social media tags preserved ($AFTER_OG og:* tags)"
fi

if [ "$AFTER_TWITTER" -eq "$BEFORE_TWITTER" ] && [ "$BEFORE_TWITTER" -gt 0 ]; then
    echo -e "${GREEN}✓${NC} Twitter card tags preserved ($AFTER_TWITTER twitter:* tags)"
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
echo -e "${CYAN}💡 Search for specific changes:${NC}"
echo -e "   grep 'schema.org' $AFTER_BODY  # View generated JSON-LD"
echo -e "   diff <(grep 'og:' $BEFORE_BODY) <(grep 'og:' $AFTER_BODY)  # Compare OG tags"
echo ""
