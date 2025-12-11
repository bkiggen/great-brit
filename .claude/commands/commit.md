---
description: Commit staged changes with auto-generated message
allowed-tools: Bash(git status:*), Bash(git diff:*), Bash(git log:*), Bash(git commit:*)
---

## Context

Staged changes:
!`git diff --cached --stat`

Staged diff:
!`git diff --cached`

Recent commit style:
!`git log --oneline -5`

## Task

Create a git commit for the **staged changes only**.

1. Analyze the staged diff above
2. Generate a conventional commit message:
   - Format: `type: short description`
   - Types: `feat`, `fix`, `docs`, `refactor`, `style`, `test`, `chore`
   - Keep the description under 50 characters
   - Use lowercase, no period at end
3. Run `git commit -m "message"`
4. Show the result

Do NOT stage any new files. Only commit what is already staged.
