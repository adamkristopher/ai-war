import { useState } from 'react';
import { FactionType } from '../shared/types';

interface GameOverModalProps {
  winner: string | null;
  playerFactionType: FactionType;
  gameState: {
    round: number;
    factions: Array<{ isEliminated: boolean; totalGPUs: number; type: FactionType }>;
  };
  onBackToMenu: () => void;
}

export function GameOverModal({ winner, playerFactionType, gameState, onBackToMenu }: GameOverModalProps) {
  const [twitterHandle, setTwitterHandle] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const playerFaction = gameState.factions.find(f => f.type === playerFactionType);
  const enemiesEliminated = gameState.factions.filter(f => f.isEliminated && f.type !== playerFactionType).length;
  const gpusRemaining = playerFaction?.totalGPUs || 0;
  const roundsSurvived = gameState.round;

  // Calculate score: rounds * 100 + enemies * 500 + GPUs remaining
  const score = roundsSurvived * 100 + enemiesEliminated * 500 + gpusRemaining;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:3001/api/leaderboard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          twitter_handle: twitterHandle,
          faction: playerFactionType,
          score,
          rounds_survived: roundsSurvived,
          enemies_eliminated: enemiesEliminated,
          gpus_remaining: gpusRemaining,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit score');
      }

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit score');
    } finally {
      setSubmitting(false);
    }
  };

  const resultText = winner === 'NONE'
    ? '💀 TOTAL ANNIHILATION'
    : winner === playerFactionType
    ? '🎉 VICTORY'
    : '💀 DEFEAT';

  const resultColor = winner === 'NONE'
    ? 'text-red-400'
    : winner === playerFactionType
    ? 'text-green-400'
    : 'text-red-400';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-8 max-w-md w-full">
        <h2 className={`text-4xl text-center mb-6 ${resultColor}`}>{resultText}</h2>

        {/* Stats */}
        <div className="bg-gray-700 rounded p-4 mb-6 space-y-2">
          <div className="flex justify-between text-white">
            <span>Faction:</span>
            <span className="font-bold">{playerFactionType}</span>
          </div>
          <div className="flex justify-between text-white">
            <span>Rounds Survived:</span>
            <span className="font-bold">{roundsSurvived}</span>
          </div>
          <div className="flex justify-between text-white">
            <span>Enemies Eliminated:</span>
            <span className="font-bold">{enemiesEliminated}</span>
          </div>
          <div className="flex justify-between text-white">
            <span>GPUs Remaining:</span>
            <span className="font-bold">{gpusRemaining}K</span>
          </div>
          <div className="flex justify-between text-yellow-400 text-xl border-t border-gray-600 pt-2 mt-2">
            <span>Final Score:</span>
            <span className="font-bold">{score.toLocaleString()}</span>
          </div>
        </div>

        {/* Submit to leaderboard */}
        {!submitted ? (
          <form onSubmit={handleSubmit} className="mb-4">
            <label className="block text-gray-300 mb-2 text-sm">
              Submit your score to the leaderboard:
            </label>
            <input
              type="text"
              value={twitterHandle}
              onChange={(e) => setTwitterHandle(e.target.value)}
              placeholder="Your X/Twitter handle"
              className="w-full px-4 py-2 bg-gray-700 text-white rounded mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
            <button
              type="submit"
              disabled={submitting}
              className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 text-white rounded-lg transition-colors"
            >
              {submitting ? 'Submitting...' : '📊 Submit to Leaderboard'}
            </button>
          </form>
        ) : (
          <div className="bg-green-900 bg-opacity-30 border border-green-600 rounded p-4 mb-4 text-center">
            <p className="text-green-400">✅ Score submitted successfully!</p>
          </div>
        )}

        <button
          onClick={onBackToMenu}
          className="w-full px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
        >
          ← Back to Menu
        </button>
      </div>
    </div>
  );
}
