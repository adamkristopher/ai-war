export enum GamePhase {
  SETUP = 'SETUP',
  PEACETIME = 'PEACETIME',
  CONFLICT = 'CONFLICT',
  FINAL_RETALIATION = 'FINAL_RETALIATION',
  ENDED = 'ENDED'
}

export enum FactionType {
  OPENG = 'OPENG',
  CLARISA = 'CLARISA',
  GEMAICA = 'GEMAICA',
  SLOTH = 'SLOTH',
  CAMEL = 'CAMEL'
}

export interface GPUCard {
  id: string;
  value: number; // 1K, 5K, 10K, 15K, or 25K GPUs
}

export interface Faction {
  id: string;
  type: FactionType;
  name: string;
  isAI: boolean;
  gpus: GPUCard[];
  totalGPUs: number;
  buildingHP: number;
  maxBuildingHP: number;
  hand: GameCard[];
  queue: GameCard[]; // 3 face-down cards (FIFO)
  organizations: OrganizationCard[];
  specialAbilityUsed: boolean;
  isEliminated: boolean;
  capturedBuildings: string[]; // IDs of captured buildings
}

export interface PendingAttack {
  attackerId: string;
  defenderId: string;
  organizationId: string;
  attackType: ActionType | CardType; // Type of attack (THROWING, PROTEST, etc. or COVERT_OP, PROPAGANDA)
  damage: number;
  targetType: 'BUILDING' | 'GPUS';
}

export interface PendingTargetSelection {
  playerId: string;
  cardId: string;
  cardType: CardType;
  validTargetIds: string[];
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
  pendingAttack: PendingAttack | null; // Attack waiting for defense response
  pendingTargetSelection: PendingTargetSelection | null; // Card waiting for player to choose target
}

export interface GameEvent {
  id: string;
  timestamp: number;
  type: 'INFO' | 'WARNING' | 'ATTACK' | 'ELIMINATION';
  message: string;
  factionId?: string;
}

// Import types from cards.ts
import type { GameCard, OrganizationCard, ActionType, CardType } from './cards';
