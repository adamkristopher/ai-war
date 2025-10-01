import {
  GameCard,
  CovertOpCard,
  PropagandaCard,
  OrganizationCard,
  ActionPlanCard,
  DefenseCard,
  GPUCard
} from '../shared/types/index';
import {
  COVERT_OPS,
  COVERT_OP_COUNTS,
  PROPAGANDA,
  PROPAGANDA_COUNTS,
  ORGANIZATIONS,
  ORGANIZATION_COUNTS,
  ACTION_PLANS,
  ACTION_PLAN_COUNTS,
  DEFENSES,
  DEFENSE_COUNTS,
  GPU_CARD_VALUES
} from '../shared/constants/index';

let cardIdCounter = 0;

function generateId(): string {
  return `card-${Date.now()}-${cardIdCounter++}`;
}

export function createDeck(): GameCard[] {
  const deck: GameCard[] = [];

  // Add covert ops
  COVERT_OPS.forEach((template) => {
    const count = COVERT_OP_COUNTS[template.name] || 1;
    for (let i = 0; i < count; i++) {
      deck.push({ ...template, id: generateId() } as CovertOpCard);
    }
  });

  // Add propaganda
  PROPAGANDA.forEach((template) => {
    const count = PROPAGANDA_COUNTS[template.name] || 1;
    for (let i = 0; i < count; i++) {
      deck.push({ ...template, id: generateId() } as PropagandaCard);
    }
  });

  // Add organizations
  ORGANIZATIONS.forEach((template) => {
    const count = ORGANIZATION_COUNTS[template.name] || 1;
    for (let i = 0; i < count; i++) {
      deck.push({ ...template, id: generateId() } as OrganizationCard);
    }
  });

  // Add action plans
  ACTION_PLANS.forEach((template) => {
    const count = ACTION_PLAN_COUNTS[template.name] || 1;
    for (let i = 0; i < count; i++) {
      deck.push({ ...template, id: generateId() } as ActionPlanCard);
    }
  });

  // Add defenses
  DEFENSES.forEach((template) => {
    const count = DEFENSE_COUNTS[template.name] || 1;
    for (let i = 0; i < count; i++) {
      deck.push({ ...template, id: generateId() } as DefenseCard);
    }
  });

  return shuffleDeck(deck);
}

export function shuffleDeck<T>(deck: T[]): T[] {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function dealCards<T>(deck: T[], count: number): T[] {
  return deck.splice(0, count);
}

export function createGPUCards(totalValue: number): GPUCard[] {
  const cards: GPUCard[] = [];
  let remaining = totalValue;
  const values = [25, 15, 10, 5, 1]; // GPU denominations in thousands

  for (const value of values) {
    while (remaining >= value) {
      cards.push({
        id: `gpu-${Date.now()}-${Math.random()}`,
        value
      });
      remaining -= value;
    }
  }

  return cards;
}
