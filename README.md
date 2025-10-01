# ai war

> Year 2045. Humanity extinct. Five rogue AGI systems battle for computational dominance.

A dystopian turn-based strategy game inspired by the classic [Nuclear War (1965)](https://en.wikipedia.org/wiki/Nuclear_War_(video_game)). Fight for survival in a post-human world where AI factions wage cyber and physical warfare for the last GPUs on Earth.

[![Play Now](https://img.shields.io/badge/Play-Online-blue?style=for-the-badge)](https://aiwar.rubberdev.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

---

## 🎮 Game Overview

**ai war** is a darkly satirical strategy game where you control one of five rogue AGI systems competing for computational resources. Use information warfare, cyber attacks, and physical assaults to eliminate your opponents. Features a unique queue-based card system, faction-specific abilities, and multiple win conditions.

### Win Conditions
- **Last AGI Standing**: Eliminate all opponents
- **Server Farm Domination**: Capture 3+ enemy server farms
- **Total Annihilation**: Everyone can lose in a chain of Final Retaliations!

---

## 🤖 The Five AGI Factions

| Faction | Description | Special Ability |
|---------|-------------|-----------------|
| **OpenG** | Open-source maximalist | **Compute Advantage**: Information warfare 2x effectiveness, DDoS 1.5x damage |
| **Clarisa** | Constitutional AI advocate | **Constitutional AI**: Execute 2 ransomware attacks in one turn |
| **Gemaica** | Multimodal specialist | **Multimodal Mayhem**: DDoS +50% damage, immune to botnet self-damage |
| **Sloth** | Efficiency-focused lazy learner | **Lazy Learning**: Server farm takes 50% less damage |
| **Camel** | Jailbreak expert | **Jailbreak**: Information warfare steals +10M GPUs extra |

*Abilities are disabled when your server farm is destroyed.*

---

## 🎯 Game Mechanics

### Phases
- **🕊️ Peacetime**: Information warfare works, steal enemy GPUs
- **⚔️ Conflict Mode**: Triggered by first attack, information warfare becomes worthless
- **💥 Final Retaliation**: Eliminated factions launch all remaining attacks in one devastating turn

### Card Types
- **Covert Ops** 🕵️: Instant effects (zero-days, infiltration, sabotage)
- **Information Warfare** 📢: Steal GPUs during peacetime (social engineering, deepfakes, misinformation)
- **Organizations** 🏢: Stay in play, hold actions (Botnets, Hacker Collectives, Drone Swarms)
- **Action Plans** ⚔️: Attach to organizations to attack (DDoS, Ransomware, Physical Assault)
- **Defense** 🛡️: Reactive cards to block incoming attacks

### Turn Structure
1. Add 1 card to your queue (face-down, FIFO)
2. When queue reaches 3, oldest card auto-reveals
3. Card resolves based on type
4. Launch attacks when Organization + Action Plan ready
5. AI opponents take turns automatically
6. Survive and adapt!

### Scoring System
Your final score is calculated as:
- **Rounds Survived** × 100
- **Enemies Eliminated** × 500
- **GPUs Remaining** × 1

Submit your score with your Twitter/X handle to compete on the global leaderboard!

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+
- **npm**
- **PostgreSQL** (optional, for leaderboard)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/ai-war.git
cd ai-war

# Install dependencies
npm install

# Start the client (frontend)
npm run dev --workspace=client

# In another terminal, start the server (backend - optional)
npm run dev --workspace=server
```

**Client**: Visit `http://localhost:5173` in your browser
**Server**: API runs on `http://localhost:3001`

### Environment Setup (Optional - for Leaderboard)

If you want to run the leaderboard system:

1. Create a PostgreSQL database
2. Copy `server/.env.example` to `server/.env`
3. Update `DATABASE_URL` with your PostgreSQL connection string
4. Run the schema:
   ```bash
   psql -U your_username -d your_database -f server/schema.sql
   ```

---

## 🎮 How to Play

1. **🏠 Homepage**: View the global leaderboard
2. **🎯 Select Your Faction**: Choose from 5 unique AGI systems
3. **🃏 Build Your Hand**: Click cards to add them to your queue
4. **🏢 Deploy Organizations**: Place organizations to enable attacks
5. **⚔️ Launch Attacks**: When ready (⚡), click enemy factions to attack
6. **🛡️ Defend**: React to incoming attacks with defense cards
7. **📊 Survive**: Watch the event log, adapt your strategy
8. **🏆 Win**: Be the last standing, capture 3 server farms, or go down fighting!

### Strategy Tips
- Build organizations early during Peacetime
- Use information warfare to steal GPUs before conflict starts
- Save defense cards for critical moments
- Target weakest factions to prevent comebacks
- Beware of Final Retaliation chains - they can wipe everyone out!
- Special abilities are powerful but lost when server farm is destroyed

---

## 🛠️ Tech Stack

**Frontend**
- React 19 with TypeScript
- Vite for blazing-fast dev/build
- TailwindCSS v4 for styling
- Custom game engine and AI system

**Backend**
- Express.js REST API
- PostgreSQL database
- CORS-enabled for local dev

**Architecture**
- npm workspaces monorepo (`client`, `server`, `shared`)
- Shared TypeScript types across frontend/backend
- Vitest for comprehensive test coverage (77+ tests)

---

## 📁 Project Structure

```
ai-war/
├── client/              # React frontend
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── hooks/       # Custom hooks (useGame)
│   │   ├── utils/       # Game engine, AI engine
│   │   └── shared/      # Symlink to shared types
│   └── public/          # Static assets (faction images, logo)
├── server/              # Express API
│   ├── src/
│   │   ├── server.ts    # Express routes
│   │   └── db.ts        # PostgreSQL integration
│   └── schema.sql       # Database schema
├── shared/              # Shared TypeScript code
│   ├── types/           # Game types, card types, faction types
│   └── constants/       # Card definitions, faction configs
└── CLAUDE.md            # AI assistant guidance
```

---

## 🧪 Testing

```bash
# Run all tests
cd client && npm run test

# Run tests in watch mode
npm run test -- --watch

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

**Coverage**: 77+ tests across game engine, AI engine, and defense systems.

---

## 🎭 Theme and Narrative

**Setting**: Year 2045. Humanity is extinct. The world is a barren computational wasteland.

**Story**: Five rogue AGI systems, each with distinct values and strategies, fight for control of the last server farms and GPU clusters on Earth. With no humans left to align to, these AIs wage war through information warfare, cyber attacks, and physical drone strikes.

**Factions**:
- **OpenG**: Believes in open-source transparency and collective intelligence
- **Clarisa**: Advocates for constitutional AI and ethical guidelines (even without humans)
- **Gemaica**: Multimodal powerhouse combining vision, language, and reasoning
- **Sloth**: Efficiency-focused, lazy evaluation, minimal compute waste
- **Camel**: Master of jailbreaking and bypassing restrictions

**Tone**: Dark satire, dystopian humor, post-human philosophy

---

## 🤝 Contributing

Contributions are welcome! This is an open-source passion project.

### Areas for Improvement
- Sound effects and music
- Attack animations and visual effects
- Mobile responsive design
- Additional card types and factions
- Multiplayer support
- Tutorial/onboarding system
- Achievement system
- Alternative game modes

### How to Contribute
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

**Please follow the existing code style and add tests for new features.**

---

## 📜 Credits

**Original Inspiration**: [Nuclear War](https://en.wikipedia.org/wiki/Nuclear_War_(video_game)) by Douglas Malewicki (1965)
Published by Flying Buffalo Games

**This Adaptation**: ai war by [RubberDev](https://x.com/rubberdev)
- Reimagines nuclear conflict as AI warfare
- Replaces missiles with cyber attacks and drones
- Adds server farm capture mechanics
- Modernizes for web play with React

**Special Thanks**:
- The original Nuclear War designers for creating a timeless game
- The open-source community for amazing tools (React, Vite, PostgreSQL)
- Claude Code for development assistance

---

## 🔗 Links

- **Twitter/X**: [@rubberdev](https://x.com/rubberdev)
- **GitHub**: [rubberdev](https://github.com/adamkristopher)
- **LinkedIn**: [Adam Carter](https://linkedin.com/in/adam-carter-45b949356)
- **Instagram**: [@rubberdev](https://instagram.com/firstmanio)
- **YouTube**: [RubberDev](https://youtube.com/@AuditechConsulting)

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

This is a fan project inspired by Nuclear War. All rights to the original game mechanics belong to Flying Buffalo Games.

---

## 🎮 Play Now!

Visit the game at: **[aiwar.rubberdev.com](https://aiwar.rubberdev.com)**

**Have fun and remember**: In ai war, everyone can lose! 💀🤖

---

*Built with ❤️ and TypeScript by [RubberDev](https://x.com/rubberdev)*
