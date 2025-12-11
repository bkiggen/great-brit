---
description: Run tests for client and/or server
allowed-tools: Bash(npm test:*), Bash(npm run test:*)
---

## Context

Available test commands:
!`grep -E "\"test\":" client/package.json server/package.json 2>/dev/null || echo "Check package.json for test scripts"`

## Task

Run the project tests.

### Options
- Run client tests: `cd client && npm test -- --watchAll=false`
- Run server tests: `cd server && npm test` (if configured)

### Step 1: Determine what to test
- If user specified "client" or "server", test that one
- Otherwise, run client tests (most common)

### Step 2: Run tests
Execute the appropriate test command and report results.

### Step 3: Summarize
- Number of tests passed/failed
- Any failing test names
- Suggestions for fixing failures if applicable
