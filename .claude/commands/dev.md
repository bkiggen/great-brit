---
description: Start both client and server for development
allowed-tools: Bash(npm run dev:*), Bash(npm start:*), Bash(cd:*), Bash(lsof:*), Bash(kill:*)
---

## Task

Start the development environment (server + client).

### Step 1: Check for running processes
Check if ports 3002 or 8000 are already in use:
```bash
lsof -i :3002 -i :8000
```

If processes are running, ask the user if they want to kill them.

### Step 2: Start server
```bash
cd /Users/benkiggen/great-brit/server && npm run dev
```
Run this in the background.

### Step 3: Start client
```bash
cd /Users/benkiggen/great-brit/client && npm start
```
Run this in the background.

### Step 4: Report
Tell the user:
- Server running at http://localhost:8000
- Client running at http://localhost:3002
