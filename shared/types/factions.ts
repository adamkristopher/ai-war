import { FactionType } from './game';

export enum AIStrategy {
  AGGRESSIVE = 'AGGRESSIVE',
  DEFENSIVE = 'DEFENSIVE',
  BALANCED = 'BALANCED',
  CHAOS = 'CHAOS',
  PROPAGANDA = 'PROPAGANDA'
}

export interface BuildingConfig {
  name: string;
  description: string;
  maxHP: number;
}

export interface SpecialAbility {
  name: string;
  description: string;
  effect: string;
}

export interface FactionConfig {
  type: FactionType;
  name: string;
  displayName: string;
  building: BuildingConfig;
  personality: string[];
  specialAbility: SpecialAbility;
  startingGPUs: number;
  aiStrategy: AIStrategy;
  color: string;
}
