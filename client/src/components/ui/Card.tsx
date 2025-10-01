import { GameCard, CardType, ActionType } from '../../shared/types/index';

interface CardProps {
  card: GameCard;
  onClick: () => void;
  disabled?: boolean;
}

export function Card({ card, onClick, disabled }: CardProps) {
  const getCardColor = () => {
    switch (card.type) {
      case CardType.COVERT_OP: return 'bg-purple-800 border-purple-500';
      case CardType.PROPAGANDA: return 'bg-blue-800 border-blue-500';
      case CardType.ORGANIZATION: return 'bg-green-800 border-green-500';
      case CardType.ACTION_PLAN: return 'bg-red-800 border-red-500';
      case CardType.DEFENSE: return 'bg-orange-800 border-orange-500';
      default: return 'bg-gray-800 border-gray-500';
    }
  };

  const getCardIcon = () => {
    switch (card.type) {
      case CardType.COVERT_OP: return '🕵️';
      case CardType.PROPAGANDA: return '📢';
      case CardType.ORGANIZATION: return '🏢';
      case CardType.ACTION_PLAN: return '⚔️';
      case CardType.DEFENSE: return '🛡️';
      default: return '❓';
    }
  };

  const getTypeLabel = () => {
    switch (card.type) {
      case CardType.COVERT_OP: return 'COVERT OP';
      case CardType.PROPAGANDA: return 'PROPAGANDA';
      case CardType.ORGANIZATION: return 'ORGANIZATION';
      case CardType.ACTION_PLAN: return 'ACTION PLAN';
      case CardType.DEFENSE: return 'DEFENSE';
      default: return 'UNKNOWN';
    }
  };

  return (
    <div
      className={`w-32 h-48 ${getCardColor()} border-3 rounded-lg p-2.5 flex flex-col
                  cursor-pointer transition-all hover:scale-105 hover:shadow-xl hover:brightness-110
                  ${disabled ? 'opacity-50 cursor-not-allowed grayscale' : ''}
                  relative overflow-hidden flex-shrink-0`}
      onClick={() => !disabled && onClick()}
      style={{
        boxShadow: disabled ? 'none' : '0 2px 10px rgba(0, 0, 0, 0.5)'
      }}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
        backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 8px, currentColor 8px, currentColor 16px)'
      }}></div>

      {/* Card type badge */}
      <div className="text-[9px] font-bold text-white bg-black bg-opacity-50 text-center py-0.5 px-1 rounded mb-1.5 uppercase tracking-wider relative z-10">
        {getTypeLabel()}
      </div>

      {/* Card icon */}
      <div className="text-center text-3xl mb-1.5 relative z-10">
        {getCardIcon()}
      </div>

      {/* Card name */}
      <div className="text-xs font-bold text-white text-center mb-1.5 leading-tight relative z-10 drop-shadow-lg">
        {card.name}
      </div>

      {/* Card description */}
      <div className="text-[10px] text-white text-center leading-tight flex-1 relative z-10 drop-shadow">
        {card.description}
      </div>
    </div>
  );
}
