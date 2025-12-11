---
description: Push to remote and update project documentation if needed
allowed-tools: Bash(git:*), Read, Glob, Edit, Write
---

## Context

Current branch:
!`git branch --show-current`

Commits to push:
!`git log origin/HEAD..HEAD --oneline 2>/dev/null || git log -3 --oneline`

Changed files in unpushed commits:
!`git diff --name-only origin/HEAD..HEAD 2>/dev/null || git diff --name-only HEAD~3..HEAD`

## Task

Push changes and maintain documentation.

### Step 1: Push
Run `git push origin HEAD`

### Step 2: Check if documentation needs updating
If any of these changed significantly:
- `server/api/router/*.js` → may need to update `docs/ARCHITECTURE.md` API routes section
- `server/prisma/schema.prisma` → may need to update `docs/ARCHITECTURE.md` schema section
- `client/src/containers/*` → may need to update `docs/FEATURES.md`
- `client/src/store/*` → may need to update `docs/ARCHITECTURE.md` Redux section

### Step 3: Update docs if needed
If code changes affect documented behavior:
1. Read the relevant doc section
2. Update it to reflect the changes
3. Stage and commit the doc update with message `docs: update [section] for [change]`
4. Push the doc update

### Step 4: Report
Summarize what was pushed and any doc updates made.
