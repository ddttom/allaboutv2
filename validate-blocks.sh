#!/bin/bash
# validate-blocks.sh
# EDS Blocks Standards Compliance Validation Script
# Checks for common EDS standards violations across all blocks

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔍 EDS BLOCKS STANDARDS VALIDATION"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Counter for violations
VIOLATION_COUNT=0

# Check 1: Reserved Class Names (-container, -wrapper)
echo "1️⃣  RESERVED CLASS NAMES"
echo "   Checking for .{blockname}-container and .{blockname}-wrapper patterns..."
echo ""

CONTAINER_VIOLATIONS=$(grep -r "^\.[a-z-]*-container\s*{" blocks/*/*.css 2>/dev/null | grep -v "button-container" | grep -v "\.\w\+-\w\+-container")
WRAPPER_VIOLATIONS=$(grep -r "^\.[a-z-]*-wrapper\s*{" blocks/*/*.css 2>/dev/null | grep -v "\.\w\+-\w\+-wrapper")

if [ -z "$CONTAINER_VIOLATIONS" ] && [ -z "$WRAPPER_VIOLATIONS" ]; then
  echo "   ✅ No reserved class name violations found"
else
  if [ ! -z "$CONTAINER_VIOLATIONS" ]; then
    echo "   ❌ CRITICAL: Found .{blockname}-container patterns:"
    echo "$CONTAINER_VIOLATIONS" | while read line; do
      echo "      $line"
      ((VIOLATION_COUNT++))
    done
  fi
  if [ ! -z "$WRAPPER_VIOLATIONS" ]; then
    echo "   ❌ CRITICAL: Found .{blockname}-wrapper patterns:"
    echo "$WRAPPER_VIOLATIONS" | while read line; do
      echo "      $line"
      ((VIOLATION_COUNT++))
    done
  fi
fi
echo ""

# Check 2: Global Selectors (document.querySelector)
echo "2️⃣  GLOBAL SELECTORS"
echo "   Checking for document.querySelector() instead of block parameter..."
echo ""

GLOBAL_SELECTORS=$(grep -r "document\.querySelector\(" blocks/*/*.js 2>/dev/null | \
  grep -v "meta\[" | \
  grep -v "\"head\"" | \
  grep -v "'head'" | \
  grep -v "\"main\"" | \
  grep -v "'main'" | \
  grep -v "\"body\"" | \
  grep -v "'body'" | \
  grep -v "//.*document\.querySelector")

if [ -z "$GLOBAL_SELECTORS" ]; then
  echo "   ✅ No global selector violations found (legitimate uses excluded)"
else
  echo "   ❌ CRITICAL: Found document.querySelector() violations:"
  echo "$GLOBAL_SELECTORS" | head -n 15 | while read line; do
    echo "      $line"
    ((VIOLATION_COUNT++))
  done
  TOTAL_GLOBAL=$(echo "$GLOBAL_SELECTORS" | wc -l | tr -d ' ')
  if [ "$TOTAL_GLOBAL" -gt 15 ]; then
    echo "      ... and $((TOTAL_GLOBAL - 15)) more"
  fi
fi
echo ""

# Check 3: Inline CSS (element.style)
echo "3️⃣  INLINE CSS"
echo "   Checking for element.style.property usage..."
echo ""

INLINE_CSS=$(grep -r "\.style\." blocks/*/*.js 2>/dev/null | \
  grep -v "\.style\.cssText" | \
  grep -v "//.*\.style\.")

if [ -z "$INLINE_CSS" ]; then
  echo "   ✅ No inline CSS violations found"
else
  echo "   ⚠️  HIGH: Found inline CSS usage:"
  echo "$INLINE_CSS" | head -n 10 | while read line; do
    echo "      $line"
    ((VIOLATION_COUNT++))
  done
  TOTAL_INLINE=$(echo "$INLINE_CSS" | wc -l | tr -d ' ')
  if [ "$TOTAL_INLINE" -gt 10 ]; then
    echo "      ... and $((TOTAL_INLINE - 10)) more"
  fi
fi
echo ""

# Check 4: Missing CONFIG Objects
echo "4️⃣  MISSING CONFIG OBJECTS"
echo "   Checking for CONFIG objects in block JS files..."
echo ""

MISSING_CONFIG=0
for dir in blocks/*/; do
  blockname=$(basename "$dir")
  jsfile="blocks/$blockname/$blockname.js"
  if [ -f "$jsfile" ]; then
    if ! grep -q "_CONFIG\s*=" "$jsfile" 2>/dev/null; then
      if [ $MISSING_CONFIG -eq 0 ]; then
        echo "   ⚠️  MEDIUM: Blocks missing CONFIG objects:"
      fi
      echo "      - $blockname"
      ((MISSING_CONFIG++))
      ((VIOLATION_COUNT++))
    fi
  fi
done

if [ $MISSING_CONFIG -eq 0 ]; then
  echo "   ✅ All blocks have CONFIG objects"
fi
echo ""

# Check 5: Async Functions Without Try/Catch
echo "5️⃣  ERROR HANDLING"
echo "   Checking for async functions without try/catch..."
echo ""

# This is a basic check - looks for async functions that don't have try/catch
ASYNC_NO_TRY=$(for file in blocks/*/*.js; do
  if grep -q "export default async function" "$file" 2>/dev/null; then
    if ! grep -q "try\s*{" "$file" 2>/dev/null; then
      echo "$file"
    fi
  fi
done)

if [ -z "$ASYNC_NO_TRY" ]; then
  echo "   ✅ Async functions appear to have error handling"
else
  echo "   ⚠️  MEDIUM: Async functions possibly missing try/catch:"
  echo "$ASYNC_NO_TRY" | while read file; do
    echo "      - $file"
    ((VIOLATION_COUNT++))
  done
fi
echo ""

# Summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 VALIDATION SUMMARY"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ $VIOLATION_COUNT -eq 0 ]; then
  echo "   ✅ All checks passed! No violations found."
  echo ""
  exit 0
else
  echo "   ⚠️  Found issues that need attention"
  echo "   Total violations detected: $VIOLATION_COUNT"
  echo ""
  echo "   Next steps:"
  echo "   1. Review the violations listed above"
  echo "   2. Follow the fix patterns in the plan"
  echo "   3. Run this script again after fixes"
  echo ""
  exit 1
fi
