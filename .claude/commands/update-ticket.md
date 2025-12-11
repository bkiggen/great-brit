---
description: Improve an existing Trello ticket using conventions
allowed-tools: mcp__trello__get_card, mcp__trello__update_card_details, mcp__trello__add_checklist_item, mcp__trello__get_checklist_by_name, Read, AskUserQuestion, Glob, Grep
---

## Task

Improve an existing Trello ticket on the GBBO board following the project's ticket writing conventions.

### Instructions

1. **Fetch the card**: Use the card ID provided by the user to get current card details
2. **Read conventions**: Review `/Users/benkiggen/great-brit/docs/TICKET_CONVENTIONS.md`
3. **Analyze current state**: Identify what's missing or could be improved:
   - Is the title clear with a type tag `[Feature]`, `[Bug]`, etc.?
   - Does it have proper Context section?
   - Does it explain the Proposed Solution?
   - Are Technical Notes present with relevant files?
   - Is there an "Acceptance Criteria" checklist with specific items?
   - Are appropriate labels applied?
4. **Research the codebase**: Use Glob/Grep to identify relevant files and components mentioned in the ticket
5. **Ask clarifying questions**: If the ticket is vague or missing critical information, ask the user:
   - What problem does this solve?
   - What's the expected behavior?
   - What are the edge cases?
   - Which files/components are involved?
6. **Update the ticket**:
   - Improve title to follow conventions (add type tag if missing)
   - Restructure description with all required sections
   - Add relevant files from codebase research
   - Create or update "Acceptance Criteria" checklist with specific, testable items
   - Suggest appropriate labels
7. **Preserve existing content**: Don't delete useful information that's already there - integrate it into the proper sections
8. **Show the result**: Display what was changed and provide the ticket URL

### Expected Description Format

```
## Context
[Why this work is needed. What problem does it solve? What's the current state?]

## Proposed Solution
[High-level approach to solving the problem]

## Technical Notes
- Relevant files: [list key files from codebase]
- Related components: [list components]
- API endpoints affected: [if applicable]

## Testing Considerations
[How to verify this works. Edge cases to consider.]

## References
[Links to related tickets, PRs, documentation]
```

### Acceptance Criteria Checklist

Create or update a checklist named "Acceptance Criteria" with clear, testable conditions:
- Use action-oriented language ("User can...", "System should...", "When X, then Y...")
- Be specific and measurable
- Include edge cases
- Cover both happy path and error states

### Example Interaction

User: `/update-ticket abc123`

You should:
1. Fetch card `abc123`
2. Read the conventions doc
3. Review current content: "Rankings broken"
4. Ask: "I see this ticket is about broken rankings. Can you clarify:
   - What specific behavior is broken?
   - When does it occur (timing, conditions)?
   - What should happen instead?
   - What error messages appear (if any)?"
5. After getting answers, search codebase for ranking-related files
6. Update the card with:
   - Title: `[Bug] Rankings not saving when submitted during episode air time`
   - Full description with all sections
   - Technical Notes listing relevant files found in codebase
   - Create "Acceptance Criteria" checklist with 5+ items
   - Suggest labels: P0, backend, bug, medium
7. Report: "Updated ticket abc123. Added Context and Technical Notes sections, created 6 acceptance criteria items, improved title, and suggested labels: P0, backend, bug. Card URL: https://trello.com/c/..."

### Tips

- Always read the existing ticket content first to understand what's already there
- Preserve any useful details or context already in the ticket
- Use codebase research to add concrete file paths and component names
- If the ticket is very unclear, ask multiple clarifying questions before making changes
- Make the title descriptive enough to understand the ticket at a glance
