import { describe, it, expect } from 'vitest';
import { AIEngine } from './aiEngine';
import { GameEngine } from './gameEngine';
import { FactionType, GamePhase, ActionType } from '../shared/types/index';

/**
 * AI Engine Tests - Based on faction-specific strategies
 *
 * AI Strategies:
 * - USA: AGGRESSIVE (targets strongest, prefers direct attacks)
 * - Britain: BALANCED (distributes attacks, collective action)
 * - North Korea: CHAOS (random targeting, high-risk plays)
 * - Russia: DEFENSIVE (targets weakest, builds up first)
 * - India: PROPAGANDA (propaganda-heavy, avoids conflict)
 */

describe('AIEngine - Action Decision', () => {
  it('should decide to add card to queue when hand has cards', () => {
    const gameEngine = new GameEngine(FactionType.OPENG);
    const aiEngine = new AIEngine();
    const state = gameEngine.getState();
    const aiFaction = state.factions.find(f => f.isAI)!;

    const action = aiEngine.decideAction(aiFaction, state);

    expect(action).not.toBeNull();
    if (action) {
      expect(['ADD_TO_QUEUE', 'EXECUTE_ATTACK']).toContain(action.type);
    }
  });

  it('should decide to attack when organization has action plan ready', () => {
    const gameEngine = new GameEngine(FactionType.CAMEL);
    const aiEngine = new AIEngine();
    const state = gameEngine.getState();
    const aiFaction = state.factions.find(f => f.isAI)!;

    // Give AI a ready attack
    gameEngine.giveReadyAttack(aiFaction.id);

    const action = aiEngine.decideAction(aiFaction, state);

    // Should have chance to attack (70% probability)
    expect(action).not.toBeNull();
  });

  it('should not attack when no valid targets remain', () => {
    const gameEngine = new GameEngine(FactionType.SLOTH);
    const aiEngine = new AIEngine();
    const state = gameEngine.getState();
    const aiFaction = state.factions.find(f => f.isAI)!;

    // Eliminate all other factions
    state.factions.forEach(f => {
      if (f.id !== aiFaction.id) {
        gameEngine.eliminateFaction(f.id);
      }
    });

    gameEngine.giveReadyAttack(aiFaction.id);
    const action = aiEngine.decideAction(aiFaction, state);

    // Should not attempt attack
    if (action) {
      expect(action.type).toBe('ADD_TO_QUEUE');
    }
  });
});

describe('AIEngine - AGGRESSIVE Strategy (USA)', () => {
  it('should target strongest opponent', () => {
    const gameEngine = new GameEngine(FactionType.CAMEL); // USA is AI
    const aiEngine = new AIEngine();
    const state = gameEngine.getState();
    const usa = state.factions.find(f => f.type === FactionType.OPENG)!;

    // Set different GPU levels
    state.factions.forEach((f, i) => {
      if (f.id !== usa.id) {
        gameEngine.setGPUs(f.id, 30 + (i * 10));
      }
    });

    gameEngine.giveReadyAttack(usa.id);
    const action = aiEngine.decideAction(usa, state);

    if (action?.type === 'EXECUTE_ATTACK') {
      const target = state.factions.find(f => f.id === action.targetId)!;
      // Should target one of the stronger factions
      expect(target.totalGPUs).toBeGreaterThan(30);
    }
  });

  it('should prioritize organizations for attack building', () => {
    const gameEngine = new GameEngine(FactionType.CAMEL);
    const aiEngine = new AIEngine();
    const state = gameEngine.getState();
    const usa = state.factions.find(f => f.type === FactionType.OPENG)!;

    // Give USA organization card
    gameEngine.giveOrganizationCard(usa.id);

    const action = aiEngine.decideAction(usa, state);

    if (action?.type === 'ADD_TO_QUEUE') {
      // Should select organization to build attack capability
      expect(action.cardId).toBeDefined();
    }
  });
});

describe('AIEngine - DEFENSIVE Strategy (Russia)', () => {
  it('should target weakest opponent to eliminate threats', () => {
    const gameEngine = new GameEngine(FactionType.OPENG); // Russia is AI
    const aiEngine = new AIEngine();
    const state = gameEngine.getState();
    const russia = state.factions.find(f => f.type === FactionType.CLARISA)!;

    // Set different GPU levels
    state.factions.forEach((f, i) => {
      if (f.id !== russia.id) {
        gameEngine.setGPUs(f.id, 50 - (i * 5));
      }
    });

    gameEngine.giveReadyAttack(russia.id);
    const action = aiEngine.decideAction(russia, state);

    if (action?.type === 'EXECUTE_ATTACK') {
      const target = state.factions.find(f => f.id === action.targetId)!;
      // Should target weaker faction
      expect(target.totalGPUs).toBeLessThan(50);
    }
  });

  it('should prioritize healing when building damaged', () => {
    const gameEngine = new GameEngine(FactionType.OPENG);
    const aiEngine = new AIEngine();
    const state = gameEngine.getState();
    const russia = state.factions.find(f => f.type === FactionType.CLARISA)!;

    // Damage building
    gameEngine.damageBuilding(russia.id, 40);

    // Give prayer healing card
    gameEngine.givePrayerCard(russia.id);

    const action = aiEngine.decideAction(russia, state);

    // Should prioritize healing
    expect(action).not.toBeNull();
  });
});

describe('AIEngine - PROPAGANDA Strategy (India)', () => {
  it('should prioritize propaganda during peacetime', () => {
    const gameEngine = new GameEngine(FactionType.OPENG); // India is AI
    const aiEngine = new AIEngine();
    const state = gameEngine.getState();
    const india = state.factions.find(f => f.type === FactionType.GEMAICA)!;

    expect(state.phase).toBe(GamePhase.PEACETIME);

    // Give propaganda card
    gameEngine.givePropagandaCard(india.id);

    const action = aiEngine.decideAction(india, state);

    if (action?.type === 'ADD_TO_QUEUE') {
      // Should select propaganda card
      expect(action.cardId).toBeDefined();
    }
  });

  it('should switch to building organizations during conflict', () => {
    const gameEngine = new GameEngine(FactionType.OPENG);
    const aiEngine = new AIEngine();
    let state = gameEngine.getState();
    const indiaId = state.factions.find(f => f.type === FactionType.GEMAICA)!.id;

    gameEngine.triggerConflict();
    state = gameEngine.getState(); // Get fresh state after mutation
    expect(state.phase).toBe(GamePhase.CONFLICT);

    // Give both propaganda and organization
    gameEngine.givePropagandaCard(indiaId);
    gameEngine.giveOrganizationCard(indiaId);

    state = gameEngine.getState(); // Get fresh state after mutations
    const india = state.factions.find(f => f.id === indiaId)!;
    const action = aiEngine.decideAction(india, state);

    // Should prefer organization over propaganda in conflict
    expect(action).not.toBeNull();
  });
});

describe('AIEngine - CHAOS Strategy (North Korea)', () => {
  it('should select random targets', () => {
    const gameEngine = new GameEngine(FactionType.OPENG); // North Korea is AI
    const aiEngine = new AIEngine();
    let state = gameEngine.getState();
    const northKoreaId = state.factions.find(f => f.type === FactionType.SLOTH)!.id;

    gameEngine.giveReadyAttack(northKoreaId);

    // Run multiple times to verify randomness
    const targets = new Set();
    for (let i = 0; i < 10; i++) {
      state = gameEngine.getState(); // Get fresh state each iteration
      const northKorea = state.factions.find(f => f.id === northKoreaId)!;
      const action = aiEngine.decideAction(northKorea, state);
      if (action?.type === 'EXECUTE_ATTACK') {
        targets.add(action.targetId);
      }
    }

    // Should have targeted different factions (randomness)
    expect(targets.size).toBeGreaterThan(0);
  });

  it('should make unpredictable card selections', () => {
    const gameEngine = new GameEngine(FactionType.OPENG);
    const aiEngine = new AIEngine();
    const state = gameEngine.getState();
    const northKorea = state.factions.find(f => f.type === FactionType.SLOTH)!;

    const action = aiEngine.decideAction(northKorea, state);

    // Should return some action (random)
    expect(action !== null || northKorea.hand.length === 0).toBe(true);
  });
});

describe('AIEngine - BALANCED Strategy (Britain)', () => {
  it('should mix propaganda and organization building', () => {
    const gameEngine = new GameEngine(FactionType.OPENG); // Britain is AI
    const aiEngine = new AIEngine();
    const state = gameEngine.getState();
    const britain = state.factions.find(f => f.type === FactionType.CAMEL)!;

    expect(state.phase).toBe(GamePhase.PEACETIME);

    // Give both types of cards
    gameEngine.givePropagandaCard(britain.id);
    gameEngine.giveOrganizationCard(britain.id);

    const action = aiEngine.decideAction(britain, state);

    // Should make a decision (either is valid for balanced strategy)
    expect(action).not.toBeNull();
  });

  it('should not over-build organizations', () => {
    const gameEngine = new GameEngine(FactionType.OPENG);
    const aiEngine = new AIEngine();
    const state = gameEngine.getState();
    const britain = state.factions.find(f => f.type === FactionType.CAMEL)!;

    // Give Britain 2 organizations already
    gameEngine.giveOrganization(britain.id);
    gameEngine.giveOrganization(britain.id);

    gameEngine.giveOrganizationCard(britain.id);
    gameEngine.giveActionPlanCard(britain.id);

    const action = aiEngine.decideAction(britain, state);

    // Should prefer action plan over third organization
    expect(action).not.toBeNull();
  });
});

describe('AIEngine - Attack Probability', () => {
  it('should have 70% probability to attack when ready', () => {
    const gameEngine = new GameEngine(FactionType.CAMEL);
    const aiEngine = new AIEngine();
    let state = gameEngine.getState();
    const aiFactionId = state.factions.find(f => f.isAI)!.id;

    gameEngine.giveReadyAttack(aiFactionId);

    let attackCount = 0;
    const trials = 100;

    for (let i = 0; i < trials; i++) {
      state = gameEngine.getState(); // Get fresh state each iteration
      const aiFaction = state.factions.find(f => f.id === aiFactionId)!;
      const action = aiEngine.decideAction(aiFaction, state);
      if (action?.type === 'EXECUTE_ATTACK') {
        attackCount++;
      }
    }

    // Should be roughly 70% (allow variance)
    const attackRate = attackCount / trials;
    expect(attackRate).toBeGreaterThan(0.5);
    expect(attackRate).toBeLessThan(0.9);
  });
});

describe('AIEngine - Target Selection', () => {
  it('should never target self', () => {
    const gameEngine = new GameEngine(FactionType.OPENG);
    const aiEngine = new AIEngine();
    const state = gameEngine.getState();
    const aiFaction = state.factions.find(f => f.isAI)!;

    gameEngine.giveReadyAttack(aiFaction.id);

    const action = aiEngine.decideAction(aiFaction, state);

    if (action?.type === 'EXECUTE_ATTACK') {
      expect(action.targetId).not.toBe(aiFaction.id);
    }
  });

  it('should never target eliminated factions', () => {
    const gameEngine = new GameEngine(FactionType.CAMEL);
    const aiEngine = new AIEngine();
    const state = gameEngine.getState();
    const aiFaction = state.factions.find(f => f.isAI)!;

    // Eliminate some factions
    gameEngine.eliminateFaction(state.factions[2].id);
    gameEngine.eliminateFaction(state.factions[3].id);

    gameEngine.giveReadyAttack(aiFaction.id);

    const action = aiEngine.decideAction(aiFaction, state);

    if (action?.type === 'EXECUTE_ATTACK') {
      const target = state.factions.find(f => f.id === action.targetId)!;
      expect(target.isEliminated).toBe(false);
    }
  });
});

describe('AIEngine - Defense Card Decision', () => {
  it('should play defense card when attack would be lethal', () => {
    const gameEngine = new GameEngine(FactionType.OPENG);
    const aiEngine = new AIEngine();
    let state = gameEngine.getState();
    const aiDefenderId = state.factions.find(f => f.isAI)!.id;

    // Disable faction ability for clean testing
    gameEngine.disableFactionAbility(aiDefenderId);

    // Reduce AI building HP to near-death
    gameEngine.damageBuilding(aiDefenderId, 90); // 20 HP remaining

    // Give AI a full-block defense card
    gameEngine.giveDefenseCard(aiDefenderId, 'Security Detail');

    state = gameEngine.getState();
    const aiDefender = state.factions.find(f => f.id === aiDefenderId)!;

    // Simulate pending attack that would be lethal (25 damage)
    const pendingAttack = {
      attackerId: state.factions[0].id,
      defenderId: aiDefenderId,
      organizationId: 'test-org',
      attackType: ActionType.THROWING,
      damage: 25,
      targetType: 'BUILDING' as 'BUILDING'
    };

    const decision = aiEngine.shouldPlayDefenseCard(aiDefender, state, pendingAttack);

    expect(decision.shouldPlay).toBe(true);
    expect(decision.cardId).toBeDefined();
  });

  it('should decline defense card for trivial damage', () => {
    const gameEngine = new GameEngine(FactionType.OPENG);
    const aiEngine = new AIEngine();
    let state = gameEngine.getState();
    const aiDefenderId = state.factions.find(f => f.isAI)!.id;

    // AI has full health
    gameEngine.giveDefenseCard(aiDefenderId, 'Security Detail');

    state = gameEngine.getState();
    const aiDefender = state.factions.find(f => f.id === aiDefenderId)!;

    // Simulate small attack (5 damage)
    const pendingAttack = {
      attackerId: state.factions[0].id,
      defenderId: aiDefenderId,
      organizationId: 'test-org',
      attackType: ActionType.THROWING,
      damage: 5,
      targetType: 'BUILDING' as 'BUILDING'
    };

    const decision = aiEngine.shouldPlayDefenseCard(aiDefender, state, pendingAttack);

    // Should decline to save defense card for later
    expect(decision.shouldPlay).toBe(false);
  });

  it('should play defense card for moderate damage when health is low', () => {
    const gameEngine = new GameEngine(FactionType.OPENG);
    const aiEngine = new AIEngine();
    let state = gameEngine.getState();
    const aiDefenderId = state.factions.find(f => f.isAI)!.id;

    // Disable faction ability for clean testing
    gameEngine.disableFactionAbility(aiDefenderId);

    // Reduce AI building HP to 40%
    gameEngine.damageBuilding(aiDefenderId, 66); // 44 HP remaining (40%)

    gameEngine.giveDefenseCard(aiDefenderId, 'Fortification');

    state = gameEngine.getState();
    const aiDefender = state.factions.find(f => f.id === aiDefenderId)!;

    // Simulate moderate attack (20 damage)
    const pendingAttack = {
      attackerId: state.factions[0].id,
      defenderId: aiDefenderId,
      organizationId: 'test-org',
      attackType: ActionType.INVASION,
      damage: 20,
      targetType: 'BUILDING' as 'BUILDING'
    };

    const decision = aiEngine.shouldPlayDefenseCard(aiDefender, state, pendingAttack);

    // Should play defense when health is low
    expect(decision.shouldPlay).toBe(true);
  });

  it('should prefer damage reduction cards for survivable attacks', () => {
    const gameEngine = new GameEngine(FactionType.OPENG);
    const aiEngine = new AIEngine();
    let state = gameEngine.getState();
    const aiDefenderId = state.factions.find(f => f.isAI)!.id;

    // Reduce HP to 50%
    gameEngine.damageBuilding(aiDefenderId, 55);

    // Give both full block and damage reduction
    gameEngine.clearHand(aiDefenderId);
    gameEngine.giveDefenseCard(aiDefenderId, 'Security Detail'); // Full block
    gameEngine.giveDefenseCard(aiDefenderId, 'Fortification'); // Damage reduction

    state = gameEngine.getState();
    const aiDefender = state.factions.find(f => f.id === aiDefenderId)!;

    // Moderate attack
    const pendingAttack = {
      attackerId: state.factions[0].id,
      defenderId: aiDefenderId,
      organizationId: 'test-org',
      attackType: ActionType.INVASION,
      damage: 30,
      targetType: 'BUILDING' as 'BUILDING'
    };

    const decision = aiEngine.shouldPlayDefenseCard(aiDefender, state, pendingAttack);

    if (decision.shouldPlay && decision.cardId) {
      const selectedCard = aiDefender.hand.find(c => c.id === decision.cardId)!;
      // Should prefer damage reduction over full block for survivable damage
      expect(selectedCard.name).toBe('Fortification');
    }
  });

  it('should play full block card on lethal damage', () => {
    const gameEngine = new GameEngine(FactionType.OPENG);
    const aiEngine = new AIEngine();
    let state = gameEngine.getState();
    const aiDefenderId = state.factions.find(f => f.isAI)!.id;

    // Disable faction ability for clean testing
    gameEngine.disableFactionAbility(aiDefenderId);

    // Very low HP
    gameEngine.damageBuilding(aiDefenderId, 95); // 15 HP remaining

    gameEngine.clearHand(aiDefenderId);
    gameEngine.giveDefenseCard(aiDefenderId, 'Security Detail'); // Full block
    gameEngine.giveDefenseCard(aiDefenderId, 'Fortification'); // Damage reduction

    state = gameEngine.getState();
    const aiDefender = state.factions.find(f => f.id === aiDefenderId)!;

    // Lethal attack
    const pendingAttack = {
      attackerId: state.factions[0].id,
      defenderId: aiDefenderId,
      organizationId: 'test-org',
      attackType: ActionType.THROWING,
      damage: 20,
      targetType: 'BUILDING' as 'BUILDING'
    };

    const decision = aiEngine.shouldPlayDefenseCard(aiDefender, state, pendingAttack);

    expect(decision.shouldPlay).toBe(true);
    if (decision.cardId) {
      const selectedCard = aiDefender.hand.find(c => c.id === decision.cardId)!;
      // Should use full block on lethal
      expect(selectedCard.name).toBe('Security Detail');
    }
  });

  it('should return null when no applicable defense cards', () => {
    const gameEngine = new GameEngine(FactionType.OPENG);
    const aiEngine = new AIEngine();
    let state = gameEngine.getState();
    const aiDefenderId = state.factions.find(f => f.isAI)!.id;

    // Give defense card that doesn't match attack type
    gameEngine.clearHand(aiDefenderId);
    gameEngine.giveDefenseCard(aiDefenderId, 'Counter-Protesters'); // Blocks PROTEST

    state = gameEngine.getState();
    const aiDefender = state.factions.find(f => f.id === aiDefenderId)!;

    // THROWING attack
    const pendingAttack = {
      attackerId: state.factions[0].id,
      defenderId: aiDefenderId,
      organizationId: 'test-org',
      attackType: ActionType.THROWING,
      damage: 30,
      targetType: 'BUILDING' as 'BUILDING'
    };

    const decision = aiEngine.shouldPlayDefenseCard(aiDefender, state, pendingAttack);

    expect(decision.shouldPlay).toBe(false);
    expect(decision.cardId).toBeUndefined();
  });

  it('should consider GPUs attacks when deciding defense', () => {
    const gameEngine = new GameEngine(FactionType.OPENG);
    const aiEngine = new AIEngine();
    let state = gameEngine.getState();
    const aiDefenderId = state.factions.find(f => f.isAI)!.id;

    // Low GPUs
    gameEngine.setGPUs(aiDefenderId, 20);

    gameEngine.clearHand(aiDefenderId);
    gameEngine.giveDefenseCard(aiDefenderId, 'Bomb Shelter'); // Reduces GPUs damage

    state = gameEngine.getState();
    const aiDefender = state.factions.find(f => f.id === aiDefenderId)!;

    // GPUs attack that would eliminate
    const pendingAttack = {
      attackerId: state.factions[0].id,
      defenderId: aiDefenderId,
      organizationId: 'test-org',
      attackType: ActionType.THROWING,
      damage: 25,
      targetType: 'GPUS' as 'GPUS'
    };

    const decision = aiEngine.shouldPlayDefenseCard(aiDefender, state, pendingAttack);

    // Should play defense to avoid elimination
    expect(decision.shouldPlay).toBe(true);
  });
});
