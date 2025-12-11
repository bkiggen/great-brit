# Ticket Writing Conventions

## Overview
This document defines the standard format for writing clear, actionable tickets in Trello. Well-written tickets help maintain context, facilitate handoffs, and ensure nothing is overlooked during implementation.

## Ticket Structure

### 1. Title
**Format**: `[Type] Brief description of the work`

**Types**:
- `[Feature]` - New functionality
- `[Bug]` - Something broken that needs fixing
- `[Refactor]` - Code improvement without behavior change
- `[Chore]` - Maintenance, dependencies, tooling
- `[Docs]` - Documentation updates
- `[Tech Debt]` - Known issues to address later

**Examples**:
- `[Feature] Add ability to edit rankings after submission`
- `[Bug] Rankings not saving when episode number is > 10`
- `[Refactor] Extract ranking logic into reusable hook`

### 2. Description

**Template**:
```
## Context
[Why this work is needed. What problem does it solve? What's the current state?]

## Proposed Solution
[High-level approach to solving the problem. Not implementation details, but the what.]

## Technical Notes
[Implementation hints, gotchas, related files, or architectural considerations]
- Relevant files: [list key files]
- Related components: [list components]
- API endpoints affected: [list endpoints if applicable]

## Testing Considerations
[How to verify this works. Edge cases to consider.]

## References
[Links to related tickets, PRs, documentation, or external resources]
```

### 3. Acceptance Criteria (Checklist)
Create a checklist named "Acceptance Criteria" with clear, testable conditions:
- Use action-oriented language ("User can...", "System should...", "When X, then Y...")
- Be specific and measurable
- Include edge cases
- Cover both happy path and error states

**Example**:
```
Acceptance Criteria:
☐ User can click "Edit" button on submitted ranking
☐ Ranking form pre-populates with current values
☐ Changes save successfully to database
☐ Other users see updated rankings in real-time
☐ Cannot edit rankings after episode airs
☐ Error message shown if save fails
```

### 4. Labels
Use labels consistently:
- **Priority**: `P0` (urgent/blocking), `P1` (important), `P2` (nice to have)
- **Area**: `frontend`, `backend`, `database`, `devops`, `design`
- **Status**: `blocked`, `needs-review`, `ready-to-test`
- **Size**: `small` (< 2 hours), `medium` (< 1 day), `large` (> 1 day)

## Quality Checklist
Before finalizing a ticket, verify:
- [ ] Title is clear and includes type tag
- [ ] Context explains WHY this work matters
- [ ] Solution describes WHAT to build (not HOW)
- [ ] Technical notes help orient the implementer
- [ ] Acceptance criteria are specific and testable
- [ ] Relevant labels are applied
- [ ] Related files/components are mentioned

## Anti-Patterns to Avoid

### ❌ Vague Titles
- "Fix bug"
- "Update rankings"
- "Make it better"

### ❌ Missing Context
Starting with implementation details without explaining the problem or why it matters.

### ❌ Unclear Acceptance Criteria
- "It works"
- "Rankings are fixed"
- "No errors"

### ❌ Solution Without Problem
Describing HOW to implement something without explaining WHAT problem it solves.

## Examples

### Good Ticket Example
**Title**: `[Bug] Rankings not persisting when submitted during episode air time`

**Description**:
```
## Context
Users report that rankings submitted within 1 hour of episode air time (8 PM EST)
are not saving. After submission, they get a success message, but refreshing the
page shows their old rankings or no rankings at all. This affects ~20% of users.

## Proposed Solution
Investigate the timestamp validation logic in rankingsRoutes.js and the
episode.airingAt field. Likely a timezone issue or race condition between
submission and the "lock rankings" cron job.

## Technical Notes
- Relevant files: server/api/router/rankingsRoutes.js, server/helpers/validators.js
- Database: Rankings table has submittedAt timestamp
- The lockRankings job runs at episode.airingAt
- Frontend converts times to UTC but server might not be handling timezones correctly

## Testing Considerations
- Test submitting at exactly episode.airingAt
- Test with different client timezones
- Verify database timestamps are in UTC
- Check logs during peak submission time

## References
- Original issue: #47
- Related: "[Feature] Add timezone display to episode air times"
```

**Acceptance Criteria**:
```
☐ Rankings save successfully when submitted before airingAt
☐ Rankings are locked and cannot be modified after airingAt
☐ Success message only shows when database confirms save
☐ All timestamps stored in UTC
☐ Frontend displays times in user's local timezone
☐ Error message if submission attempted after lock
☐ Test passes for users in EST, PST, and GMT+1 timezones
```

**Labels**: `P0`, `backend`, `bug`, `medium`

---

### Another Good Example
**Title**: `[Feature] Add confirmation dialog before deleting episode`

**Description**:
```
## Context
Admins can currently delete episodes with a single click. This is dangerous because
deleting an episode also cascades to delete all rankings, bets, and related data.
We need a safety mechanism.

## Proposed Solution
Add a Material-UI confirmation dialog that appears when admin clicks the delete
button. Dialog should clearly warn about cascade deletion and require explicit
confirmation.

## Technical Notes
- Relevant files: client/src/containers/AdminPanel.js
- Use MUI Dialog component with sx prop for styling
- Show count of affected records (rankings, bets) in warning message
- Consider adding a "soft delete" in the future (out of scope for this ticket)

## Testing Considerations
- Verify dialog appears on delete click
- Confirm canceling the dialog does nothing
- Verify confirming the dialog actually deletes
- Check that cascade deletion still works properly
```

**Acceptance Criteria**:
```
☐ Clicking delete button shows confirmation dialog
☐ Dialog displays episode number and title
☐ Dialog warns about cascade deletion
☐ Dialog shows count of rankings and bets that will be deleted
☐ "Cancel" button closes dialog without deleting
☐ "Delete" button proceeds with deletion
☐ Success/error toast shows after deletion attempt
```

**Labels**: `P1`, `frontend`, `feature`, `small`

## Tips for Claude

When improving an existing ticket:
1. Read the current ticket content carefully
2. Identify what's missing (context, acceptance criteria, technical notes)
3. Ask clarifying questions if the intent is unclear
4. Preserve any useful information already in the ticket
5. Reformat according to this template
6. Add relevant labels if missing
7. Create/update the "Acceptance Criteria" checklist

When creating a new ticket from a prompt:
1. Ask questions to understand context and requirements
2. Draft the ticket following the template
3. Make acceptance criteria specific and testable
4. Suggest appropriate labels
5. Identify relevant files from the codebase
