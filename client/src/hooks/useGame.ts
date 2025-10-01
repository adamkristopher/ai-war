import { useState, useEffect, useCallback } from 'react';
import { GameEngine } from '../utils/gameEngine';
import { AIEngine } from '../utils/aiEngine';
import { GameState, FactionType, Faction } from '../shared/types/index';

export function useGame(playerFactionType: FactionType) {
  const [engine] = useState(() => new GameEngine(playerFactionType));
  const [aiEngine] = useState(() => new AIEngine());
  const [gameState, setGameState] = useState<GameState>(engine.getState());
  const [isProcessing, setIsProcessing] = useState(false);

  const updateState = useCallback(() => {
    setGameState(engine.getState());
  }, [engine]);

  const addCardToQueue = useCallback((cardId: string) => {
    const currentState = engine.getState();
    const playerFaction = currentState.factions[0]; // Player is always first faction

    // Check if card exists before adding
    const cardExists = playerFaction.hand.some(c => c.id === cardId);
    if (!cardExists) {
      console.warn('Card not found in hand:', cardId);
      return;
    }

    engine.addCardToQueue(playerFaction.id, cardId);
    updateState();

    // Auto-reveal if queue reaches 3
    const updatedState = engine.getState();
    const updatedPlayerFaction = updatedState.factions[0];
    if (updatedPlayerFaction.queue.length >= 3) {
      setTimeout(() => {
        engine.revealAndResolveCard(playerFaction.id);
        updateState();

        // Auto-end turn after revealing
        setTimeout(() => {
          engine.nextTurn();
          updateState();
        }, 1000);
      }, 500);
    }
  }, [engine, updateState]);

  const executeAttack = useCallback((targetId: string, organizationId: string) => {
    const currentState = engine.getState();
    const playerFaction = currentState.factions[0]; // Player is always first faction
    const result = engine.executeAttack(playerFaction.id, targetId, organizationId);
    updateState();

    // If attack is pending defense, wait for defense response
    if (result.status === 'PENDING_DEFENSE') {
      // Check if defender is AI
      const defender = currentState.factions.find(f => f.id === result.defenderId);
      if (defender?.isAI) {
        // AI auto-defends after a delay
        setTimeout(() => {
          const state = engine.getState();
          const defenderFaction = state.factions.find(f => f.id === result.defenderId!);
          const pending = state.pendingAttack;

          if (defenderFaction && pending) {
            const decision = aiEngine.shouldPlayDefenseCard(defenderFaction, state, pending);

            if (decision.shouldPlay && decision.cardId) {
              engine.playDefenseCard(result.defenderId!, decision.cardId);
            } else {
              engine.declineDefense(result.defenderId!);
            }

            updateState();

            // Check win condition
            const winner = engine.checkWinCondition();
            if (!winner) {
              engine.nextTurn();
              updateState();
            }
          }
        }, 1000);
      }
      // Player defense will be handled via DefenseModal
      return;
    }

    // Check win condition
    const winner = engine.checkWinCondition();
    if (winner) {
      updateState();
      return;
    }

    // Move to next turn after attack
    engine.nextTurn();
    updateState();
  }, [engine, aiEngine, updateState]);

  const processAITurn = useCallback(() => {
    if (isProcessing) return;

    let currentState = engine.getState();
    const currentFaction = currentState.factions[currentState.currentPlayerIndex];
    if (!currentFaction.isAI || currentFaction.isEliminated) return;

    setIsProcessing(true);

    setTimeout(() => {
      currentState = engine.getState(); // Get fresh state
      const faction = currentState.factions[currentState.currentPlayerIndex];
      const action = aiEngine.decideAction(faction, currentState);

      if (action) {
        if (action.type === 'ADD_TO_QUEUE' && action.cardId) {
          engine.addCardToQueue(faction.id, action.cardId);
          updateState();

          // Auto-reveal if queue reaches 3
          currentState = engine.getState(); // Get fresh state after adding
          const updatedFaction = currentState.factions.find(f => f.id === faction.id)!;
          if (updatedFaction.queue.length >= 3) {
            setTimeout(() => {
              engine.revealAndResolveCard(faction.id);
              updateState();

              // End AI turn after revealing (slower for readability)
              setTimeout(() => {
                engine.nextTurn();
                updateState();
                setIsProcessing(false);
              }, 2000); // Increased from 1000ms to 2000ms
            }, 800); // Increased from 500ms to 800ms
          } else {
            // Continue AI turn (slower pace)
            setTimeout(() => {
              processAITurn();
            }, 600); // Increased from 300ms to 600ms
          }
        } else if (action.type === 'EXECUTE_ATTACK' && action.targetId && action.organizationId) {
          const attackResult = engine.executeAttack(faction.id, action.targetId, action.organizationId);
          updateState();

          // If attack is pending defense, handle it
          if (attackResult.status === 'PENDING_DEFENSE') {
            const defender = currentState.factions.find(f => f.id === attackResult.defenderId);

            if (defender?.isAI) {
              // AI vs AI - auto-defend
              setTimeout(() => {
                const state = engine.getState();
                const defenderFaction = state.factions.find(f => f.id === attackResult.defenderId!);
                const pending = state.pendingAttack;

                if (defenderFaction && pending) {
                  const decision = aiEngine.shouldPlayDefenseCard(defenderFaction, state, pending);

                  if (decision.shouldPlay && decision.cardId) {
                    engine.playDefenseCard(attackResult.defenderId!, decision.cardId);
                  } else {
                    engine.declineDefense(attackResult.defenderId!);
                  }

                  updateState();

                  // Check win condition
                  const winner = engine.checkWinCondition();
                  if (!winner) {
                    setTimeout(() => {
                      engine.nextTurn();
                      updateState();
                      setIsProcessing(false);
                    }, 1000);
                  } else {
                    setIsProcessing(false);
                  }
                }
              }, 1000);
            } else {
              // Player is defender - modal will show, but don't block AI processing
              setIsProcessing(false);
            }
            return;
          }

          // Check win condition
          const winner = engine.checkWinCondition();
          if (winner) {
            setIsProcessing(false);
            updateState();
            return;
          }

          // Move to next turn (slower for readability)
          setTimeout(() => {
            engine.nextTurn();
            updateState();
            setIsProcessing(false);
          }, 2000); // Increased from 1000ms to 2000ms
        }
      } else {
        // No action, end turn
        engine.nextTurn();
        updateState();
        setIsProcessing(false);
      }
    }, 1200); // Increased from 800ms to 1200ms
  }, [engine, aiEngine, isProcessing, updateState]);

  const playDefenseCard = useCallback((cardId: string) => {
    const currentState = engine.getState();
    const playerFaction = currentState.factions[0];

    if (!currentState.pendingAttack) return;

    engine.playDefenseCard(playerFaction.id, cardId);
    updateState();

    // Check win condition
    const winner = engine.checkWinCondition();
    if (winner) {
      updateState();
      return;
    }

    // Move to next turn
    engine.nextTurn();
    updateState();
  }, [engine, updateState]);

  const declineDefense = useCallback(() => {
    const currentState = engine.getState();
    const playerFaction = currentState.factions[0];

    if (!currentState.pendingAttack) return;

    engine.declineDefense(playerFaction.id);
    updateState();

    // Check win condition
    const winner = engine.checkWinCondition();
    if (winner) {
      updateState();
      return;
    }

    // Move to next turn
    engine.nextTurn();
    updateState();
  }, [engine, updateState]);

  const endTurn = useCallback(() => {
    engine.nextTurn();
    updateState();
  }, [engine, updateState]);

  // Process AI turns automatically
  useEffect(() => {
    const currentFaction = gameState.factions[gameState.currentPlayerIndex];
    if (currentFaction?.isAI && !isProcessing && gameState.phase !== 'ENDED') {
      const timer = setTimeout(() => {
        processAITurn();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [gameState.currentPlayerIndex, gameState.phase, isProcessing, processAITurn, gameState.factions]);

  const selectCardTarget = useCallback((targetId: string) => {
    engine.selectCardTarget(targetId);
    updateState();
  }, [engine, updateState]);

  return {
    gameState,
    addCardToQueue,
    executeAttack,
    endTurn,
    playDefenseCard,
    declineDefense,
    selectCardTarget,
    isProcessing,
    playerFaction: gameState.factions[0], // Player is always first faction
    currentFaction: gameState.factions[gameState.currentPlayerIndex]
  };
}
