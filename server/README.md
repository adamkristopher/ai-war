# AI WAR Server

Backend API for the AI WAR leaderboard system.

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure database:**
   - Copy `.env.example` to `.env`
   - Update `DATABASE_URL` with your PostgreSQL connection string:
     ```
     DATABASE_URL=postgresql://username:password@localhost:5432/aiwar
     ```

3. **Create database and tables:**
   ```bash
   # Connect to PostgreSQL
   psql -U your_username

   # Create database
   CREATE DATABASE aiwar;

   # Exit and run schema
   psql -U your_username -d aiwar -f schema.sql
   ```

4. **Start the server:**
   ```bash
   npm run dev
   ```

## API Endpoints

### GET `/api/leaderboard`
Get top 20 scores (or specify `?limit=N`)

**Response:**
```json
[
  {
    "id": 1,
    "twitter_handle": "rubberdev",
    "faction": "OPENG",
    "score": 15000,
    "rounds_survived": 50,
    "enemies_eliminated": 3,
    "gpus_remaining": 250,
    "created_at": "2025-10-01T12:00:00Z"
  }
]
```

### POST `/api/leaderboard`
Submit a new score

**Request:**
```json
{
  "twitter_handle": "rubberdev",
  "faction": "OPENG",
  "score": 15000,
  "rounds_survived": 50,
  "enemies_eliminated": 3,
  "gpus_remaining": 250
}
```

### GET `/api/leaderboard/user/:handle`
Get user's best score

## Scoring System

- Rounds Survived × 100
- Enemies Eliminated × 500
- GPUs Remaining × 1
- **Total Score**

## Database Schema

```sql
CREATE TABLE leaderboard (
  id SERIAL PRIMARY KEY,
  twitter_handle VARCHAR(100) NOT NULL,
  faction VARCHAR(50) NOT NULL,
  score INTEGER NOT NULL,
  rounds_survived INTEGER NOT NULL,
  enemies_eliminated INTEGER NOT NULL,
  gpus_remaining INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
