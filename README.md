# Minesweeper Game (Django + React + Docker)

This is a full-stack Minesweeper game built with Django and DRF on the backend and React (TypeScript) on the frontend. It includes authentication, gameplay, and a leaderboard based on most wins.

## Setup Instructions
### Prerequisites
- Docker
- Docker Compose

### Run the Project
From the project root:

```bash
docker-compose up --build
```

Then access:
- Frontend: http://localhost:5173

**Note:** The `.env` file is included in this project for ease of setup during review. In a real-world production environment, sensitive credentials should never be committed to version control.

## Features
- JWT-based authentication (Sign up / Sign in)
- Playable Minesweeper with resume option
- Leaderboard showing users with most wins
- Dockerized with PostgreSQL, Django, React, and Nginx

## Tech Stack
- Backend: Django, Django REST Framework, SimpleJWT
- Frontend: React, TypeScript, Tailwind CSS v4, Vite
- Database: PostgreSQL

## API Endpoints

### Auth
- POST /api/register/ – Sign up
- POST /api/token/ – Get access/refresh tokens
- POST /api/token/refresh/ – Refresh token

### Game
- POST /api/game/ – Create new game
- GET /api/game/<game_id>/ – Get game state
- POST /api/game/<game_id>/action/ – Reveal or flag a cell
- GET /api/game/resume/ – List top 5 unfinished games for user
- GET /api/game/leaderboard/ – Leaderboard based on most wins

