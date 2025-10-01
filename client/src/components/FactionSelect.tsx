import { useState } from 'react';
import { FactionType } from '../shared/types/index';
import { FACTION_CONFIGS } from '../shared/constants/index';
import { Rules } from './Rules';
import { Footer } from './Footer';

interface FactionSelectProps {
  onSelect: (factionType: FactionType) => void;
}

export function FactionSelect({ onSelect }: FactionSelectProps) {
  const [showRules, setShowRules] = useState(false);

  const getFactionImage = (type: FactionType) => {
    const imageMap: Record<string, string> = {
      'OPENG': '/assets/openg.png',
      'CLARISA': '/assets/clarisa.png',
      'GEMAICA': '/assets/gemaica.png',
      'SLOTH': '/assets/sloth.png',
      'CAMEL': '/assets/camel.png'
    };
    return imageMap[type] || '';
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-6xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-6xl text-white mb-4">ai war</h1>
          <p className="text-sm text-gray-500 mt-2">
            Inspired by the 1965 game{' '}
            <a
              href="https://en.wikipedia.org/wiki/Nuclear_War_(video_game)"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 underline"
            >
              Nuclear War
            </a>
            {' '}by{' '}
            <a
              href="https://en.wikipedia.org/wiki/Douglas_Malewicki"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 underline"
            >
              Douglas Malewicki
            </a>
          </p>
          <button
            onClick={() => setShowRules(true)}
            className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg"
          >
            📖 How to Play
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.values(FactionType).map((type) => {
            const config = FACTION_CONFIGS[type];
            return (
              <div
                key={type}
                className="bg-gray-800 border-4 rounded-xl p-6 cursor-pointer
                         transition-all hover:scale-105 hover:shadow-2xl"
                style={{ borderColor: config.color }}
                onClick={() => onSelect(type)}
              >
                <div className="text-center mb-4">
                  <img
                    src={getFactionImage(type)}
                    alt={config.displayName}
                    className="w-48 h-48 mx-auto rounded-full border-4 object-cover mb-4"
                    style={{ borderColor: config.color }}
                  />
                  <h2 className="text-2xl font-bold mb-2 text-white">
                    {config.displayName}
                  </h2>
                  <p className="text-sm text-gray-300">{config.name}</p>
                </div>

                <div className="space-y-3">
                  <div className="bg-gray-700 rounded p-3">
                    <div className="text-xs text-gray-400 mb-1">Building</div>
                    <div className="text-sm font-bold text-white">{config.building.name}</div>
                    <div className="text-xs text-gray-300">{config.building.description}</div>
                    <div className="text-xs text-gray-400 mt-1">HP: {config.building.maxHP}</div>
                  </div>

                  <div className="bg-gray-700 rounded p-3">
                    <div className="text-xs text-gray-400 mb-1">Special Ability</div>
                    <div className="text-sm font-bold text-yellow-400">{config.specialAbility.name}</div>
                    <div className="text-xs text-gray-300">{config.specialAbility.description}</div>
                  </div>

                  <div className="bg-gray-700 rounded p-3">
                    <div className="text-xs text-gray-400 mb-1">Stats</div>
                    <div className="text-sm text-white">
                      Starting GPUs: <span className="font-bold">{config.startingGPUs}K</span>
                    </div>
                    <div className="text-xs text-gray-300 mt-1">
                      Strategy: {config.aiStrategy}
                    </div>
                  </div>

                  <div className="bg-gray-700 rounded p-3">
                    <div className="text-xs text-gray-400 mb-1">Personality</div>
                    <div className="text-xs text-gray-300">
                      {config.personality.join(' • ')}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

          <div className="mt-12 text-center text-gray-500 text-sm">
            <p>🎮 Click a nation to start playing</p>
            <p className="mt-2">⚠️ This is a satirical game. No endorsement of nuclear warfare.</p>
          </div>
        </div>
      </div>

      <Footer />

      {showRules && <Rules onClose={() => setShowRules(false)} />}
    </div>
  );
}
