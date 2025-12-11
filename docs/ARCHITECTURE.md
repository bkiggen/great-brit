# Great Brit - Architecture Overview

A full-stack web application for a competitive ranking and betting game based on "The Great British Baking Show."

## Directory Structure

```
great-brit/
├── client/                     # React frontend
│   └── src/
│       ├── containers/         # Page components
│       │   ├── Home/          # Dashboard with balance history
│       │   ├── Rankings/      # Star ranking interface
│       │   ├── Bets/          # Betting interface
│       │   ├── Episodes/      # Episode management
│       │   ├── Stars/         # Star (baker) management
│       │   ├── Admin/         # Admin panel
│       │   ├── Profile/       # User profile
│       │   └── Login.js       # Authentication
│       ├── components/         # Reusable UI components
│       │   ├── Header/        # Navigation
│       │   ├── ChatWidget/    # WebSocket chat
│       │   ├── Events/        # Event displays
│       │   └── LoginBox/      # Login form
│       ├── store/             # Redux state (8 slices)
│       ├── helpers/           # Utilities (API, notifications)
│       ├── router.js          # Route definitions
│       └── App.js             # Root component
│
├── server/                     # Express backend
│   ├── api/router/            # API route handlers
│   │   ├── userRoutes.js      # Auth, profiles, leaderboard
│   │   ├── betRoutes.js       # Betting endpoints
│   │   ├── rankingRoutes.js   # Rankings endpoints
│   │   ├── episodeRoutes.js   # Episode management
│   │   ├── starRoutes.js      # Star management
│   │   ├── eventRoutes.js     # Event management
│   │   ├── roomRoutes.js      # Chat rooms
│   │   ├── authMiddleware.js  # Session verification
│   │   └── index.js           # Route aggregator
│   ├── socket/                # WebSocket handlers
│   ├── prisma/schema.prisma   # Database schema
│   └── index.js               # Server entry point
│
└── docs/                       # Documentation
```

## Technology Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React 18, Redux Toolkit, Material-UI v5, React Router v6, Recharts |
| **Backend** | Express 4, Prisma ORM, Socket.io |
| **Database** | PostgreSQL |
| **State** | Redux with redux-persist (session persisted to localStorage) |

## Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                          FRONTEND                                │
│  ┌──────────┐    ┌─────────────┐    ┌──────────────────────┐   │
│  │  React   │───▶│   Redux     │───▶│    makeRequest()     │   │
│  │   UI     │◀───│   Store     │◀───│  (client/helpers/)   │   │
│  └──────────┘    └─────────────┘    └──────────┬───────────┘   │
└─────────────────────────────────────────────────┼───────────────┘
                                                  │ HTTP + Auth Header
                                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                          BACKEND                                 │
│  ┌──────────────────┐    ┌─────────────┐    ┌───────────────┐  │
│  │  Express Router  │───▶│    Auth     │───▶│    Route      │  │
│  │   /api/*         │    │  Middleware │    │   Handlers    │  │
│  └──────────────────┘    └─────────────┘    └───────┬───────┘  │
│                                                      │          │
│                                              ┌───────▼───────┐  │
│                                              │    Prisma     │  │
│                                              │    Client     │  │
│                                              └───────┬───────┘  │
└──────────────────────────────────────────────────────┼──────────┘
                                                       │
                                               ┌───────▼───────┐
                                               │  PostgreSQL   │
                                               └───────────────┘
```

### Request Lifecycle

1. **UI Action** - User interacts with React component
2. **Redux Thunk** - Component dispatches async action from slice
3. **API Call** - `makeRequest()` adds Bearer token, calls `/api/*`
4. **Auth Check** - `authMiddleware.js` validates session token against DB
5. **Route Handler** - Processes request using Prisma queries
6. **Response** - Data returns through chain, Redux updates store, UI re-renders

## Key Entry Points

| File | Purpose |
|------|---------|
| `client/src/index.js` | React app bootstrap |
| `client/src/router.js` | Route definitions with auth guards |
| `server/index.js` | Express server, static files, WebSocket setup |
| `server/api/router/index.js` | API route aggregation |
| `server/prisma/schema.prisma` | Database schema (source of truth) |

## Database Schema

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│    User     │       │   Session   │       │    Star     │
├─────────────┤       ├─────────────┤       ├─────────────┤
│ id (uuid)   │◀──────│ userId      │       │ id (int)    │
│ firstName   │       │ token       │       │ firstName   │
│ lastName    │       │ expiresAt   │       │ lastName    │
│ email       │       └─────────────┘       │ bio         │
│ password    │                             │ active      │
└─────────────┘                             └─────────────┘
      │                                           │
      │ ┌─────────────────────────────────────────┤
      │ │                                         │
      ▼ ▼                                         ▼
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│   Ranking   │       │   Episode   │◀──────│ EpisodeStar │
├─────────────┤       ├─────────────┤       ├─────────────┤
│ userId      │──────▶│ number (PK) │       │ episodeId   │
│ starId      │       │ hasAired    │       │ starId      │
│ rank        │       │ current     │       └─────────────┘
│ episode     │──────▶└─────────────┘
└─────────────┘             │
                            │
      ┌─────────────────────┼─────────────────────┐
      │                     │                     │
      ▼                     ▼                     ▼
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│     Bet     │       │    Event    │       │  UserDelta  │
├─────────────┤       ├─────────────┤       ├─────────────┤
│ betterId    │       │ eventTypeId │──────▶│ userId      │
│ episode     │       │ starId      │       │ episodeId   │
│ description │       │ episodeId   │       │ delta       │
│ odds        │       │ time        │       └─────────────┘
│ maxLose     │       └─────────────┘
│ won         │              │
│ eligible[]  │              ▼
│ accepted[]  │       ┌─────────────┐
└─────────────┘       │  EventType  │
                      ├─────────────┤
                      │ description │
                      │ value       │
                      └─────────────┘
```

### Key Relationships

- **User → Session**: One-to-many (user can have multiple sessions)
- **User → Ranking**: One-to-many (user ranks stars per episode)
- **User → Bet**: Creator, eligible users, accepted users (multiple relations)
- **Episode → Star**: Many-to-many via `EpisodeStar` join table
- **Episode → Event**: One-to-many (events occur within episodes)
- **User → UserDelta**: Balance changes per episode

## Redux Store Structure

```javascript
{
  session: { userId, sessionToken, ... },  // Persisted to localStorage
  users: { list, leaderboard, balanceHistory },
  episodes: { list, currentEpisode },
  stars: { list },
  rankings: { byEpisode },
  bets: { list },
  events: { list },
  socket: { socket, connected }
}
```

**State Slices** (in `client/src/store/`):
- `sessionSlice.js` - Auth state (persisted)
- `usersSlice.js` - Users, leaderboard, balance history
- `episodesSlice.js` - Episode data
- `starsSlice.js` - Star (baker) data
- `rankingsSlice.js` - User rankings
- `betsSlice.js` - Betting data
- `eventsSlice.js` - Event data
- `socketSlice.js` - WebSocket connection

## Authentication Flow

```
┌─────────┐     POST /api/users/login      ┌─────────┐
│ Client  │ ─────────────────────────────▶ │ Server  │
│         │     { email, password }        │         │
│         │                                │         │
│         │     { sessionToken, user }     │         │
│         │ ◀───────────────────────────── │         │
└─────────┘                                └─────────┘
     │
     │ Store token in Redux (persisted)
     ▼
┌─────────────────────────────────────────────────────┐
│  All subsequent requests include:                    │
│  Authorization: Bearer <sessionToken>               │
└─────────────────────────────────────────────────────┘
```

- Sessions stored in DB with expiration
- Frontend persists session slice to localStorage
- `ProtectedRoute` component redirects to `/login` if no token
- `authMiddleware.js` validates token on every protected API call

## API Routes

All routes prefixed with `/api`:

| Resource | Key Endpoints |
|----------|---------------|
| **Users** | `GET /users`, `POST /users`, `POST /login`, `POST /logout`, `PATCH /users`, `PUT /user/profile`, `PUT /user/password`, `GET /users/leaderboard`, `GET /users/balanceHistory`, `GET /users/allBalanceHistory`, `GET /users/usersWithRankings/:episodeId`, `POST /admin/backfill-rankings` |
| **Episodes** | `GET /episodes`, `POST /episodes`, `GET /episodes/current`, `POST /episodes/current`, `GET /episodes/:id/stars`, `PUT /episodes/:id/stars`, `GET /episodes/:id/events`, `POST /episodes/:id/events`, `POST /episodes/:id/calculateDeltas`, `DELETE /episodes/:id/deltas` |
| **Stars** | `GET /stars`, `POST /stars`, `PATCH /stars/:id`, `DELETE /stars/:id` |
| **Rankings** | `GET /rankings`, `PUT /rankings`, `DELETE /rankings` |
| **Bets** | `GET /bets`, `POST /bets`, `POST /bets/:id/accept`, `PATCH /bets/:id`, `DELETE /bets/:id` |
| **Events** | `GET /events`, `POST /events`, `DELETE /events/:id` |
| **Rooms** | `GET /rooms`, `POST /rooms` |

## Frontend Routes

| Path | Component | Auth Required |
|------|-----------|---------------|
| `/` | Home | Yes |
| `/rankings` | Rankings | Yes |
| `/bets` | Bets | Yes |
| `/episodes` | Episodes | Yes |
| `/admin/*` | Admin | Yes |
| `/profile` | Profile | Yes |
| `/login` | Login | No |

## Environment Variables

**Server** (`server/.env`):
```
DATABASE_URL=postgresql://...
PORT=8000
NODE_ENV=development|production
FRONTEND_URL=http://localhost:3002
NEW_USER_SECRET=<registration-secret>
```

**Client** (optional):
```
REACT_APP_API_URL=http://localhost:8000
```

## Production Deployment

- Server serves React build as static files from `client/build`
- Catch-all route serves `index.html` for client-side routing
- Railway deployment configured via `railway.json` and `nixpacks.toml`
- See `RAILWAY_DEPLOYMENT.md` for detailed deployment guide
