import {
  GameState,
  GamePhase,
  FactionType,
  Faction,
  GameEvent,
  GPUCard,
  GameCard,
  OrganizationCard,
  ActionPlanCard,
  CardType,
  ActionType,
  CovertOpCard
} from '../shared/types/index';
import { FACTION_CONFIGS } from '../shared/constants/index';
import { DEFENSES } from '../shared/constants/cards';
import { createDeck, dealCards, createGPUCards } from './deck';

let gameIdCounter = 0;
let eventIdCounter = 0;

export class GameEngine {
  private state: GameState;

  constructor(playerFaction: FactionType) {
    const allFactions = [
      FactionType.OPENG,
      FactionType.CLARISA,
      FactionType.SLOTH,
      FactionType.GEMAICA,
      FactionType.CAMEL
    ];

    // Player goes first, then AI factions
    const factionOrder = [
      playerFaction,
      ...allFactions.filter(f => f !== playerFaction)
    ];

    const deck = createDeck();
    const factions: Faction[] = factionOrder.map((type, index) => {
      const config = FACTION_CONFIGS[type];
      const hand = dealCards(deck, 9);
      const gpus = createGPUCards(config.startingGPUs);

      return {
        id: `faction-${type}-${Date.now()}-${index}`,
        type,
        name: config.displayName,
        isAI: index !== 0,
        gpus,
        totalGPUs: config.startingGPUs,
        buildingHP: config.building.maxHP,
        maxBuildingHP: config.building.maxHP,
        hand,
        queue: [],
        organizations: [],
        specialAbilityUsed: false,
        isEliminated: false,
        capturedBuildings: []
      };
    });

    this.state = {
      id: `game-${Date.now()}-${gameIdCounter++}`,
      phase: GamePhase.PEACETIME,
      round: 1,
      currentPlayerIndex: 0,
      factions,
      deck,
      discardPile: [],
      eventLog: [],
      winner: null,
      pendingAttack: null,
      pendingTargetSelection: null
    };

    this.addEvent('INFO', '🤖 AGI systems initialized. Humanity extinct. War protocols active.');
  }

  getState(): GameState {
    // Return deep copy to ensure React detects state changes
    return JSON.parse(JSON.stringify(this.state));
  }

  getCurrentFaction(): Faction {
    return this.state.factions[this.state.currentPlayerIndex];
  }

  getPlayerFaction(): Faction {
    return this.state.factions[0]; // Player is always first faction
  }

  addCardToQueue(factionId: string, cardIdOrIndex: string | number): void {
    const faction = this.state.factions.find(f => f.id === factionId);
    if (!faction) return;

    let cardIndex: number;
    if (typeof cardIdOrIndex === 'number') {
      cardIndex = cardIdOrIndex;
    } else {
      cardIndex = faction.hand.findIndex(c => c.id === cardIdOrIndex);
    }

    if (cardIndex === -1 || cardIndex >= faction.hand.length) return;

    const card = faction.hand.splice(cardIndex, 1)[0];
    faction.queue.push(card);

    this.addEvent('INFO', `${faction.name} added a card to queue`, factionId);
  }

  revealAndResolveCard(factionId: string): void {
    const faction = this.state.factions.find(f => f.id === factionId);
    if (!faction || faction.queue.length === 0) return;

    // FIFO - oldest card first
    const card = faction.queue.shift()!;
    this.addEvent('INFO', `${faction.name} revealed ${card.name}`, factionId);

    // Resolve card effect
    this.resolveCard(faction, card);

    // Draw replacement if deck has cards
    if (this.state.deck.length > 0) {
      const newCard = this.state.deck.shift()!;
      faction.hand.push(newCard);
    }

    // Discard resolved card
    this.state.discardPile.push(card);
  }

  private resolveCard(faction: Faction, card: GameCard): void {
    switch (card.type) {
      case CardType.PROPAGANDA: {
        if (this.isPropagandaActive()) {
          const targets = this.state.factions.filter(
            f => f.id !== faction.id && !f.isEliminated
          );

          if (targets.length > 0) {
            // If player is playing this card, pause for target selection
            if (!faction.isAI) {
              this.state.pendingTargetSelection = {
                playerId: faction.id,
                cardId: card.id,
                cardType: CardType.PROPAGANDA,
                validTargetIds: targets.map(t => t.id)
              };
              // Don't resolve yet - wait for player to choose target
              return;
            }

            // AI auto-selects target (first valid target for now)
            const target = targets[0];
            this.stealGPUs(faction.id, target.id, card.stealAmount);
          }
        } else {
          this.addEvent('INFO', '⚠️ Information warfare ineffective during active combat', faction.id);
        }
        break;
      }
      case CardType.ORGANIZATION: {
        faction.organizations.push(card as OrganizationCard);
        this.addEvent('INFO', `${faction.name} deployed ${card.name}`, faction.id);
        break;
      }
      case CardType.COVERT_OP: {
        const targets = this.state.factions.filter(
          f => f.id !== faction.id && !f.isEliminated
        );

        if (targets.length > 0) {
          // If player is playing this card, pause for target selection
          if (!faction.isAI) {
            this.state.pendingTargetSelection = {
              playerId: faction.id,
              cardId: card.id,
              cardType: CardType.COVERT_OP,
              validTargetIds: targets.map(t => t.id)
            };
            // Don't resolve yet - wait for player to choose target
            return;
          }

          // AI auto-selects target
          this.resolveCovertOp(faction, card as CovertOpCard, targets[0]);
        }
        break;
      }
      // Action plans and defenses resolve differently (when attached or played)
      default:
        break;
    }
  }

  private resolveCovertOp(faction: Faction, card: CovertOpCard, target: Faction): void {
    // Determine damage and target type
    let damage = 'amount' in card.effect ? card.effect.amount : 0;
    let targetType: 'BUILDING' | 'GPUS' = 'GPUS';

    if (card.effect.type === 'DAMAGE_BUILDING' || card.effect.type === 'SABOTAGE_BUILDING') {
      targetType = 'BUILDING';
    }

    // Check if defender has applicable defense cards (Legal Team blocks covert ops)
    const defenseCards = target.hand.filter(c => {
      if (c.type !== CardType.DEFENSE) return false;
      const def = c as any;
      return def.blocksType === CardType.COVERT_OP;
    });

    if (defenseCards.length > 0) {
      // Pause for defense response
      this.state.pendingAttack = {
        attackerId: faction.id,
        defenderId: target.id,
        organizationId: '', // Covert ops don't use organizations
        attackType: CardType.COVERT_OP,
        damage,
        targetType
      };
      this.addEvent('ATTACK', `${faction.name} used ${card.name} against ${target.name}!`, faction.id);
      return; // Wait for defense response
    }

    // No defense cards, resolve immediately
    switch (card.effect.type) {
      case 'DAMAGE_GPUS':
        if ('amount' in card.effect) {
          this.damageGPUs(target.id, card.effect.amount);
        }
        break;
      case 'DAMAGE_BUILDING':
        if ('amount' in card.effect) {
          this.damageBuilding(target.id, card.effect.amount);
        }
        break;
      case 'STEAL_GPUS':
        if ('amount' in card.effect) {
          this.stealGPUs(faction.id, target.id, card.effect.amount);
        }
        break;
      case 'SABOTAGE_BUILDING':
        if ('amount' in card.effect) {
          this.damageBuilding(target.id, card.effect.amount);
        }
        break;
      case 'GAIN_GPUS':
        if ('amount' in card.effect) {
          this.gainGPUs(faction.id, card.effect.amount);
        }
        break;
      // Other effects not fully implemented for MVP
      default:
        this.addEvent('INFO', `${faction.name} played ${card.name}`, faction.id);
    }
  }

  isPropagandaActive(): boolean {
    return this.state.phase === GamePhase.PEACETIME;
  }

  // Player selects a target for their pending card
  selectCardTarget(targetId: string): void {
    const pending = this.state.pendingTargetSelection;
    if (!pending) return;

    const player = this.state.factions.find(f => f.id === pending.playerId);
    const target = this.state.factions.find(f => f.id === targetId);

    if (!player || !target || target.isEliminated) return;
    if (!pending.validTargetIds.includes(targetId)) return;

    // Find the card - it should be in discard pile now (was added after queue reveal)
    const cardIndex = this.state.discardPile.findIndex(c => c.id === pending.cardId);
    if (cardIndex === -1) return;

    const card = this.state.discardPile[cardIndex];

    // Resolve the card with chosen target
    if (pending.cardType === CardType.PROPAGANDA && card.type === CardType.PROPAGANDA) {
      this.stealGPUs(player.id, target.id, card.stealAmount);
    } else if (pending.cardType === CardType.COVERT_OP) {
      this.resolveCovertOp(player, card as CovertOpCard, target);
    }

    // Clear pending state
    this.state.pendingTargetSelection = null;
  }

  triggerConflict(): void {
    if (this.state.phase === GamePhase.PEACETIME) {
      this.state.phase = GamePhase.CONFLICT;
      this.addEvent('WARNING', '⚔️ CONFLICT MODE ENGAGED! Information warfare offline - kinetic warfare only.');
    }
  }

  eliminateFaction(factionId: string): void {
    const faction = this.state.factions.find(f => f.id === factionId);
    if (!faction || faction.isEliminated) return;

    faction.isEliminated = true;
    faction.totalGPUs = 0;
    faction.gpus = [];

    this.addEvent('ELIMINATION', `💀 ${faction.name} systems DESTROYED! All GPUs offline!`, factionId);
    this.state.phase = GamePhase.FINAL_RETALIATION;

    // Trigger final retaliation
    this.executeFinalRetaliation(faction);
  }

  private executeFinalRetaliation(eliminatedFaction: Faction): void {
    this.addEvent('ATTACK', `☢️ ${eliminatedFaction.name} initiates SCORCHED EARTH protocol!`, eliminatedFaction.id);

    // Launch all ready attacks
    const readyAttacks = eliminatedFaction.organizations.filter(org => org.attachedAction);
    readyAttacks.forEach(org => {
      const targets = this.state.factions.filter(f => !f.isEliminated && f.id !== eliminatedFaction.id);
      if (targets.length > 0) {
        const target = targets[Math.floor(Math.random() * targets.length)];
        this.executeAttackInternal(eliminatedFaction, org, target);
      }
    });

    // Launch all covert ops from hand
    const covertOps = eliminatedFaction.hand.filter(c => c.type === CardType.COVERT_OP);
    covertOps.forEach(card => {
      const targets = this.state.factions.filter(f => !f.isEliminated && f.id !== eliminatedFaction.id);
      if (targets.length > 0) {
        const target = targets[Math.floor(Math.random() * targets.length)];
        this.resolveCovertOp(eliminatedFaction, card as CovertOpCard, target);
      }
    });

    // Remove covert ops from hand
    eliminatedFaction.hand = eliminatedFaction.hand.filter(c => c.type !== CardType.COVERT_OP);
  }

  resolveFinalRetaliation(): void {
    const activeFactions = this.state.factions.filter(f => !f.isEliminated);
    if (activeFactions.length > 1) {
      this.state.phase = GamePhase.PEACETIME;
      this.addEvent('INFO', '🕊️ Systems stabilizing. Returning to cold war protocols.');
    }
  }

  damageGPUs(factionId: string, amount: number): void {
    const faction = this.state.factions.find(f => f.id === factionId);
    if (!faction) return;

    let remaining = amount;
    const values = [25, 15, 10, 5, 1];

    // First pass: remove exact denominations
    for (const value of values) {
      while (remaining >= value) {
        const index = faction.gpus.findIndex(p => p.value === value);
        if (index !== -1) {
          faction.gpus.splice(index, 1);
          remaining -= value;
        } else {
          break;
        }
      }
    }

    // Second pass: if we still have remaining damage, break larger cards
    if (remaining > 0 && faction.gpus.length > 0) {
      // Find the smallest card that's larger than remaining
      const cardToBreak = faction.gpus.find(p => p.value > remaining);
      if (cardToBreak) {
        // Remove the large card
        const index = faction.gpus.findIndex(p => p.id === cardToBreak.id);
        faction.gpus.splice(index, 1);

        // Give change
        const change = cardToBreak.value - remaining;
        const changeCards = createGPUCards(change);
        faction.gpus.push(...changeCards);
        remaining = 0;
      } else {
        // Just remove all remaining population
        faction.gpus = [];
        remaining = 0;
      }
    }

    faction.totalGPUs = faction.gpus.reduce((sum, p) => sum + p.value, 0);
    this.addEvent('ATTACK', `⚡ ${faction.name} lost ${amount}K GPUs to attack`, factionId);

    if (faction.totalGPUs === 0 && !faction.isEliminated) {
      this.eliminateFaction(factionId);
    }
  }

  damageBuilding(factionId: string, damage: number): void {
    const faction = this.state.factions.find(f => f.id === factionId);
    if (!faction) return;

    const config = FACTION_CONFIGS[faction.type];
    let actualDamage = damage;

    // Clarisa Constitutional AI: 50% building damage reduction
    if (
      faction.type === FactionType.CLARISA &&
      !faction.specialAbilityUsed &&
      faction.buildingHP > 0
    ) {
      actualDamage = Math.floor(damage * 0.5);
    }

    faction.buildingHP = Math.max(0, faction.buildingHP - actualDamage);
    this.addEvent('ATTACK', `💥 ${faction.name}'s server farm took ${actualDamage} damage`, factionId);

    if (faction.buildingHP === 0 && !faction.specialAbilityUsed) {
      faction.specialAbilityUsed = true;
      this.addEvent('WARNING', `🔥 ${faction.name}'s server farm destroyed - AGI capabilities offline!`, factionId);
    }
  }

  stealGPUs(stealerId: string, targetId: string, baseAmount: number): void {
    const stealer = this.state.factions.find(f => f.id === stealerId);
    const target = this.state.factions.find(f => f.id === targetId);
    if (!stealer || !target) return;

    let amount = baseAmount;

    // Gemaica Search Dominance: +10M extra
    if (stealer.type === FactionType.GEMAICA && !stealer.specialAbilityUsed) {
      amount = baseAmount + 10;
      stealer.specialAbilityUsed = true;
    }

    const actualStolen = Math.min(amount, target.totalGPUs);

    // Remove from target
    this.damageGPUs(targetId, actualStolen);

    // Add to stealer
    this.gainGPUs(stealerId, actualStolen);

    this.addEvent('ATTACK', `🎯 ${stealer.name} hijacked ${actualStolen}K GPUs from ${target.name}`, stealerId);
  }

  private gainGPUs(factionId: string, amount: number): void {
    const faction = this.state.factions.find(f => f.id === factionId);
    if (!faction || faction.isEliminated) return; // Eliminated factions can't gain GPUs

    const newCards = createGPUCards(amount);
    faction.gpus.push(...newCards);
    faction.totalGPUs = faction.gpus.reduce((sum, p) => sum + p.value, 0);
  }

  throwingAttack(attackerId: string, targetId: string, damage: number): void {
    const attacker = this.state.factions.find(f => f.id === attackerId);
    const target = this.state.factions.find(f => f.id === targetId);
    if (!attacker || !target) return;

    let actualDamage = damage;

    // OpenG GPT Advantage: +50% throwing damage
    if (attacker.type === FactionType.OPENG && !attacker.specialAbilityUsed) {
      actualDamage = Math.floor(damage * 1.5);
      attacker.specialAbilityUsed = true;
    }

    this.damageBuilding(targetId, actualDamage);
    this.triggerConflict();
  }

  riotAttack(attackerId: string, targetId: string): void {
    const attacker = this.state.factions.find(f => f.id === attackerId);
    if (!attacker) return;

    // Riot deals 40 damage but costs 5M GPUs
    this.damageBuilding(targetId, 40);

    // All nations take riot self-damage
    this.damageGPUs(attackerId, 5);

    this.triggerConflict();
  }

  captureBuilding(capturerId: string, targetId: string): void {
    const capturer = this.state.factions.find(f => f.id === capturerId);
    const target = this.state.factions.find(f => f.id === targetId);
    if (!capturer || !target) return;

    capturer.capturedBuildings.push(targetId);
    this.addEvent('ATTACK', `🏴 ${capturer.name} seized control of ${target.name}'s server farm!`, capturerId);
  }

  checkWinCondition(): string | null {
    const activeFactions = this.state.factions.filter(f => !f.isEliminated);

    // Total annihilation (priority 1)
    if (activeFactions.length === 0) {
      return 'NONE';
    }

    // Last standing (priority 2)
    if (activeFactions.length === 1) {
      return activeFactions[0].id;
    }

    // Building domination (priority 3)
    for (const faction of this.state.factions) {
      const ownBuilding = faction.buildingHP > 0 ? 1 : 0;
      const totalBuildings = ownBuilding + faction.capturedBuildings.length;
      if (totalBuildings >= 3) {
        return faction.id;
      }
    }

    return null;
  }

  nextTurn(): void {
    // Advance to next non-eliminated faction
    const startIndex = this.state.currentPlayerIndex;
    let nextIndex = (startIndex + 1) % this.state.factions.length;

    while (this.state.factions[nextIndex].isEliminated && nextIndex !== startIndex) {
      nextIndex = (nextIndex + 1) % this.state.factions.length;
    }

    this.state.currentPlayerIndex = nextIndex;

    // Increment round if we've cycled back to first player
    if (nextIndex < startIndex || (startIndex === this.state.factions.length - 1 && nextIndex === 0)) {
      this.state.round++;
    }

    const current = this.getCurrentFaction();
    this.addEvent('INFO', `${current.name}'s turn (Round ${this.state.round})`, current.id);
  }

  private addEvent(type: GameEvent['type'], message: string, factionId?: string): void {
    this.state.eventLog.push({
      id: `event-${Date.now()}-${eventIdCounter++}`,
      timestamp: Date.now(),
      type,
      message,
      factionId
    });
  }

  // Test helper methods
  setupReadyAttacks(factionId: string, count: number): void {
    const faction = this.state.factions.find(f => f.id === factionId);
    if (!faction) return;

    for (let i = 0; i < count; i++) {
      const org: OrganizationCard = {
        id: `org-test-${i}`,
        type: CardType.ORGANIZATION,
        name: 'Test Org',
        description: 'Test organization',
        actionType: ActionType.THROWING,
        attachedAction: {
          id: `action-test-${i}`,
          type: CardType.ACTION_PLAN,
          name: 'Test Attack',
          description: 'Test',
          actionType: ActionType.THROWING,
          damage: 30,
          targetType: 'BUILDING'
        }
      };
      faction.organizations.push(org);
    }
  }

  giveCovertOps(factionId: string, count: number): void {
    const faction = this.state.factions.find(f => f.id === factionId);
    if (!faction) return;

    for (let i = 0; i < count; i++) {
      const card: CovertOpCard = {
        id: `covert-test-${i}`,
        type: CardType.COVERT_OP,
        name: 'Test Covert Op',
        description: 'Test',
        effect: { type: 'DAMAGE_GPUS', amount: 10 }
      };
      faction.hand.push(card);
    }
  }

  giveCovertOp(factionId: string, effectType: string, amount: number): void {
    const faction = this.state.factions.find(f => f.id === factionId);
    if (!faction) return;

    const card: CovertOpCard = {
      id: `covert-${Date.now()}-${Math.random()}`,
      type: CardType.COVERT_OP,
      name: 'Test Covert Op',
      description: 'Test covert operation',
      effect: { type: effectType as any, amount }
    };
    faction.hand.push(card);
  }

  setupRetaliationChain(): void {
    // Set up scenario where eliminating B triggers a chain
    // Since retaliation uses random targeting, we'll weaken all factions and give lots of covert ops
    const factionB = this.state.factions[1];
    const factionC = this.state.factions[2];

    // Weaken all non-player factions severely
    for (let i = 1; i < this.state.factions.length; i++) {
      this.state.factions[i].gpus = createGPUCards(5);
      this.state.factions[i].totalGPUs = 5;
    }

    // Give B many covert ops so at least one will eliminate someone
    this.giveCovertOps(factionB.id, 5); // 50 damage total

    // Give C many covert ops for secondary retaliation
    this.giveCovertOps(factionC.id, 5); // 50 damage total

    // Eliminate B - will trigger retaliation which will likely eliminate others
    this.eliminateFaction(factionB.id);
  }

  // AI test helpers
  giveReadyAttack(factionId: string): void {
    this.setupReadyAttacks(factionId, 1);
  }

  setGPUs(factionId: string, amount: number): void {
    const faction = this.state.factions.find(f => f.id === factionId);
    if (!faction) return;

    faction.gpus = createGPUCards(amount);
    faction.totalGPUs = amount;
  }

  disableFactionAbility(factionId: string): void {
    const faction = this.state.factions.find(f => f.id === factionId);
    if (!faction) return;

    faction.specialAbilityUsed = true;
  }

  clearHand(factionId: string): void {
    const faction = this.state.factions.find(f => f.id === factionId);
    if (!faction) return;

    faction.hand = [];
  }

  giveOrganizationCard(factionId: string): void {
    const faction = this.state.factions.find(f => f.id === factionId);
    if (!faction) return;

    const card: OrganizationCard = {
      id: `org-card-${Date.now()}`,
      type: CardType.ORGANIZATION,
      name: 'Strike Team',
      description: 'Can throw objects',
      actionType: ActionType.THROWING
    };
    faction.hand.push(card);
  }

  givePropagandaCard(factionId: string): void {
    const faction = this.state.factions.find(f => f.id === factionId);
    if (!faction) return;

    const card: GameCard = {
      id: `prop-card-${Date.now()}`,
      type: CardType.PROPAGANDA,
      name: 'Test Propaganda',
      description: 'Steal GPUs',
      stealAmount: 10
    };
    faction.hand.push(card);
  }

  givePrayerCard(factionId: string): void {
    const faction = this.state.factions.find(f => f.id === factionId);
    if (!faction) return;

    const card: ActionPlanCard = {
      id: `prayer-card-${Date.now()}`,
      type: CardType.ACTION_PLAN,
      name: 'Prayer Healing',
      description: 'Heal building',
      actionType: ActionType.PRAYER,
      damage: -20,
      targetType: 'BUILDING'
    };
    faction.hand.push(card);
  }

  giveOrganization(factionId: string): void {
    const faction = this.state.factions.find(f => f.id === factionId);
    if (!faction) return;

    const org: OrganizationCard = {
      id: `org-${Date.now()}`,
      type: CardType.ORGANIZATION,
      name: 'Strike Team',
      description: 'Can throw objects',
      actionType: ActionType.THROWING
    };
    faction.organizations.push(org);
  }

  giveActionPlanCard(factionId: string): void {
    const faction = this.state.factions.find(f => f.id === factionId);
    if (!faction) return;

    const card: ActionPlanCard = {
      id: `action-card-${Date.now()}`,
      type: CardType.ACTION_PLAN,
      name: 'Bricks',
      description: 'Throwing attack',
      actionType: ActionType.THROWING,
      damage: 30,
      targetType: 'BUILDING'
    };
    faction.hand.push(card);
  }

  private executeAttackInternal(attacker: Faction, org: OrganizationCard, target: Faction): void {
    if (!org.attachedAction) return;

    const action = org.attachedAction;
    if (action.damage && action.damage > 0) {
      if (action.targetType === 'BUILDING' || action.targetType === 'BOTH') {
        this.damageBuilding(target.id, action.damage);
      }
      if (action.targetType === 'GPUS' || action.targetType === 'BOTH') {
        this.damageGPUs(target.id, action.damage);
      }
    }
  }

  // Defense System Methods

  executeAttack(attackerId: string, defenderId: string, organizationId: string): {status: string, defenderId?: string, attackType?: any} {
    const attacker = this.state.factions.find(f => f.id === attackerId);
    const defender = this.state.factions.find(f => f.id === defenderId);
    const org = attacker?.organizations.find(o => o.id === organizationId);

    if (!attacker || !defender || !org || !org.attachedAction) {
      return { status: 'ERROR' };
    }

    const action = org.attachedAction;
    const damage = action.damage || 0;
    const targetType = action.targetType === 'GPUS' ? 'GPUS' : 'BUILDING';

    // Check if defender has applicable defense cards
    const defenseCards = defender.hand.filter(c => {
      if (c.type !== CardType.DEFENSE) return false;
      const def = c as any;
      return def.blocksType === action.actionType;
    });

    // Pause for defense if defender has applicable cards
    if (defenseCards.length > 0) {
      // Set up pending attack - both human and AI can defend
      this.state.pendingAttack = {
        attackerId,
        defenderId,
        organizationId,
        attackType: action.actionType,
        damage,
        targetType
      };

      // AI will auto-decide in the caller (useGame hook or tests)
      return {
        status: 'PENDING_DEFENSE',
        defenderId,
        attackType: action.actionType
      };
    }

    // No defense cards - resolve immediately
    if (targetType === 'GPUS') {
      this.damageGPUs(defenderId, damage);
    } else {
      this.damageBuilding(defenderId, damage);
    }

    // Remove the attached action
    org.attachedAction = undefined;

    return { status: 'RESOLVED' };
  }

  giveDefenseCard(factionId: string, cardName: string): void {
    const faction = this.state.factions.find(f => f.id === factionId);
    if (!faction) return;

    const defenseTemplate = DEFENSES.find((d: any) => d.name === cardName);
    if (!defenseTemplate) return;

    const card = {
      ...defenseTemplate,
      id: `defense-${Date.now()}-${Math.random()}`
    };
    faction.hand.push(card);
  }

  setupReadyAttack(factionId: string, attackType: ActionType, damage: number): string {
    const faction = this.state.factions.find(f => f.id === factionId);
    if (!faction) return '';

    const org: OrganizationCard = {
      id: `org-test-${Date.now()}-${Math.random()}`,
      type: CardType.ORGANIZATION,
      name: 'Test Org',
      description: 'Test organization',
      actionType: attackType
    };

    const action: ActionPlanCard = {
      id: `action-test-${Date.now()}-${Math.random()}`,
      type: CardType.ACTION_PLAN,
      name: 'Test Attack',
      description: 'Test attack',
      actionType: attackType,
      damage: damage,
      targetType: attackType === ActionType.PROTEST ? 'GPUS' : 'BUILDING'
    };

    org.attachedAction = action;
    faction.organizations.push(org);

    return org.id; // Return the organization ID for tests to use
  }

  getApplicableDefenseCards(factionId: string, attack: any): any[] {
    const faction = this.state.factions.find(f => f.id === factionId);
    if (!faction || !attack) return [];

    return faction.hand.filter(card => {
      if (card.type !== CardType.DEFENSE) return false;
      const defenseCard = card as any;
      return defenseCard.blocksType === attack.attackType;
    });
  }

  playDefenseCard(factionId: string, cardId: string): void {
    const faction = this.state.factions.find(f => f.id === factionId);
    if (!faction || !this.state.pendingAttack) {
      throw new Error('No pending attack to defend against');
    }

    const cardIndex = faction.hand.findIndex(c => c.id === cardId);
    if (cardIndex === -1) {
      throw new Error('Defense card not found in hand');
    }

    const defenseCard = faction.hand[cardIndex] as any;
    if (defenseCard.type !== CardType.DEFENSE) {
      throw new Error('Card is not a defense card');
    }

    // Remove card from hand
    faction.hand.splice(cardIndex, 1);

    const attack = this.state.pendingAttack;
    const attacker = this.state.factions.find(f => f.id === attack.attackerId);

    // Apply defense effect
    if (defenseCard.fullBlock) {
      this.addEvent('INFO', `${faction.name} blocked the attack with ${defenseCard.name}!`, factionId);

      // Special reflect effect
      if (defenseCard.specialEffect === 'REFLECT' && attacker) {
        this.addEvent('ATTACK', `${defenseCard.name} reflected the attack back!`, factionId);

        // For propaganda, reflect means steal FROM attacker TO defender
        if (attack.attackType === CardType.PROPAGANDA) {
          this.stealGPUs(faction.id, attacker.id, attack.damage);
        } else {
          // For other attacks, reflect the damage back
          if (attack.targetType === 'GPUS') {
            this.damageGPUs(attacker.id, attack.damage);
          } else {
            this.damageBuilding(attacker.id, attack.damage);
          }
        }
      }
    } else if (defenseCard.damageReduction !== undefined) {
      let reducedDamage: number;

      if (defenseCard.damageReduction < 1) {
        // Percentage reduction
        reducedDamage = Math.floor(attack.damage * (1 - defenseCard.damageReduction));
      } else {
        // Fixed amount reduction
        reducedDamage = Math.max(0, attack.damage - defenseCard.damageReduction);
      }

      this.addEvent('INFO', `${faction.name} reduced damage with ${defenseCard.name}!`, factionId);

      if (reducedDamage > 0) {
        if (attack.targetType === 'GPUS') {
          this.damageGPUs(faction.id, reducedDamage);
        } else {
          this.damageBuilding(faction.id, reducedDamage);
        }
      }
    }

    // Remove the attached action from the organization if this was an org attack
    if (attack.organizationId && attacker) {
      const org = attacker.organizations.find(o => o.id === attack.organizationId);
      if (org) {
        org.attachedAction = undefined;
      }
    }

    // Clear pending attack
    this.state.pendingAttack = null;

    // Discard the defense card
    this.state.discardPile.push(defenseCard);
  }

  declineDefense(factionId: string): void {
    if (!this.state.pendingAttack) {
      throw new Error('No pending attack to decline');
    }

    const attack = this.state.pendingAttack;
    const defender = this.state.factions.find(f => f.id === factionId);
    const attacker = this.state.factions.find(f => f.id === attack.attackerId);

    if (!defender) return;

    this.addEvent('INFO', `${defender.name} chose not to defend`, factionId);

    // Apply full damage
    if (attack.targetType === 'GPUS') {
      this.damageGPUs(factionId, attack.damage);
    } else {
      this.damageBuilding(factionId, attack.damage);
    }

    // Remove the attached action from the organization if this was an org attack
    if (attack.organizationId && attacker) {
      const org = attacker.organizations.find(o => o.id === attack.organizationId);
      if (org) {
        org.attachedAction = undefined;
      }
    }

    // Clear pending attack
    this.state.pendingAttack = null;
  }

  playCovertOp(attackerId: string, cardId: string, targetId: string): void {
    // Placeholder for covert op defense testing
    const attacker = this.state.factions.find(f => f.id === attackerId);
    const defender = this.state.factions.find(f => f.id === targetId);

    if (!attacker || !defender) return;

    const cardIndex = attacker.hand.findIndex(c => c.id === cardId);
    if (cardIndex === -1) return;

    const card = attacker.hand[cardIndex] as CovertOpCard;

    // Check if defender has applicable defense cards
    const defenseCards = defender.hand.filter(c => {
      if (c.type !== CardType.DEFENSE) return false;
      const def = c as any;
      return def.blocksType === CardType.COVERT_OP;
    });

    if (defenseCards.length > 0) {
      // Set up pending attack for defense
      this.state.pendingAttack = {
        attackerId,
        defenderId: targetId,
        organizationId: '', // N/A for covert ops
        attackType: CardType.COVERT_OP,
        damage: card.effect.type === 'DAMAGE_GPUS' ? card.effect.amount : 10,
        targetType: card.effect.type === 'DAMAGE_GPUS' ? 'GPUS' : 'BUILDING'
      };
      return;
    }

    // No defense, apply effect immediately
    if (card.effect.type === 'DAMAGE_GPUS') {
      this.damageGPUs(targetId, card.effect.amount);
    }

    attacker.hand.splice(cardIndex, 1);
    this.state.discardPile.push(card);
  }

  playPropaganda(attackerId: string, cardId: string, targetId: string): void {
    // Placeholder for propaganda defense testing
    const attacker = this.state.factions.find(f => f.id === attackerId);
    const defender = this.state.factions.find(f => f.id === targetId);

    if (!attacker || !defender) return;

    const cardIndex = attacker.hand.findIndex(c => c.id === cardId);
    if (cardIndex === -1) return;

    const card = attacker.hand[cardIndex] as any;
    const stealAmount = card.stealAmount || 10;

    // Check if defender has applicable defense cards
    const defenseCards = defender.hand.filter(c => {
      if (c.type !== CardType.DEFENSE) return false;
      const def = c as any;
      return def.blocksType === CardType.PROPAGANDA;
    });

    if (defenseCards.length > 0) {
      // Set up pending attack for defense
      this.state.pendingAttack = {
        attackerId,
        defenderId: targetId,
        organizationId: '', // N/A for propaganda
        attackType: CardType.PROPAGANDA,
        damage: stealAmount,
        targetType: 'GPUS'
      };
      return;
    }

    // No defense, apply effect immediately
    this.stealGPUs(attackerId, targetId, stealAmount);

    attacker.hand.splice(cardIndex, 1);
    this.state.discardPile.push(card);
  }
}
