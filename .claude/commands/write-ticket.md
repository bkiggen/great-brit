---
description: Create a new Trello ticket using conventions
allowed-tools: mcp__trello__get_lists, mcp__trello__add_card_to_list, mcp__trello__add_checklist_item, mcp__trello__get_checklist_by_name, Read, AskUserQuestion, Glob, Grep
---

## Task

Create a new, well-formatted Trello ticket on the GBBO board following the project's ticket writing conventions.

### Instructions

1. **Understand the request**: The user will provide a brief description of what ticket they want to create
2. **Read conventions**: Review `/Users/benkiggen/great-brit/docs/TICKET_CONVENTIONS.md`
3. **Gather information**: Ask clarifying questions to gather all necessary details:
   - What problem does this solve? (Context)
   - What's the expected behavior? (Proposed Solution)
   - What are the edge cases? (Testing Considerations)
   - What type of ticket is this? (Feature, Bug, Refactor, etc.)
   - What priority? (P0, P1, P2)
   - Which area? (frontend, backend, database, etc.)
4. **Research the codebase**: Use Glob/Grep to identify relevant files and components
5. **Get available lists**: Fetch the lists on the GBBO board to know where to place the card
6. **Ask for list placement**: Show the user available lists and ask which one to use
7. **Create the ticket**:
   - Write a clear title with type tag (e.g., `[Feature] Add user profile editing`)
   - Create well-structured description with all sections
   - Add to the appropriate list
   - Create "Acceptance Criteria" checklist with specific, testable items
8. **Show the result**: Display the created ticket with its URL

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

Create a checklist named "Acceptance Criteria" with clear, testable conditions:
- Use action-oriented language
- Be specific and measurable
- Include edge cases
- Cover both happy path and error states

### Example Interaction

User: `/write-ticket Add ability to edit rankings after submission`

You should:
1. Read the conventions doc
2. Ask questions:
   - "Should users be able to edit at any time, or only before the episode airs?"
   - "What happens to existing bets when rankings change?"
   - "Should there be an edit history?"
3. Search codebase: Grep for "ranking" to find relevant files
4. Get lists from GBBO board
5. Ask: "I found these lists: Backlog, In Progress, Done. Which list should I add this to?"
6. Create card with:
   - Title: `[Feature] Add ability to edit rankings after submission`
   - Full description with all sections
   - Acceptance criteria checklist
   - Suggest labels: P1, frontend, backend, medium
7. Report: "Created ticket '[Feature] Add ability to edit rankings after submission' in Backlog list with 6 acceptance criteria items. Card URL: https://trello.com/c/..."
