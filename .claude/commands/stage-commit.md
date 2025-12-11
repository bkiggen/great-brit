---
description: Stage all changes and commit with auto-generated message
allowed-tools: Bash(git status:*), Bash(git diff:*), Bash(git log:*), Bash(git add:*), Bash(git commit:*)
---

## Context

Current status:
!`git status --short`

Full diff (staged + unstaged):
!`git diff HEAD`

Recent commit style:
!`git log --oneline -5`

## Task

Stage all changes and create a commit.

1. Run `git add -A` to stage all changes
2. Analyze the diff above
3. Generate a conventional commit message:
   - Format: `type: short description`
   - Types: `feat`, `fix`, `docs`, `refactor`, `style`, `test`, `chore`
   - Keep the description under 50 characters
   - Use lowercase, no period at end
4. Run `git commit -m "message"`
5. Show the result
