# Hooks Configuration Guide

This guide explains how to configure and customize the hooks system for your project.

## Current Configuration

This project uses a **minimal hooks setup** optimized for EDS development. The active configuration in `.claude/settings.json`:

```json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "$CLAUDE_PROJECT_DIR/.claude/hooks/skill-activation-prompt.sh"
          }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Edit|MultiEdit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "$CLAUDE_PROJECT_DIR/.claude/hooks/post-tool-use-tracker.sh"
          },
          {
            "type": "command",
            "command": "$CLAUDE_PROJECT_DIR/.claude/hooks/cloudflare-worker-test-regenerate.sh"
          }
        ]
      }
    ]
  }
}
```

### Active Hooks

**skill-activation-prompt.sh**
- **Trigger:** When user submits a prompt
- **Purpose:** Auto-suggest relevant skills based on prompt content
- **Implementation:** TypeScript-based detection in `skill-activation-prompt.ts`

**post-tool-use-tracker.sh**
- **Trigger:** After Edit, MultiEdit, or Write operations
- **Purpose:** Track modified files for session context
- **Implementation:** Bash script with minimal overhead

**pre-tool-use-version-check.sh** (Cloudflare Worker Version Monitor)
- **Trigger:** Before Edit, MultiEdit, or Write operations on `cloudflare/files/cloudflare-worker.js`
- **Purpose:** Monitor and enforce version increments for worker changes
- **Implementation:** Bash script with git version comparison
- **Features:**
  - Detects version changes by comparing with git HEAD
  - Warns if WORKER_VERSION not incremented
  - Validates two-file rule (only cloudflare-worker.test.js allowed)
  - Reminds developers to update four version locations:
    1. WORKER_VERSION constant (line 20)
    2. @version comment in file header (line 15)
    3. package.json version field
    4. cloudflare/test.html footer (line 395)
- **Benefits:**
  - Enforces semantic versioning discipline
  - Prevents accidental deployment with stale version
  - Maintains version consistency across files
  - Catches two-file rule violations early
- **Note:** Version is hardcoded for Cloudflare Workers compatibility (no JSON import)

**cloudflare-worker-test-regenerate.sh** (Enhanced with AI Test Automation)
- **Trigger:** After Edit, MultiEdit, or Write operations on `cloudflare/files/cloudflare-worker.js`
- **Purpose:** Intelligent test automation system with auto-generation and coverage reporting
- **Implementation:** Calls `cloudflare-test-automation.js` for complete test lifecycle management
- **Features:**
  - Detects changes via git diff (new/modified/deleted functions)
  - Auto-generates test stubs for new functions
  - Auto-updates test expectations for modified functions
  - Creates timestamped backups before making changes
  - Runs all tests (npm test + test:local)
  - Generates comprehensive coverage report
  - Rollback capability if tests fail
- **Benefits:**
  - Ensures tests stay synchronized with worker code
  - Reduces manual test writing effort
  - Provides immediate validation of changes
  - Comprehensive audit trail via coverage reports
  - Safe with backup/rollback mechanism
- **See:** `.claude/hooks/cloudflare-test-automation.README.md` for complete documentation

**pre-commit-changelog.sh** (Git Hook)
- **Trigger:** Before `git commit` operations
- **Purpose:**
  - **REQUIRED:** Validates CHANGELOG.md is included in commits (blocks commit if missing)
  - **Simple Check:** Verifies CHANGELOG.md is staged before allowing commit
  - **Works with Claude Code:** No TTY issues - just checks staged files
- **Implementation:** Bash script with staged file detection
  - Uses `git diff --cached --name-only` to check for CHANGELOG.md
  - No interactive prompts - just validates file is staged
  - Works seamlessly in all environments (terminal, IDE, CI/CD)
- **Usage:**
  - Runs automatically before every commit: `git commit -m "message"`
  - Blocks commit if CHANGELOG.md not staged
  - Provides clear instructions on next steps
- **Bypass:** Use `SKIP_DOC_CHECK=1 git commit -m "message"` (only if CHANGELOG truly doesn't need updating)
- **Workflow:**
  1. Make code changes
  2. Update CHANGELOG.md with your changes
  3. Stage both: `git add . CHANGELOG.md`
  4. Commit: `git commit -m "your message"`
  5. Hook validates CHANGELOG.md is included, allows commit
  6. Push: `git push` (no validation hook on push)

## Quick Start Configuration

### 1. Verify Existing Setup

The configuration is already in place. To verify:

```bash
cat .claude/settings.json | jq .hooks
```

### 2. Install Dependencies

The hooks use TypeScript, which requires dependencies:

```bash
cd .claude/hooks
npm install
```

### 3. Verify Execute Permissions

Hooks should already have execute permissions:

```bash
ls -la .claude/hooks/*.sh
```

If needed, set permissions:
```bash
chmod +x .claude/hooks/*.sh
```

## Customization Options

### EDS Project Structure

This project follows Adobe Edge Delivery Services conventions:

**Blocks:** `blocks/` - EDS block components
**Build:** `build/` - Build-enhanced blocks with dependencies
**Scripts:** `scripts/` - Shared JavaScript utilities
**Docs:** `docs/` - Documentation including `docs/for-ai/`
**Tools:** `tools/` - Development and build tools

### Customizing Skill Triggers

The `skill-activation-prompt.ts` hook auto-suggests skills based on:
- Keywords in user prompts
- Intent patterns (regex matching)
- File paths being modified
- Content patterns in files

Edit `.claude/skills/skill-rules.json` to customize triggers for EDS-specific patterns.

### File Tracking Customization

The `post-tool-use-tracker.sh` hook tracks modified files. Customize what gets tracked:

Edit `.claude/hooks/post-tool-use-tracker.sh`:

```bash
# Skip certain files or directories
if [[ "$file_path" =~ /node_modules/ ]] || [[ "$file_path" =~ /\.cache/ ]]; then
    exit 0  # Don't track
fi
```

### EDS-Specific Patterns

For EDS development, you might want to track:
- Block JavaScript files: `blocks/**/*.js`
- Block CSS files: `blocks/**/*.css`
- Test files: `blocks/**/test.html`
- Jupyter notebooks: `**/*.ipynb`
- Documentation: `docs/**/*.md`

## Environment Variables

### Global Environment Variables

Set in your shell profile (`.bashrc`, `.zshrc`, etc.):

```bash
# Disable error handling reminders
export SKIP_ERROR_REMINDER=1

# Custom project directory (if not using default)
export CLAUDE_PROJECT_DIR=/path/to/your/project
```

### Per-Session Environment Variables

Set before starting Claude Code:

```bash
SKIP_ERROR_REMINDER=1 claude-code
```

## Hook Execution Order

Hooks run in the order specified in `settings.json`. This project has two sequential hook triggers:

1. **UserPromptSubmit** - skill-activation-prompt.sh runs first
2. **PostToolUse** - post-tool-use-tracker.sh runs after file edits

**Why this order matters:**
- Skill suggestions happen before any work begins
- File tracking happens after edits are made
- Minimal overhead for fast development workflow

## Selective Hook Enabling

This project uses a minimal, optimized setup. You can customize by enabling/disabling hooks:

### Current Setup (Both Hooks)

```json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "$CLAUDE_PROJECT_DIR/.claude/hooks/skill-activation-prompt.sh"
          }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Edit|MultiEdit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "$CLAUDE_PROJECT_DIR/.claude/hooks/post-tool-use-tracker.sh"
          }
        ]
      }
    ]
  }
}
```

### Skill Activation Only

```json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "$CLAUDE_PROJECT_DIR/.claude/hooks/skill-activation-prompt.sh"
          }
        ]
      }
    ]
  }
}
```

### File Tracking Only

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|MultiEdit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "$CLAUDE_PROJECT_DIR/.claude/hooks/post-tool-use-tracker.sh"
          }
        ]
      }
    ]
  }
}
```

## Cache Management

### Cache Location

```
$CLAUDE_PROJECT_DIR/.claude/tsc-cache/[session_id]/
```

### Manual Cache Cleanup

```bash
# Remove all cached data
rm -rf $CLAUDE_PROJECT_DIR/.claude/tsc-cache/*

# Remove specific session
rm -rf $CLAUDE_PROJECT_DIR/.claude/tsc-cache/[session-id]
```

### Automatic Cleanup

The build-check hook automatically cleans up session cache on successful builds.

## Troubleshooting Configuration

### Hook Not Executing

1. **Check registration:** Verify hook is in `.claude/settings.json`
2. **Check permissions:** Run `chmod +x .claude/hooks/*.sh`
3. **Check path:** Ensure `$CLAUDE_PROJECT_DIR` is set correctly
4. **Check TypeScript:** Run `cd .claude/hooks && npx tsc` to check for errors

### False Positive Detections

**Issue:** Hook triggers for files it shouldn't

**Solution:** Add skip conditions in the relevant hook:

```bash
# In post-tool-use-tracker.sh
if [[ "$file_path" =~ /generated/ ]]; then
    exit 0  # Skip generated files
fi
```

### Performance Issues

**Issue:** Hooks are slow

**Solutions:**
1. Limit TypeScript checks to changed files only
2. Use faster package managers (pnpm > npm)
3. Add more skip conditions
4. Disable Prettier for large files

```bash
# Skip large files in stop-prettier-formatter.sh
file_size=$(wc -c < "$file" 2>/dev/null || echo 0)
if [[ $file_size -gt 100000 ]]; then  # Skip files > 100KB
    continue
fi
```

### Debugging Hooks

Add debug output to any hook:

```bash
# At the top of the hook script
set -x  # Enable debug mode

# Or add specific debug lines
echo "DEBUG: file_path=$file_path" >&2
echo "DEBUG: repo=$repo" >&2
```

View hook execution in Claude Code's logs.

## Advanced Configuration

### Custom Hook Event Handlers

You can create your own hooks for other events:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "$CLAUDE_PROJECT_DIR/.claude/hooks/my-custom-bash-guard.sh"
          }
        ]
      }
    ]
  }
}
```

### EDS Multi-Directory Projects

For projects with multiple block collections:

```bash
# In post-tool-use-tracker.sh
case "$directory" in
    blocks)
        echo "Main EDS blocks"
        ;;
    build)
        echo "Build-enhanced blocks"
        ;;
esac
```

### Custom Linting Integration

EDS projects use ESLint and Stylelint:

```bash
# Add to post-tool-use-tracker.sh
if [[ "$file_path" =~ \.js$ ]]; then
    npx eslint "$file_path"
fi
if [[ "$file_path" =~ \.css$ ]]; then
    npx stylelint "$file_path"
fi
```

## Best Practices

1. **Start minimal** - Enable hooks one at a time
2. **Test thoroughly** - Make changes and verify hooks work
3. **Document customizations** - Add comments to explain custom logic
4. **Version control** - Commit `.claude/` directory to git
5. **Team consistency** - Share configuration across team

## See Also

- [README.md](./README.md) - Hooks overview
- [../../docs/HOOKS_SYSTEM.md](../../docs/HOOKS_SYSTEM.md) - Complete hooks reference
- [../../docs/SKILLS_SYSTEM.md](../../docs/SKILLS_SYSTEM.md) - Skills integration
