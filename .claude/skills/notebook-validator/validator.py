#!/usr/bin/env python3
"""
Generic Jupyter Notebook Validator

Validates notebooks for production readiness with configurable parameters.

Usage:
    python validator.py <notebook.ipynb> [options]

Options:
    --expected-parts <N>     Expected number of parts/sections (default: auto-detect)
    --require-transitions    Require transition cells with action cards
    --min-intro-cells <N>    Minimum cells before first part (default: 1)
    --min-conclusion-cells   Minimum cells after last part (default: 2)
    --check-metadata <field> Required metadata fields (can specify multiple)
"""

import json
import re
import sys
import argparse
from typing import Dict, List, Tuple, Optional
from pathlib import Path


class NotebookValidator:
    """Generic notebook validator with configurable parameters."""

    def __init__(
        self,
        notebook_path: str,
        expected_parts: Optional[int] = None,
        require_transitions: bool = False,
        min_intro_cells: int = 1,
        min_conclusion_cells: int = 2,
        required_metadata: Optional[List[str]] = None
    ):
        self.notebook_path = Path(notebook_path)
        self.expected_parts = expected_parts
        self.require_transitions = require_transitions
        self.min_intro_cells = min_intro_cells
        self.min_conclusion_cells = min_conclusion_cells
        self.required_metadata = required_metadata or ['repo']

        # Load notebook
        with open(self.notebook_path, 'r', encoding='utf-8') as f:
            self.notebook = json.load(f)

        self.cells = self.notebook['cells']
        self.results = {}

    def normalize_heading(self, text: str) -> str:
        """Normalize heading text for matching (remove emojis, lowercase, strip)."""
        # Remove common emojis
        text = re.sub(r'[🌍👥🎯📚💡🛡️🏁🔧⚡🎨📊🔍✨🚀💻🔐📈]', '', text)
        # Remove extra spaces and lowercase
        return ' '.join(text.lower().strip().split())

    def extract_headings(self) -> Dict[str, Tuple[str, int]]:
        """Extract all headings from notebook cells."""
        headings = {}
        for idx, cell in enumerate(self.cells):
            if cell['cell_type'] != 'markdown':
                continue
            source = ''.join(cell.get('source', []))
            for line in source.split('\n'):
                if line.startswith('#'):
                    heading = line.lstrip('#').strip()
                    normalized = self.normalize_heading(heading)
                    if normalized:  # Skip empty headings
                        headings[normalized] = (heading, idx)
        return headings

    def extract_smart_links(self) -> List[Tuple[str, int]]:
        """Extract all smart links [text](#) from notebook."""
        links = []
        for idx, cell in enumerate(self.cells):
            if cell['cell_type'] != 'markdown':
                continue
            source = ''.join(cell.get('source', []))
            found = re.findall(r'\[([^\]]+)\]\(#\)', source)
            links.extend([(link, idx) for link in found])
        return links

    def validate_smart_links(self) -> Dict:
        """Validate all smart links resolve to headings."""
        links = self.extract_smart_links()
        headings = self.extract_headings()

        valid = 0
        broken = []

        for link_text, cell_idx in links:
            normalized = self.normalize_heading(link_text)
            if normalized in headings:
                valid += 1
            else:
                # Try fuzzy matching
                found_match = False
                for heading_norm in headings.keys():
                    if normalized in heading_norm or heading_norm in normalized:
                        valid += 1
                        found_match = True
                        break
                if not found_match:
                    broken.append((link_text, cell_idx))

        status = 'PASS' if len(broken) == 0 else 'FAIL'
        score = int((valid / len(links)) * 100) if links else 100

        return {
            'total': len(links),
            'valid': valid,
            'broken': broken,
            'status': status,
            'score': score
        }

    def identify_parts(self) -> List[Dict]:
        """Identify all parts/sections in the notebook."""
        parts = []
        for idx, cell in enumerate(self.cells):
            if cell['cell_type'] != 'markdown':
                continue
            source = ''.join(cell.get('source', []))

            # Look for "Part X:" or "Section X:" patterns
            # Match both "## Part 1:" and "### 💡 Part 12:" and "## Section 1:"
            match = re.search(
                r'##[#]?\s*(?:[🌍👥🎯📚💡🛡️🏁🔧⚡🎨📊🔍✨🚀💻🔐📈]\s*)?(Part|Section)\s*(\d+):',
                source,
                re.IGNORECASE
            )
            if match:
                part_num = int(match.group(2))
                parts.append({
                    'number': part_num,
                    'cell': idx,
                    'type': match.group(1).lower(),
                    'source': source
                })
        return parts

    def validate_structure(self) -> Dict:
        """Validate notebook has proper structure."""
        parts = self.identify_parts()
        issues = []

        # Only check part count if expected_parts specified
        if self.expected_parts is not None:
            if len(parts) != self.expected_parts:
                issues.append(f"Expected {self.expected_parts} parts, found {len(parts)}")

        # Only check intro/conclusion if parts exist and thresholds are set
        if parts:
            if self.min_intro_cells > 0 and parts[0]['cell'] < self.min_intro_cells:
                issues.append(
                    f"No clear introduction section "
                    f"(need {self.min_intro_cells}+ cells before first part)"
                )

            if self.min_conclusion_cells > 0 and parts[-1]['cell'] > len(self.cells) - self.min_conclusion_cells:
                issues.append(
                    f"No clear conclusion section "
                    f"(need {self.min_conclusion_cells}+ cells after last part)"
                )

        status = 'PASS' if len(issues) == 0 else 'WARN'
        score = max(0, 100 - (len(issues) * 20))

        return {
            'parts_found': len(parts),
            'parts_expected': self.expected_parts if self.expected_parts is not None else 'not specified',
            'has_parts': len(parts) > 0,
            'issues': issues,
            'status': status,
            'score': score
        }

    def is_transition_cell(self, source: str) -> bool:
        """Check if cell is a transition cell."""
        return (
            re.search(r'(Part|Section)\s*\d+:', source, re.IGNORECASE) and
            'Progress:' in source and
            '🔵' in source
        )

    def validate_transitions(self) -> Dict:
        """Validate transition cells have action cards (if required)."""
        transitions = []
        issues = []

        for idx, cell in enumerate(self.cells):
            if cell['cell_type'] != 'markdown':
                continue
            source = ''.join(cell.get('source', []))

            if not self.is_transition_cell(source):
                continue

            # Extract part number
            match = re.search(r'(Part|Section)\s+(\d+):', source, re.IGNORECASE)
            part_num = int(match.group(2)) if match else None

            # Check for action cards marker
            has_marker = '<!-- action-cards -->' in source

            # Count action card links
            links = re.findall(r'^\s*- \[([^\]]+)\]\(#\)', source, re.MULTILINE)
            link_count = len(links)

            transition_info = {
                'part': part_num,
                'cell': idx,
                'has_marker': has_marker,
                'link_count': link_count
            }
            transitions.append(transition_info)

            # Validate if required
            if self.require_transitions:
                if not has_marker:
                    issues.append({
                        'severity': 'ERROR',
                        'part': part_num,
                        'cell': idx,
                        'message': 'Missing <!-- action-cards --> marker'
                    })
                elif link_count < 3:
                    issues.append({
                        'severity': 'ERROR',
                        'part': part_num,
                        'cell': idx,
                        'message': f'Only {link_count} action cards (need 3-6)'
                    })
                elif link_count > 6:
                    issues.append({
                        'severity': 'WARN',
                        'part': part_num,
                        'cell': idx,
                        'message': f'{link_count} action cards (recommended 3-6)'
                    })

        # Calculate score
        if not transitions:
            score = 100
        elif not self.require_transitions:
            score = 100  # Pass if not required
        else:
            errors = sum(1 for i in issues if i['severity'] == 'ERROR')
            warnings = sum(1 for i in issues if i['severity'] == 'WARN')
            score = max(0, 100 - (errors * 30) - (warnings * 10))

        status = 'PASS' if len([i for i in issues if i['severity'] == 'ERROR']) == 0 else 'FAIL'

        return {
            'transitions_found': len(transitions),
            'transitions_with_markers': sum(1 for t in transitions if t['has_marker']),
            'issues': issues,
            'status': status,
            'score': score
        }

    def is_transition_cell(self, source: str) -> bool:
        """Check if cell is a transition cell."""
        return (
            re.search(r'(Part|Section)\s+\d+:', source, re.IGNORECASE) and
            'Progress:' in source and
            '🔵' in source and
            'Reading time:' in source.lower()
        )

    def validate_part_flow(self) -> Dict:
        """Validate parts are numbered sequentially."""
        parts = self.identify_parts()
        issues = []

        if not parts:
            return {
                'parts': 0,
                'sequential': True,
                'issues': [],
                'status': 'PASS',
                'score': 100
            }

        expected = 1
        for part in parts:
            if part['number'] != expected:
                issues.append(
                    f"{part['type'].title()} {expected} expected, "
                    f"found {part['type'].title()} {part['number']} at cell {part['cell']}"
                )
            expected = part['number'] + 1

        # Check for duplicates
        part_numbers = [p['number'] for p in parts]
        duplicates = [n for n in set(part_numbers) if part_numbers.count(n) > 1]
        if duplicates:
            issues.append(f"Duplicate part numbers: {duplicates}")

        status = 'PASS' if len(issues) == 0 else 'FAIL'
        score = max(0, 100 - (len(issues) * 25))

        return {
            'parts': len(parts),
            'sequential': len(issues) == 0,
            'issues': issues,
            'status': status,
            'score': score
        }

    def validate_production_readiness(self) -> Dict:
        """Validate notebook metadata and production readiness."""
        metadata = self.notebook.get('metadata', {})
        issues = []

        # Check for required metadata
        for field in self.required_metadata:
            if field not in metadata:
                issues.append(f"Missing metadata field: {field}")

        # Check repo URL if present
        repo = metadata.get('repo', '')
        if repo and not (repo.startswith('https://github.com/') or repo.startswith('http')):
            issues.append("Repository URL should be valid URL")

        # Check file size (warn if > 5MB)
        try:
            size_mb = self.notebook_path.stat().st_size / (1024 * 1024)
            if size_mb > 5:
                issues.append(f"Large file size: {size_mb:.1f}MB (consider optimization)")
        except:
            pass

        status = 'PASS' if len(issues) == 0 else 'WARN'
        score = max(0, 100 - (len(issues) * 15))

        return {
            'metadata_complete': len(issues) == 0,
            'repo_configured': 'repo' in metadata,
            'issues': issues,
            'status': status,
            'score': score
        }

    def calculate_overall_score(self) -> int:
        """Calculate weighted overall score."""
        weights = {
            'smart_links': 0.30,
            'structure': 0.25,
            'transitions': 0.20,
            'part_flow': 0.15,
            'production': 0.10
        }

        total = 0
        for category, weight in weights.items():
            if category in self.results:
                total += self.results[category]['score'] * weight

        return int(total)

    def generate_report(self, verbose: bool = True) -> int:
        """Generate comprehensive validation report."""
        if verbose:
            print("\n" + "=" * 70)
            print(f"NOTEBOOK VALIDATION REPORT: {self.notebook_path.name}")
            print("=" * 70)
            print()

        overall_score = self.calculate_overall_score()

        # Summary
        if verbose:
            print("SUMMARY:")
            print(f"  Total Cells: {len(self.cells)}")

            if 'smart_links' in self.results:
                sl = self.results['smart_links']
                print(f"  Smart Links: {sl['total']} ({sl['valid']} valid, {len(sl['broken'])} broken)")

            if 'part_flow' in self.results:
                pf = self.results['part_flow']
                print(f"  Parts: {pf['parts']} ({'sequential' if pf['sequential'] else 'non-sequential'})")

            if 'transitions' in self.results:
                tr = self.results['transitions']
                print(f"  Transitions: {tr['transitions_found']} ({tr['transitions_with_markers']} with action cards)")

            # Overall score
            if overall_score >= 90:
                status_emoji = "✅ PRODUCTION READY"
            elif overall_score >= 75:
                status_emoji = "⚠️  MINOR FIXES NEEDED"
            elif overall_score >= 60:
                status_emoji = "⚠️  MODERATE ISSUES"
            else:
                status_emoji = "❌ MAJOR REWORK REQUIRED"

            print(f"  Overall Score: {overall_score}/100 {status_emoji}")
            print()

            # Detailed results
            self._print_detailed_results()

            # Recommendations
            self._print_recommendations(overall_score)

        return overall_score

    def _print_detailed_results(self):
        """Print detailed validation results."""
        for category in ['smart_links', 'structure', 'transitions', 'part_flow', 'production']:
            if category not in self.results:
                continue

            result = self.results[category]
            status_symbol = "✅" if result['status'] == 'PASS' else ("⚠️ " if result['status'] == 'WARN' else "❌")

            category_name = category.upper().replace('_', ' ')
            print(f"{category_name}: {status_symbol} {result['status']}")
            print(f"  Score: {result['score']}/100")

            # Category-specific details
            if category == 'smart_links':
                if result['broken']:
                    print(f"  ✗ {len(result['broken'])} broken links:")
                    for link_text, cell_idx in result['broken'][:5]:
                        print(f"    - Cell {cell_idx}: [{link_text}](#)")
                    if len(result['broken']) > 5:
                        print(f"    - ... and {len(result['broken']) - 5} more")
                else:
                    print(f"  ✓ All {result['valid']} smart links resolve correctly")

            elif category == 'structure':
                if result['has_parts']:
                    print(f"  ✓ Found {result['parts_found']} parts")
                    if result['parts_expected'] != 'not specified':
                        print(f"    (expected {result['parts_expected']})")
                else:
                    print(f"  ℹ️  No numbered parts/sections detected (notebook uses free-form structure)")
                if result['issues']:
                    for issue in result['issues']:
                        print(f"  ⚠  {issue}")

            elif category == 'transitions':
                print(f"  ✓ {result['transitions_with_markers']} of {result['transitions_found']} transitions have action cards")
                if result['issues']:
                    for issue in result['issues']:
                        severity_symbol = "❌" if issue['severity'] == 'ERROR' else "⚠️ "
                        print(f"  {severity_symbol} Part {issue['part']} (cell {issue['cell']}): {issue['message']}")

            elif category == 'part_flow':
                if result['sequential']:
                    print(f"  ✓ Parts numbered 1-{result['parts']} sequentially")
                if result['issues']:
                    for issue in result['issues']:
                        print(f"  ✗ {issue}")

            elif category == 'production':
                if result['repo_configured']:
                    print(f"  ✓ Repository URL configured")
                if result['issues']:
                    for issue in result['issues']:
                        print(f"  ⚠  {issue}")

            print()

    def _print_recommendations(self, overall_score: int):
        """Print recommendations based on score."""
        print("RECOMMENDATIONS:")
        if overall_score >= 90:
            print("  • Notebook is ready for production deployment")
            print("  • All validation checks passed")
        elif overall_score >= 75:
            print("  • Fix minor issues before deployment")
            print("  • Review warnings and broken links")
        elif overall_score >= 60:
            print("  • Address moderate issues before deployment")
            print("  • Focus on transitions and part flow")
        else:
            print("  • Major rework required before deployment")
            print("  • Address all errors systematically")
        print()

    def run_validation(self, verbose: bool = True) -> bool:
        """Run all validation checks."""
        if verbose:
            print(f"Validating: {self.notebook_path}")
            print(f"Total cells: {len(self.cells)}\n")

        # Run all validations
        self.results['smart_links'] = self.validate_smart_links()
        self.results['structure'] = self.validate_structure()
        self.results['transitions'] = self.validate_transitions()
        self.results['part_flow'] = self.validate_part_flow()
        self.results['production'] = self.validate_production_readiness()

        # Generate report
        overall_score = self.generate_report(verbose)

        return overall_score >= 90  # Return True if production ready


def main():
    parser = argparse.ArgumentParser(
        description='Validate Jupyter notebooks for production readiness',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  %(prog)s notebook.ipynb
  %(prog)s notebook.ipynb --expected-parts 12
  %(prog)s notebook.ipynb --require-transitions
  %(prog)s notebook.ipynb --check-metadata repo version author
        """
    )

    parser.add_argument('notebook', help='Path to notebook file')
    parser.add_argument(
        '--expected-parts',
        type=int,
        help='Expected number of parts/sections (default: auto-detect)'
    )
    parser.add_argument(
        '--require-transitions',
        action='store_true',
        help='Require transition cells with action cards'
    )
    parser.add_argument(
        '--min-intro-cells',
        type=int,
        default=1,
        help='Minimum cells before first part (default: 1)'
    )
    parser.add_argument(
        '--min-conclusion-cells',
        type=int,
        default=2,
        help='Minimum cells after last part (default: 2)'
    )
    parser.add_argument(
        '--check-metadata',
        nargs='+',
        default=['repo'],
        help='Required metadata fields (default: repo)'
    )
    parser.add_argument(
        '--quiet',
        action='store_true',
        help='Suppress detailed output, only show score'
    )

    args = parser.parse_args()

    validator = NotebookValidator(
        notebook_path=args.notebook,
        expected_parts=args.expected_parts,
        require_transitions=args.require_transitions,
        min_intro_cells=args.min_intro_cells,
        min_conclusion_cells=args.min_conclusion_cells,
        required_metadata=args.check_metadata
    )

    is_ready = validator.run_validation(verbose=not args.quiet)

    if args.quiet:
        print(f"Score: {validator.calculate_overall_score()}/100")

    return 0 if is_ready else 1


if __name__ == '__main__':
    sys.exit(main())
