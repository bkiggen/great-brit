# Architectural Decisions & Gotchas

A living document of design decisions, quirks, and things to remember when working on Great Brit.

---

## Configuration Gotchas

### CORS Port Configuration
**Decision**: Client runs on port 3002, not the CRA default of 3000.

**Why**: Avoid conflicts with other local development servers.

**Impact**:
- `server/index.js` CORS config uses 3002
- `server/.env` should have `FRONTEND_URL=http://localhost:3002`
- Client proxy (if used) must target port 8000

### Episode Primary Key
**Decision**: Episode uses `number` as primary key, not an auto-increment `id`.

**Why**: Episode numbers are meaningful business identifiers (Episode 1, Episode 2, etc.) and are never changed.

**Impact**:
- Foreign keys reference `episode` (the number), not `episodeId`
- When creating relationships, use the episode number directly
- Example: `{ episode: 5 }` not `{ episodeId: 5 }`

---

## Authentication

### Session Storage
**Decision**: Sessions stored in database, tokens in Redux (persisted to localStorage).

**Why**:
- DB sessions allow server-side invalidation
- Redux persistence provides seamless refresh experience

**Impact**:
- Logout must call API to invalidate server session
- Token expiration handled both client and server side
- `authMiddleware.js` validates every protected request

### Registration Secret
**Decision**: New user registration requires a secret code (`NEW_USER_SECRET` env var).

**Why**: This is a private game among friends, not a public app.

**Impact**:
- Registration form requires secret field
- Secret must be shared out-of-band with new players

---

## Data Model Decisions

### Rankings Per Episode
**Decision**: Users have separate rankings for each episode, not one global ranking.

**Why**: Allows strategy changes as bakers are eliminated and performance changes.

**Impact**:
- `Ranking` table has composite key of `userId + starId + episode`
- Default rankings auto-created when episodes are created
- Historical rankings preserved for scoring calculations

### Bet Eligibility Model
**Decision**: Bets have explicit `eligible` and `accepted` user arrays.

**Why**:
- Creator can limit who can accept (e.g., exclude themselves)
- Track who has accepted for payout calculations

**Impact**:
- Two many-to-many relations between Bet and User
- Payout multiplied by number of acceptors

### UserDelta for Balance History
**Decision**: Balance changes stored as deltas per episode, not running totals.

**Why**:
- Easy to recalculate totals
- Clear audit trail
- Can regenerate history if scoring rules change

**Impact**:
- Current balance = 100 + sum(all deltas)
- Leaderboard queries must aggregate deltas

---

## Frontend Architecture

### Redux Slice Organization
**Decision**: One slice per domain entity (users, episodes, stars, rankings, bets, events, session, socket).

**Why**: Clear separation, predictable state shape, easy to find related code.

**Impact**:
- Async thunks live in their respective slices
- Selectors should be co-located with slices
- Cross-slice dependencies minimized

### MUI v5 Styling
**Decision**: Use `sx` prop for styling, not `makeStyles` or `styled()`.

**Why**:
- `makeStyles` deprecated in MUI v5
- `sx` prop is more concise for component-specific styles
- Theme values accessible directly

**Impact**:
- No separate style files needed
- Theme access via `sx={{ color: 'primary.main' }}`
- Responsive values: `sx={{ width: { xs: '100%', md: '50%' } }}`

---

## Scoring System

### Ranking Multipliers
**Decision**: Multipliers change based on number of remaining bakers.

**Why**: Keep scoring balanced as field narrows.

**Location**: `server/helpers/splits.js`

**Key insight**: Multipliers sum to zero within each episode, making it a zero-sum game among rankings.

### Event Values
**Decision**: Event types have fixed point values defined in database.

**Why**: Easy to adjust scoring without code changes.

**Impact**:
- `EventType` table is source of truth
- Changes affect future calculations only
- Consider migration if retroactive changes needed

---

## Deployment

### Railway Configuration
**Decision**: Single service deployment with server serving client build.

**Why**: Simpler deployment, single URL, no CORS in production.

**Files**:
- `railway.json` - Service configuration
- `nixpacks.toml` - Build configuration

**Impact**:
- Production client build served from `client/build`
- All `/api/*` routes handled by Express
- Catch-all serves `index.html` for client routing

---

## Adding New Decisions

When making significant architectural decisions, add them here with:
1. **Decision**: What was decided
2. **Why**: The reasoning
3. **Impact**: What developers need to know
