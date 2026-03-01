Run markdown linting and fix all issues in the repository.

Execute the following steps:

1. Run `npm run lint:markdown:fix` to automatically fix all markdown linting issues
2. Run `npm run lint:markdown` to verify all issues are resolved
3. Report any remaining issues that couldn't be auto-fixed
4. Show a summary of files that were modified
5. Cross-Project Consistency Check (if terminology files were modified):
   - If changes affect book manuscript, Web Audit Suite docs, or shared terminology
   - Verify consistency across all four projects (book, tool, backend, web)
   - Check that terminology follows: book (authoritative) → tool → documentation
   - See CLAUDE.md "Cross-Project Consistency and Terminology" section

If there are any errors that couldn't be auto-fixed, provide guidance on how to fix them manually based on markdown linting rules in CLAUDE.md.
