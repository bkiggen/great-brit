---
description: Review work against a Trello ticket and create a PR
allowed-tools: Bash(git:*), Bash(gh:*), mcp__trello__get_card, Read, Glob, Grep
---

## Context

Trello Card ID (from argument): $ARGUMENTS

Current branch:
!`git branch --show-current`

Base branch:
!`git remote show origin | grep 'HEAD branch' | cut -d' ' -f5`

Staged and unstaged changes:
!`git diff HEAD --name-only`

Commits on this branch (not yet on main):
!`git log origin/main..HEAD --oneline 2>/dev/null || echo "No commits ahead of main"`

## Task

Review the current work against the specified Trello ticket, then create a pull request.

### Step 1: Fetch the ticket

Use `mcp__trello__get_card` with the card ID from $ARGUMENTS to get the full ticket details including:
- Description with context and proposed solution
- Technical notes about relevant files
- Testing considerations
- Acceptance criteria

### Step 2: Review the changes

1. Read the changed files to understand what was implemented
2. Compare the implementation against:
   - The proposed solution in the ticket
   - Technical notes (were the right files modified?)
   - Testing considerations
   - Acceptance criteria checklist items

3. Create a brief assessment:
   - What was implemented
   - How it addresses the ticket requirements
   - Any gaps or concerns (if any)

### Step 3: Create the PR

Use `gh pr create` with:
- **Title**: Match or reference the ticket title
- **Body**:
  ```
  ## Summary
  - Brief description of changes

  ## Changes
  - List of what was modified

  ## Testing
  - How to verify the changes work
  - Based on ticket's testing considerations

  ## Trello
  Card: [SHORT_ID](full_url)

  🤖 Generated with [Claude Code](https://claude.com/claude-code)
  ```

**Important**: Do NOT commit or push changes. Only create the PR from existing commits.

If changes haven't been committed/pushed yet, inform the user they need to commit and push first before running this command.

### Step 4: Report

Provide:
1. Summary of how the work matches the ticket
2. The PR URL
3. Any items from acceptance criteria that may need manual verification
