-- Leaderboard table for AI WAR
CREATE TABLE IF NOT EXISTS leaderboard (
  id SERIAL PRIMARY KEY,
  twitter_handle VARCHAR(100) NOT NULL,
  faction VARCHAR(50) NOT NULL,
  score INTEGER NOT NULL,
  rounds_survived INTEGER NOT NULL,
  enemies_eliminated INTEGER NOT NULL,
  gpus_remaining INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster leaderboard queries
CREATE INDEX IF NOT EXISTS idx_leaderboard_score ON leaderboard(score DESC);

-- Index for twitter handle lookups
CREATE INDEX IF NOT EXISTS idx_leaderboard_twitter ON leaderboard(twitter_handle);
