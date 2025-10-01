import {
  CovertOpCard,
  PropagandaCard,
  OrganizationCard,
  ActionPlanCard,
  DefenseCard,
  CardType,
  ActionType
} from '../types/index';

// Covert Ops (20 cards total)
export const COVERT_OPS: Omit<CovertOpCard, 'id'>[] = [
  {
    type: CardType.COVERT_OP,
    name: 'Scandal Leak',
    description: 'Target loses 15M population',
    effect: { type: 'DAMAGE_POPULATION', amount: 15 }
  },
  {
    type: CardType.COVERT_OP,
    name: 'Infiltrator',
    description: 'Steal 10M population (works during conflict)',
    effect: { type: 'STEAL_POPULATION', amount: 10 }
  },
  {
    type: CardType.COVERT_OP,
    name: 'Inside Job',
    description: 'Deal 20 damage to target building',
    effect: { type: 'DAMAGE_BUILDING', amount: 20 }
  },
  {
    type: CardType.COVERT_OP,
    name: 'Blackmail',
    description: 'Force target to skip next turn',
    effect: { type: 'SKIP_TURN' }
  },
  {
    type: CardType.COVERT_OP,
    name: 'Double Agent',
    description: 'Redirect enemy\'s next attack to different target',
    effect: { type: 'REDIRECT_ATTACK' }
  },
  {
    type: CardType.COVERT_OP,
    name: 'Media Blackout',
    description: 'Cancel all propaganda next round',
    effect: { type: 'CANCEL_PROPAGANDA' }
  },
  {
    type: CardType.COVERT_OP,
    name: 'Viral Moment',
    description: 'Gain 10M population instantly',
    effect: { type: 'GAIN_POPULATION', amount: 10 }
  },
  {
    type: CardType.COVERT_OP,
    name: 'Sabotage',
    description: 'Deal 15 damage to target building',
    effect: { type: 'SABOTAGE_BUILDING', amount: 15 }
  },
];

export const COVERT_OP_COUNTS: Record<string, number> = {
  'Scandal Leak': 3,
  'Infiltrator': 2,
  'Inside Job': 2,
  'Blackmail': 2,
  'Double Agent': 2,
  'Media Blackout': 2,
  'Viral Moment': 3,
  'Sabotage': 4
};

// Propaganda Cards (15 cards total)
export const PROPAGANDA: Omit<PropagandaCard, 'id'>[] = [
  {
    type: CardType.PROPAGANDA,
    name: 'Social Media Blitz',
    description: 'Steal 10M population from target',
    stealAmount: 10
  },
  {
    type: CardType.PROPAGANDA,
    name: 'Meme Warfare',
    description: 'Steal 8M population, target of your choice',
    stealAmount: 8
  },
  {
    type: CardType.PROPAGANDA,
    name: 'Fake News',
    description: 'Steal 15M but roll die - on 1-2 backfires',
    stealAmount: 15,
    backfireChance: 0.33
  },
  {
    type: CardType.PROPAGANDA,
    name: 'Radio Campaign',
    description: 'Steal 5M from ALL enemies',
    stealAmount: 5,
    targetAll: true
  },
  {
    type: CardType.PROPAGANDA,
    name: 'Door-to-Door',
    description: 'Steal 12M population, slow but reliable',
    stealAmount: 12
  },
];

export const PROPAGANDA_COUNTS: Record<string, number> = {
  'Social Media Blitz': 4,
  'Meme Warfare': 3,
  'Fake News': 2,
  'Radio Campaign': 3,
  'Door-to-Door': 3
};

// Organizations (20 cards total)
export const ORGANIZATIONS: Omit<OrganizationCard, 'id'>[] = [
  {
    type: CardType.ORGANIZATION,
    name: 'Protest Group',
    description: 'Can organize protests and rallies',
    actionType: ActionType.PROTEST
  },
  {
    type: CardType.ORGANIZATION,
    name: 'Prayer Circle',
    description: 'Can perform prayers and blessings',
    actionType: ActionType.PRAYER
  },
  {
    type: CardType.ORGANIZATION,
    name: 'Strike Team',
    description: 'Can throw objects and conduct raids',
    actionType: ActionType.THROWING
  },
  {
    type: CardType.ORGANIZATION,
    name: 'Invasion Force',
    description: 'Can invade and capture buildings',
    actionType: ActionType.INVASION
  },
];

export const ORGANIZATION_COUNTS: Record<string, number> = {
  'Protest Group': 6,
  'Prayer Circle': 4,
  'Strike Team': 7,
  'Invasion Force': 3
};

// Action Plans (30 cards total)
export const ACTION_PLANS: Omit<ActionPlanCard, 'id'>[] = [
  // Protest actions
  {
    type: CardType.ACTION_PLAN,
    name: 'Peaceful March',
    description: '10 damage to population',
    actionType: ActionType.PROTEST,
    damage: 10,
    targetType: 'POPULATION'
  },
  {
    type: CardType.ACTION_PLAN,
    name: 'Disruptive Protest',
    description: '20 damage to building',
    actionType: ActionType.PROTEST,
    damage: 20,
    targetType: 'BUILDING'
  },
  {
    type: CardType.ACTION_PLAN,
    name: 'Riot',
    description: '40 damage to building, lose 5M own population',
    actionType: ActionType.PROTEST,
    damage: 40,
    targetType: 'BUILDING',
    specialEffect: 'SELF_DAMAGE_5'
  },
  {
    type: CardType.ACTION_PLAN,
    name: 'Sit-In',
    description: 'Occupy building, prevent actions for 1 turn',
    actionType: ActionType.PROTEST,
    damage: 0,
    targetType: 'BUILDING',
    specialEffect: 'DISABLE_1_TURN'
  },
  // Prayer actions
  {
    type: CardType.ACTION_PLAN,
    name: 'Prayer Healing',
    description: 'Heal 20 building HP',
    actionType: ActionType.PRAYER,
    damage: -20, // Negative = healing
    targetType: 'BUILDING'
  },
  {
    type: CardType.ACTION_PLAN,
    name: 'Blessing',
    description: '+25% defense next turn',
    actionType: ActionType.PRAYER,
    damage: 0,
    targetType: 'BUILDING',
    specialEffect: 'DEFENSE_BOOST_25'
  },
  {
    type: CardType.ACTION_PLAN,
    name: 'Curse',
    description: 'Enemy\'s next attack deals 50% damage',
    actionType: ActionType.PRAYER,
    damage: 0,
    targetType: 'BUILDING',
    specialEffect: 'CURSE_ATTACK_50'
  },
  // Throwing actions
  {
    type: CardType.ACTION_PLAN,
    name: 'Eggs',
    description: '10 building damage, embarrassing',
    actionType: ActionType.THROWING,
    damage: 10,
    targetType: 'BUILDING'
  },
  {
    type: CardType.ACTION_PLAN,
    name: 'Paint Bombs',
    description: '15 building damage',
    actionType: ActionType.THROWING,
    damage: 15,
    targetType: 'BUILDING'
  },
  {
    type: CardType.ACTION_PLAN,
    name: 'Bricks',
    description: '30 building damage',
    actionType: ActionType.THROWING,
    damage: 30,
    targetType: 'BUILDING'
  },
  {
    type: CardType.ACTION_PLAN,
    name: 'Molotovs',
    description: '50 building damage, 10% chance backfire (25 self-damage)',
    actionType: ActionType.THROWING,
    damage: 50,
    targetType: 'BUILDING',
    backfireChance: 0.1,
    backfireDamage: 25
  },
  // Invasion actions
  {
    type: CardType.ACTION_PLAN,
    name: 'Raid',
    description: '20 building damage, attempt capture if below 30 HP',
    actionType: ActionType.INVASION,
    damage: 20,
    targetType: 'BUILDING',
    specialEffect: 'CAPTURE_BELOW_30'
  },
  {
    type: CardType.ACTION_PLAN,
    name: 'Siege',
    description: '25 building damage, prevent building use for 1 turn',
    actionType: ActionType.INVASION,
    damage: 25,
    targetType: 'BUILDING',
    specialEffect: 'DISABLE_1_TURN'
  },
  {
    type: CardType.ACTION_PLAN,
    name: 'Takeover',
    description: 'If building below 20 HP, capture it immediately',
    actionType: ActionType.INVASION,
    damage: 0,
    targetType: 'BUILDING',
    specialEffect: 'CAPTURE_BELOW_20'
  },
];

export const ACTION_PLAN_COUNTS: Record<string, number> = {
  'Peaceful March': 4,
  'Disruptive Protest': 3,
  'Riot': 2,
  'Sit-In': 2,
  'Prayer Healing': 3,
  'Blessing': 2,
  'Curse': 2,
  'Eggs': 3,
  'Paint Bombs': 3,
  'Bricks': 3,
  'Molotovs': 2,
  'Raid': 2,
  'Siege': 2,
  'Takeover': 1
};

// Defense Cards (15 cards total)
export const DEFENSES: Omit<DefenseCard, 'id'>[] = [
  {
    type: CardType.DEFENSE,
    name: 'Security Detail',
    description: 'Block one throwing attack',
    blocksType: ActionType.THROWING,
    fullBlock: true
  },
  {
    type: CardType.DEFENSE,
    name: 'Counter-Protesters',
    description: 'Block one protest action',
    blocksType: ActionType.PROTEST,
    fullBlock: true
  },
  {
    type: CardType.DEFENSE,
    name: 'Legal Team',
    description: 'Cancel one covert op targeting you',
    blocksType: CardType.COVERT_OP,
    fullBlock: true
  },
  {
    type: CardType.DEFENSE,
    name: 'Bomb Shelter',
    description: 'Reduce population damage by 50%',
    blocksType: ActionType.THROWING,
    damageReduction: 0.5
  },
  {
    type: CardType.DEFENSE,
    name: 'Fortification',
    description: 'Reduce building damage by 25 points',
    blocksType: ActionType.INVASION,
    damageReduction: 25
  },
  {
    type: CardType.DEFENSE,
    name: 'Media Spin',
    description: 'Turn propaganda attempt against attacker',
    blocksType: CardType.PROPAGANDA,
    fullBlock: true,
    specialEffect: 'REFLECT'
  },
];

export const DEFENSE_COUNTS: Record<string, number> = {
  'Security Detail': 3,
  'Counter-Protesters': 3,
  'Legal Team': 3,
  'Bomb Shelter': 2,
  'Fortification': 2,
  'Media Spin': 2
};

// Population card distribution
export const POPULATION_CARD_VALUES = [
  { value: 1, count: 10 },
  { value: 5, count: 8 },
  { value: 10, count: 6 },
  { value: 15, count: 4 },
  { value: 25, count: 2 }
];
