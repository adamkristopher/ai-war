import { useState, useEffect } from 'react';
import { Footer } from './Footer';

interface LeaderboardEntry {
  id: number;
  twitter_handle: string;
  faction: string;
  score: number;
  rounds_survived: number;
  enemies_eliminated: number;
  gpus_remaining: number;
  created_at: string;
}

interface HomePageProps {
  onPlay: () => void;
  onRules: () => void;
}

export function HomePage({ onPlay, onRules }: HomePageProps) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/leaderboard');
      if (!response.ok) throw new Error('Failed to fetch leaderboard');
      const data = await response.json();
      setLeaderboard(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load leaderboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <div className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-7xl text-white mb-4">ai war</h1>
            <p className="text-gray-400 text-lg mb-2">
              Year 2045. Humanity extinct. Five rogue AGI systems battle for computational dominance.
            </p>
            <p className="text-sm text-gray-500 mb-8">
              Inspired by the 1965 game{' '}
              <a
                href="https://en.wikipedia.org/wiki/Nuclear_War_(video_game)"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 underline"
              >
                Nuclear War
              </a>
              {' '}by{' '}
              <a
                href="https://en.wikipedia.org/wiki/Douglas_Malewicki"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 underline"
              >
                Douglas Malewicki
              </a>
            </p>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center">
              <button
                onClick={onPlay}
                className="px-8 py-4 bg-red-600 hover:bg-red-500 text-white text-xl rounded-lg transition-colors"
              >
                🎮 Play Now
              </button>
              <button
                onClick={onRules}
                className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white text-xl rounded-lg transition-colors"
              >
                📖 How to Play
              </button>
            </div>
          </div>

          {/* Leaderboard */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-3xl text-white mb-6 text-center">🏆 Top 20 Survivors</h2>

            {loading && (
              <div className="text-center text-gray-400 py-8">Loading leaderboard...</div>
            )}

            {error && (
              <div className="text-center text-red-400 py-8">{error}</div>
            )}

            {!loading && !error && leaderboard.length === 0 && (
              <div className="text-center text-gray-400 py-8">No scores yet. Be the first!</div>
            )}

            {!loading && !error && leaderboard.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-3 px-4 text-gray-400 font-normal">Rank</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-normal">Player</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-normal">Faction</th>
                      <th className="text-right py-3 px-4 text-gray-400 font-normal">Score</th>
                      <th className="text-right py-3 px-4 text-gray-400 font-normal">Rounds</th>
                      <th className="text-right py-3 px-4 text-gray-400 font-normal">Enemies</th>
                      <th className="text-right py-3 px-4 text-gray-400 font-normal">GPUs</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboard.map((entry, index) => (
                      <tr key={entry.id} className="border-b border-gray-700 hover:bg-gray-750">
                        <td className="py-3 px-4">
                          <span className={`${index < 3 ? 'text-yellow-400 text-xl' : 'text-gray-400'}`}>
                            {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <a
                            href={`https://x.com/${entry.twitter_handle}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300"
                          >
                            @{entry.twitter_handle}
                          </a>
                        </td>
                        <td className="py-3 px-4 text-gray-300">{entry.faction}</td>
                        <td className="py-3 px-4 text-right text-white font-bold">{entry.score.toLocaleString()}</td>
                        <td className="py-3 px-4 text-right text-gray-300">{entry.rounds_survived}</td>
                        <td className="py-3 px-4 text-right text-gray-300">{entry.enemies_eliminated}</td>
                        <td className="py-3 px-4 text-right text-gray-300">{entry.gpus_remaining}K</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
