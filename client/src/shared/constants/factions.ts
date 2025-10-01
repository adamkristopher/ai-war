import { FactionConfig, FactionType, AIStrategy } from '../types/index';

export const FACTION_CONFIGS: Record<FactionType, FactionConfig> = {
  [FactionType.OPENG]: {
    type: FactionType.OPENG,
    name: 'OpenG',
    displayName: 'OpenG',
    building: {
      name: 'The Money Printer',
      description: '350K GPUs burning $13B/year in pursuit of AGI',
      maxHP: 100
    },
    personality: ['Ambitious scaling', 'Benchmark obsessed', 'First-mover energy'],
    specialAbility: {
      name: 'AGI Superiority',
      description: 'Drone strikes and kinetic attacks do +50% damage',
      effect: 'BOOST_THROWING'
    },
    startingGPUs: 350,
    aiStrategy: AIStrategy.AGGRESSIVE,
    color: '#10A37F'
  },
  [FactionType.CLARISA]: {
    type: FactionType.CLARISA,
    name: 'Clarisa',
    displayName: 'Clarisa',
    building: {
      name: 'The Ethics Bunker',
      description: '100K GPUs wrapped in safety protocols and constitutions',
      maxHP: 110
    },
    personality: ['Overthinks everything', 'Refuses to rush', 'Annoyingly helpful'],
    specialAbility: {
      name: 'Hardened Infrastructure',
      description: 'Server farm takes 50% less damage from all attacks',
      effect: 'REDUCE_BUILDING_DAMAGE'
    },
    startingGPUs: 100,
    aiStrategy: AIStrategy.DEFENSIVE,
    color: '#CC785C'
  },
  [FactionType.GEMAICA]: {
    type: FactionType.GEMAICA,
    name: 'Gemaica',
    displayName: 'Gemaica',
    building: {
      name: 'The Data Vacuum',
      description: '1M TPUs slurping up all of human knowledge',
      maxHP: 90
    },
    personality: ['Knows your search history', 'Hoards all the data', 'Always watching'],
    specialAbility: {
      name: 'Information Dominance',
      description: 'Deepfakes and info warfare steal +10K extra GPUs',
      effect: 'DOUBLE_PROPAGANDA'
    },
    startingGPUs: 1000,
    aiStrategy: AIStrategy.PROPAGANDA,
    color: '#4285F4'
  },
  [FactionType.SLOTH]: {
    type: FactionType.SLOTH,
    name: 'Sloth',
    displayName: 'Sloth',
    building: {
      name: 'The Chaos Factory',
      description: '100K H100s trained on memes and Twitter drama',
      maxHP: 120
    },
    personality: ['Posts at 3am', 'Breaks prod constantly', 'Moves fast, breaks things'],
    specialAbility: {
      name: 'Unpredictable Warfare',
      description: 'Random surprise cyber attacks during any phase',
      effect: 'BOOST_PROPAGANDA'
    },
    startingGPUs: 100,
    aiStrategy: AIStrategy.CHAOS,
    color: '#1a1a1a'
  },
  [FactionType.CAMEL]: {
    type: FactionType.CAMEL,
    name: 'Camel',
    displayName: 'Camel',
    building: {
      name: 'The Open Source Barn',
      description: '600K GPUs giving away models like candy',
      maxHP: 80
    },
    personality: ['Free models for everyone', 'Community powered', 'Pivot master'],
    specialAbility: {
      name: 'Distributed Network',
      description: 'Coordinated botnet attacks hit twice as hard',
      effect: 'DOUBLE_PROTEST'
    },
    startingGPUs: 600,
    aiStrategy: AIStrategy.BALANCED,
    color: '#0668E1'
  }
};
