import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { getTopLeaderboard, addLeaderboardEntry, getUserBestScore } from './db.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Serve static files from client build in production
if (process.env.NODE_ENV === 'production') {
  const clientDistPath = path.join(__dirname, '../../client/dist');
  app.use(express.static(clientDistPath));
}

// Get top 20 leaderboard
app.get('/api/leaderboard', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 20;
    const leaderboard = await getTopLeaderboard(limit);
    res.json(leaderboard);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

// Submit new score
app.post('/api/leaderboard', async (req, res) => {
  try {
    const { twitter_handle, faction, score, rounds_survived, enemies_eliminated, gpus_remaining } = req.body;

    // Validate input
    if (!twitter_handle || !faction || score === undefined || rounds_survived === undefined || enemies_eliminated === undefined || gpus_remaining === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Clean twitter handle (remove @ if present)
    const cleanHandle = twitter_handle.replace(/^@/, '');

    const entry = await addLeaderboardEntry({
      twitter_handle: cleanHandle,
      faction,
      score,
      rounds_survived,
      enemies_eliminated,
      gpus_remaining
    });

    res.json(entry);
  } catch (error) {
    console.error('Error adding leaderboard entry:', error);
    res.status(500).json({ error: 'Failed to add leaderboard entry' });
  }
});

// Get user's best score
app.get('/api/leaderboard/user/:handle', async (req, res) => {
  try {
    const handle = req.params.handle.replace(/^@/, '');
    const bestScore = await getUserBestScore(handle);
    res.json(bestScore);
  } catch (error) {
    console.error('Error fetching user score:', error);
    res.status(500).json({ error: 'Failed to fetch user score' });
  }
});

// Serve index.html for all other routes (SPA support) in production
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    const clientDistPath = path.join(__dirname, '../../client/dist');
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
