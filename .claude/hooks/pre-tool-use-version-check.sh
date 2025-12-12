#!/bin/bash

# Pre-Tool-Use Hook: Cloudflare Worker Validation
#
# This hook monitors edits to cloudflare/files/ and ensures:
# 1. WORKER_VERSION constant is incremented for worker.js changes
# 2. Two-file rule is followed (only .js and .test.js files)
# 3. Pure function pattern is maintained
#
# Triggered by: Edit, MultiEdit, Write tools
# Target files: cloudflare/files/*
# Action: Warn if rules are violated

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

# Function to check if any cloudflare/files/ file is being modified
is_cloudflare_file_modified() {
  local tool_name="${1:-}"
  local file_path="${2:-}"

  # Check if the tool is Edit, MultiEdit, or Write
  if [[ "$tool_name" != "Edit" && "$tool_name" != "MultiEdit" && "$tool_name" != "Write" ]]; then
    return 1
  fi

  # Check if the file is in cloudflare/files/
  if [[ "$file_path" == *"cloudflare/files/"* ]]; then
    return 0
  fi

  return 1
}

# Function to check for two-file rule violations
check_two_file_rule() {
  local file_path="${1:-}"

  # Only check if creating a new test file
  if [[ "$file_path" != *".test.js" ]]; then
    return 0
  fi

  # Check if the file is a new test file (not cloudflare-worker.test.js)
  if [[ "$file_path" == *"cloudflare-worker.test.js" ]]; then
    return 0
  fi

  # Check if it's in cloudflare/files/
  if [[ "$file_path" == *"cloudflare/files/"* && "$file_path" == *".test.js" ]]; then
    cat >&2 <<EOF

🚫 CLOUDFLARE WORKER TWO-FILE RULE VIOLATION

You are attempting to create: $(basename "$file_path")

⚠️  ERROR: Only ONE test file is allowed for Cloudflare workers!

The two-file rule requires:
  File 1: cloudflare-worker.js (production code)
  File 2: cloudflare-worker.test.js (unified tests)

❌ DO NOT create separate test files like:
  - cloudflare-worker.unit.test.js
  - cloudflare-worker.integration.test.js
  - Any other .test.js files

✅ ALL tests must be in: cloudflare-worker.test.js

Why this matters:
- Cloudflare Workers runtime APIs (HTMLRewriter) don't exist in Node.js
- Pure functions are testable; runtime-specific handlers are not
- One unified test file ensures all logic is testable

What to do:
  1. Add your tests to cloudflare-worker.test.js
  2. Implement core logic as pure functions (string → string)
  3. Use HTMLRewriter only for features that require it
  4. Run: /check-cloudflare-tests to validate structure

For complete details:
  - cloudflare/files/TESTING.md (two-file rule documentation)
  - cloudflare/files/README.md (testing requirements)
  - CLAUDE.md (Cloudflare Worker Two-File Testing System)

EOF
    exit 1
  fi

  return 0
}

# Function to warn about pure function requirements
warn_about_pure_functions() {
  cat >&2 <<EOF

📋 CLOUDFLARE WORKER TESTING REMINDER

You are modifying Cloudflare worker files.

⚠️  CRITICAL: Follow the two-file rule

Required structure:
  1. cloudflare-worker.js - Pure JavaScript functions
  2. cloudflare-worker.test.js - All tests (unit + integration)

✅ CORRECT pattern - Pure functions:
  export const replacePicturePlaceholder = (html) => {
    const pattern = /<div>.*Picture Here.*<\/div>/g;
    return html.replace(pattern, replacement);
  };

  // Test without Cloudflare runtime
  test('replaces Picture Here', () => {
    const result = replacePicturePlaceholder('<div>Picture Here</div>');
    expect(result).toContain('<img');
  });

❌ WRONG pattern - Runtime-specific APIs:
  export const handlePicturePlaceholder = (element) => {
    element.ontext((text) => {...});  // TypeError in tests!
  };

Before committing:
  1. Ensure all logic is pure functions
  2. Export all functions for testing
  3. Run: cd cloudflare/files && npm test
  4. Run: /check-cloudflare-tests

See: cloudflare/files/TESTING.md for complete guide

EOF
}

# Main hook logic
main() {
  # Get hook parameters
  local tool_name="${1:-}"
  local file_path="${2:-}"

  # Check for two-file rule violations (blocks operation if violated)
  check_two_file_rule "$file_path"

  # Show reminder if any cloudflare/files/ file is being modified
  if is_cloudflare_file_modified "$tool_name" "$file_path"; then
    # Only show reminder for .js files (not package.json, README.md, etc.)
    if [[ "$file_path" == *".js" && "$file_path" != *".test.js" ]]; then
      warn_about_pure_functions
    fi
  fi

  # Only proceed with version check if worker file is being modified
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
