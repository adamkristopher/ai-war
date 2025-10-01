import { Faction } from '../../shared/types/index';
import { FACTION_CONFIGS } from '../../shared/constants/index';

interface FactionCardProps {
  faction: Faction;
  position: { x: number; y: number };
  isCurrentPlayer: boolean;
  isPlayerFaction: boolean;
  onSelectAsTarget?: (targetId: string) => void;
}

export function FactionCard({
  faction,
  position,
  isCurrentPlayer,
  isPlayerFaction,
  onSelectAsTarget
}: FactionCardProps) {
  const config = FACTION_CONFIGS[faction.type];
  const healthPercent = (faction.buildingHP / faction.maxBuildingHP) * 100;

  const getFactionImage = () => {
    const imageMap: Record<string, string> = {
      'MAFA': '/mafa.png',
      'BLAM': '/blam.png',
      'AUNTY_FAFA': '/auntyfa.png',
      'PROUD_GALS': '/proudgal.png',
      'LMNOP': '/lmnop.png'
    };
    return imageMap[faction.type] || '';
  };

  return (
    <div
      className={`absolute transform -translate-x-1/2 -translate-y-1/2
                  bg-gray-800 border-4 rounded-xl p-3 w-48
                  ${isCurrentPlayer ? 'ring-4 ring-yellow-400' : ''}
                  ${faction.isEliminated ? 'opacity-40 grayscale' : ''}
                  ${!isPlayerFaction && !faction.isEliminated ? 'cursor-pointer hover:border-red-500 hover:scale-105 transition-all' : ''}
                  shadow-2xl`}
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        borderColor: isCurrentPlayer ? config.color : '#4B5563',
      }}
      onClick={() => !isPlayerFaction && !faction.isEliminated && onSelectAsTarget?.(faction.id)}
    >
      {/* Faction image */}
      <div className="text-center mb-2">
        <img
          src={getFactionImage()}
          alt={faction.name}
          className="w-20 h-20 mx-auto rounded-full border-4 object-cover"
          style={{ borderColor: config.color }}
        />
      </div>

      {/* Faction name */}
      <div className="text-center mb-2">
        <h3 className="text-xs font-bold truncate" style={{ color: config.color }}>
          {faction.name}
        </h3>
        {isPlayerFaction && <span className="text-xs text-green-400">(You)</span>}
        {faction.isAI && <span className="text-xs text-gray-400">(AI)</span>}
      </div>

      {/* Building */}
      <div className="mb-2">
        <div className="text-[10px] text-gray-400 mb-1">{config.building.name}</div>
        <div className="bg-gray-700 h-2 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              healthPercent > 60 ? 'bg-green-500' :
              healthPercent > 30 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${healthPercent}%` }}
          />
        </div>
        <div className="text-[10px] text-center mt-1">
          {faction.buildingHP}/{faction.maxBuildingHP} HP
        </div>
      </div>

      {/* Population */}
      <div className="text-center mb-2">
        <div className="text-xl font-bold text-white">{faction.totalGPUs}M</div>
        <div className="text-[10px] text-gray-400">population</div>
      </div>

      {/* Organizations - show count only */}
      {faction.organizations.length > 0 && (
        <div className="border-t border-gray-700 pt-2 mt-2">
          <div className="text-[10px] text-gray-400 text-center">
            🏢 {faction.organizations.length} org{faction.organizations.length > 1 ? 's' : ''}
            {faction.organizations.some(o => o.attachedAction) && <span className="text-yellow-400 ml-1">⚡</span>}
          </div>
        </div>
      )}

      {/* Captured buildings */}
      {faction.capturedBuildings.length > 0 && (
        <div className="mt-1 text-[10px] text-yellow-400 text-center">
          🏆 {faction.capturedBuildings.length}
        </div>
      )}

      {faction.isEliminated && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-4xl">💀</div>
        </div>
      )}
    </div>
  );
}
