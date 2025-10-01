export enum CardType {
  COVERT_OP = 'COVERT_OP',
  PROPAGANDA = 'PROPAGANDA',
  ORGANIZATION = 'ORGANIZATION',
  ACTION_PLAN = 'ACTION_PLAN',
  DEFENSE = 'DEFENSE'
}

export enum ActionType {
  PROTEST = 'PROTEST',
  PRAYER = 'PRAYER',
  THROWING = 'THROWING',
  INVASION = 'INVASION'
}

export interface BaseCard {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
}

export interface CovertOpCard extends BaseCard {
  type: CardType.COVERT_OP;
  effect: CovertOpEffect;
}

export interface PropagandaCard extends BaseCard {
  type: CardType.PROPAGANDA;
  stealAmount: number;
  backfireChance?: number; // 0-1 probability
  targetAll?: boolean; // If true, steals from all opponents
}

export interface OrganizationCard extends BaseCard {
  type: CardType.ORGANIZATION;
  actionType: ActionType;
  attachedAction?: ActionPlanCard; // Action plan attached to this organization
}

export interface ActionPlanCard extends BaseCard {
  type: CardType.ACTION_PLAN;
  actionType: ActionType;
  damage?: number;
  targetType: 'GPUS' | 'BUILDING' | 'BOTH';
  specialEffect?: string;
  backfireChance?: number; // Some actions (like Molotovs) can backfire
  backfireDamage?: number;
}

export interface DefenseCard extends BaseCard {
  type: CardType.DEFENSE;
  blocksType: ActionType | CardType; // What type of action/card this defends against
  damageReduction?: number; // Amount of damage reduced (if not full block)
  fullBlock?: boolean; // If true, completely negates the attack
}

export type GameCard = CovertOpCard | PropagandaCard | OrganizationCard | ActionPlanCard | DefenseCard;

// Covert Op effect types
export type CovertOpEffect =
  | { type: 'DAMAGE_GPUS'; amount: number }
  | { type: 'DAMAGE_BUILDING'; amount: number }
  | { type: 'STEAL_GPUS'; amount: number }
  | { type: 'SKIP_TURN' }
  | { type: 'REDIRECT_ATTACK' }
  | { type: 'CANCEL_PROPAGANDA' }
  | { type: 'GAIN_GPUS'; amount: number }
  | { type: 'SABOTAGE_BUILDING'; amount: number };
