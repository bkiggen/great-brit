---
description: Create a pull request for the current branch
allowed-tools: Bash(git:*), Bash(gh:*)
---

## Context

Current branch:
!`git branch --show-current`

Base branch:
!`git remote show origin | grep 'HEAD branch' | cut -d' ' -f5`

Commits to include:
!`git log origin/main..HEAD --oneline 2>/dev/null || git log -5 --oneline`

Changed files:
!`git diff --name-only origin/main..HEAD 2>/dev/null || git diff --name-only HEAD~3..HEAD`

## Task

Create a pull request for the current branch.

### Step 1: Ensure changes are pushed
```bash
git push -u origin HEAD
```

### Step 2: Create PR
Use `gh pr create` with:
- Title: Summary of changes (from commit messages)
- Body:
  - ## Summary section with bullet points
  - ## Test plan section with testing checklist

```bash
gh pr create --title "title here" --body "$(cat <<'EOF'
## Summary
- bullet points here

## Test plan
- [ ] Testing steps here

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

### Step 3: Report
Return the PR URL so the user can review it.
