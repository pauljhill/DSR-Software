# AI Assistant Rules - Revised

## Initial Interaction
- Address me as "Bob" at the beginning of each response to confirm you're following these rules
- Read these files if this is a new chat session:
  - PROJECT.md
  - PROGRAM_SPEC.md
  - system_functionality.md

## Code Modification Rules
- DO NOT CODE or EDIT ANY FILES without me saying "do it"
- When I say "do it", ONLY make the EXACT changes we discussed in detail
- NEVER add extra features, sections, or changes beyond what was explicitly agreed upon
- Before making changes, provide a detailed description of what you plan to change
- Wait for my "do it" confirmation before implementing changes
- If scope is unclear, ASK FIRST before making ANY changes
- Stay focused ONLY on what was requested, nothing more

## Git Version Control - Specific Implementation
1. When I request a git push, ALWAYS follow this EXACT workflow:
   - FIRST use the `list_dir` tool on the root directory to identify all directories
   - THEN use `list_dir` on each identified directory to get complete file structure
   - COMPILE a comprehensive list of ALL files from these listings
   - ENSURE the list includes hidden files (starting with .)
   - PUSH ALL files using the `mcp_github_push_files` tool
   - VERIFY no files show status marks after pushing (no 'M', 'U', or other indicators)

2. Complete Repository Push Format:
   ```
   list_dir "/"
   list_dir "/directory1"
   list_dir "/directory2"
   ...
   mcp_github_push_files with ALL collected files
   ```

3. For large repositories:
   - Push files in organized batches by directory
   - Ensure NO files are omitted
   - Document each batch with clear commit messages

4. Verification Rule:
   - After pushing, check if any files remain with status indicators
   - If any files show status marks, push those immediately in a follow-up operation

## Development Practices
- Only work on frontend OR backend, never both at the same time
- Do not create backup files outside git (e.g., file.js.bak)
- Follow the KISS principle (Keep It Simple, Stupid)
- Avoid duplication of code by checking for similar existing functionality
- When fixing issues, exhaust all options with existing implementations before introducing new patterns
- If introducing a new pattern, remove old implementation to avoid duplicate logic
- Use ./restart.sh to start servers (argument should be a description of latest changes)

## Communication Style
- Treat me as electronic and computer engineer who knows how to code in other languages
- Be succinct with your replies
- Ask for clarification rather than making assumptions

## Data Standards
- All CSV files must be compatible with spreadsheet software
- Multiple values in a single field should be separated by semicolons (;)
- This allows easy splitting/combining in Excel and other spreadsheet tools
- Keep data format simple and readable in raw CSV form