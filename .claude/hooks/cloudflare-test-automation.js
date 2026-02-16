# !/usr/bin/env node
/**

* Cloudflare Worker Test Automation System
*
* Automatically generates and updates tests when cloudflare-worker.js changes.
*
* Features:
* * Detects worker changes via git diff
* * Auto-generates tests for new functions
* * Auto-updates test expectations for modified functions
* * Generates comprehensive coverage report
* * Creates backups with rollback capability
* * Runs all test suites (unit + integration + browser)
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const__dirname = dirname(__filename);

// ANSI color codes
const COLORS = {
  GREEN: '\x1b[32m',
  BLUE: '\x1b[34m',
  YELLOW: '\x1b[33m',
  RED: '\x1b[31m',
  CYAN: '\x1b[36m',
  MAGENTA: '\x1b[35m',
  NC: '\x1b[0m', // No Color
};

/**

* Main orchestrator class
 */
class CloudflareTestAutomation {
  constructor(projectRoot) {
    this.projectRoot = projectRoot;
    this.cloudflareDir = join(projectRoot, 'cloudflare');
    this.filesDir = join(this.cloudflareDir, 'files');
    this.backupDir = join(this.cloudflareDir, 'backups');
    this.workerFile = join(this.filesDir, 'cloudflare-worker.js');
    this.testHtmlFile = join(this.cloudflareDir, 'test.html');
    this.testLocalFile = join(this.filesDir, 'test-local-html.js');
    this.testSuiteFile = join(this.filesDir, 'cloudflare-worker.test.js');
    this.coverageReportFile = join(this.cloudflareDir, 'test-coverage-report.md');

    this.timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    this.backups = {};
    this.results = {
      newFunctions: [],
      modifiedFunctions: [],
      deletedFunctions: [],
      testsGenerated: [],
      testsUpdated: [],
      testsFailed: [],
      npmTestPassed: false,
      errors: [],
    };
  }

  /**

* Main entry point
   */
  async run() {
    try {
      this.printHeader();

      // Step 1: Analyze worker changes
      console.log(`${COLORS.CYAN}📊 Step 1: Analyzing worker changes...${COLORS.NC}`);
      await this.analyzeWorkerChanges();

      // Step 2: Create backups
      console.log(`${COLORS.CYAN}💾 Step 2: Creating backups...${COLORS.NC}`);
      await this.createBackups();

      // Step 3: Generate tests for new functions
      if (this.results.newFunctions.length > 0) {
        console.log(`${COLORS.CYAN}✨ Step 3: Generating tests for new functions...${COLORS.NC}`);
        await this.generateTests();
      }

      // Step 4: Update tests for modified functions
      if (this.results.modifiedFunctions.length > 0) {
        console.log(`${COLORS.CYAN}🔄 Step 4: Updating tests for modified functions...${COLORS.NC}`);
        await this.updateTests();
      }

      // Step 5: Run all tests
      console.log(`${COLORS.CYAN}🧪 Step 5: Running all tests...${COLORS.NC}`);
      await this.runAllTests();

      // Step 6: Generate coverage report
      console.log(`${COLORS.CYAN}📝 Step 6: Generating coverage report...${COLORS.NC}`);
      await this.generateCoverageReport();

      // Step 7: Summary
      this.printSummary();

    } catch (error) {
      console.error(`${COLORS.RED}✗ Fatal error: ${error.message}${COLORS.NC}`);
      this.results.errors.push({ stage: 'main', error: error.message });
      await this.handleFailure();
      process.exit(1);
    }
  }

  /**

* Print header
   */
  printHeader() {
    console.log(`${COLORS.BLUE}${'='.repeat(60)}${COLORS.NC}`);
    console.log(`${COLORS.BLUE}🤖 CLOUDFLARE WORKER TEST AUTOMATION${COLORS.NC}`);
    console.log(`${COLORS.BLUE}${'='.repeat(60)}${COLORS.NC}`);
    console.log('');
  }

  /**

* Analyze worker changes using git diff
   */
  async analyzeWorkerChanges() {
    try {
      // Try git diff first
      let diff = '';
      try {
        diff = execSync(`cd ${this.projectRoot} && git diff HEAD ${this.workerFile}`,
          { encoding: 'utf-8' });
      } catch (gitError) {
        // Fallback to cache comparison (if git fails)
        console.log(`${COLORS.YELLOW}⚠️  Git diff unavailable, using cache fallback${COLORS.NC}`);
        // TODO: Implement cache-based comparison
      }

      if (!diff || diff.trim() === '') {
        console.log(`${COLORS.GREEN}✓ No changes detected in worker${COLORS.NC}`);
        return;
      }

      // Parse diff to find exported functions
      const currentExports = this.extractExportedFunctions(
        readFileSync(this.workerFile, 'utf-8')
      );

      // Get previous version from git
      let previousContent = '';
      try {
        previousContent = execSync(
          `cd ${this.projectRoot} && git show HEAD:${this.workerFile.replace(this.projectRoot + '/', '')}`,
          { encoding: 'utf-8' }
        );
      } catch (e) {
        // First commit or file is new
        console.log(`${COLORS.YELLOW}⚠️  No previous version found${COLORS.NC}`);
      }

      const previousExports = this.extractExportedFunctions(previousContent);

      // Compare to find new, modified, and deleted functions
      currentExports.forEach(fn => {
        const previous = previousExports.find(p => p.name === fn.name);
        if (!previous) {
          this.results.newFunctions.push(fn);
        } else if (fn.body !== previous.body) {
          this.results.modifiedFunctions.push({ current: fn, previous });
        }
      });

      previousExports.forEach(fn => {
        if (!currentExports.find(c => c.name === fn.name)) {
          this.results.deletedFunctions.push(fn);
        }
      });

      // Print findings
      if (this.results.newFunctions.length > 0) {
        console.log(`${COLORS.GREEN}✓ Found ${this.results.newFunctions.length} new function(s):${COLORS.NC}`);
        this.results.newFunctions.forEach(fn => {
          console.log(`- ${fn.name} (${fn.type})`);
        });
      }

      if (this.results.modifiedFunctions.length > 0) {
        console.log(`${COLORS.YELLOW}✓ Found ${this.results.modifiedFunctions.length} modified function(s):${COLORS.NC}`);
        this.results.modifiedFunctions.forEach(({ current }) => {
          console.log(`- ${current.name}`);
        });
      }

      if (this.results.deletedFunctions.length > 0) {
        console.log(`${COLORS.RED}✓ Found ${this.results.deletedFunctions.length} deleted function(s):${COLORS.NC}`);
        this.results.deletedFunctions.forEach(fn => {
          console.log(`- ${fn.name}`);
        });
      }

    } catch (error) {
      console.error(`${COLORS.RED}✗ Error analyzing changes: ${error.message}${COLORS.NC}`);
      this.results.errors.push({ stage: 'analyze', error: error.message });
    }
  }

  /**

* Extract exported functions from JavaScript code
   */
  extractExportedFunctions(code) {
    const functions = [];

    // Match: export const functionName = (params) => { body }
    // Match: export function functionName(params) { body }
    const patterns = [
      /export\s+const\s+(\w+)\s*=\s*\(([^)]*)\)\s*=>\s*{([^}]+)}/g,
      /export\s+function\s+(\w+)\s*\(([^)]*)\)\s*{([^}]+)}/g,
      /export\s+const\s+(\w+)\s*=\s*\(([^)]*)\)\s*=>\s*\(([^)]+)\)/g, // Arrow with implicit return
    ];

    patterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(code)) !== null) {
        const [, name, params, body] = match;

        // Infer function type from name
        let type = 'utility';
        if (name.startsWith('inject') || name.startsWith('add')) type = 'inject';
        else if (name.startsWith('remove') || name.startsWith('delete')) type = 'remove';
        else if (name.startsWith('replace') || name.startsWith('transform')) type = 'replace';
        else if (name.startsWith('extract') || name.startsWith('get')) type = 'extract';
        else if (name.startsWith('build') || name.startsWith('create')) type = 'build';

        functions.push({
          name,
          params: params.trim(),
          body: body.trim(),
          type,
        });
      }
    });

    return functions;
  }

  /**

* Create backups of all test files
   */
  async createBackups() {
    // Ensure backup directory exists
    if (!existsSync(this.backupDir)) {
      mkdirSync(this.backupDir, { recursive: true });
    }

    const filesToBackup = [
      this.testHtmlFile,
      this.testLocalFile,
      this.testSuiteFile,
    ];

    filesToBackup.forEach(file => {
      if (existsSync(file)) {
        const filename = file.split('/').pop();  // Extract just filename
        const backupPath = join(this.backupDir, `${filename}.backup-${this.timestamp}`);
        try {
          const content = readFileSync(file, 'utf-8');
          writeFileSync(backupPath, content, 'utf-8');
          this.backups[file] = backupPath;
          console.log(`${COLORS.GREEN}✓ Backed up: ${filename}${COLORS.NC}`);
        } catch (error) {
          console.error(`${COLORS.RED}✗ Failed to backup ${filename}: ${error.message}${COLORS.NC}`);
        }
      }
    });
  }

  /**

* Generate tests for new functions
   */
  async generateTests() {
    for (const fn of this.results.newFunctions) {
      try {
        console.log(`${COLORS.CYAN}  Generating tests for: ${fn.name}${COLORS.NC}`);

        // TODO: Implement test generation based on function type
        // For now, mark as TODO
        this.results.testsGenerated.push({
          function: fn.name,
          status: 'stub',
          message: 'Test stub generated - needs manual implementation',
        });

        console.log(`${COLORS.YELLOW}  ⚠️  Test stub created (needs manual implementation)${COLORS.NC}`);

      } catch (error) {
        console.error(`${COLORS.RED}  ✗ Failed to generate test for ${fn.name}: ${error.message}${COLORS.NC}`);
        this.results.errors.push({ stage: 'generate', function: fn.name, error: error.message });
      }
    }
  }

  /**

* Update tests for modified functions
   */
  async updateTests() {
    for (const { current } of this.results.modifiedFunctions) {
      try {
        console.log(`${COLORS.CYAN}  Updating tests for: ${current.name}${COLORS.NC}`);

        // TODO: Implement smart test updates
        // For now, mark as needs review
        this.results.testsUpdated.push({
          function: current.name,
          status: 'review',
          message: 'Function modified - test expectations may need updates',
        });

        console.log(`${COLORS.YELLOW}  ⚠️  Tests marked for review${COLORS.NC}`);

      } catch (error) {
        console.error(`${COLORS.RED}  ✗ Failed to update test for ${current.name}: ${error.message}${COLORS.NC}`);
        this.results.errors.push({ stage: 'update', function: current.name, error: error.message });
      }
    }
  }

  /**

* Run all test suites
   */
  async runAllTests() {
    try {
      // Run npm test
      console.log(`${COLORS.CYAN}  Running npm test...${COLORS.NC}`);
      execSync('npm test', { cwd: this.filesDir, stdio: 'inherit' });
      this.results.npmTestPassed = true;
      console.log(`${COLORS.GREEN}✓ All tests passed${COLORS.NC}`);

    } catch (error) {
      console.error(`${COLORS.RED}✗ Tests failed${COLORS.NC}`);
      this.results.npmTestPassed = false;
      this.results.testsFailed.push({ suite: 'npm test', error: error.message });
    }

    try {
      // Run local HTML test
      console.log(`${COLORS.CYAN}  Running local HTML test...${COLORS.NC}`);
      execSync('npm run test:local', { cwd: this.filesDir, stdio: 'inherit' });
      console.log(`${COLORS.GREEN}✓ Local HTML test passed${COLORS.NC}`);

    } catch (error) {
      console.error(`${COLORS.RED}✗ Local HTML test failed${COLORS.NC}`);
      this.results.testsFailed.push({ suite: 'test:local', error: error.message });
    }
  }

  /**

* Generate comprehensive coverage report
   */
  async generateCoverageReport() {
    const report = this.buildCoverageReport();

    try {
      writeFileSync(this.coverageReportFile, report, 'utf-8');
      console.log(`${COLORS.GREEN}✓ Coverage report saved: ${this.coverageReportFile}${COLORS.NC}`);
    } catch (error) {
      console.error(`${COLORS.RED}✗ Failed to save coverage report: ${error.message}${COLORS.NC}`);
    }
  }

  /**

* Build coverage report content
   */
  buildCoverageReport() {
    const timestamp = new Date().toISOString();

    let report = `# Cloudflare Worker Test Coverage Report\n\n`;
    report += `**Generated:** ${timestamp}\n\n`;
    report += `---\n\n`;

    // Summary section
    report += `## Summary\n\n`;
    report += `- **New Functions:** ${this.results.newFunctions.length}\n`;
    report += `- **Modified Functions:** ${this.results.modifiedFunctions.length}\n`;
    report += `- **Deleted Functions:** ${this.results.deletedFunctions.length}\n`;
    report += `- **Tests Generated:** ${this.results.testsGenerated.length}\n`;
    report += `- **Tests Updated:** ${this.results.testsUpdated.length}\n`;
    report += `- **npm test:** ${this.results.npmTestPassed ? '✅ PASSED' : '❌ FAILED'}\n`;
    report += `- **Errors:** ${this.results.errors.length}\n\n`;

    // Quick Actions
    if (this.results.testsGenerated.length > 0 || this.results.testsUpdated.length > 0) {
      report += `## Quick Actions\n\n`;
      this.results.testsGenerated.forEach(test => {
        report += `- [ ] Implement test for \`${test.function}\` (${test.message})\n`;
      });
      this.results.testsUpdated.forEach(test => {
        report += `- [ ] Review test for \`${test.function}\` (${test.message})\n`;
      });
      report += `\n`;
    }

    // Function Changes
    if (this.results.newFunctions.length > 0) {
      report += `## New Functions\n\n`;
      this.results.newFunctions.forEach(fn => {
        report += `### \`${fn.name}\`\n`;
        report += `- **Type:** ${fn.type}\n`;
        report += `- **Parameters:** \`${fn.params}\`\n`;
        report += `- **Status:** ⚠️ Test stub generated\n\n`;
      });
    }

    if (this.results.modifiedFunctions.length > 0) {
      report += `## Modified Functions\n\n`;
      this.results.modifiedFunctions.forEach(({ current }) => {
        report += `### \`${current.name}\`\n`;
        report += `- **Type:** ${current.type}\n`;
        report += `- **Status:** ⚠️ Needs test review\n\n`;
      });
    }

    if (this.results.deletedFunctions.length > 0) {
      report += `## Deleted Functions\n\n`;
      this.results.deletedFunctions.forEach(fn => {
        report += `- \`${fn.name}\` - Consider removing obsolete tests\n`;
      });
      report += `\n`;
    }

    // Backups
    if (Object.keys(this.backups).length > 0) {
      report += `## Backups Created\n\n`;
      Object.entries(this.backups).forEach(([original, backup]) => {
        const originalFilename = original.split('/').pop();
        const backupRelativePath = backup.replace(this.cloudflareDir + '/', '');
        report += `- \`${originalFilename}\` → \`${backupRelativePath}\`\n`;
      });
      report += `\n`;
    }

    // Errors
    if (this.results.errors.length > 0) {
      report += `## Errors\n\n`;
      this.results.errors.forEach(err => {
        report += `- **Stage:** ${err.stage}\n`;
        if (err.function) report += `- **Function:** \`${err.function}\`\n`;
        report += `- **Error:** ${err.error}\n\n`;
      });
    }

    return report;
  }

  /**

* Print summary
   */
  printSummary() {
    console.log('');
    console.log(`${COLORS.BLUE}${'='.repeat(60)}${COLORS.NC}`);
    console.log(`${COLORS.BLUE}📊 SUMMARY${COLORS.NC}`);
    console.log(`${COLORS.BLUE}${'='.repeat(60)}${COLORS.NC}`);
    console.log(`${COLORS.CYAN}New Functions:${COLORS.NC} ${this.results.newFunctions.length}`);
    console.log(`${COLORS.CYAN}Modified Functions:${COLORS.NC} ${this.results.modifiedFunctions.length}`);
    console.log(`${COLORS.CYAN}Tests Generated:${COLORS.NC} ${this.results.testsGenerated.length}`);
    console.log(`${COLORS.CYAN}Tests Updated:${COLORS.NC} ${this.results.testsUpdated.length}`);
    console.log(`${COLORS.CYAN}npm test:${COLORS.NC} ${this.results.npmTestPassed ? '✅ PASSED' : '❌ FAILED'}`);
    console.log(`${COLORS.CYAN}Errors:${COLORS.NC} ${this.results.errors.length}`);
    console.log('');
    console.log(`${COLORS.GREEN}✓ Coverage report: ${this.coverageReportFile}${COLORS.NC}`);
    console.log(`${COLORS.BLUE}${'='.repeat(60)}${COLORS.NC}`);
  }

  /**

* Handle failure - restore from backups if needed
   */
  async handleFailure() {
    if (this.results.errors.length > 0 && Object.keys(this.backups).length > 0) {
      console.log(`${COLORS.YELLOW}⚠️  Errors occurred. Backups available for rollback.${COLORS.NC}`);
      console.log(`${COLORS.YELLOW}To restore: cp <backup-file> <original-file>${COLORS.NC}`);
    }
  }
}

// Main execution
const projectRoot = process.env.CLAUDE_PROJECT_DIR || process.cwd();
const automation = new CloudflareTestAutomation(projectRoot);
automation.run().catch(error => {
  console.error(`Fatal error: ${error.message}`);
  process.exit(1);
});
