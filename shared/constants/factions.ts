import { FactionConfig, FactionType, AIStrategy } from '../types/index';

export const FACTION_CONFIGS: Record<FactionType, FactionConfig> = {
  [FactionType.MAFA]: {
    type: FactionType.MAFA,
    name: 'MAFA',
    displayName: 'Make America Fun Again',
    building: {
      name: 'The Golden Tower',
      description: 'Gaudy skyscraper with gold trim',
      maxHP: 100
    },
    personality: ['Aggressive', 'Bombastic', 'Predictable'],
    specialAbility: {
      name: 'Rally Call',
      description: 'Double propaganda effectiveness once per game',
      effect: 'DOUBLE_PROPAGANDA'
    },
    startingGPUs: 50,
    aiStrategy: AIStrategy.AGGRESSIVE,
    color: '#FF4444'
  },
  [FactionType.BLAM]: {
    type: FactionType.BLAM,
    name: 'BLAM',
    displayName: 'Big Loud Activist Movement',
    building: {
      name: 'The Community Center',
      description: 'Grassroots hub with murals',
      maxHP: 80
    },
    personality: ['Collective', 'Multi-target', 'Collaborative'],
    specialAbility: {
      name: 'Mass Mobilization',
      description: 'Launch two protests in one turn',
      effect: 'DOUBLE_PROTEST'
    },
    startingGPUs: 55,
    aiStrategy: AIStrategy.BALANCED,
    color: '#FF8800'
  },
  [FactionType.AUNTY_FAFA]: {
    type: FactionType.AUNTY_FAFA,
    name: 'Aunty Fafa',
    displayName: 'Aunty Fafa',
    building: {
      name: 'The Collective',
      description: 'Underground bunker/safehouse',
      maxHP: 120
    },
    personality: ['Chaotic', 'Unpredictable', 'High-risk'],
    specialAbility: {
      name: 'Black Bloc',
      description: 'Throwing attacks do +50% damage, riots never damage own population',
      effect: 'BOOST_THROWING'
    },
    startingGPUs: 45,
    aiStrategy: AIStrategy.CHAOS,
    color: '#000000'
  },
  [FactionType.PROUD_GALS]: {
    type: FactionType.PROUD_GALS,
    name: 'Proud Gals',
    displayName: 'Proud Gals',
    building: {
      name: 'The Clubhouse',
      description: 'Fortified lodge with perimeter',
      maxHP: 110
    },
    personality: ['Defensive', 'Patient', 'Strategic'],
    specialAbility: {
      name: 'Stand Back Stand By',
      description: 'Building takes 50% less damage',
      effect: 'REDUCE_BUILDING_DAMAGE'
    },
    startingGPUs: 48,
    aiStrategy: AIStrategy.DEFENSIVE,
    color: '#FFD700'
  },
  [FactionType.LMNOP]: {
    type: FactionType.LMNOP,
    name: 'LMNOP',
    displayName: 'Alphabet Gang',
    building: {
      name: 'Rainbow HQ',
      description: 'Colorful headquarters with flags',
      maxHP: 90
    },
    personality: ['Diplomatic', 'Persuasive', 'Strategic'],
    specialAbility: {
      name: 'Pride Parade',
      description: 'Propaganda steals +10 million extra, can convert defenders during invasion',
      effect: 'BOOST_PROPAGANDA'
    },
    startingGPUs: 52,
    aiStrategy: AIStrategy.PROPAGANDA,
    color: '#9B59B6'
  }
};
