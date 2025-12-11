---
description: Create a pull request for the current branch
allowed-tools: Bash(git:*), Bash(gh:*), Read, Glob, Edit, mcp__trello__attach_file_to_card
---

## Context

Current branch:
!`git branch --show-current`

Base branch:
!`git remote show origin | grep 'HEAD branch' | cut -d' ' -f5`

Commits to include:
!`git log origin/main..HEAD --oneline 2>/dev/null || git log -5 --oneline`

Full commit messages:
!`git log origin/main..HEAD --pretty=format:'%s%n%b---' 2>/dev/null || git log -3 --pretty=format:'%s%n%b---'`

Changed files:
!`git diff --name-only origin/main..HEAD 2>/dev/null || git diff --name-only HEAD~3..HEAD`

Diff stats:
!`git diff --stat origin/main..HEAD 2>/dev/null || git diff --stat HEAD~3..HEAD`

## PR Conventions

Follow the conventions in `docs/PR_CONVENTIONS.md`:

### Title Format
`type: brief description` (lowercase, imperative mood, <72 chars)

Types: `feat`, `fix`, `refactor`, `chore`, `docs`, `style`, `test`

### Body Structure
```markdown
## Summary
- WHAT changed and WHY (user/system impact, not implementation)
- Action verbs: Add, Update, Fix, Remove, Refactor

## Changes
- List modified files by area (Frontend, Backend, Database)

## Testing
- [ ] How to verify changes work
- [ ] Edge cases to check

## Trello
[Link to card or N/A]

🤖 Generated with [Claude Code](https://claude.com/claude-code)
```

## Task

Create a pull request for the current branch.

### Step 1: Read the changes
Before writing the PR, read the actual changed files to understand what was modified:
- For each changed file, read enough to understand the change
- Note the purpose and impact of changes
- Look for Trello card references in commits

### Step 2: Ensure changes are pushed
```bash
git push -u origin HEAD
```

### Step 3: Determine PR content
Based on the commits and file changes:
1. **Title**: Derive from commit messages, use appropriate type prefix
2. **Summary**: Explain what changed and why (from user's perspective)
3. **Changes**: List modified files organized by area
4. **Testing**: Derive verification steps from the changes
5. **Trello**: Extract card short ID and full URL from commits (format: `[SHORT_ID](url)`)

### Step 4: Check if docs need updating
If changes affect documented behavior, update docs first:
- Schema changes → `docs/ARCHITECTURE.md`
- Feature changes → `docs/FEATURES.md`
- New conventions → relevant docs file

### Step 5: Create the PR
```bash
gh pr create --title "type: description" --body "$(cat <<'EOF'
## Summary
- bullet points

## Changes
- file list

## Testing
- [ ] verification steps

## Trello
[Link to card or N/A]

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

### Step 6: Attach PR to Trello card
If a Trello card was referenced in the commits, use `mcp__trello__attach_file_to_card` to attach the PR URL to the card:
- `cardId`: The card's short ID (e.g., `NlzYV4Sn` from `https://trello.com/c/NlzYV4Sn`)
- `fileUrl`: The PR URL returned from `gh pr create`
- `name`: `PR #N: <pr title>`

### Step 7: Report
Return the PR URL so the user can review it. Confirm if the PR was attached to Trello.
