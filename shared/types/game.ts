export enum GamePhase {
  SETUP = 'SETUP',
  PEACETIME = 'PEACETIME',
  CONFLICT = 'CONFLICT',
  FINAL_RETALIATION = 'FINAL_RETALIATION',
  ENDED = 'ENDED'
}

export enum FactionType {
  MAFA = 'MAFA',
  BLAM = 'BLAM',
  AUNTY_FAFA = 'AUNTY_FAFA',
  PROUD_GALS = 'PROUD_GALS',
  LMNOP = 'LMNOP'
}

export interface PopulationCard {
  id: string;
  value: number; // 1, 5, 10, 15, or 25 million
}

export interface Faction {
  id: string;
  type: FactionType;
  name: string;
  isAI: boolean;
  population: PopulationCard[];
  totalPopulation: number;
  buildingHP: number;
  maxBuildingHP: number;
  hand: GameCard[];
  queue: GameCard[]; // 3 face-down cards (FIFO)
  organizations: OrganizationCard[];
  specialAbilityUsed: boolean;
  isEliminated: boolean;
  capturedBuildings: string[]; // IDs of captured buildings
}

export interface GameState {
  id: string;
  phase: GamePhase;
  round: number;
  currentPlayerIndex: number;
  factions: Faction[];
  deck: GameCard[];
  discardPile: GameCard[];
  eventLog: GameEvent[];
  winner: string | null;
}

export interface GameEvent {
  id: string;
  timestamp: number;
  type: 'INFO' | 'WARNING' | 'ATTACK' | 'ELIMINATION';
  message: string;
  factionId?: string;
}

// Import types from cards.ts
import type { GameCard, OrganizationCard } from './cards';
