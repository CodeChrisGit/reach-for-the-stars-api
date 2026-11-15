# Reach for the Stars API

Backend API for **Reach for the Stars**, a tournament game for the SorSU Bulan Campus library.
CS 313 Software Engineering 1, A.Y. 2026-2027.

- Developer: Chrisjay M. Bibat (CodeChrisGit), BSCS 3-1 
- Group and game concept: Group 5

This is my own build of my group's game concept. Every commit in this repository was made by me, with Git, on my own computer or in my own Codespace.

## Tech stack

| Layer | Tool |
|---|---|
| Runtime | Node.js 22 LTS or newer |
| Web framework | Express 5 |
| Database | PostgreSQL 16 or newer |
| ORM and migrations | Sequelize 6 with sequelize-cli |

## Setup

```
git clone [repository-url]
cd [folder-name]
npm install
```

Copy `.env.example` to `.env`, then put your own PostgreSQL password in `DB_PASSWORD`.

```
npm run db:create     (first time only)
npm run db:migrate
npm run db:seed
npm run db:check
npm run dev
```

## Environment variables

| Key | Example | Purpose |
|---|---|---|
| NODE_ENV | development | Which config block to use |
| PORT | 3001 | Port the API listens on (the library assigns the final port at deployment) |
| DB_HOST | 127.0.0.1 | PostgreSQL host |
| DB_PORT | 5432 | PostgreSQL port |
| DB_NAME | your_game_slug | Database name: your game slug, with underscores |
| DB_USER | postgres | Database user |
| DB_PASSWORD | (your own) | Database password. Never commit this. |
| HUB_API_KEY | dev-hub-key | Key the Library Game Hub sends to read results. The library gives the real one at deployment. |

## Endpoints (Hub Contract v1.2)

Base URL: `http://localhost:3001/api/v1`

| Method | Path | Purpose | Success |
|---|---|---|---|
| GET | /health | Is the API up and can it reach the database? | 200 (503 when the database is down) |
| GET | /game-info | Slug, name, group, developer, description, player limits, version | 200 |
| GET | /results | Finished games, every player, and the top 3. Needs the `X-Hub-Key` header. Optional `?since=` | 200 (401 without the key) |

### Module 1: Question Sets 
| Method | Path | Purpose | Success |
|---|---|---|---|
| GET | /question-sets | List all question sets visible to the caller (Host or Admin) | 200 |
| POST | /question-sets | Create a new question set (Host/Admin only) | 201 |
| GET | /question-sets/{id} | Read a specific question set by its ID | 200 |
| PATCH | /question-sets/{id} | Update fields of a specific question set (Owner/Admin only) | 200 |
| DELETE | /question-sets/{id} | Delete a specific question set (Owner/Admin only) | 204 |

### Module 2: Game Sessions and Joining
| Method | Path | Purpose | Success |
|---|---|---|---|
| POST | /sessions | Start a new game session with a randomly generated 6-digit PIN (Host/Admin only) | 201 |
| GET | /sessions/{code} | Read game session details by its 6-digit join code | 200 |
| PATCH | /sessions/{code} | Change the game session status (e.g., LOBBY -> RUNNING -> CLOSED) | 200 |
| POST | /sessions/{code}/players | Join a game session or rejoin with the same seat (Any account) | 201 / 200 |
| GET | /sessions/{code}/players | List participants, nicknames, and current scores in a session | 200 |

## What "completed" means in my game

[One or two sentences: when does a player count as having completed a game? For example: "A player completed the game when they answered every question, even if some answers were wrong or timed out."]

## Tables

[List your tables, one line each, in the order of your migrations.]

## Database scripts

| Command | What it does |
|---|---|
| npm run db:migrate | Runs migrations that have not run yet |
| npm run db:migrate:status | Lists every migration as up or down |
| npm run db:seed | Loads the seed data |
| npm run db:check | Counts the rows in every table |
| npm run db:reset | Empties the database, rebuilds every table and reloads the seed data |
| npm run check | Runs the same automatic check that GitHub runs after every push |
