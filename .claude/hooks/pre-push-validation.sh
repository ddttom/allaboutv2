#!/bin/bash
# Pre-push validation hook for Claude Code
# Ensures CLAUDE.md, README.md, and CHANGELOG.md are updated before pushing
#
# This hook runs before git push operations to validate documentation is current

set -euo pipefail

# ANSI color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Get project root
PROJECT_ROOT="${CLAUDE_PROJECT_DIR:-$(git rev-parse --show-toplevel 2>/dev/null || pwd)}"

# Files to check
CRITICAL_FILES=(
    "CLAUDE.md"
    "README.md"
    "CHANGELOG.md"
)

# Function to check if file has uncommitted changes
has_uncommitted_changes() {
    local file="$1"
    git diff --quiet "$file" 2>/dev/null
    return $?
}

# Function to check if file is in staging area
is_staged() {
    local file="$1"
    git diff --cached --quiet "$file" 2>/dev/null
    return $?
}

# Function to get last modified date of file
get_last_modified() {
    local file="$1"
    if [[ -f "$PROJECT_ROOT/$file" ]]; then
        git log -1 --format="%ci" -- "$file" 2>/dev/null || echo "never"
    else
        echo "missing"
    fi
}

# Function to get last commit date
get_last_commit_date() {
    git log -1 --format="%ci" 2>/dev/null || echo "never"
}

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}🔍 PRE-PUSH VALIDATION${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# Check if we're in a git repository
if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
    echo -e "${RED}❌ Not in a git repository${NC}"
    exit 0  # Don't block non-git operations
fi

# Get commits about to be pushed
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
UPSTREAM_BRANCH=$(git rev-parse --abbrev-ref "@{u}" 2>/dev/null || echo "")

if [[ -z "$UPSTREAM_BRANCH" ]]; then
    echo -e "${YELLOW}⚠️  No upstream branch configured${NC}"
    echo -e "${YELLOW}   This appears to be a new branch - validation skipped${NC}"
    exit 0
fi

# Count commits to be pushed
COMMITS_TO_PUSH=$(git log "$UPSTREAM_BRANCH..HEAD" --oneline 2>/dev/null | wc -l | tr -d ' ')

if [[ "$COMMITS_TO_PUSH" -eq 0 ]]; then
    echo -e "${GREEN}✓ No commits to push${NC}"
    exit 0
fi

echo -e "${BLUE}📊 Commits to push: ${COMMITS_TO_PUSH}${NC}"
echo -e "${BLUE}🌿 Branch: ${CURRENT_BRANCH} → ${UPSTREAM_BRANCH}${NC}"
echo ""

# Get date of oldest unpushed commit
OLDEST_UNPUSHED_DATE=$(git log "$UPSTREAM_BRANCH..HEAD" --reverse --format="%ci" | head -1)

echo -e "${YELLOW}📝 Checking documentation files...${NC}"
echo ""

VALIDATION_FAILED=0
WARNINGS=()

for file in "${CRITICAL_FILES[@]}"; do
    LAST_MODIFIED=$(get_last_modified "$file")

    if [[ "$LAST_MODIFIED" == "missing" ]]; then
        echo -e "${RED}❌ $file: File not found${NC}"
        VALIDATION_FAILED=1
        continue
    fi

    if [[ "$LAST_MODIFIED" == "never" ]]; then
        echo -e "${RED}❌ $file: Never committed${NC}"
        VALIDATION_FAILED=1
        continue
    fi

    # Check if file has changes since oldest unpushed commit
    if [[ "$LAST_MODIFIED" < "$OLDEST_UNPUSHED_DATE" ]]; then
        echo -e "${RED}❌ $file: Not updated since ${OLDEST_UNPUSHED_DATE:0:10}${NC}"
        echo -e "${RED}   Last modified: ${LAST_MODIFIED:0:10}${NC}"
        VALIDATION_FAILED=1
    else
        # Check if file has uncommitted changes
        if ! has_uncommitted_changes "$file"; then
            echo -e "${YELLOW}⚠️  $file: Has uncommitted changes${NC}"
            WARNINGS+=("$file has uncommitted changes")
        # Check if file has staged changes
        elif ! is_staged "$file"; then
            echo -e "${YELLOW}⚠️  $file: Has staged but uncommitted changes${NC}"
            WARNINGS+=("$file has staged changes")
        else
            echo -e "${GREEN}✓ $file: Updated ${LAST_MODIFIED:0:10}${NC}"
        fi
    fi
done

echo ""

# Display validation results
if [[ $VALIDATION_FAILED -eq 1 ]]; then
    echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${RED}❌ VALIDATION FAILED${NC}"
    echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo -e "${YELLOW}Please update the following files before pushing:${NC}"
    for file in "${CRITICAL_FILES[@]}"; do
        LAST_MODIFIED=$(get_last_modified "$file")
        if [[ "$LAST_MODIFIED" < "$OLDEST_UNPUSHED_DATE" ]] || [[ "$LAST_MODIFIED" == "never" ]] || [[ "$LAST_MODIFIED" == "missing" ]]; then
            echo -e "  • ${file}"
        fi
    done
    echo ""
    echo -e "${YELLOW}💡 Tips:${NC}"
    echo -e "  1. Update CHANGELOG.md with your changes"
    echo -e "  2. Update README.md if project structure changed"
    echo -e "  3. Update CLAUDE.md if AI instructions changed"
    echo -e "  4. Commit your documentation updates"
    echo -e "  5. Push again"
    echo ""
    echo -e "${YELLOW}To bypass this check (NOT RECOMMENDED):${NC}"
    echo -e "  git push --no-verify"
    echo ""
    exit 1
fi

# Display warnings but don't block
if [[ ${#WARNINGS[@]} -gt 0 ]]; then
    echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${YELLOW}⚠️  WARNINGS${NC}"
    echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    for warning in "${WARNINGS[@]}"; do
        echo -e "${YELLOW}  • $warning${NC}"
    done
    echo ""
    echo -e "${YELLOW}💡 Consider committing these changes before pushing${NC}"
    echo ""
fi

echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✓ VALIDATION PASSED${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

exit 0
