#!/bin/bash
# Pre-commit hook for CHANGELOG.md validation
# Ensures CHANGELOG.md is updated before committing changes
#
# This hook runs before git commit operations
# It checks if CHANGELOG.md has been modified in the current commit
#
# To bypass validation when docs don't need updating:
#   SKIP_DOC_CHECK=1 git commit -m "message"
# Or set environment variable:
#   export SKIP_DOC_CHECK=1

set -euo pipefail

# Check if validation should be skipped
if [[ "${SKIP_DOC_CHECK:-0}" == "1" ]]; then
    echo -e "\033[1;33m⚠️  Documentation check skipped (SKIP_DOC_CHECK=1)\033[0m"
    exit 0
fi

# ANSI color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Get project root
PROJECT_ROOT="${CLAUDE_PROJECT_DIR:-$(git rev-parse --show-toplevel 2>/dev/null || pwd)}"
CHANGELOG_FILE="$PROJECT_ROOT/CHANGELOG.md"

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}🔍 PRE-COMMIT VALIDATION${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# Check if we're in a git repository
if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
    echo -e "${RED}❌ Not in a git repository${NC}"
    exit 0  # Don't block non-git operations
fi

# Get list of files being committed
STAGED_FILES=$(git diff --cached --name-only 2>/dev/null || echo "")

if [[ -z "$STAGED_FILES" ]]; then
    echo -e "${YELLOW}⚠️  No files staged for commit${NC}"
    exit 0
fi

# Check if CHANGELOG.md is being committed
if echo "$STAGED_FILES" | grep -q "^CHANGELOG.md$"; then
    echo -e "${GREEN}✓ CHANGELOG.md: Included in this commit${NC}"
    echo ""
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}✓ VALIDATION PASSED${NC}"
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    exit 0
fi

# Check if user accidentally created CHANGELOG in subdirectory
SUBDIR_CHANGELOG=$(echo "$STAGED_FILES" | grep -E "^.+/CHANGELOG\.md$" || echo "")
if [[ -n "$SUBDIR_CHANGELOG" ]]; then
    echo -e "${RED}❌ CHANGELOG.md: Found in subdirectory${NC}"
    echo ""
    echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${RED}❌ ERROR: Wrong Location${NC}"
    echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo -e "${RED}Found CHANGELOG.md in subdirectory:${NC}"
    echo -e "  ${SUBDIR_CHANGELOG}"
    echo ""
    echo -e "${YELLOW}⚠️  CHANGELOG.md must be at repository root, not in subdirectories${NC}"
    echo ""
    echo -e "${BLUE}💡 Correct location:${NC}"
    echo -e "  $PROJECT_ROOT/CHANGELOG.md"
    echo ""
    echo -e "${BLUE}💡 Next steps:${NC}"
    echo -e "  1. Remove subdirectory CHANGELOG: git rm ${SUBDIR_CHANGELOG}"
    echo -e "  2. Update root CHANGELOG: edit $PROJECT_ROOT/CHANGELOG.md"
    echo -e "  3. Stage root CHANGELOG: git add CHANGELOG.md"
    echo -e "  4. Amend this commit: git commit --amend --no-edit"
    echo ""
    echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${RED}❌ COMMIT BLOCKED${NC}"
    echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    exit 1
fi

# CHANGELOG.md is not being committed - warn the user
echo -e "${YELLOW}⚠️  CHANGELOG.md: Not included in this commit${NC}"
echo ""
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}⚠️  WARNING${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${YELLOW}You are committing code changes without updating CHANGELOG.md${NC}"
echo ""
echo -e "${BLUE}💡 Location:${NC}"
echo -e "  $PROJECT_ROOT/CHANGELOG.md (must be at repository root)"
echo ""
echo -e "${BLUE}💡 Next steps:${NC}"
echo -e "  1. Update CHANGELOG.md with your changes"
echo -e "  2. Stage the changes: git add CHANGELOG.md"
echo -e "  3. Amend this commit: git commit --amend --no-edit"
echo ""
echo -e "${BLUE}Or if CHANGELOG doesn't need updating:${NC}"
echo -e "  SKIP_DOC_CHECK=1 git commit -m \"your message\""
echo ""
echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${RED}❌ COMMIT BLOCKED${NC}"
echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

exit 1
