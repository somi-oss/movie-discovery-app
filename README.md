# Movie Discovery App

A full-stack movie discovery application built with React and Node.js, using TMDB as the movie data source. Users can browse trending movies, search, filter by genre, sort results, view detailed movie pages, and maintain a persistent wishlist.

## Tech Stack

**Frontend:** React (Vite), React Router, Axios
**Backend:** Node.js, Express
**Database:** PostgreSQL (hosted on Neon)
**ORM:** Prisma
**External API:** The Movie Database (TMDB)

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- A free TMDB account and API Read Access Token ([themoviedb.org](https://www.themoviedb.org) → Settings → API)
- A PostgreSQL database (this project was built against a free [Neon](https://neon.tech) instance, but any PostgreSQL connection string will work)

### Backend

```bash
cd backend
npm install
```

Create a `.env` file in `backend/` with:
```
DATABASE_URL="your_postgresql_connection_string"
TMDB_API_KEY=your_tmdb_v4_read_access_token
PORT=5000
```

Run migrations to create the database schema:
```bash
npx prisma migrate dev
```

Start the server:
```bash
npm run dev
```
Backend runs at `http://localhost:5000`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```
Frontend runs at `http://localhost:5173`.

**Note:** the frontend expects the backend to be running at `http://localhost:5000` (hardcoded in `frontend/src/services/api.js` for this project's scope).

## Approach

The core architectural decision was to keep the frontend fully decoupled from TMDB — the React client only ever talks to my own Express backend, which acts as an abstraction layer: it calls TMDB, reshapes the response into a normalized format the frontend actually needs (camelCase fields, resolved poster/backdrop URLs, simplified structure), and adds caching and retry logic before returning data. This meant the frontend never needs to know TMDB's raw response shape, rate limits, or availability at all.

On the frontend, I structured the app around React Router with distinct pages (Browse, Search, Movie Detail, Wishlist) sharing a persistent Header/BottomNav, backed by a Wishlist Context so any component (movie cards, detail page, wishlist page) can read/update wishlist state without prop drilling.

## Key Technical Decisions

- **PostgreSQL (Neon) over SQLite/MongoDB:** wishlist data is small and relational (a row per saved movie, referencing a movie ID), so a relational database was the natural fit over a document store. I initially prototyped with SQLite for local simplicity but switched to a hosted Postgres instance to better reflect a production-realistic setup.
- **In-memory caching (node-cache) over Redis:** given the scale of this assignment (single server instance, no horizontal scaling), an in-memory cache is sufficient and adds zero infrastructure overhead. I'd swap this for Redis if the app needed to run across multiple server instances, since in-memory caches don't share state between processes.
- **Retry logic with backoff for TMDB calls:** during development I hit intermittent `ECONNRESET` errors calling TMDB from Node. Rather than treat this as a one-off, I added a small retry wrapper (2 retries, exponential-ish backoff) around all TMDB calls, since the assignment explicitly asks the app to tolerate a slow/unavailable external service.
- **"Load More" pagination over infinite scroll:** simpler to reason about and test, avoids accidentally re-fetching data, and still satisfies "continue exploring when there are many matching results" without the added complexity of scroll-position tracking.
- **Storing only what's needed in the wishlist table** (movie ID, title, poster path, release year, rating, timestamp) rather than mirroring full TMDB movie objects — the rest of a movie's details are refetched live from TMDB/my backend when the user opens that movie's detail page, keeping the database lightweight.
- **Responsive navigation switches from a top nav (desktop) to a fixed bottom tab bar (mobile)** at a 640px breakpoint — a pattern used by many production apps (Instagram, Twitter web, food delivery apps) for better thumb reachability on small screens, rather than cramming search + nav links into one thin header row.

## Assumptions

- No user authentication was implemented — the wishlist is global to whoever accesses the app (single-user assumption), since the assignment didn't specify multi-user support.
- TMDB's `popular` endpoint was used as the default "browse" feed; genre/sort filtering switches to TMDB's `discover` endpoint.
- English-language (`en-US`) results only, for simplicity.

## Known Limitations

- No automated tests (unit/integration) were written given the assignment's time scope.
- Basic input validation exists on the wishlist API (checks required fields), but doesn't strictly validate types (e.g., a malformed `movieId`).
- No dedicated handling for TMDB entries with entirely missing metadata beyond basic fallback UI (e.g., "No poster", "No description available").
- Visual design is functional but intentionally minimal — focus was placed on architecture, data flow, and handling the specified edge cases over visual polish.

## AI Tools Used

I used Claude extensively throughout this project — for scaffolding boilerplate (Express setup, Prisma schema, React components), debugging real issues I hit during development (a Prisma version mismatch pulling an unstable release candidate, ECONNRESET errors when calling TMDB from Windows/Node, Git staging mistakes when running commands from the wrong directory), and explaining concepts I wasn't already familiar with (how SQLite/Postgres/Prisma actually work under the hood, how migrations work, why certain TMDB endpoints were more appropriate than others). All architectural decisions — the caching strategy, database choice, API route design, and how data flows between TMDB → backend → database → client — were made by me, and I can walk through and explain every part of the implementation.

## What I'd Improve With More Time

- Add automated tests for the backend routes (especially TMDB normalization and wishlist CRUD).
- Build a more polished visual design system (consistent spacing scale, custom typography, hover/transition states, skeleton loaders instead of plain "Loading..." text).
- Add stricter backend input validation (e.g., using a library like Zod) on all routes.
- Add infinite scroll as an alternative to "Load More," with proper scroll-position restoration when navigating back from a movie detail page.
- Add basic user accounts so wishlists could be personal rather than global.