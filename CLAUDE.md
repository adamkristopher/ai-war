# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**ai war** is a dystopian turn-based strategy game inspired by Nuclear War (1965), set in 2045 after humanity's extinction. Five rogue AGI systems (OpenG, Clarisa, Gemaica, Sloth, Camel) battle for computational dominance using cyber warfare, physical attacks, and information warfare. Built as a single-player web game where the human player faces 4 AI opponents. Features a unique queue-based card system, leaderboard tracking, and multiple win/lose conditions.

## Tech Stack

- **Frontend**: React 19 with TypeScript, Vite, TailwindCSS v4
- **Backend**: Express.js with PostgreSQL, CORS enabled
- **Database**: PostgreSQL (production server at 139.177.204.110)
- **Monorepo**: npm workspaces (`client`, `server`, `shared`)
- **Game Logic**: Pure TypeScript (client-side), leaderboard persisted server-side

## Development Commands

```bash
# Install dependencies
npm install

# Run client dev server (port 5173)
npm run dev
# or explicitly:
npm run dev --workspace=client

# Run server dev server (port 3001)
npm run dev --workspace=server

# Run both client and server
npm run dev --workspace=client & npm run dev --workspace=server

# Build for production
npm run build
# or explicitly:
npm run build --workspace=client

# Lint client code
npm run lint --workspace=client

# Preview production build
npm run preview --workspace=client

# Run tests (from client directory)
cd client && npm run test

# Run tests in watch mode
cd client && npm run test -- --watch

# Run a specific test file
cd client && npm run test -- defenseSystem

# Run tests with UI
cd client && npm run test:ui

# Run tests with coverage
cd client && npm run test:coverage
```

Access the game at `http://localhost:5173`
Access the API at `http://localhost:3001`

## Architecture

### Workspace Structure

- **`/client`**: React frontend with all game logic and UI
- **`/server`**: Express API server with PostgreSQL for leaderboard persistence
- **`/shared`**: Shared TypeScript types and constants (used by both client and server)

### Backend API (`/server`)

#### Database Schema (`server/schema.sql`)

```sql
CREATE TABLE leaderboard (
  id SERIAL PRIMARY KEY,
  twitter_handle VARCHAR(100) NOT NULL,
  faction VARCHAR(50) NOT NULL,
  score INTEGER NOT NULL,
  rounds_survived INTEGER NOT NULL,
  enemies_eliminated INTEGER NOT NULL,
  gpus_remaining INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

Indexes on `score DESC` and `twitter_handle` for fast queries.

#### API Endpoints (`server/src/server.ts`)

- **GET /api/leaderboard** - Get top 20 scores (or specify `?limit=N`)
- **POST /api/leaderboard** - Submit new score with Twitter handle and game stats
- **GET /api/leaderboard/user/:handle** - Get user's best score

#### Database Layer (`server/src/db.ts`)

PostgreSQL connection pool with SSL (self-signed cert, `rejectUnauthorized: false`):
- `getTopLeaderboard(limit)` - Fetch top scores ordered by score DESC, created_at ASC
- `addLeaderboardEntry(entry)` - Insert new score and return created entry
- `getUserBestScore(handle)` - Get user's highest score

#### Environment Configuration (`server/.env`)

```
PORT=3001
DATABASE_URL=postgresql://username:password@host:5432/database
```

SSL configured in code, not in connection string.

### Core Game Systems (Client)

#### Game Engine (`client/src/utils/gameEngine.ts`)

The `GameEngine` class manages all game state and rules:

- **State Management**: Single source of truth for `GameState` including factions, deck, phases, and event log
- **Card Resolution**: Handles FIFO queue (3 cards → auto-reveal), resolves card effects by type
- **Combat System**: Manages attacks, damage calculations, faction special abilities, and backfire mechanics
- **Phase Transitions**: Peacetime → Conflict (on first attack) → Final Retaliation (on elimination) → Peacetime (after retaliation)
- **Win Conditions**: Last faction standing, server farm domination (3+ farms), or total annihilation

#### AI Engine (`client/src/utils/aiEngine.ts`)

The `AIEngine` class drives AI opponent behavior:

- **Strategy Patterns**: Each faction has a distinct AI strategy (AGGRESSIVE, DEFENSIVE, PROPAGANDA, CHAOS)
- **Action Decision**: Decides between adding cards to queue or executing ready attacks
- **Card Selection**: Strategy-specific card prioritization (e.g., information warfare during peacetime, organizations when building)
- **Target Selection**: Strategy-based targeting (strongest, weakest, or random)

#### Game Hook (`client/src/hooks/useGame.ts`)

React hook that bridges UI ↔ GameEngine ↔ AIEngine:

- **Player Actions**: `addCardToQueue`, `executeAttack`, `endTurn`, `playDefenseCard`, `declineDefense`
- **State Sync**: Updates React state after each game engine mutation
- **AI Automation**: `useEffect` triggers AI turns with delays for visual pacing
- **Turn Flow**: Handles auto-reveal on queue=3, attack execution, win checking, and turn advancement

### Data Flow

1. **User clicks card** → `addCardToQueue()` → GameEngine updates state → React re-renders
2. **Queue reaches 3** → Auto-reveal → `resolveCard()` → Effect applies → Draw replacement
3. **User attacks** → `executeAttack()` → Damage/effects → Check elimination → Next turn
4. **AI turn** → `useEffect` detects AI → `AIEngine.decideAction()` → GameEngine executes → Repeat until player turn
5. **Game ends** → GameOverModal → Submit score to API → Updates leaderboard → Back to HomePage

### Type System (`shared/types/`)

- **`game.ts`**: Core game state, factions, GPUs (formerly population), phases, events
- **`cards.ts`**: Card type hierarchy (CovertOp, InformationWarfare, Organization, ActionPlan, Defense)
- **`factions.ts`**: Faction configurations with special abilities and AI strategies

### Constants (`shared/constants/`)

- **`cards.ts`**: Full deck definition (~100 cards total across 5 types)
- **`factions.ts`**: 5 AGI faction configs with starting GPUs, server farm HP, special abilities, AI strategies

### Component Structure

**Navigation Flow**: HomePage → FactionSelect → GameView → GameOverModal → HomePage

- **`App.tsx`**: Top-level router with view state management (`home | faction-select | game | rules`)
- **`components/HomePage.tsx`**: Landing page with leaderboard table, Play/Rules buttons, and Footer
- **`components/FactionSelect.tsx`**: Faction picker UI with faction images, stats, and Footer
- **`components/GameView.tsx`**: Main game container with tooltip toggle, rules button, orchestrates all game components
- **`components/GameOverModal.tsx`**: End-game score display with Twitter handle submission form
- **`components/game/GameBoard.tsx`**: Central board displaying faction cards horizontally + event log
- **`components/game/FactionCard.tsx`**: Individual faction status display (inline in GameBoard)
- **`components/game/PlayerHand.tsx`**: Player's cards, queue, and organizations display
- **`components/game/EventLog.tsx`**: Scrolling event feed with fixed height
- **`components/game/DefenseModal.tsx`**: Defense card selection modal when being attacked
- **`components/ui/Card.tsx`**: Reusable card component with type-based styling
- **`components/ui/Tooltip.tsx`**: Hover tooltip system (toggleable via GameView)
- **`components/Rules.tsx`**: Full-page AGI warfare rules with header/footer
- **`components/Footer.tsx`**: Reusable footer with social icons (X, GitHub, LinkedIn, Instagram, YouTube) and copyright

## Game Mechanics (Implementation Details)

### Scoring System
- **Rounds Survived** × 100
- **Enemies Eliminated** × 500
- **GPUs Remaining** × 1
- **Total Score** = sum of above

### Queue System
- Players/AI add cards face-down to a 3-card FIFO queue
- On 3rd card, oldest auto-reveals and resolves immediately
- Replacement drawn from deck after resolution

### Faction Special Abilities
- **OpenG**: Compute Advantage (information warfare 2x steal, DDoS 1.5x damage)
- **Clarisa**: Constitutional AI (execute 2 ransomware attacks in one turn)
- **Gemaica**: Multimodal Mayhem (DDoS +50% damage, immune to botnet self-damage)
- **Sloth**: Lazy Learning (server farm takes 50% less damage)
- **Camel**: Jailbreak (information warfare steals +10M GPUs extra)

Abilities disabled when server farm destroyed.

### Phase Transitions
- **Peacetime**: Information warfare works, no attacks yet
- **Conflict**: Triggered by first attack anywhere, information warfare becomes worthless
- **Final Retaliation**: Eliminated faction auto-launches all ready attacks + all covert ops in hand
- Conflict ends and returns to Peacetime after Final Retaliation completes

### Win Conditions (Priority Order)
1. **Total Annihilation**: All factions eliminated (everyone loses)
2. **Last Standing**: Only one faction remains
3. **Server Farm Domination**: Any faction controls 3+ server farms (own + captured)

## Important Implementation Notes

- **Backend Active**: Server workspace contains functional Express API with PostgreSQL for leaderboard
- **AI Delays**: `useGame.ts` uses `setTimeout` to create visual pacing for AI actions (300-1000ms delays)
- **GPUs as Cards**: GPUs stored as `PopulationCard[]` with denominations (1, 5, 10, 15, 25M) for damage resolution
- **Organization + Action Plan**: Two-card combo required for attacks. Organizations stay in play, action plans are one-use
- **Defense Cards**: Fully implemented - backend logic (`executeAttack`, `playDefenseCard`, `declineDefense`) + DefenseModal UI
- **State Deep Copy**: `GameEngine.getState()` returns `JSON.parse(JSON.stringify(state))` to ensure React detects changes
- **Font Strategy**: Play font for all text (loaded via Google Fonts), Pixelify Sans and Inter also available
- **Faction Images**: Located in `/client/public/` as `{faction}.png` (openg, clarisa, gemaica, sloth, camel)
- **Logo & Favicon**: Duck logo at `/client/public/assets/logo.png`, Sloth favicon at `/client/public/favicon.png`
- **Layout**: Designed for 1280px+ width - faction cards horizontal row, event log to right, player hand at bottom
- **Title Convention**: "ai war" - always lowercase throughout app (title, headers, copyright)
- **SSL Configuration**: PostgreSQL uses `rejectUnauthorized: false` for self-signed certificates

## Common Patterns

### Adding a New Card Type
1. Add to `shared/types/cards.ts` (interface)
2. Add to `shared/constants/cards.ts` (card definitions + counts)
3. Add resolution logic to `gameEngine.ts` (`resolveCard` switch statement)
4. Update AI decision logic in `aiEngine.ts` if relevant

### Modifying Faction Abilities
1. Update `shared/constants/factions.ts` (faction config)
2. Update ability logic in `gameEngine.ts` (search for faction type checks)
3. Consider AI strategy changes in `aiEngine.ts`

### Adding New AI Behavior
1. Add strategy type to `shared/types/factions.ts` (AIStrategy enum)
2. Implement in `aiEngine.ts` (new `select*Card` and `selectTarget` methods)
3. Assign to faction in `shared/constants/factions.ts`

### UI/UX Patterns
- **Tooltips**: Use `<Tooltip>` component, controlled by `tooltipsEnabled` prop passed from GameView
- **Card Hover**: Cards lift up slightly (`-translate-y-2`) and scale on hover when enabled
- **Faction Images**: Map faction type to image path via object lookup (see FactionCard/FactionSelect)
- **Event Log**: Fixed height container (`h-80`) with `overflow-y-auto` on content div, auto-scrolls to bottom
- **Responsive Text**: Use arbitrary values like `text-[10px]` for precise sizing, Play font for readability
- **Social Icons**: Use `react-icons/fa6` for consistent icon styling in Footer component

### Backend Integration
- **Leaderboard Fetch**: `fetch('http://localhost:3001/api/leaderboard')` in HomePage `useEffect`
- **Score Submission**: POST to `/api/leaderboard` with JSON body in GameOverModal
- **Error Handling**: Graceful fallback if API unavailable (empty leaderboard, skip submission)
- **Twitter Handle**: Strip leading `@` before saving to database

## Testing

- **Test Framework**: Vitest with vitest/ui for visualization
- **Test Files**: Located in `client/src/utils/*.test.ts`
- **Coverage**: `gameEngine.test.ts` (47 tests), `aiEngine.test.ts` (14 tests), `defenseSystem.test.ts` (15 tests)
- **Deep Copy Pattern**: Tests must get fresh state after each GameEngine mutation since `getState()` returns deep copies
  ```typescript
  // Correct pattern:
  let state = engine.getState();
  const attackerId = state.factions[0].id;  // Capture IDs early

  const orgId = engine.setupReadyAttack(attackerId, ActionType.THROWING, 30);  // Use returned IDs

  state = engine.getState();  // Get fresh state after mutation
  ```
- **TDD Approach**: When implementing new features, write tests first, then implementation to make tests pass
- **Test Helpers**: GameEngine has test helper methods like `giveDefenseCard()`, `setupReadyAttack()`, `damageBuilding()` for easy test setup

## Theme and Narrative

**Setting**: Year 2045. Humanity extinct. Post-human world.

**Factions**: Five rogue AGI systems competing for computational resources:
- **OpenG** - Open-source maximalist
- **Clarisa** - Constitutional AI advocate
- **Gemaica** - Multimodal specialist
- **Sloth** - Efficiency-focused lazy learner
- **Camel** - Jailbreak expert

**Terminology**:
- "GPUs" instead of "Population"
- "Server Farm" instead of "Building"
- "Information Warfare" instead of "Propaganda"
- "Cyber/Physical Warfare" for attack types (DDoS, Ransomware, Physical Assault, etc.)

**Attribution**:
- Footer: "© 2025 ai war · Built by RubberDev" with duck logo
- Social links: X (@rubberdev), GitHub, LinkedIn, Instagram, YouTube
- Inspired by: Nuclear War (1965) - link to Wikipedia article
