import { PendingAttack, GameCard } from '../../shared/types/index';
import { Card } from '../ui/Card';

interface DefenseModalProps {
  pendingAttack: PendingAttack;
  applicableCards: GameCard[];
  onPlayDefense: (cardId: string) => void;
  onDeclineDefense: () => void;
}

export function DefenseModal({
  pendingAttack,
  applicableCards,
  onPlayDefense,
  onDeclineDefense
}: DefenseModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-800 border-4 border-red-600 rounded-lg p-6 max-w-2xl">
        <h2 className="text-2xl font-bold text-red-500 mb-4">⚠️ UNDER ATTACK!</h2>

        <div className="mb-6">
          <p className="text-white text-lg mb-2">
            You are being attacked with <span className="text-red-400 font-bold">{pendingAttack.attackType}</span>!
          </p>
          <p className="text-gray-300">
            Incoming damage: <span className="text-yellow-400 font-bold">{pendingAttack.damage}</span> to your{' '}
            <span className="text-blue-400 font-bold">{pendingAttack.targetType.toLowerCase()}</span>
          </p>
        </div>

        {applicableCards.length > 0 ? (
          <>
            <p className="text-white mb-4">Play a defense card or take the damage:</p>

            <div className="flex gap-3 mb-6 justify-center">
              {applicableCards.map(card => (
                <Card
                  key={card.id}
                  card={card}
                  onClick={() => onPlayDefense(card.id)}
                />
              ))}
            </div>

            <div className="flex justify-center gap-4">
              <button
                onClick={onDeclineDefense}
                className="px-6 py-2 bg-gray-600 hover:bg-gray-500 text-white font-bold rounded"
              >
                Take the Damage
              </button>
            </div>
          </>
        ) : (
          <div className="text-center">
            <p className="text-gray-300 mb-4">No defense cards available!</p>
            <button
              onClick={onDeclineDefense}
              className="px-6 py-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded"
            >
              Accept Damage
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
