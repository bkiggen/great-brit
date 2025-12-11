# Great Brit - Feature Guides

Detailed documentation of how each feature works in the Great Brit application.

## Table of Contents

1. [Ranking System](#ranking-system)
2. [Betting System](#betting-system)
3. [Balance & Scoring](#balance--scoring)
4. [Episode Management](#episode-management)
5. [Leaderboard](#leaderboard)

---

## Ranking System

Users rank bakers (stars) each episode to earn points based on how well their ranked bakers perform.

### How Rankings Work

1. **Per-Episode Rankings**: Each user maintains a separate ranking for each episode
2. **Drag-and-Drop**: Rankings are reordered via drag-and-drop (React DnD)
3. **Auto-Save**: Rankings save automatically when dropped
4. **Locking**: Rankings for past episodes are locked and view-only

### Ranking Flow

```
User opens Rankings page
        │
        ▼
Current episode selected by default
        │
        ▼
User drags bakers to reorder (1 = best, N = worst)
        │
        ▼
On drop → POST /api/rankings saves new order
        │
        ▼
When episode ends → Rankings locked
```

### Score Multipliers

Rankings affect scoring through multipliers defined in `server/helpers/splits.js`:

```javascript
// Episode 1 (12 bakers): [-3, -2, -2, -1, -1, 0, 0, 1, 1, 2, 2, 3]
// Episode 6 (7 bakers):  [-3, -2, -2, 1, 2, 2, 3]
// Episode 10 (3 bakers): [-3, 1, 3]
```

**How multipliers work**:
- Your #1 ranked baker gets the highest multiplier (rightmost value)
- Your last ranked baker gets the lowest multiplier (leftmost value)
- Multiplier × event value = points earned/lost for that baker

**Example** (Episode 1):
- Baker ranked #1 (best) → multiplier = 3
- Baker ranked #12 (worst) → multiplier = -3
- If your #1 baker wins Star Baker (+2 points event), you get: 3 × 2 = +6 points

### Default Rankings

When a new user joins or a new episode is created:
- System creates default rankings for all users
- Bakers are ordered by their database ID
- Users should reorder before the episode airs

### Key Files

| File | Purpose |
|------|---------|
| `client/src/containers/Rankings/index.js` | Rankings UI with drag-drop |
| `client/src/store/rankingsSlice.js` | Redux state for rankings |
| `server/api/router/rankingRoutes.js` | API endpoints |
| `server/helpers/splits.js` | Score multipliers by episode |

---

## Betting System

Users can create and accept side bets on episode outcomes for additional risk/reward.

### Bet Structure

Each bet has:
- **Description**: What the bet is about (e.g., "Paul will give a Hollywood handshake")
- **Odds**: Decimal odds (e.g., 2.0 = 2:1)
- **Max Lose**: Maximum amount the creator can lose per accepted user
- **Eligible Users**: Who can accept this bet
- **Accepted Users**: Who has accepted

### Bet Lifecycle

```
1. CREATION
   Creator posts bet with description, odds, maxLose, eligible users
   Status: Open for acceptance
        │
        ▼
2. ACCEPTANCE
   Eligible users can accept the bet
   Multiple users can accept the same bet
        │
        ▼
3. RESOLUTION
   Admin marks bet as won (true) or lost (false)
   "Won" means the bet creator was correct
        │
        ▼
4. CALCULATION
   When deltas are calculated, bet outcomes affect balances
```

### Payout Calculation

**If bet creator wins** (`won: true`):
- Creator gains: `maxLose × (1/odds) × numberOfAcceptors`
- Each acceptor loses: `maxLose × (1/odds)`

**If bet creator loses** (`won: false`):
- Creator loses: `maxLose × numberOfAcceptors`
- Each acceptor gains: `maxLose`

**Example**:
- Bet: "Star Baker will be eliminated" at 3:1 odds, maxLose = £10
- 2 users accept
- If creator wins: Creator gets £10 × (1/3) × 2 = £6.67
- If creator loses: Creator loses £10 × 2 = £20, each acceptor gains £10

### Bet Views

The Bets page has three tabs:
1. **All Bets**: All bets for current episode
2. **My Bets**: Bets you created
3. **Available to Accept**: Bets you can accept (eligible & not yet accepted)

### Key Files

| File | Purpose |
|------|---------|
| `client/src/containers/Bets/index.js` | Bets UI with tabs |
| `client/src/containers/Bets/NewBet.js` | Bet creation form |
| `client/src/containers/Bets/BetTable.js` | Bet listing/actions |
| `client/src/store/betsSlice.js` | Redux state for bets |
| `server/api/router/betRoutes.js` | API endpoints |

---

## Balance & Scoring

Every user starts with £100. Balance changes are tracked per episode.

### Starting Balance

```javascript
const startingBalance = 100;
const currentBalance = startingBalance + sumOfAllDeltas;
```

### Delta Calculation

When "Calculate Deltas" is triggered for an episode, the system:

1. **Processes Rankings**:
   - Gets all events that occurred in the episode
   - For each user's ranking:
     - Finds events for each baker they ranked
     - Multiplies event values by ranking multiplier
     - Sums to get ranking-based delta

2. **Processes Bets**:
   - For each resolved bet (`won !== null`):
     - Calculates payout/loss based on odds and acceptance
     - Adds to user's delta

3. **Stores Results**:
   - Creates/updates `UserDelta` record for each user + episode
   - These deltas power the leaderboard and balance history

### Event Types

Events have point values defined in `EventType` table. Common examples:
- Star Baker: positive value
- Eliminated: negative value
- Technical win: positive value

### Key Files

| File | Purpose |
|------|---------|
| `server/api/router/episodeRoutes.js` | `calculateDeltas` endpoint (lines 274-422) |
| `server/helpers/splits.js` | Ranking multipliers |
| `client/src/containers/Home/index.jsx` | Balance display & chart |

---

## Episode Management

Episodes are the core organizational unit - each represents one show episode.

### Episode Properties

| Field | Purpose |
|-------|---------|
| `number` | Episode number (1, 2, 3...) - also the primary key |
| `current` | Is this the active episode? (only one can be current) |
| `hasAired` | Has this episode aired? |

### Episode Lifecycle

```
1. CREATE EPISODE
   POST /api/episodes
   - Creates episode record
   - Copies stars from previous episode (or all active stars for ep 1)
   - Creates EpisodeStar relationships
   - Creates default rankings for all users
        │
        ▼
2. SET AS CURRENT
   POST /api/episodes/current
   - Marks this episode as current
   - Unmarks all other episodes
        │
        ▼
3. USERS INTERACT
   - Users set their rankings
   - Users create/accept bets
   - Admin adds events as show airs
        │
        ▼
4. CALCULATE DELTAS
   POST /api/episodes/:id/calculateDeltas
   - Validates all users have rankings (or force)
   - Calculates ranking-based scores
   - Calculates bet outcomes
   - Creates UserDelta records
        │
        ▼
5. NEXT EPISODE
   - Remove eliminated bakers from next episode
   - Create new episode (repeats from step 1)
```

### Managing Stars Per Episode

Each episode has its own set of bakers (EpisodeStar join table):
- `GET /api/episodes/:id/stars` - Get bakers in episode
- `PUT /api/episodes/:id/stars` - Update bakers in episode

This allows removing eliminated bakers from future episodes.

### Key Files

| File | Purpose |
|------|---------|
| `client/src/containers/Episodes/index.js` | Episode management UI |
| `server/api/router/episodeRoutes.js` | Episode API endpoints |
| `server/prisma/schema.prisma` | Episode, EpisodeStar models |

---

## Leaderboard

Real-time ranking of all users by total balance.

### How It Works

```
GET /api/users/leaderboard

1. Fetch all users with their UserDeltas
2. For each user:
   - Sum all delta values
   - Add to starting balance (100)
3. Sort by balance descending
4. Return sorted list
```

### Display

The leaderboard shows:
- Rank position (with medal icons for top 3)
- User name
- Current balance
- Highlighting for the logged-in user

### Balance History Chart

The home page includes a line chart showing balance over time:
- X-axis: Episodes (Start, Ep 1, Ep 2, ...)
- Y-axis: Balance (£)
- Toggle visibility of different users
- Your line is emphasized

### Key Files

| File | Purpose |
|------|---------|
| `server/api/router/userRoutes.js` | Leaderboard endpoint (lines 24-61) |
| `client/src/containers/Home/index.jsx` | Leaderboard & chart display |
| `client/src/store/usersSlice.js` | Redux state for users/leaderboard |

---

## Quick Reference: User Workflows

### New User Onboarding
1. Register with secret code → Account created
2. Default rankings created for all episodes
3. Adjust rankings before current episode airs
4. Create or accept bets

### Weekly Episode Flow
1. Admin creates new episode
2. Admin sets it as current
3. Users lock in rankings before show
4. During show: Admin adds events
5. After show: Admin marks bet outcomes
6. Admin calculates deltas
7. Leaderboard updates
8. Admin removes eliminated baker
9. Repeat for next episode

### Checking Your Status
1. Home page shows current balance
2. Balance history chart shows trends
3. Leaderboard shows position
4. Bets section shows active bets
