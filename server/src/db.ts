import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

export interface LeaderboardEntry {
  id: number;
  twitter_handle: string;
  faction: string;
  score: number;
  rounds_survived: number;
  enemies_eliminated: number;
  gpus_remaining: number;
  created_at: Date;
}

export interface NewLeaderboardEntry {
  twitter_handle: string;
  faction: string;
  score: number;
  rounds_survived: number;
  enemies_eliminated: number;
  gpus_remaining: number;
}

export async function getTopLeaderboard(limit: number = 20): Promise<LeaderboardEntry[]> {
  const result = await pool.query(
    'SELECT * FROM leaderboard ORDER BY score DESC, created_at ASC LIMIT $1',
    [limit]
  );
  return result.rows;
}

export async function addLeaderboardEntry(entry: NewLeaderboardEntry): Promise<LeaderboardEntry> {
  const result = await pool.query(
    `INSERT INTO leaderboard (twitter_handle, faction, score, rounds_survived, enemies_eliminated, gpus_remaining)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [entry.twitter_handle, entry.faction, entry.score, entry.rounds_survived, entry.enemies_eliminated, entry.gpus_remaining]
  );
  return result.rows[0];
}

export async function getUserBestScore(twitterHandle: string): Promise<LeaderboardEntry | null> {
  const result = await pool.query(
    'SELECT * FROM leaderboard WHERE twitter_handle = $1 ORDER BY score DESC LIMIT 1',
    [twitterHandle]
  );
  return result.rows[0] || null;
}

export default pool;
