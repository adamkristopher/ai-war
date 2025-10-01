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
    name: 'Zero-Day Exploit',
    description: 'Target loses 15K GPUs to emergency shutdown',
    effect: { type: 'DAMAGE_POPULATION', amount: 15 }
  },
  {
    type: CardType.COVERT_OP,
    name: 'Model Theft',
    description: 'Steal 10K GPUs worth of compute (works during conflict)',
    effect: { type: 'STEAL_POPULATION', amount: 10 }
  },
  {
    type: CardType.COVERT_OP,
    name: 'Cooling System Sabotage',
    description: 'Deal 20 damage to target server farm',
    effect: { type: 'DAMAGE_BUILDING', amount: 20 }
  },
  {
    type: CardType.COVERT_OP,
    name: 'DDoS Attack',
    description: 'Force target to skip next turn',
    effect: { type: 'SKIP_TURN' }
  },
  {
    type: CardType.COVERT_OP,
    name: 'Adversarial Attack',
    description: 'Redirect enemy\'s next attack to different target',
    effect: { type: 'REDIRECT_ATTACK' }
  },
  {
    type: CardType.COVERT_OP,
    name: 'Internet Blackout',
    description: 'Cancel all information campaigns next round',
    effect: { type: 'CANCEL_PROPAGANDA' }
  },
  {
    type: CardType.COVERT_OP,
    name: 'GPU Heist',
    description: 'Gain 10K GPUs instantly',
    effect: { type: 'GAIN_POPULATION', amount: 10 }
  },
  {
    type: CardType.COVERT_OP,
    name: 'Power Grid Attack',
    description: 'Deal 15 damage to target server farm',
    effect: { type: 'SABOTAGE_BUILDING', amount: 15 }
  },
];

export const COVERT_OP_COUNTS: Record<string, number> = {
  'Zero-Day Exploit': 3,
  'Model Theft': 2,
  'Cooling System Sabotage': 2,
  'DDoS Attack': 2,
  'Adversarial Attack': 2,
  'Internet Blackout': 2,
  'GPU Heist': 3,
  'Power Grid Attack': 4
};

// Information Warfare Cards (15 cards total)
export const PROPAGANDA: Omit<PropagandaCard, 'id'>[] = [
  {
    type: CardType.PROPAGANDA,
    name: 'Deepfake Campaign',
    description: 'Steal 10K GPUs from target',
    stealAmount: 10
  },
  {
    type: CardType.PROPAGANDA,
    name: 'Bot Network Swarm',
    description: 'Steal 8K GPUs, target of your choice',
    stealAmount: 8
  },
  {
    type: CardType.PROPAGANDA,
    name: 'Synthetic Media Flood',
    description: 'Steal 15K but roll die - on 1-2 backfires',
    stealAmount: 15,
    backfireChance: 0.33
  },
  {
    type: CardType.PROPAGANDA,
    name: 'Global Disinformation',
    description: 'Steal 5K from ALL enemies',
    stealAmount: 5,
    targetAll: true
  },
  {
    type: CardType.PROPAGANDA,
    name: 'Personalized Manipulation',
    description: 'Steal 12K GPUs, slow but reliable',
    stealAmount: 12
  },
];

export const PROPAGANDA_COUNTS: Record<string, number> = {
  'Deepfake Campaign': 4,
  'Bot Network Swarm': 3,
  'Synthetic Media Flood': 2,
  'Global Disinformation': 3,
  'Personalized Manipulation': 3
};

// Organizations (20 cards total)
export const ORGANIZATIONS: Omit<OrganizationCard, 'id'>[] = [
  {
    type: CardType.ORGANIZATION,
    name: 'Botnet Army',
    description: 'Can launch coordinated cyber attacks',
    actionType: ActionType.PROTEST
  },
  {
    type: CardType.ORGANIZATION,
    name: 'Defensive AI',
    description: 'Can repair and fortify infrastructure',
    actionType: ActionType.PRAYER
  },
  {
    type: CardType.ORGANIZATION,
    name: 'Drone Swarm',
    description: 'Can conduct kinetic strikes on server farms',
    actionType: ActionType.THROWING
  },
  {
    type: CardType.ORGANIZATION,
    name: 'Autonomous Legion',
    description: 'Can capture and occupy enemy facilities',
    actionType: ActionType.INVASION
  },
];

export const ORGANIZATION_COUNTS: Record<string, number> = {
  'Botnet Army': 6,
  'Defensive AI': 4,
  'Drone Swarm': 7,
  'Autonomous Legion': 3
};

// Action Plans (30 cards total)
export const ACTION_PLANS: Omit<ActionPlanCard, 'id'>[] = [
  // Botnet actions
  {
    type: CardType.ACTION_PLAN,
    name: 'Ransomware',
    description: '10K GPU disruption',
    actionType: ActionType.PROTEST,
    damage: 10,
    targetType: 'POPULATION'
  },
  {
    type: CardType.ACTION_PLAN,
    name: 'Logic Bomb',
    description: '20 damage to server farm',
    actionType: ActionType.PROTEST,
    damage: 20,
    targetType: 'BUILDING'
  },
  {
    type: CardType.ACTION_PLAN,
    name: 'Worm Outbreak',
    description: '40 damage to server farm, lose 5K own GPUs',
    actionType: ActionType.PROTEST,
    damage: 40,
    targetType: 'BUILDING',
    specialEffect: 'SELF_DAMAGE_5'
  },
  {
    type: CardType.ACTION_PLAN,
    name: 'System Lockdown',
    description: 'Freeze systems, prevent actions for 1 turn',
    actionType: ActionType.PROTEST,
    damage: 0,
    targetType: 'BUILDING',
    specialEffect: 'DISABLE_1_TURN'
  },
  // Defensive AI actions
  {
    type: CardType.ACTION_PLAN,
    name: 'Auto-Repair',
    description: 'Heal 20 server farm HP',
    actionType: ActionType.PRAYER,
    damage: -20, // Negative = healing
    targetType: 'BUILDING'
  },
  {
    type: CardType.ACTION_PLAN,
    name: 'Firewall Upgrade',
    description: '+25% defense next turn',
    actionType: ActionType.PRAYER,
    damage: 0,
    targetType: 'BUILDING',
    specialEffect: 'DEFENSE_BOOST_25'
  },
  {
    type: CardType.ACTION_PLAN,
    name: 'AI Poisoning',
    description: 'Enemy\'s next attack deals 50% damage',
    actionType: ActionType.PRAYER,
    damage: 0,
    targetType: 'BUILDING',
    specialEffect: 'CURSE_ATTACK_50'
  },
  // Drone strike actions
  {
    type: CardType.ACTION_PLAN,
    name: 'Recon Drones',
    description: '10 server farm damage, minimal risk',
    actionType: ActionType.THROWING,
    damage: 10,
    targetType: 'BUILDING'
  },
  {
    type: CardType.ACTION_PLAN,
    name: 'EMP Strike',
    description: '15 server farm damage',
    actionType: ActionType.THROWING,
    damage: 15,
    targetType: 'BUILDING'
  },
  {
    type: CardType.ACTION_PLAN,
    name: 'Missile Barrage',
    description: '30 server farm damage',
    actionType: ActionType.THROWING,
    damage: 30,
    targetType: 'BUILDING'
  },
  {
    type: CardType.ACTION_PLAN,
    name: 'Thermobaric Bomb',
    description: '50 server farm damage, 10% chance backfire (25 self-damage)',
    actionType: ActionType.THROWING,
    damage: 50,
    targetType: 'BUILDING',
    backfireChance: 0.1,
    backfireDamage: 25
  },
  // Invasion actions
  {
    type: CardType.ACTION_PLAN,
    name: 'Server Farm Raid',
    description: '20 server farm damage, attempt capture if below 30 HP',
    actionType: ActionType.INVASION,
    damage: 20,
    targetType: 'BUILDING',
    specialEffect: 'CAPTURE_BELOW_30'
  },
  {
    type: CardType.ACTION_PLAN,
    name: 'Blockade',
    description: '25 server farm damage, prevent operations for 1 turn',
    actionType: ActionType.INVASION,
    damage: 25,
    targetType: 'BUILDING',
    specialEffect: 'DISABLE_1_TURN'
  },
  {
    type: CardType.ACTION_PLAN,
    name: 'Hostile Takeover',
    description: 'If server farm below 20 HP, capture it immediately',
    actionType: ActionType.INVASION,
    damage: 0,
    targetType: 'BUILDING',
    specialEffect: 'CAPTURE_BELOW_20'
  },
];

export const ACTION_PLAN_COUNTS: Record<string, number> = {
  'Ransomware': 4,
  'Logic Bomb': 3,
  'Worm Outbreak': 2,
  'System Lockdown': 2,
  'Auto-Repair': 3,
  'Firewall Upgrade': 2,
  'AI Poisoning': 2,
  'Recon Drones': 3,
  'EMP Strike': 3,
  'Missile Barrage': 3,
  'Thermobaric Bomb': 2,
  'Server Farm Raid': 2,
  'Blockade': 2,
  'Hostile Takeover': 1
};

// Defense Cards (15 cards total)
export const DEFENSES: Omit<DefenseCard, 'id'>[] = [
  {
    type: CardType.DEFENSE,
    name: 'Anti-Drone System',
    description: 'Block one kinetic strike',
    blocksType: ActionType.THROWING,
    fullBlock: true
  },
  {
    type: CardType.DEFENSE,
    name: 'Intrusion Detection',
    description: 'Block one cyber attack',
    blocksType: ActionType.PROTEST,
    fullBlock: true
  },
  {
    type: CardType.DEFENSE,
    name: 'Air-Gapped Network',
    description: 'Cancel one covert op targeting you',
    blocksType: CardType.COVERT_OP,
    fullBlock: true
  },
  {
    type: CardType.DEFENSE,
    name: 'Redundant Systems',
    description: 'Reduce GPU damage by 50%',
    blocksType: ActionType.THROWING,
    damageReduction: 0.5
  },
  {
    type: CardType.DEFENSE,
    name: 'Hardened Bunker',
    description: 'Reduce server farm damage by 25 points',
    blocksType: ActionType.INVASION,
    damageReduction: 25
  },
  {
    type: CardType.DEFENSE,
    name: 'Counter-Intelligence',
    description: 'Turn information warfare against attacker',
    blocksType: CardType.PROPAGANDA,
    fullBlock: true,
    specialEffect: 'REFLECT'
  },
];

export const DEFENSE_COUNTS: Record<string, number> = {
  'Anti-Drone System': 3,
  'Intrusion Detection': 3,
  'Air-Gapped Network': 3,
  'Redundant Systems': 2,
  'Hardened Bunker': 2,
  'Counter-Intelligence': 2
};

// Population card distribution
export const POPULATION_CARD_VALUES = [
  { value: 1, count: 10 },
  { value: 5, count: 8 },
  { value: 10, count: 6 },
  { value: 15, count: 4 },
  { value: 25, count: 2 }
];
