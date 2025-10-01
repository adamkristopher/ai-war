import { GameState, Faction } from '../../shared/types/index';
import { FACTION_CONFIGS } from '../../shared/constants/index';
import { FactionCard } from './FactionCard';
import { EventLog } from './EventLog';
import { PlayerHand } from './PlayerHand';

interface GameBoardProps {
  gameState: GameState;
  playerFaction: Faction;
  onAddToQueue: (cardId: string) => void;
  onAttack: (targetId: string, organizationId: string) => void;
  onSelectTarget: (targetId: string) => void;
  onEndTurn: () => void;
  isProcessing: boolean;
  tooltipsEnabled: boolean;
}

export function GameBoard({
  gameState,
  playerFaction,
  onAddToQueue,
  onAttack,
  onSelectTarget,
  onEndTurn,
  isProcessing,
  tooltipsEnabled
}: GameBoardProps) {
  const isPlayerTurn = gameState.currentPlayerIndex === 0;
  const isSelectingTarget = !!gameState.pendingTargetSelection && isPlayerTurn;
  const validTargetIds = isSelectingTarget ? (gameState.pendingTargetSelection?.validTargetIds || []) : [];
  return (
    <div className="w-full h-screen bg-gray-900 flex flex-col">
      {/* Game status bar */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xl text-white">ai war</span>
            <span className="ml-4 text-gray-400">Round {gameState.round}</span>
            <span className="ml-4 px-3 py-1 rounded text-sm font-bold" style={{
              backgroundColor: gameState.phase === 'PEACETIME' ? '#4CAF50' :
                             gameState.phase === 'CONFLICT' ? '#FF5722' : '#9C27B0'
            }}>
              {gameState.phase}
            </span>
            {isSelectingTarget && (
              <span className="ml-4 px-3 py-1 bg-yellow-600 text-white rounded text-sm font-bold animate-pulse">
                🎯 Choose a Target
              </span>
            )}
          </div>
          {gameState.phase === 'ENDED' && (
            <div className="text-2xl font-bold text-yellow-400">
              {gameState.winner === 'NONE' ? '💀 TOTAL ANNIHILATION!' :
               gameState.winner === playerFaction.id ? '🎉 YOU WIN!' : '💀 YOU LOSE'}
            </div>
          )}
        </div>
      </div>

      {/* Main game area */}
      <div className="flex-1 flex flex-col">
        {/* Top section: Faction cards + Event Log */}
        <div className="flex-shrink-0 flex border-b border-gray-700 h-80">
          {/* Faction cards */}
          <div className="bg-gray-800 p-3 border-r border-gray-700">
            <div className="flex gap-3">
              {gameState.factions.map((faction, index) => {
                return (
                  <div
                    key={faction.id}
                    className={`bg-gray-800 border-3 rounded-lg p-3 w-40
                      ${gameState.currentPlayerIndex === index ? 'ring-2 ring-yellow-400' : ''}
                      ${faction.isEliminated ? 'opacity-40 grayscale' : ''}
                      ${faction.id !== playerFaction.id && !faction.isEliminated ? 'cursor-pointer hover:border-red-500 hover:scale-105 transition-all' : ''}
                      ${isSelectingTarget && validTargetIds.includes(faction.id) ? 'ring-4 ring-yellow-500 animate-pulse' : ''}
                      shadow-xl relative`}
                    style={{
                      borderColor:
                        isSelectingTarget && validTargetIds.includes(faction.id) ? '#EAB308' :
                        gameState.currentPlayerIndex === index ? FACTION_CONFIGS[faction.type].color : '#4B5563'
                    }}
                    onClick={() => {
                      if (faction.id !== playerFaction.id && !faction.isEliminated) {
                        // If selecting target for a card, handle that
                        if (isSelectingTarget && validTargetIds.includes(faction.id)) {
                          onSelectTarget(faction.id);
                          return;
                        }

                        // Otherwise, handle attack if ready
                        const readyOrg = playerFaction.organizations.find(o => o.attachedAction);
                        if (readyOrg) {
                          onAttack(faction.id, readyOrg.id);
                        }
                      }
                    }}
                  >
                    {/* Faction image */}
                    <div className="text-center mb-2">
                      <img
                        src={(() => {
                          const imageMap: Record<string, string> = {
                            'OPENG': '/assets/openg.png',
                            'CLARISA': '/assets/clarisa.png',
                            'GEMAICA': '/assets/gemaica.png',
                            'SLOTH': '/assets/sloth.png',
                            'CAMEL': '/assets/camel.png'
                          };
                          return imageMap[faction.type] || '';
                        })()}
                        alt={faction.name}
                        className="w-20 h-20 mx-auto rounded-full border-3 object-cover"
                        style={{ borderColor: FACTION_CONFIGS[faction.type].color }}
                      />
                    </div>

                    {/* Faction name */}
                    <div className="text-center mb-2">
                      <h3 className="text-xs font-bold truncate text-white">
                        {faction.name}
                      </h3>
                      {faction.id === playerFaction.id && <span className="text-[10px] text-green-400">(You)</span>}
                    </div>

                    {/* Building */}
                    <div className="mb-2">
                      <div className="text-[9px] text-gray-400 mb-1 truncate">{FACTION_CONFIGS[faction.type].building.name}</div>
                      <div className="bg-gray-700 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${
                            (faction.buildingHP / faction.maxBuildingHP) * 100 > 60 ? 'bg-green-500' :
                            (faction.buildingHP / faction.maxBuildingHP) * 100 > 30 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${(faction.buildingHP / faction.maxBuildingHP) * 100}%` }}
                        />
                      </div>
                      <div className="text-[9px] text-white text-center mt-1">
                        {faction.buildingHP}/{faction.maxBuildingHP} HP
                      </div>
                    </div>

                    {/* GPUs */}
                    <div className="text-center mb-2">
                      <div className="text-2xl font-bold text-white">{faction.totalGPUs}K</div>
                      <div className="text-[9px] text-gray-400">GPUs</div>
                    </div>

                    {/* Organizations */}
                    {faction.organizations.length > 0 && (
                      <div className="border-t border-gray-700 pt-2 mt-2">
                        <div className="text-[9px] text-gray-400 text-center">
                          🏢 {faction.organizations.length}{faction.organizations.some(o => o.attachedAction) && <span className="text-yellow-400 ml-1">⚡</span>}
                        </div>
                      </div>
                    )}

                    {faction.isEliminated && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-3xl">💀</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Event log */}
          <div className="flex-1 bg-gray-800">
            <EventLog events={gameState.eventLog} />
          </div>
        </div>

        {/* Player hand at bottom */}
        <div className="h-72 bg-gray-900 border-t border-gray-700 overflow-visible">
          <PlayerHand
            faction={playerFaction}
            onCardClick={onAddToQueue}
            onEndTurn={onEndTurn}
            isPlayerTurn={gameState.currentPlayerIndex === 0}
            isProcessing={isProcessing}
            tooltipsEnabled={tooltipsEnabled}
          />
        </div>
      </div>
    </div>
  );
}
