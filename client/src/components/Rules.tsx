import { FaXTwitter, FaGithub, FaLinkedin, FaInstagram, FaYoutube } from 'react-icons/fa6';

export function Rules({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4 flex-shrink-0">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div>
            <h1 className="text-3xl text-white">🤖 AGI Warfare Protocol</h1>
            <p className="text-gray-400 text-sm mt-1">Year 2045. Humanity extinct. Five rogue AGI systems battle for computational dominance.</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-3xl font-bold px-4"
          >
            ×
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto p-8">

          <div className="space-y-6 text-gray-300">
            {/* Win Conditions */}
            <section>
              <h2 className="text-2xl font-bold text-yellow-400 mb-3">Victory Conditions</h2>
            <ul className="list-disc list-inside space-y-2 pl-4">
              <li><strong className="text-white">Last System Online:</strong> Destroy all opponent AGI cores</li>
              <li><strong className="text-white">Infrastructure Dominance:</strong> Seize control of 3+ server farms</li>
              <li><strong className="text-red-400">Total System Failure:</strong> All AGIs can be destroyed! (Common outcome)</li>
            </ul>
          </section>

          {/* Turn Structure */}
          <section>
            <h2 className="text-2xl font-bold text-yellow-400 mb-3">Turn Structure</h2>
            <ol className="list-decimal list-inside space-y-2 pl-4">
              <li>Click a card from your hand to add it to your <strong className="text-white">queue</strong> (face-down)</li>
              <li>When your queue reaches <strong className="text-white">3 cards</strong>, the oldest card auto-reveals (FIFO)</li>
              <li>The revealed card resolves immediately based on its type</li>
              <li>You draw a replacement card from the deck</li>
              <li>If you have an Organization + Action Plan ready (⚡), click an enemy faction to attack</li>
              <li>Turn passes to the next faction automatically</li>
            </ol>
          </section>

          {/* Card Types */}
          <section>
            <h2 className="text-2xl font-bold text-yellow-400 mb-3">Warfare Systems</h2>
            <div className="space-y-3">
              <div className="bg-gray-700 rounded p-3">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-2xl">💻</span>
                  <h3 className="text-lg font-bold text-purple-400">Covert Ops</h3>
                </div>
                <p>Instant cyber attacks targeting random enemies (zero-days, model theft, cooling sabotage, DDoS)</p>
              </div>

              <div className="bg-gray-700 rounded p-3">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-2xl">📡</span>
                  <h3 className="text-lg font-bold text-blue-400">Information Warfare</h3>
                </div>
                <p><strong className="text-red-400">Only works during PEACETIME!</strong> Deepfakes and bot networks steal GPUs. Useless once kinetic warfare begins.</p>
              </div>

              <div className="bg-gray-700 rounded p-3">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-2xl">🤖</span>
                  <h3 className="text-lg font-bold text-green-400">Organizations</h3>
                </div>
                <p>Persistent attack systems. Required to deploy Action Plans (Botnet Army, Drone Swarm, Defensive AI, Autonomous Legion)</p>
              </div>

              <div className="bg-gray-700 rounded p-3">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-2xl">⚔️</span>
                  <h3 className="text-lg font-bold text-red-400">Action Plans</h3>
                </div>
                <p>Attach to Organizations to execute attacks (Ransomware, EMP Strikes, Missile Barrages, Server Farm Raids, Auto-Repair)</p>
              </div>

              <div className="bg-gray-700 rounded p-3">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-2xl">🛡️</span>
                  <h3 className="text-lg font-bold text-yellow-400">Defense</h3>
                </div>
                <p>Countermeasures to block attacks (Anti-Drone Systems, Intrusion Detection, Air-Gapped Networks)</p>
              </div>
            </div>
          </section>

          {/* Game Phases */}
          <section>
            <h2 className="text-2xl font-bold text-yellow-400 mb-3">Conflict Phases</h2>
            <div className="space-y-3">
              <div className="bg-green-900 bg-opacity-30 border border-green-600 rounded p-3">
                <h3 className="text-lg font-bold text-green-400 mb-2">🕊️ PEACETIME (Cold War Protocol)</h3>
                <p>Information warfare operational. Deploy organizations. Hijack GPUs via deepfakes. First kinetic strike triggers hot war!</p>
              </div>

              <div className="bg-red-900 bg-opacity-30 border border-red-600 rounded p-3">
                <h3 className="text-lg font-bold text-red-400 mb-2">⚔️ CONFLICT (Kinetic Warfare)</h3>
                <p>Triggered by first physical attack. Information warfare offline! Only cyber/physical attacks effective.</p>
              </div>

              <div className="bg-purple-900 bg-opacity-30 border border-purple-600 rounded p-3">
                <h3 className="text-lg font-bold text-purple-400 mb-2">☢️ SCORCHED EARTH PROTOCOL</h3>
                <p>When an AGI is destroyed, it launches ALL ready attacks + ALL covert ops. Cascading failures possible!</p>
              </div>
            </div>
          </section>

          {/* Faction Abilities */}
          <section>
            <h2 className="text-2xl font-bold text-yellow-400 mb-3">AGI Special Capabilities</h2>
            <div className="space-y-2 text-sm">
              <p><strong style={{color: '#10A37F'}}>OpenG:</strong> AGI Superiority - Drone strikes and kinetic attacks deal +50% damage</p>
              <p><strong style={{color: '#CC785C'}}>Clarisa:</strong> Hardened Infrastructure - Server farm takes 50% less damage from all attacks</p>
              <p><strong style={{color: '#4285F4'}}>Gemaica:</strong> Information Dominance - Deepfakes and info warfare steal +10K extra GPUs</p>
              <p><strong style={{color: '#1a1a1a'}} className="bg-white px-1">Sloth:</strong> Unpredictable Warfare - Random surprise cyber attacks during any phase</p>
              <p><strong style={{color: '#0668E1'}}>Camel:</strong> Distributed Network - Coordinated botnet attacks hit twice as hard</p>
              <p className="text-gray-400 italic mt-2">Warning: Capabilities go offline when server farm is destroyed!</p>
            </div>
          </section>

          {/* Strategy Tips */}
          <section>
            <h2 className="text-2xl font-bold text-yellow-400 mb-3">Tactical Protocols</h2>
            <ul className="list-disc list-inside space-y-2 pl-4">
              <li>Deploy attack organizations early during cold war phase</li>
              <li>Use information warfare to hijack GPUs before kinetic strikes begin</li>
              <li>Target weakest AGI systems to eliminate them before they recover</li>
              <li>Save auto-repair protocols for critical server farm damage</li>
              <li>Warning: Destroying an AGI triggers their Scorched Earth Protocol!</li>
              <li>Scorched Earth cascades can cause total system failure (everyone loses)</li>
            </ul>
          </section>

          {/* Combat Details */}
          <section>
            <h2 className="text-2xl font-bold text-yellow-400 mb-3">Warfare Mechanics</h2>
            <div className="space-y-2 text-sm">
              <p><strong className="text-white">Thermobaric Bombs:</strong> 50 server farm damage, 10% malfunction chance (25 self-damage)</p>
              <p><strong className="text-white">Worm Outbreaks:</strong> 40 server farm damage, lose 5K own GPUs as collateral</p>
              <p><strong className="text-white">Auto-Repair:</strong> Restore 20 server farm HP</p>
              <p><strong className="text-white">Server Farm Raids:</strong> Can capture facilities below certain HP thresholds</p>
              <p><strong className="text-white">Server Farm Destroyed:</strong> Lose AGI special capabilities permanently</p>
              <p><strong className="text-red-400">GPUs = 0:</strong> System Destroyed → Scorched Earth Protocol</p>
            </div>
            </section>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-800 border-t border-gray-700 px-6 py-6 flex-shrink-0">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="text-gray-500 text-sm">
              <p>Inspired by Nuclear War by Douglas Malewicki (1965)</p>
              <p className="mt-1">⚠️ Dystopian satire. No endorsement of AI warfare or human extinction.</p>
            </div>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg"
            >
              Got it! Let's Play
            </button>
          </div>

          {/* Social Icons */}
          <div className="flex justify-center gap-6 mb-4 pt-4 border-t border-gray-700">
            <a
              href="https://x.com/rubberdev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#61a2d3] hover:text-white transition-all hover:scale-125"
              aria-label="X (Twitter)"
            >
              <FaXTwitter size={28} />
            </a>
            <a
              href="https://github.com/adamkristopher"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#61a2d3] hover:text-white transition-all hover:scale-125"
              aria-label="GitHub"
            >
              <FaGithub size={28} />
            </a>
            <a
              href="https://www.linkedin.com/in/adam-carter-45b949356/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#61a2d3] hover:text-white transition-all hover:scale-125"
              aria-label="LinkedIn"
            >
              <FaLinkedin size={28} />
            </a>
            <a
              href="https://www.instagram.com/firstmanio/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#61a2d3] hover:text-white transition-all hover:scale-125"
              aria-label="Instagram"
            >
              <FaInstagram size={28} />
            </a>
            <a
              href="https://www.youtube.com/@AuditechConsulting"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#61a2d3] hover:text-white transition-all hover:scale-125"
              aria-label="Youtube"
            >
              <FaYoutube size={28} />
            </a>
          </div>

          {/* Copyright */}
          <div className="flex justify-center items-center gap-2">
            <div className="text-white text-lg">
              © 2025 ai war · Built by RubberDev
            </div>
            <div className="w-8 h-8">
              <img
                src="/assets/logo.png"
                alt="RubberDev logo"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
