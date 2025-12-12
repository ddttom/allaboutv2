#!/bin/bash
#
# Cloudflare Worker Test Regeneration Hook
#
# Purpose: Automatically regenerate test-rendered.html when cloudflare-worker.js is edited
# Trigger: PostToolUse (Edit, MultiEdit, Write)
# Target: cloudflare/files/cloudflare-worker.js
#
# This hook ensures that test-rendered.html stays synchronized with worker code changes
# by running the local HTML test after any modifications to the worker file.

set -euo pipefail

# Get the modified file path from the hook environment
# Claude Code provides this in MODIFIED_FILES or via stdin JSON
if [[ -n "${MODIFIED_FILES:-}" ]]; then
    file_path="$MODIFIED_FILES"
else
    # Parse JSON input from stdin (alternative method)
    file_path=$(cat | jq -r '.file_path // empty' 2>/dev/null || echo "")
fi

# Exit if no file path provided
if [[ -z "$file_path" ]]; then
    exit 0
fi

# Check if the modified file is cloudflare-worker.js
if [[ "$file_path" != *"cloudflare/files/cloudflare-worker.js" ]]; then
    exit 0  # Not the worker file, skip hook
fi

# Determine project root
if [[ -n "${CLAUDE_PROJECT_DIR:-}" ]]; then
    PROJECT_ROOT="$CLAUDE_PROJECT_DIR"
else
    PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
fi

# ANSI color codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}🤖 CLOUDFLARE WORKER TEST AUTOMATION${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}Detected change to: cloudflare-worker.js${NC}"
echo -e "${YELLOW}Running intelligent test automation...${NC}"
echo ""

# Run the intelligent test automation system
if node "$PROJECT_ROOT/.claude/hooks/cloudflare-test-automation.js"; then
    echo ""
    echo -e "${GREEN}✓ Test automation completed successfully${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    exit 0
else
    echo ""
    echo -e "${RED}✗ Test automation encountered errors${NC}"
    echo -e "${YELLOW}Check coverage report: cloudflare/test-coverage-report.md${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    exit 1
fi
