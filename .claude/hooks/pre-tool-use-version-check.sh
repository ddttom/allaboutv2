#!/bin/bash

# Pre-Tool-Use Hook: Cloudflare Worker Version Check
#
# This hook monitors edits to cloudflare/files/cloudflare-worker.js and ensures
# the WORKER_VERSION constant is incremented for all changes.
#
# Triggered by: Edit, MultiEdit, Write tools
# Target file: cloudflare/files/cloudflare-worker.js
# Action: Warn if version not incremented

set -euo pipefail

# Configuration
WORKER_FILE="cloudflare/files/cloudflare-worker.js"
VERSION_PATTERN='export const WORKER_VERSION = '\''\([0-9]\+\.[0-9]\+\.[0-9]\+\)'\''';'

# Function to extract version from file
get_current_version() {
  if [[ ! -f "$WORKER_FILE" ]]; then
    echo ""
    return
  fi

  grep "WORKER_VERSION" "$WORKER_FILE" | sed -n "s/.*WORKER_VERSION = '\([0-9.]*\)'.*/\1/p"
}

# Function to get version from git history
get_previous_version() {
  if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo ""
    return
  fi

  # Get the last committed version
  git show HEAD:"$WORKER_FILE" 2>/dev/null | grep "WORKER_VERSION" | sed -n "s/.*WORKER_VERSION = '\([0-9.]*\)'.*/\1/p" || echo ""
}

# Function to check if file is being modified
is_worker_file_modified() {
  local tool_name="${1:-}"
  local file_path="${2:-}"

  # Check if the tool is Edit, MultiEdit, or Write
  if [[ "$tool_name" != "Edit" && "$tool_name" != "MultiEdit" && "$tool_name" != "Write" ]]; then
    return 1
  fi

  # Check if the file being modified is the worker file
  if [[ "$file_path" == *"$WORKER_FILE"* ]]; then
    return 0
  fi

  return 1
}

# Main hook logic
main() {
  # Get hook parameters
  local tool_name="${1:-}"
  local file_path="${2:-}"

  # Only proceed if worker file is being modified
  if ! is_worker_file_modified "$tool_name" "$file_path"; then
    exit 0
  fi

  # Get versions
  local current_version
  local previous_version
  current_version=$(get_current_version)
  previous_version=$(get_previous_version)

  # If we can't determine versions, skip check
  if [[ -z "$current_version" || -z "$previous_version" ]]; then
    exit 0
  fi

  # Compare versions
  if [[ "$current_version" == "$previous_version" ]]; then
    cat >&2 <<EOF

⚠️  Cloudflare Worker Version Check

You are modifying: cloudflare/files/cloudflare-worker.js
Current version:   $current_version

⚠️  WARNING: Version has not been incremented!

According to project standards, ALL changes to the worker file MUST
include a version increment following semantic versioning.

Version increment rules:
  MAJOR (x.0.0) - Breaking changes or major features
  MINOR (1.x.0) - New features, backward-compatible changes
  PATCH (1.0.x) - Bug fixes, refactoring, documentation

How to increment version:
  1. Use command: /increment-cfw-version [MAJOR|MINOR|PATCH]
  2. Or manually update WORKER_VERSION in cloudflare-worker.js
  3. Then run tests: cd cloudflare/files && npm test

For more info, see: .claude/skills/cfw-version-monitor/SKILL.md

EOF
    # Don't block the operation, just warn
    exit 0
  fi

  # Version was incremented, show confirmation
  cat >&2 <<EOF

✅ Cloudflare Worker Version Updated

Previous version: $previous_version
New version:      $current_version

Remember to:
  1. Run tests: cd cloudflare/files && npm test
  2. Update CHANGELOG.md with changes
  3. Update documentation if needed

EOF

  exit 0
}

# Run main function with all arguments
main "$@"
