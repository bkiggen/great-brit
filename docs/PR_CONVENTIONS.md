# Pull Request Conventions

## Overview
This document defines the standard format for writing clear, informative pull requests. Good PRs help reviewers understand the changes, facilitate discussion, and create a useful history of changes.

## PR Structure

### 1. Title
**Format**: `type: brief description of changes`

**Types** (same as commit conventions):
- `feat` - New functionality
- `fix` - Bug fix
- `refactor` - Code improvement without behavior change
- `chore` - Maintenance, dependencies, tooling
- `docs` - Documentation updates
- `style` - Formatting, linting (no code change)
- `test` - Adding or updating tests

**Guidelines**:
- Keep under 72 characters
- Use lowercase
- Use imperative mood ("add", not "added" or "adds")
- No period at end

**Examples**:
- `feat: add dark mode toggle to settings`
- `fix: prevent duplicate ranking submissions`
- `refactor: extract scoring logic into shared helper`

### 2. Body

**Template**:
```markdown
## Summary
- Concise bullet points explaining WHAT changed and WHY
- Focus on the impact, not implementation details
- Link to related Trello ticket if applicable

## Changes
- List of files/components modified
- Organized by area (frontend, backend, database)

## Testing
- How to verify the changes work
- Manual testing steps
- Edge cases to check

## Trello
Card: [SHORT_ID](full_url)

🤖 Generated with [Claude Code](https://claude.com/claude-code)
```

### 3. Summary Section
The summary is the most important part. It should answer:
- **What** was changed? (high-level description)
- **Why** was it changed? (motivation/problem being solved)
- **How** does it affect users/system? (impact)

**Good summary bullets**:
- Start with action verbs (Add, Update, Fix, Remove, Refactor)
- Be specific but concise
- Include relevant context

**Examples**:
```markdown
## Summary
- Add confirmation dialog before episode deletion to prevent accidental data loss
- Include count of affected rankings and bets in warning message
- Fix cascade deletion not properly cleaning up related bets
```

### 4. Changes Section
List what files were modified, organized logically:

```markdown
## Changes
**Frontend**
- `client/src/containers/AdminPanel.js` - Added delete confirmation dialog
- `client/src/components/ConfirmDialog.js` - New reusable component

**Backend**
- `server/api/router/episodeRoutes.js` - Added count endpoint for cascade preview

**Database**
- `server/prisma/schema.prisma` - No changes
```

### 5. Testing Section
Provide clear verification steps:

```markdown
## Testing
- [ ] Navigate to Admin > Episodes
- [ ] Click delete on an episode with rankings
- [ ] Verify dialog shows correct count of affected records
- [ ] Click Cancel - verify episode is NOT deleted
- [ ] Click Delete - verify episode and related data are removed
- [ ] Check for console errors
```

## Quality Checklist
Before submitting a PR, verify:
- [ ] Title follows `type: description` format
- [ ] Summary explains what and why
- [ ] Changes section lists modified files
- [ ] Testing section includes verification steps
- [ ] Trello section includes card short ID in link format: `[SHORT_ID](url)`
- [ ] No unrelated changes included
- [ ] Self-reviewed the diff

## Anti-Patterns to Avoid

### ❌ Vague Titles
- "fix bug"
- "updates"
- "WIP"

### ❌ Empty or Minimal Description
Just a title with no context about what changed or why.

### ❌ Listing Implementation Details as Summary
```markdown
## Summary
- Changed line 45 to use `map` instead of `forEach`
- Added `useState` hook
- Updated import statement
```

Instead, explain the purpose:
```markdown
## Summary
- Fix rankings not displaying in correct order by using sorted mapping
```

### ❌ No Testing Information
Leaving reviewers to guess how to verify the changes work.

### ❌ Kitchen Sink PRs
Including unrelated changes, refactors, or "drive-by fixes" that make review harder.

## Good PR Examples

### Feature PR
**Title**: `feat: add user profile avatar upload`

```markdown
## Summary
- Allow users to upload and crop profile avatars
- Store images in S3 with CDN caching
- Display avatars in leaderboard and rankings views

## Changes
**Frontend**
- `client/src/containers/Profile.js` - Avatar upload form
- `client/src/components/AvatarCropper.js` - New crop component
- `client/src/store/usersSlice.js` - Add upload thunk

**Backend**
- `server/api/router/userRoutes.js` - POST /users/:id/avatar endpoint
- `server/helpers/s3.js` - New S3 upload helper

## Testing
- [ ] Go to Profile > Edit
- [ ] Upload an image (JPG, PNG, GIF)
- [ ] Crop to desired size
- [ ] Save and verify avatar appears
- [ ] Check avatar shows in leaderboard
- [ ] Test with invalid file types (should show error)
- [ ] Test file size limits (> 5MB should fail)

## Trello
Card: [xyz123](https://trello.com/c/xyz123)

🤖 Generated with [Claude Code](https://claude.com/claude-code)
```

### Bug Fix PR
**Title**: `fix: prevent duplicate bet submissions`

```markdown
## Summary
- Users could submit the same bet multiple times by clicking quickly
- Added debouncing on frontend and idempotency check on backend
- Existing duplicate bets are not affected (data migration out of scope)

## Changes
- `client/src/containers/Bets/NewBet.js` - Disable button during submission
- `server/api/router/betRoutes.js` - Add duplicate check before insert

## Testing
- [ ] Create a new bet
- [ ] Try clicking Submit rapidly
- [ ] Verify only one bet is created
- [ ] Check submit button is disabled while loading
- [ ] Verify error handling still works

## Trello
Card: [abc456](https://trello.com/c/abc456)

🤖 Generated with [Claude Code](https://claude.com/claude-code)
```

### Refactor PR
**Title**: `refactor: extract ranking calculations into shared module`

```markdown
## Summary
- Consolidate duplicated ranking calculation logic
- Improve testability by isolating pure functions
- No behavior changes - all existing tests pass

## Changes
- `server/helpers/rankings.js` - New module with calculation functions
- `server/api/router/rankingsRoutes.js` - Import from shared module
- `server/api/router/leaderboardRoutes.js` - Import from shared module
- `server/tests/rankings.test.js` - New unit tests for calculations

## Testing
- [ ] Run `npm test` - all tests pass
- [ ] Verify leaderboard displays correctly
- [ ] Verify individual rankings calculate correctly
- [ ] Spot-check a few users' scores manually

🤖 Generated with [Claude Code](https://claude.com/claude-code)
```

## Tips for Claude

When creating a PR:
1. Read ALL commits being included (not just the latest)
2. Look at the actual diff to understand what changed
3. Write summary from the user's perspective (impact, not implementation)
4. Include file paths in Changes section
5. Derive testing steps from acceptance criteria if a ticket exists
6. Keep the PR focused - flag if unrelated changes are included
7. Include Trello card short ID in link text (e.g., `[abc123](url)`) for GitHub Power-Up detection
