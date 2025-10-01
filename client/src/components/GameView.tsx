import { useState, useMemo } from 'react';
import { FactionType, CardType, GamePhase } from '../shared/types/index';
import { useGame } from '../hooks/useGame';
import { GameBoard } from './game/GameBoard';
import { Rules } from './Rules';
import { DefenseModal } from './game/DefenseModal';
import { GameOverModal } from './GameOverModal';

interface GameViewProps {
  selectedFaction: FactionType;
  onBackToMenu: () => void;
}

export function GameView({ selectedFaction, onBackToMenu }: GameViewProps) {
  const [showRules, setShowRules] = useState(false);
  const [tooltipsEnabled, setTooltipsEnabled] = useState(true);
  const {
    gameState,
    addCardToQueue,
    executeAttack,
    endTurn,
    playDefenseCard,
    declineDefense,
    selectCardTarget,
    isProcessing,
    playerFaction
  } = useGame(selectedFaction);

  // Get applicable defense cards when player is being attacked
  const applicableDefenseCards = useMemo(() => {
    if (!gameState.pendingAttack || gameState.pendingAttack.defenderId !== playerFaction.id) {
      return [];
    }

    return playerFaction.hand.filter(card => {
      if (card.type !== CardType.DEFENSE) return false;
      const defenseCard = card as any;
      return defenseCard.blocksType === gameState.pendingAttack!.attackType;
    });
  }, [gameState.pendingAttack, playerFaction.hand, playerFaction.id]);

  return (
    <div className="relative">
      {/* Top buttons */}
      <div className="absolute top-4 right-4 z-50 flex space-x-2">
        <button
          onClick={() => setTooltipsEnabled(!tooltipsEnabled)}
          className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
            tooltipsEnabled
              ? 'bg-green-600 hover:bg-green-500 text-white'
              : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
          }`}
          title={tooltipsEnabled ? 'Tooltips ON' : 'Tooltips OFF'}
        >
          💡 {tooltipsEnabled ? 'Tooltips ON' : 'Tooltips OFF'}
        </button>
        <button
          onClick={() => setShowRules(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-bold"
        >
          📖 Rules
        </button>
        <button
          onClick={onBackToMenu}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm"
        >
          ← Back to Menu
        </button>
      </div>

      <GameBoard
        gameState={gameState}
        playerFaction={playerFaction}
        onAddToQueue={addCardToQueue}
        onAttack={executeAttack}
        onSelectTarget={selectCardTarget}
        onEndTurn={endTurn}
        isProcessing={isProcessing}
        tooltipsEnabled={tooltipsEnabled}
      />

      {showRules && <Rules onClose={() => setShowRules(false)} />}

      {/* Defense Modal - shows when player is being attacked */}
      {gameState.pendingAttack && gameState.pendingAttack.defenderId === playerFaction.id && (
        <DefenseModal
          pendingAttack={gameState.pendingAttack}
          applicableCards={applicableDefenseCards}
          onPlayDefense={playDefenseCard}
          onDeclineDefense={declineDefense}
        />
      )}

      {/* Game Over Modal */}
      {gameState.phase === GamePhase.ENDED && (
        <GameOverModal
          winner={gameState.winner}
          playerFactionType={selectedFaction}
          gameState={gameState}
          onBackToMenu={onBackToMenu}
        />
      )}
    </div>
  );
}
