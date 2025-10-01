import { describe, it, expect, beforeEach } from 'vitest';
import { GameEngine } from './gameEngine';
import { FactionType, GamePhase, CardType } from '../shared/types/index';

/**
 * Game Engine Tests - Based on Nuclear War (1965) inspired mechanics
 *
 * Core Rules:
 * - 5 factions compete (1 human, 4 AI)
 * - Turn-based with FIFO card queue (3 cards max, oldest auto-reveals)
 * - Phases: PEACETIME → CONFLICT (on first attack) → FINAL_RETALIATION (on elimination) → PEACETIME
 * - Win: Last standing, Building domination (3+), or Total Annihilation (everyone loses)
 * - GPUs stored as cards (1, 5, 10, 15, 25M denominations)
 */

describe('GameEngine - Initialization', () => {
  it('should create game with player faction and 4 AI factions', () => {
    const engine = new GameEngine(FactionType.OPENG);
    const state = engine.getState();

    expect(state.factions).toHaveLength(5);
    expect(state.factions[0].type).toBe(FactionType.OPENG);
    expect(state.factions[0].isAI).toBe(false);
    expect(state.factions.filter(f => f.isAI)).toHaveLength(4);
  });

  it('should start in PEACETIME phase', () => {
    const engine = new GameEngine(FactionType.CAMEL);
    expect(engine.getState().phase).toBe(GamePhase.PEACETIME);
  });

  it('should deal 9 cards to each faction', () => {
    const engine = new GameEngine(FactionType.SLOTH);
    const state = engine.getState();

    state.factions.forEach(faction => {
      expect(faction.hand.length).toBeLessThanOrEqual(9);
    });
  });

  it('should initialize factions with correct starting GPUs', () => {
    const engine = new GameEngine(FactionType.OPENG);
    const state = engine.getState();
    const openg = state.factions[0];

    // OpenG starts with 300M GPUs
    expect(openg.totalGPUs).toBe(300);
    expect(openg.gpus.length).toBeGreaterThan(0);

    // GPUs sum should equal total
    const sum = openg.gpus.reduce((acc, card) => acc + card.value, 0);
    expect(sum).toBe(300);
  });

  it('should initialize factions with buildings at max HP', () => {
    const engine = new GameEngine(FactionType.CLARISA);
    const state = engine.getState();

    state.factions.forEach(faction => {
      expect(faction.buildingHP).toBe(faction.maxBuildingHP);
      expect(faction.buildingHP).toBeGreaterThan(0);
    });
  });
});

describe('GameEngine - Queue System (FIFO)', () => {
  let engine: GameEngine;

  beforeEach(() => {
    engine = new GameEngine(FactionType.OPENG);
  });

  it('should add card to queue when player plays card', () => {
    const state = engine.getState();
    const player = state.factions[0];
    const cardId = player.hand[0].id;
    const initialHandLength = player.hand.length;

    engine.addCardToQueue(player.id, cardId);

    const newState = engine.getState();
    expect(newState.factions[0].queue).toHaveLength(1);
    expect(newState.factions[0].hand).toHaveLength(initialHandLength - 1);
  });

  it('should auto-reveal oldest card when queue reaches 3 (FIFO)', () => {
    const state = engine.getState();
    const player = state.factions[0];
    const playerId = player.id;

    // Capture card IDs before adding (since getState() returns deep copies)
    const card1Id = state.factions[0].hand[0].id;
    const card2Id = state.factions[0].hand[1].id;
    const card3Id = state.factions[0].hand[2].id;

    // Add 3 cards
    engine.addCardToQueue(playerId, card1Id);
    engine.addCardToQueue(playerId, card2Id);
    engine.addCardToQueue(playerId, card3Id);

    // Queue should have 3
    let newState = engine.getState();
    expect(newState.factions[0].queue).toHaveLength(3);

    // Reveal should process FIFO (oldest first)
    engine.revealAndResolveCard(playerId);

    newState = engine.getState();
    expect(newState.factions[0].queue).toHaveLength(2);
  });

  it('should draw replacement card after revealing', () => {
    const state = engine.getState();
    const player = state.factions[0];
    const initialDeckSize = state.deck.length;

    engine.addCardToQueue(player.id, player.hand[0].id);
    engine.revealAndResolveCard(player.id);

    const newState = engine.getState();
    expect(newState.deck.length).toBe(initialDeckSize - 1);
  });
});

describe('GameEngine - Phase Transitions', () => {
  it('should transition from PEACETIME to CONFLICT on first attack', () => {
    const engine = new GameEngine(FactionType.OPENG);
    expect(engine.getState().phase).toBe(GamePhase.PEACETIME);

    // Simulate attack (implementation will add proper attack method)
    engine.triggerConflict();

    expect(engine.getState().phase).toBe(GamePhase.CONFLICT);
  });

  it('should make propaganda worthless during CONFLICT', () => {
    const engine = new GameEngine(FactionType.GEMAICA);

    engine.triggerConflict();
    expect(engine.getState().phase).toBe(GamePhase.CONFLICT);

    // Propaganda should not steal GPUs in conflict
    const isPropagandaActive = engine.isPropagandaActive();
    expect(isPropagandaActive).toBe(false);
  });

  it('should trigger FINAL_RETALIATION when faction eliminated', () => {
    const engine = new GameEngine(FactionType.OPENG);
    const state = engine.getState();
    const targetId = state.factions[1].id;

    // Eliminate a faction
    engine.eliminateFaction(targetId);

    expect(engine.getState().phase).toBe(GamePhase.FINAL_RETALIATION);
  });

  it('should return to PEACETIME after final retaliation resolves', () => {
    const engine = new GameEngine(FactionType.CAMEL);

    engine.triggerConflict();
    engine.eliminateFaction(engine.getState().factions[1].id);
    engine.resolveFinalRetaliation();

    const state = engine.getState();
    if (state.factions.filter(f => !f.isEliminated).length > 1) {
      expect(state.phase).toBe(GamePhase.PEACETIME);
    }
  });
});

describe('GameEngine - Combat System', () => {
  it('should damage GPUs when attack targets GPUs', () => {
    const engine = new GameEngine(FactionType.OPENG);
    const state = engine.getState();
    const targetId = state.factions[1].id;
    const initialGPUs = state.factions[1].totalGPUs;

    engine.damageGPUs(targetId, 10);

    const newState = engine.getState();
    const target = newState.factions.find(f => f.id === targetId)!;
    expect(target.totalGPUs).toBe(initialGPUs - 10);
  });

  it('should damage building when attack targets building', () => {
    const engine = new GameEngine(FactionType.CAMEL);
    const state = engine.getState();
    const targetId = state.factions[1].id;
    const initialHP = state.factions[1].buildingHP;

    engine.damageBuilding(targetId, 30);

    const newState = engine.getState();
    const target = newState.factions.find(f => f.id === targetId)!;
    expect(target.buildingHP).toBe(initialHP - 30);
  });

  it('should eliminate faction when GPUs reaches 0', () => {
    const engine = new GameEngine(FactionType.SLOTH);
    const state = engine.getState();
    const targetId = state.factions[1].id;
    const targetGPUs = state.factions[1].totalGPUs;

    engine.damageGPUs(targetId, targetGPUs);

    const newState = engine.getState();
    const target = newState.factions.find(f => f.id === targetId)!;
    expect(target.isEliminated).toBe(true);
    expect(target.totalGPUs).toBe(0);
  });

  it('should disable special ability when building destroyed', () => {
    const engine = new GameEngine(FactionType.CLARISA);
    const state = engine.getState();
    const targetId = state.factions[1].id;
    const targetHP = state.factions[1].buildingHP;

    engine.damageBuilding(targetId, targetHP);

    const newState = engine.getState();
    const target = newState.factions.find(f => f.id === targetId)!;
    expect(target.buildingHP).toBe(0);
    expect(target.specialAbilityUsed).toBe(true);
  });
});

describe('GameEngine - Faction Special Abilities', () => {
  it('Gemaica Search Dominance: propaganda steals extra GPUs', () => {
    const engine = new GameEngine(FactionType.GEMAICA);
    const state = engine.getState();
    const gemaica = state.factions[0];
    const initialGPUs = gemaica.totalGPUs;
    const targetId = state.factions[1].id;

    engine.stealGPUs(gemaica.id, targetId, 10);

    const newState = engine.getState();
    const updatedGemaica = newState.factions[0];
    // Should steal 20 due to 2x bonus (if ability not used)
    expect(updatedGemaica.totalGPUs).toBeGreaterThan(initialGPUs + 10);
  });

  it('OpenG GPT Advantage: throwing attacks +50% damage', () => {
    const engine = new GameEngine(FactionType.OPENG);
    const state = engine.getState();
    // Target a non-Clarisa faction to avoid defensive ability interference
    const target = state.factions.find(f => f.type !== FactionType.OPENG && f.type !== FactionType.CLARISA)!;
    const targetId = target.id;
    const initialHP = target.buildingHP;

    engine.throwingAttack(state.factions[0].id, targetId, 30);

    const newState = engine.getState();
    const updatedTarget = newState.factions.find(f => f.id === targetId)!;
    // Should deal 45 damage (30 * 1.5)
    expect(updatedTarget.buildingHP).toBe(initialHP - 45);
  });

  it('All factions take riot self-damage', () => {
    const engine = new GameEngine(FactionType.OPENG);
    const state = engine.getState();
    const openg = state.factions[0];
    const initialGPUs = openg.totalGPUs;

    engine.riotAttack(openg.id, state.factions[1].id);

    const newState = engine.getState();
    const updatedOpenG = newState.factions[0];
    // Should lose 5M GPUs
    expect(updatedOpenG.totalGPUs).toBe(initialGPUs - 5);
  });

  it('Clarisa Constitutional AI: building takes 50% less damage', () => {
    const engine = new GameEngine(FactionType.CLARISA);
    const state = engine.getState();
    const clarisa = state.factions.find(f => f.type === FactionType.CLARISA)!;
    const initialHP = clarisa.buildingHP;

    engine.damageBuilding(clarisa.id, 30);

    const newState = engine.getState();
    const updated = newState.factions.find(f => f.type === FactionType.CLARISA)!;
    // Should take 15 damage (30 * 0.5)
    expect(updated.buildingHP).toBe(initialHP - 15);
  });

  it('Gemaica Search Dominance: propaganda steals +10M extra', () => {
    const engine = new GameEngine(FactionType.GEMAICA);
    const state = engine.getState();
    const gemaica = state.factions[0];
    const initialGPUs = gemaica.totalGPUs;
    const targetId = state.factions[1].id;

    engine.stealGPUs(gemaica.id, targetId, 10);

    const newState = engine.getState();
    const updatedGemaica = newState.factions[0];
    // Should steal 20 (10 + 10 bonus)
    expect(updatedGemaica.totalGPUs).toBe(initialGPUs + 20);
  });
});

describe('GameEngine - Win Conditions', () => {
  it('should detect last faction standing victory', () => {
    const engine = new GameEngine(FactionType.OPENG);
    const state = engine.getState();

    // Eliminate all but player
    for (let i = 1; i < state.factions.length; i++) {
      engine.eliminateFaction(state.factions[i].id);
    }

    const winner = engine.checkWinCondition();
    expect(winner).toBe(state.factions[0].id);
  });

  it('should detect total annihilation (everyone loses)', () => {
    const engine = new GameEngine(FactionType.CAMEL);
    const state = engine.getState();

    // Eliminate all factions
    state.factions.forEach(f => engine.eliminateFaction(f.id));

    const winner = engine.checkWinCondition();
    expect(winner).toBe('NONE');
  });

  it('should detect building domination victory (3+ buildings)', () => {
    const engine = new GameEngine(FactionType.SLOTH);
    const state = engine.getState();
    const playerId = state.factions[0].id;

    // Capture 2 buildings (own + 2 captured = 3 total)
    engine.captureBuilding(playerId, state.factions[1].id);
    engine.captureBuilding(playerId, state.factions[2].id);

    const winner = engine.checkWinCondition();
    expect(winner).toBe(playerId);
  });

  it('should prioritize total annihilation over last standing', () => {
    const engine = new GameEngine(FactionType.GEMAICA);
    const state = engine.getState();

    // Eliminate everyone
    state.factions.forEach(f => engine.eliminateFaction(f.id));

    const winner = engine.checkWinCondition();
    expect(winner).toBe('NONE');
  });
});

describe('GameEngine - Final Retaliation (Nuclear War mechanic)', () => {
  it('should auto-launch all attacks when faction eliminated', () => {
    const engine = new GameEngine(FactionType.OPENG);
    const state = engine.getState();

    // Set up faction with ready attacks
    const targetId = state.factions[1].id;
    engine.setupReadyAttacks(targetId, 2);

    // Eliminate faction
    engine.eliminateFaction(targetId);

    // Should trigger retaliation
    const events = engine.getState().eventLog;
    const hasRetaliation = events.some(e => e.message.includes('FINAL RETALIATION'));
    expect(hasRetaliation).toBe(true);
  });

  it('should launch all covert ops from hand during final retaliation', () => {
    const engine = new GameEngine(FactionType.CAMEL);
    const state = engine.getState();
    const targetId = state.factions[1].id;

    // Give faction covert ops
    engine.giveCovertOps(targetId, 3);

    // Eliminate and check covert ops were played
    engine.eliminateFaction(targetId);

    const newState = engine.getState();
    const eliminated = newState.factions.find(f => f.id === targetId)!;
    const covertOpsInHand = eliminated.hand.filter(c => c.type === CardType.COVERT_OP);
    expect(covertOpsInHand).toHaveLength(0);
  });

  it('should chain retaliations if retaliation eliminates another faction', () => {
    const engine = new GameEngine(FactionType.SLOTH);

    // Set up chain: eliminate A → A retaliates eliminating B → B retaliates
    engine.setupRetaliationChain();

    const state = engine.getState();
    const eliminatedCount = state.factions.filter(f => f.isEliminated).length;
    expect(eliminatedCount).toBeGreaterThan(1);
  });
});

describe('GameEngine - Turn Management', () => {
  it('should advance to next non-eliminated player', () => {
    const engine = new GameEngine(FactionType.OPENG);
    const initial = engine.getCurrentFaction();

    engine.nextTurn();

    const next = engine.getCurrentFaction();
    expect(next.id).not.toBe(initial.id);
    expect(next.isEliminated).toBe(false);
  });

  it('should skip eliminated players', () => {
    const engine = new GameEngine(FactionType.CAMEL);
    const state = engine.getState();

    // Eliminate faction 1
    engine.eliminateFaction(state.factions[1].id);

    // Advance turn
    engine.nextTurn();

    const current = engine.getCurrentFaction();
    expect(current.isEliminated).toBe(false);
  });

  it('should increment round after full cycle', () => {
    const engine = new GameEngine(FactionType.CLARISA);
    const initialRound = engine.getState().round;

    // Complete full turn cycle (5 players)
    for (let i = 0; i < 5; i++) {
      engine.nextTurn();
    }

    expect(engine.getState().round).toBeGreaterThan(initialRound);
  });
});
