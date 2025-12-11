---
description: Run ESLint and auto-fix issues
allowed-tools: Bash(npx eslint:*), Bash(npm run lint:*)
---

## Context

ESLint config location:
!`ls -la client/.eslintrc* client/eslint.config.* 2>/dev/null || echo "Using default CRA eslint config"`

## Task

Run the linter and fix auto-fixable issues.

### Step 1: Run ESLint with auto-fix
```bash
cd /Users/benkiggen/great-brit/client && npx eslint src/ --fix --ext .js,.jsx
```

### Step 2: Check server (if eslint configured)
```bash
cd /Users/benkiggen/great-brit/server && npx eslint . --fix --ext .js 2>/dev/null || echo "Server eslint not configured"
```

### Step 3: Report
- Number of issues fixed automatically
- Any remaining issues that need manual attention
- File locations of remaining issues
