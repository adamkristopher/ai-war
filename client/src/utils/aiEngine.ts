import {
  Faction,
  GameState,
  FactionType,
  CardType,
  ActionType,
  OrganizationCard,
  GameCard,
  PendingAttack
} from '../shared/types/index';
import { AIStrategy } from '../shared/types/factions';
import { FACTION_CONFIGS } from '../shared/constants/index';

export interface AIAction {
  type: 'ADD_TO_QUEUE' | 'EXECUTE_ATTACK';
  cardId?: string;
  targetId?: string;
  organizationId?: string;
}

export interface DefenseDecision {
  shouldPlay: boolean;
  cardId?: string;
}

export class AIEngine {
  decideAction(faction: Faction, state: GameState): AIAction | null {
    // Get valid targets (not self, not eliminated)
    const validTargets = state.factions.filter(
      f => f.id !== faction.id && !f.isEliminated
    );

    if (validTargets.length === 0) {
      // No valid targets, just add card to queue if possible
      if (faction.hand.length > 0) {
        return {
          type: 'ADD_TO_QUEUE',
          cardId: faction.hand[0].id
        };
      }
      return null;
    }

    // Check if we have ready attacks
    const readyAttacks = faction.organizations.filter(org => org.attachedAction);

    // 70% probability to attack when ready
    if (readyAttacks.length > 0 && Math.random() < 0.7) {
      const org = readyAttacks[0];
      const target = this.selectTarget(faction, validTargets, state);

      return {
        type: 'EXECUTE_ATTACK',
        organizationId: org.id,
        targetId: target.id
      };
    }

    // Otherwise, add card to queue
    if (faction.hand.length > 0) {
      const config = FACTION_CONFIGS[faction.type];
      const strategy = config.aiStrategy;
      const card = this.selectCard(faction, state, strategy);

      if (card) {
        return {
          type: 'ADD_TO_QUEUE',
          cardId: card.id
        };
      }
    }

    return null;
  }

  private selectCard(faction: Faction, state: GameState, strategy: AIStrategy): GameCard | null {
    if (faction.hand.length === 0) return null;

    switch (strategy) {
      case AIStrategy.AGGRESSIVE:
        return this.selectAggressiveCard(faction, state);

      case AIStrategy.DEFENSIVE:
        return this.selectDefensiveCard(faction, state);

      case AIStrategy.PROPAGANDA:
        return this.selectPropagandaCard(faction, state);

      case AIStrategy.CHAOS:
        return this.selectChaosCard(faction);

      case AIStrategy.BALANCED:
        return this.selectBalancedCard(faction, state);

      default:
        return faction.hand[0];
    }
  }

  private selectAggressiveCard(faction: Faction, state: GameState): GameCard | null {
    // MAFA: Prioritize organizations to build attack capability
    const organizations = faction.hand.filter(c => c.type === CardType.ORGANIZATION);
    if (organizations.length > 0 && faction.organizations.length < 2) {
      return organizations[0];
    }

    // Then action plans
    const actionPlans = faction.hand.filter(c => c.type === CardType.ACTION_PLAN);
    if (actionPlans.length > 0) {
      return actionPlans[0];
    }

    // Then anything else
    return faction.hand[0];
  }

  private selectDefensiveCard(faction: Faction, state: GameState): GameCard | null {
    // Proud Gals: Prioritize healing when building damaged
    if (faction.buildingHP < faction.maxBuildingHP * 0.6) {
      const healing = faction.hand.filter(
        c => c.type === CardType.ACTION_PLAN &&
        c.actionType === ActionType.PRAYER
      );
      if (healing.length > 0) {
        return healing[0];
      }
    }

    // Otherwise build up defenses
    const defenses = faction.hand.filter(c => c.type === CardType.DEFENSE);
    if (defenses.length > 0) {
      return defenses[0];
    }

    // Organizations
    const organizations = faction.hand.filter(c => c.type === CardType.ORGANIZATION);
    if (organizations.length > 0 && faction.organizations.length < 2) {
      return organizations[0];
    }

    return faction.hand[0];
  }

  private selectPropagandaCard(faction: Faction, state: GameState): GameCard | null {
    // LMNOP: Prioritize propaganda during peacetime
    if (state.phase === 'PEACETIME') {
      const propaganda = faction.hand.filter(c => c.type === CardType.PROPAGANDA);
      if (propaganda.length > 0) {
        return propaganda[0];
      }
    }

    // During conflict, switch to organizations
    const organizations = faction.hand.filter(c => c.type === CardType.ORGANIZATION);
    if (organizations.length > 0 && faction.organizations.length < 2) {
      return organizations[0];
    }

    // Then action plans
    const actionPlans = faction.hand.filter(c => c.type === CardType.ACTION_PLAN);
    if (actionPlans.length > 0) {
      return actionPlans[0];
    }

    return faction.hand[0];
  }

  private selectChaosCard(faction: Faction): GameCard | null {
    // Aunty Fafa: Random selection
    const randomIndex = Math.floor(Math.random() * faction.hand.length);
    return faction.hand[randomIndex];
  }

  private selectBalancedCard(faction: Faction, state: GameState): GameCard | null {
    // BLAM: Mix strategies, don't over-build organizations

    // If we have 2+ organizations, prefer action plans
    if (faction.organizations.length >= 2) {
      const actionPlans = faction.hand.filter(c => c.type === CardType.ACTION_PLAN);
      if (actionPlans.length > 0) {
        return actionPlans[0];
      }
    }

    // During peacetime, mix propaganda and organizations
    if (state.phase === 'PEACETIME') {
      const propaganda = faction.hand.filter(c => c.type === CardType.PROPAGANDA);
      const organizations = faction.hand.filter(c => c.type === CardType.ORGANIZATION);

      // 50/50 chance between them if both available
      if (propaganda.length > 0 && organizations.length > 0) {
        return Math.random() < 0.5 ? propaganda[0] : organizations[0];
      }
      if (propaganda.length > 0) return propaganda[0];
      if (organizations.length > 0) return organizations[0];
    }

    // Otherwise prioritize organizations
    const organizations = faction.hand.filter(c => c.type === CardType.ORGANIZATION);
    if (organizations.length > 0 && faction.organizations.length < 2) {
      return organizations[0];
    }

    return faction.hand[0];
  }

  selectTarget(faction: Faction, validTargets: Faction[], state: GameState): Faction {
    const config = FACTION_CONFIGS[faction.type];
    const strategy = config.aiStrategy;

    switch (strategy) {
      case AIStrategy.AGGRESSIVE:
        // USA: Target strongest, but prioritize finishing wounded
        return this.selectAggressiveTarget(faction, validTargets);

      case AIStrategy.DEFENSIVE:
        // Russia: Target threats with ready attacks, otherwise weakest
        return this.selectDefensiveTarget(faction, validTargets);

      case AIStrategy.CHAOS:
        // North Korea: Random target
        return validTargets[Math.floor(Math.random() * validTargets.length)];

      case AIStrategy.PROPAGANDA:
        // India: Target high population but avoid strong military
        return this.selectPropagandaTarget(faction, validTargets);

      case AIStrategy.BALANCED:
        // Britain: Balanced multi-factor scoring
        return this.selectBalancedTarget(faction, validTargets);

      default:
        return validTargets.reduce((best, current) =>
          current.totalPopulation > best.totalPopulation ? current : best
        );
    }
  }

  private selectAggressiveTarget(faction: Faction, validTargets: Faction[]): Faction {
    // Prioritize finishing off wounded targets (< 30% building HP or < 50% population)
    const wounded = validTargets.filter(t =>
      (t.buildingHP / t.maxBuildingHP < 0.3) ||
      (t.totalPopulation < FACTION_CONFIGS[t.type].startingPopulation * 0.5)
    );

    if (wounded.length > 0) {
      // Target the strongest wounded opponent
      return wounded.reduce((best, current) =>
        current.totalPopulation > best.totalPopulation ? current : best
      );
    }

    // Otherwise target strongest by total power (population + building HP)
    return validTargets.reduce((strongest, current) => {
      const currentPower = current.totalPopulation + current.buildingHP;
      const strongestPower = strongest.totalPopulation + strongest.buildingHP;
      return currentPower > strongestPower ? current : strongest;
    });
  }

  private selectDefensiveTarget(faction: Faction, validTargets: Faction[]): Faction {
    // Prioritize targets with ready attacks (they're threats)
    const threatsWithAttacks = validTargets.filter(t =>
      t.organizations.some(org => org.attachedAction)
    );

    if (threatsWithAttacks.length > 0) {
      // Attack the weakest threat to eliminate them quickly
      return threatsWithAttacks.reduce((weakest, current) =>
        (current.buildingHP + current.totalPopulation * 0.3) <
        (weakest.buildingHP + weakest.totalPopulation * 0.3) ? current : weakest
      );
    }

    // Otherwise target weakest by population (easiest to eliminate)
    return validTargets.reduce((weakest, current) =>
      current.totalPopulation < weakest.totalPopulation ? current : weakest
    );
  }

  private selectPropagandaTarget(faction: Faction, validTargets: Faction[]): Faction {
    // Target high population, but avoid those with many organizations (military strength)
    const scored = validTargets.map(t => ({
      target: t,
      score: t.totalPopulation - (t.organizations.length * 200)
    }));

    return scored.reduce((best, current) =>
      current.score > best.score ? current : best
    ).target;
  }

  private selectBalancedTarget(faction: Faction, validTargets: Faction[]): Faction {
    // Consider multiple factors: population, building HP, threats, opportunities
    const scored = validTargets.map(t => {
      let score = 0;

      // Factor 1: Finishing potential (high score for near-death targets)
      const hpPercent = t.buildingHP / t.maxBuildingHP;
      if (hpPercent < 0.3) score += 100;
      else if (hpPercent < 0.5) score += 50;

      // Factor 2: Population value (more pop = better steal target)
      score += t.totalPopulation * 0.05;

      // Factor 3: Threat level (ready attacks are dangerous)
      if (t.organizations.some(org => org.attachedAction)) score += 50;

      // Factor 4: Avoid strongest (they can retaliate harder)
      const power = t.totalPopulation + t.buildingHP;
      const avgPower = validTargets.reduce((sum, vt) =>
        sum + vt.totalPopulation + vt.buildingHP, 0
      ) / validTargets.length;
      if (power > avgPower * 1.5) score -= 80; // Penalize strongest

      return { target: t, score };
    });

    return scored.reduce((best, current) =>
      current.score > best.score ? current : best
    ).target;
  }

  shouldPlayDefenseCard(faction: Faction, state: GameState, attack: PendingAttack): DefenseDecision {
    // Get applicable defense cards
    const applicableCards = faction.hand.filter(card => {
      if (card.type !== CardType.DEFENSE) return false;
      const defenseCard = card as any;
      return defenseCard.blocksType === attack.attackType;
    });

    if (applicableCards.length === 0) {
      return { shouldPlay: false };
    }

    // Determine current health status
    const currentHP = attack.targetType === 'BUILDING' ? faction.buildingHP : faction.totalPopulation;
    const maxHP = attack.targetType === 'BUILDING' ? faction.maxBuildingHP :
      (FACTION_CONFIGS[faction.type]?.startingPopulation || 100);
    const healthPercent = maxHP > 0 ? currentHP / maxHP : 0;

    // Check if attack would be lethal
    const isLethal = attack.damage >= currentHP;

    // Damage thresholds for decision making
    const trivialDamage = attack.damage < 10;
    const moderateDamage = attack.damage >= 10 && attack.damage < 30;
    const heavyDamage = attack.damage >= 30;

    // Decision logic:
    // 1. Always play on lethal damage
    if (isLethal) {
      return this.selectBestDefenseCard(applicableCards, attack, true);
    }

    // 2. Never play on trivial damage
    if (trivialDamage) {
      return { shouldPlay: false };
    }

    // 3. Play on moderate damage if health is low (< 50%)
    if (moderateDamage && healthPercent < 0.5) {
      return this.selectBestDefenseCard(applicableCards, attack, false);
    }

    // 4. Play on heavy damage if health is not full (< 80%)
    if (heavyDamage && healthPercent < 0.8) {
      return this.selectBestDefenseCard(applicableCards, attack, false);
    }

    // Otherwise, save the defense card
    return { shouldPlay: false };
  }

  private selectBestDefenseCard(cards: GameCard[], attack: PendingAttack, isLethal: boolean): DefenseDecision {
    // Separate cards by type
    const fullBlockCards = cards.filter((c: any) => c.fullBlock);
    const reductionCards = cards.filter((c: any) => c.damageReduction !== undefined);

    // On lethal damage, prefer full block cards
    if (isLethal && fullBlockCards.length > 0) {
      return { shouldPlay: true, cardId: fullBlockCards[0].id };
    }

    // For survivable damage, prefer damage reduction (save full blocks for later)
    if (!isLethal && reductionCards.length > 0) {
      return { shouldPlay: true, cardId: reductionCards[0].id };
    }

    // Fallback: use any applicable card
    if (cards.length > 0) {
      return { shouldPlay: true, cardId: cards[0].id };
    }

    return { shouldPlay: false };
  }
}
