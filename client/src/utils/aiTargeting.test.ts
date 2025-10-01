import { describe, it, expect, beforeEach } from 'vitest';
import { GameEngine } from './gameEngine';
import { AIEngine } from './aiEngine';
import { FactionType, ActionType } from '../shared/types/index';

/**
 * AI Targeting Logic Tests - TDD Approach
 *
 * AI should consider multiple factors when selecting targets:
 * - Building HP (low HP = good target to eliminate)
 * - Population (high pop = good steal target, low pop = easy elimination)
 * - Military strength (ready attacks = threat)
 * - Strategy personality (aggressive, defensive, chaos, propaganda, balanced)
 */

describe('AI Targeting - Aggressive Strategy (USA)', () => {
  let engine: GameEngine;
  let aiEngine: AIEngine;

  beforeEach(() => {
    // Player is Russia, so USA will be an AI with AGGRESSIVE strategy
    engine = new GameEngine(FactionType.CLARISA);
    aiEngine = new AIEngine();
  });

  it('should prioritize wounded targets over healthy strong targets', () => {
    let state = engine.getState();
    const usaId = state.factions.find(f => f.type === FactionType.OPENG)!.id;
    const nKoreaId = state.factions.find(f => f.type === FactionType.SLOTH)!.id;
    const indiaId = state.factions.find(f => f.type === FactionType.GEMAICA)!.id;

    // India has most population (1400) but is healthy
    // North Korea has less population (26) but is wounded
    engine.damageBuilding(nKoreaId, 90); // N.Korea at 30/120 HP (25%)

    state = engine.getState();
    const usa = state.factions.find(f => f.id === usaId)!;
    const validTargets = state.factions.filter(f => f.id !== usaId && !f.isEliminated);

    // USA should prefer finishing off wounded N.Korea over healthy India
    const target = aiEngine.selectTarget(usa, validTargets, state);
    expect(target.id).toBe(nKoreaId);
  });

  it('should target strongest when no wounded targets exist', () => {
    let state = engine.getState();
    const usaId = state.factions.find(f => f.type === FactionType.OPENG)!.id;
    const indiaId = state.factions.find(f => f.type === FactionType.GEMAICA)!.id;

    state = engine.getState();
    const usa = state.factions.find(f => f.id === usaId)!;
    const validTargets = state.factions.filter(f => f.id !== usaId && !f.isEliminated);

    // Should target India (highest population)
    const target = aiEngine.selectTarget(usa, validTargets, state);
    expect(target.id).toBe(indiaId);
  });
});

describe('AI Targeting - Defensive Strategy (Russia)', () => {
  let engine: GameEngine;
  let aiEngine: AIEngine;

  beforeEach(() => {
    engine = new GameEngine(FactionType.OPENG);
    aiEngine = new AIEngine();
  });

  it('should prioritize targets with ready attacks (threats)', () => {
    let state = engine.getState();
    const russiaId = state.factions.find(f => f.type === FactionType.CLARISA)!.id;
    const usaId = state.factions.find(f => f.type === FactionType.OPENG)!.id;
    const britainId = state.factions.find(f => f.type === FactionType.CAMEL)!.id;

    // Give USA a ready attack (makes them a threat)
    engine.setupReadyAttack(usaId, ActionType.THROWING, 30);

    state = engine.getState();
    const russia = state.factions.find(f => f.id === russiaId)!;
    const validTargets = state.factions.filter(f => f.id !== russiaId && !f.isEliminated);

    // Russia should target USA (has ready attack) over Britain
    const target = aiEngine.selectTarget(russia, validTargets, state);
    expect(target.id).toBe(usaId);
  });

  it('should target weakest when no immediate threats', () => {
    let state = engine.getState();
    const russiaId = state.factions.find(f => f.type === FactionType.CLARISA)!.id;
    const nKoreaId = state.factions.find(f => f.type === FactionType.SLOTH)!.id;

    state = engine.getState();
    const russia = state.factions.find(f => f.id === russiaId)!;
    const validTargets = state.factions.filter(f => f.id !== russiaId && !f.isEliminated);

    // Should target North Korea (lowest population 26M)
    const target = aiEngine.selectTarget(russia, validTargets, state);
    expect(target.id).toBe(nKoreaId);
  });
});

describe('AI Targeting - Propaganda Strategy (India)', () => {
  let engine: GameEngine;
  let aiEngine: AIEngine;

  beforeEach(() => {
    engine = new GameEngine(FactionType.OPENG);
    aiEngine = new AIEngine();
  });

  it('should prefer high population targets with weak military', () => {
    let state = engine.getState();
    const indiaId = state.factions.find(f => f.type === FactionType.GEMAICA)!.id;
    const usaId = state.factions.find(f => f.type === FactionType.OPENG)!.id;
    const britainId = state.factions.find(f => f.type === FactionType.CAMEL)!.id;

    // Give USA 2 organizations (strong military)
    engine.setupReadyAttack(usaId, ActionType.THROWING, 30);
    const orgId2 = engine.setupReadyAttack(usaId, ActionType.INVASION, 40);

    state = engine.getState();
    const india = state.factions.find(f => f.id === indiaId)!;
    const validTargets = state.factions.filter(f => f.id !== indiaId && !f.isEliminated);

    // Should prefer Britain (68M, fewer orgs) over USA (330M but 2 orgs)
    const target = aiEngine.selectTarget(india, validTargets, state);
    expect(target.type).toBe(FactionType.CAMEL);
  });
});

describe('AI Targeting - Balanced Strategy (Britain)', () => {
  let engine: GameEngine;
  let aiEngine: AIEngine;

  beforeEach(() => {
    engine = new GameEngine(FactionType.OPENG);
    aiEngine = new AIEngine();
  });

  it('should strongly prefer finishing off near-death targets', () => {
    let state = engine.getState();
    const britainId = state.factions.find(f => f.type === FactionType.CAMEL)!.id;
    const nKoreaId = state.factions.find(f => f.type === FactionType.SLOTH)!.id;
    const indiaId = state.factions.find(f => f.type === FactionType.GEMAICA)!.id;

    // North Korea at critical HP (25% HP)
    engine.damageBuilding(nKoreaId, 90); // 30/120 HP

    state = engine.getState();
    const britain = state.factions.find(f => f.id === britainId)!;
    const validTargets = state.factions.filter(f => f.id !== britainId && !f.isEliminated);

    // Should target wounded North Korea despite India having more population
    const target = aiEngine.selectTarget(britain, validTargets, state);
    expect(target.id).toBe(nKoreaId);
  });

  it('should avoid targeting the strongest when multiple options exist', () => {
    let state = engine.getState();
    const britainId = state.factions.find(f => f.type === FactionType.CAMEL)!.id;
    const indiaId = state.factions.find(f => f.type === FactionType.GEMAICA)!.id;

    state = engine.getState();
    const britain = state.factions.find(f => f.id === britainId)!;
    const validTargets = state.factions.filter(f => f.id !== britainId && !f.isEliminated);

    // Should NOT always target India (strongest with 1400 pop)
    // Let's run this 10 times - should pick non-India at least once
    let pickedNonIndia = false;
    for (let i = 0; i < 10; i++) {
      const target = aiEngine.selectTarget(britain, validTargets, state);
      if (target.id !== indiaId) {
        pickedNonIndia = true;
        break;
      }
    }
    expect(pickedNonIndia).toBe(true);
  });

  it('should prioritize threats with ready attacks', () => {
    let state = engine.getState();
    const britainId = state.factions.find(f => f.type === FactionType.CAMEL)!.id;
    const russiaId = state.factions.find(f => f.type === FactionType.CLARISA)!.id;

    // Give Russia a ready attack
    engine.setupReadyAttack(russiaId, ActionType.THROWING, 30);

    state = engine.getState();
    const britain = state.factions.find(f => f.id === britainId)!;
    const validTargets = state.factions.filter(f => f.id !== britainId && !f.isEliminated);

    // Should consider Russia's threat level in scoring
    const target = aiEngine.selectTarget(britain, validTargets, state);
    // We expect Russia to score higher due to threat bonus
    expect(target.id).toBe(russiaId);
  });
});
