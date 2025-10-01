import { Faction, GameCard, CardType } from '../../shared/types/index';
import { Card } from '../ui/Card';
import { Tooltip } from '../ui/Tooltip';

interface PlayerHandProps {
  faction: Faction;
  onCardClick: (cardId: string) => void;
  onEndTurn: () => void;
  isPlayerTurn: boolean;
  isProcessing: boolean;
  tooltipsEnabled: boolean;
}

export function PlayerHand({
  faction,
  onCardClick,
  onEndTurn,
  isPlayerTurn,
  isProcessing,
  tooltipsEnabled
}: PlayerHandProps) {
  const readyOrg = faction.organizations.find(o => o.attachedAction);

  return (
    <div className="h-full flex flex-col bg-gray-900 overflow-visible">
      {/* Status bar with queue and orgs */}
      <div className="px-4 py-2 border-b border-gray-700 bg-gray-800 flex-shrink-0 relative z-10">
        <div className="flex items-center justify-between text-xs">
          {/* Queue */}
          <div className="flex items-center space-x-3">
            <span className="text-gray-400 font-bold">QUEUE ({faction.queue.length}/3):</span>
            <div className="flex space-x-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className={`w-10 h-12 rounded border-2 flex items-center justify-center text-xs font-bold
                    ${i < faction.queue.length ? 'bg-blue-900 border-blue-600 text-blue-300' : 'bg-gray-700 border-gray-600 text-gray-500'}`}
                >
                  {i < faction.queue.length ? (i + 1) : '−'}
                </div>
              ))}
            </div>
          </div>

          {/* Organizations */}
          <div className="flex items-center space-x-3">
            <span className="text-gray-400 font-bold">ORGS:</span>
            {faction.organizations.length === 0 ? (
              <span className="text-gray-500">None</span>
            ) : (
              <div className="flex gap-2">
                {faction.organizations.map(org => (
                  <div
                    key={org.id}
                    className="px-3 py-1 bg-green-800 border-2 border-green-600 rounded text-[10px] font-bold flex items-center space-x-1"
                  >
                    <span className="text-white truncate max-w-[80px]">{org.name}</span>
                    {org.attachedAction && (
                      <span className="text-yellow-400" title={org.attachedAction.name}>⚡</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Status and End Turn button */}
          <div className="flex items-center space-x-3">
            {readyOrg && (
              <div className="text-yellow-400 font-bold animate-pulse">
                ⚡ READY! Click enemy
              </div>
            )}
            {!isPlayerTurn && (
              <div className="text-gray-400">
                {isProcessing ? '⏳ AI thinking...' : '🤖 AI turn'}
              </div>
            )}
            {isPlayerTurn && !isProcessing && (
              <Tooltip
                content="Click to end your turn and let AI players take their turns"
                enabled={tooltipsEnabled}
              >
                <button
                  onClick={onEndTurn}
                  className={`px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-white font-bold rounded transition-all ${faction.queue.length > 0 ? 'animate-pulse shadow-lg shadow-yellow-500/50' : ''}`}
                >
                  End Turn ⏭
                </button>
              </Tooltip>
            )}
          </div>
        </div>
      </div>

      {/* Hand */}
      <div className="flex-1 px-3 pt-8 pb-4 overflow-x-auto overflow-y-visible">
        <div className="flex space-x-2 h-full items-center">
          {faction.hand.length === 0 ? (
            <div className="text-gray-500 text-sm">Deck empty</div>
          ) : (
            faction.hand.map(card => (
              <Tooltip
                key={card.id}
                content={isPlayerTurn ? "Click to add to queue (auto-reveals at 3)" : "Wait for your turn"}
                enabled={tooltipsEnabled}
              >
                <Card
                  card={card}
                  onClick={() => {
                    if (isPlayerTurn && !isProcessing) {
                      onCardClick(card.id);
                    }
                  }}
                  disabled={!isPlayerTurn || isProcessing}
                />
              </Tooltip>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
