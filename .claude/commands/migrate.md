---
description: Create and run a Prisma database migration
allowed-tools: Bash(npx prisma:*), Bash(cd:*), Read
---

## Context

Current schema:
!`head -100 server/prisma/schema.prisma`

## Arguments

$ARGUMENTS - The migration name (e.g., "add-user-avatar", "update-bet-schema")

## Task

Create and apply a Prisma migration.

### Step 1: Validate
- If no migration name provided, ask the user for one
- Migration names should be kebab-case (e.g., "add-user-field")

### Step 2: Run migration
```bash
cd /Users/benkiggen/great-brit/server && npx prisma migrate dev --name $ARGUMENTS
```

### Step 3: Regenerate client
```bash
cd /Users/benkiggen/great-brit/server && npx prisma generate
```

### Step 4: Report
- Migration created successfully or errors encountered
- Remind user to commit the migration files
