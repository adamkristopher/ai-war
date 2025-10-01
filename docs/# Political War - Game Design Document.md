# Political War - Game Design Document

## Game Overview

**Political War** is a satirical turn-based strategy game inspired by the classic Nuclear War card game. Players control one of five political factions competing for dominance through propaganda, protests, prayers, and building attacks. The game features dark humor, unpredictable chaos, and the possibility that everyone loses.

**Win Condition:** Be the last faction standing with population remaining OR capture 3+ enemy buildings

**Game Duration:** 10-20 minutes per match

---

## The Five Factions

### 1. MAFA (Make America Fun Again)

**Building:** The Golden Tower

- Gaudy skyscraper with gold trim
- High visibility, medium defense

**Personality:** Aggressive, bombastic

- Prefers direct attacks
- Loves big, flashy moves
- Predictable but powerful

**Special Ability:** "Rally Call"

- Once per game: Double propaganda effectiveness
- Steals 2x population on successful propaganda

**Starting Stats:**

- Population: 50 million
- Building HP: 100
- Defense: Medium

---

### 2. BLAM (Big Loud Activist Movement)

**Building:** The Community Center

- Grassroots hub with murals
- Medium visibility, low defense

**Personality:** Collective action focused

- Strength in numbers
- Multi-target attacks
- Vulnerable when isolated

**Special Ability:** "Mass Mobilization"

- Once per game: Launch two protests in one turn
- Can target same or different enemies

**Starting Stats:**

- Population: 55 million
- Building HP: 80
- Defense: Low

---

### 3. Aunty Fafa

**Building:** The Collective

- Underground bunker/safehouse
- Low visibility, high defense

**Personality:** Chaotic, unpredictable

- Guerrilla tactics
- High risk, high reward
- Sometimes backfires

**Special Ability:** "Black Bloc"

- Throwing stuff does +50% damage
- Riots never damage own population

**Starting Stats:**

- Population: 45 million
- Building HP: 120
- Defense: High

---

### 4. Proud Gals

**Building:** The Clubhouse

- Fortified lodge with perimeter
- Medium visibility, high defense

**Personality:** Defensive, patient

- Builds up before striking
- Superior building defense
- Slow to act

**Special Ability:** "Stand Back Stand By"

- Building takes 50% less damage
- Can fortify building for free once per game

**Starting Stats:**

- Population: 48 million
- Building HP: 110
- Defense: Very High

---

### 5. LMNOP (Alphabet Gang)

**Building:** Rainbow HQ

- Colorful headquarters with flags
- High visibility, medium defense

**Personality:** Diplomatic, persuasive

- Heavy propaganda use
- Steals population effectively
- Lower direct damage

**Special Ability:** "Pride Parade"

- Propaganda steals +10 million extra population
- Can convert defenders to your side during invasion

**Starting Stats:**

- Population: 52 million
- Building HP: 90
- Defense: Medium

---

## Core Game Mechanics

### Game Phases

#### Phase 1: Peacetime (Cold War)

- Game starts in Peacetime
- **Propaganda works** - can steal enemy population
- Players jockey for position
- No direct attacks yet
- Lasts until first attack is launched

#### Phase 2: Conflict Mode (Hot War)

- Triggered when first attack launches
- **Propaganda becomes worthless** - all propaganda cards discarded
- Direct attacks begin
- Lasts until someone is eliminated

#### Phase 3: Return to Peacetime

- After a faction is eliminated (and Final Retaliation resolved)
- Propaganda works again
- Brief calm before next conflict
- Cycle repeats

---

## Card Types

### 1. Covert Ops (Secrets)

Played immediately when revealed. Instant effects.

**Examples:**

- **Scandal Leak:** Target loses 15 million population
- **Infiltrator:** Steal 10 million population (works during conflict)
- **Inside Job:** Deal 20 damage to target building
- **Blackmail:** Force target to skip next turn
- **Double Agent:** Redirect enemy's next attack to different target
- **Media Blackout:** Cancel all propaganda next round
- **Viral Moment:** Gain 10 million population instantly

### 2. Propaganda Cards

Only work during Peacetime. Steal enemy population.

**Types:**

- **Social Media Blitz:** Steal 10 million
- **Meme Warfare:** Steal 8 million, target of your choice
- **Fake News:** Steal 15 million but roll die - on 1-2 backfires
- **Radio Campaign:** Steal 5 million from ALL enemies
- **Door-to-Door:** Steal 12 million, slow but reliable

### 3. Organizations (Delivery Systems)

Stay in play. Must attach Action Plan to execute.

**Examples:**

- **Protest Group:** Holds protest actions
- **Prayer Circle:** Holds prayer actions
- **Strike Team:** Holds throwing/invasion actions
- **Media Network:** Holds propaganda boosts
- **Defense Force:** Holds defensive actions

### 4. Action Plans (Warheads)

Attach to Organizations. Execute on next turn.

**Protest Actions:**

- **Peaceful March:** 10 damage to population, +5 propaganda next turn
- **Disruptive Protest:** 20 damage to building
- **Riot:** 40 damage to building, lose 5 million own population
- **Sit-In:** Occupy building, prevent their actions for 1 turn

**Prayer Actions:**

- **Prayer Circle:** Heal 20 building HP
- **Blessing:** +25% defense next turn
- **Curse:** Enemy's next attack deals 50% damage

**Throwing Actions:**

- **Eggs:** 10 building damage, embarrassing
- **Paint/Graffiti:** 15 building damage, +3 propaganda
- **Bricks:** 30 building damage
- **Molotovs:** 50 building damage, 10% chance backfire (25 self-damage)

**Invasion Actions:**

- **Raid:** Damage building, attempt capture if below 30 HP
- **Siege:** Deal 20 damage, prevent building use for 1 turn
- **Takeover:** If building below 20 HP, capture it (win condition)

### 5. Defense Cards (Specials)

Reactive cards. Play from hand when attacked.

**Examples:**

- **Security Detail:** Block one throwing attack
- **Counter-Protesters:** Block one protest action
- **Legal Team:** Cancel one covert op targeting you
- **Bomb Shelter:** Reduce population damage by 50%
- **Fortification:** Reduce building damage by 25
- **Media Spin:** Turn propaganda attempt against attacker

---

## Turn Structure

### Setup Phase

1. Each player draws starting population cards (total varies by player count)
2. Each player draws 9 game cards
3. Each player immediately plays all Covert Ops, draws replacements
4. Continue until no one has Covert Ops in opening hand

### Turn Sequence

#### Round Start

1. Each player places 2 cards face-down in their queue
2. Random event may occur (roll die)

#### Player Turns (Clockwise)

Each player's turn:

1. **Add Card:** Place 1 new card face-down in queue (now have 3)
2. **Reveal Card:** Flip oldest card (FIFO - First In First Out)
3. **Resolve Card:**
   - **Covert Op:** Execute immediately
   - **Propaganda:** Steal population if Peacetime
   - **Organization:** Place in play area
   - **Action Plan:** Attach to Organization OR discard if none available
   - **Defense:** Keep in hand for reactive use
4. **Launch Attack:** If Organization + Action Plan combo exists, MUST declare target and launch
   - Triggers Conflict Mode if in Peacetime
   - Opponent can play Defense card
   - Resolve damage/effects
5. **Draw:** Draw 1 replacement card

#### Round End

- Check for eliminations
- Resolve Final Retaliation if needed
- Check win condition
- Return to Peacetime if someone eliminated

---

## Combat Resolution

### Attack Declaration

1. Attacker declares target faction
2. Attacker declares attack type (protest, throwing, invasion, etc.)
3. Defender may play Defense card from hand
4. Roll die for certain actions (if required)
5. Apply damage/effects

### Damage Types

- **Population Damage:** Reduce target's population cards
- **Building Damage:** Reduce target's building HP
- **Control Effects:** Skip turns, redirect attacks, etc.

### Defense Resolution

Defender can play ONE defense card per attack:

- Must match attack type (Security vs Throwing, Counter-Protesters vs Protests)
- Some defenses reduce damage, others negate completely
- Defender draws replacement card immediately

---

## Random Events

Roll 1d10 at start of each round:

| Roll | Event                        | Effect                                 |
| ---- | ---------------------------- | -------------------------------------- |
| 1    | **Third Party Interference** | All factions lose 5 million population |
| 2    | **Scandal Breaks**           | Random faction loses 10 million        |
| 3    | **Viral Moment**             | Random faction gains 10 million        |
| 4    | **Media Blackout**           | No propaganda this round               |
| 5    | **Police Crackdown**         | Protests do 50% damage this round      |
| 6-7  | **No Event**                 | Continue normally                      |
| 8    | **Unity Moment**             | Peacetime declared (if in Conflict)    |
| 9    | **Supply Drop**              | All players draw 1 extra card          |
| 10   | **Chaos Reigns**             | Roll twice more, both happen           |

---

## Elimination & Final Retaliation

### When Population Reaches 0

1. Faction is eliminated
2. **Final Retaliation (Last Stand):**
   - Eliminated player reveals entire hand
   - Can immediately launch ALL Organizations + Action Plans
   - Can play all Covert Ops
   - Choose targets for each
   - Resolve in order declared
3. If Final Retaliation eliminates another player, THAT player gets Final Retaliation
4. Chain reaction can eliminate multiple players
5. Game ends when chain resolves

### When Building Reaches 0

- Building is destroyed but faction survives with population
- Lose special ability permanently
- Cannot use defensive actions
- Vulnerable to direct population attacks
- More likely to be eliminated

### When Building is Captured

- Attacker controls building
- Original owner loses special ability
- Original owner continues with population
- Counts toward attacker's win condition (need 3 buildings to win)

---

## Win Conditions

### Victory Methods

**1. Last Faction Standing**

- All other factions eliminated (population = 0)
- Classic win

**2. Building Domination**

- Control 3 or more buildings (your own + captured)
- Immediate win

**3. Population Superiority** (Optional Rule)

- If 20 rounds pass, faction with most population wins
- Tiebreaker: Building HP

### Total Annihilation (No Winner)

- If Final Retaliation chain eliminates all remaining factions
- Everyone loses
- High score board shows stats
- Most common ending!

---

## Strategy Tips

### MAFA Strategy

- Use Rally Call early in Peacetime to build population lead
- Favor direct throwing attacks over protests
- Aggressive early game, defensive late game

### BLAM Strategy

- Mass Mobilization after opponent uses defenses
- Target multiple enemies to avoid retaliation chains
- Keep population spread, don't make yourself biggest target

### Aunty Fafa Strategy

- Save Black Bloc for critical building attacks
- Use risky actions (Molotovs) without fear
- Bait opponents into attacking your fortified building

### Proud Gals Strategy

- Fortify early, build Organization + Action combos
- Play defensive until you have overwhelming force
- Counter-attack when enemies are weakened

### LMNOP Strategy

- Maximize propaganda in Peacetime
- Pride Parade + invasion combo is deadly
- Avoid early conflicts, let others weaken each other

---

## AI Opponent Behaviors

### Difficulty Levels

- **Easy:** Random actions, poor targeting
- **Medium:** Basic strategy, targets weakest
- **Hard:** Adaptive strategy, exploits weaknesses
- **Chaos:** Completely unpredictable (most fun!)

### AI Personalities

Each faction has unique AI behavior:

- **MAFA AI:** Always attacks strongest opponent, aggressive
- **BLAM AI:** Distributes attacks evenly, collective action
- **Aunty Fafa AI:** Random targeting, high-risk plays
- **Proud Gals AI:** Builds defenses first, patient
- **LMNOP AI:** Propaganda heavy, avoids conflict until forced

---

## Multiplayer Modes

### Solo vs AI

- 1 human player vs 4 AI opponents
- Classic mode
- Choose your faction

### Hot Seat Multiplayer

- 2-5 human players on same device
- Pass and play
- Take turns revealing cards

### Online Multiplayer (Future)

- Real-time matches
- Spectator mode
- Tournament brackets

---

## Scoring System

### Points Awarded

- **Eliminate opponent:** 10 points
- **Eliminate via propaganda:** 15 points (harder)
- **Eliminate via retaliation:** 5 points (easier)
- **Capture building:** 20 points
- **Win by domination:** 50 points
- **Survival bonus:** 25 points
- **Position points:** 5 per faction eliminated before you

### Leaderboard

Global leaderboard tracks:

- Total wins
- Total eliminations
- Buildings captured
- Propaganda victories
- Longest win streak
- Faction-specific stats

---

## Visual Design

### Art Style

Satirical political cartoon aesthetic

- Exaggerated character designs
- Bold colors per faction
- Comic-style action effects
- Retro cold-war propaganda poster influence

### UI Elements

- Faction portraits with stats
- Building health bars
- Population counters
- Card hand display
- Action queue (3 face-down cards)
- Event log/history

### Animations

- Missile/protest march paths between buildings
- Explosion effects for building damage
- Population migration (propaganda)
- Building destruction sequence
- Victory/defeat animations

---

## Technical Implementation Notes

### Technology Stack

- **Frontend:** React + Canvas/SVG
- **Backend:** Node.js + Express
- **Database:** PostgreSQL
- **Real-time:** Socket.io
- **Deployment:** Vercel + Railway

### Game State Management

- Track each faction's:
  - Current population (sum of cards)
  - Building HP (0-100+)
  - Cards in hand
  - Cards in queue (face-down)
  - Organizations in play
  - Active effects/modifiers
- Track game state:
  - Phase (Peacetime/Conflict)
  - Current turn player
  - Round number
  - Event history

### Card Deck Composition

- **Covert Ops:** 20 cards
- **Propaganda:** 15 cards
- **Organizations:** 20 cards
- **Action Plans:** 30 cards
- **Defenses:** 15 cards
- **Total:** 100 card deck

### Population Cards

- 1 million: 10 cards
- 5 million: 8 cards
- 10 million: 6 cards
- 15 million: 4 cards
- 25 million: 2 cards
- **Total:** 30 population cards

---

## Development Roadmap

### Week 1 (Contest Entry)

- [ ] Core game engine
- [ ] Single-player vs AI
- [ ] All 5 factions functional
- [ ] Basic UI/visuals
- [ ] Leaderboard
- [ ] Deploy live demo

### Future Enhancements

- [ ] Online multiplayer
- [ ] Mobile app version
- [ ] Additional factions
- [ ] Custom game modes
- [ ] Replay system
- [ ] Achievements
- [ ] Faction customization

---

## Credits & Inspiration

**Original Game:** Nuclear War by Douglas Malewicki (1965)
**Published by:** Flying Buffalo Games

**Our Adaptation:** Political War

- Reimagines nuclear conflict as political/social activism
- Replaces missiles with protests, propaganda, prayers
- Adds building capture mechanics
- Modernizes for web play

---

## Legal & Content Notes

This is a work of **satire and parody** featuring:

- Fictional faction names (MAFA, BLAM, Aunty Fafa, Proud Gals, LMNOP)
- Dark comedy about political conflict
- No endorsement of real-world violence
- Educational commentary on group dynamics and game theory

**Rating:** Mature (17+) for political themes and dark humor

---

## Appendix: Full Card List

### Covert Ops (20 cards)

1. Scandal Leak (×3)
2. Infiltrator (×2)
3. Inside Job (×2)
4. Blackmail (×2)
5. Double Agent (×2)
6. Media Blackout (×2)
7. Viral Moment (×3)
8. Defector (×2)
9. Sabotage (×2)

### Propaganda (15 cards)

1. Social Media Blitz (×4)
2. Meme Warfare (×3)
3. Fake News (×2)
4. Radio Campaign (×3)
5. Door-to-Door (×3)

### Organizations (20 cards)

1. Protest Group (×6)
2. Prayer Circle (×4)
3. Strike Team (×5)
4. Media Network (×3)
5. Defense Force (×2)

### Action Plans (30 cards)

1. Peaceful March (×4)
2. Disruptive Protest (×3)
3. Riot (×2)
4. Sit-In (×2)
5. Prayer Circle (×3)
6. Blessing (×2)
7. Curse (×2)
8. Eggs (×3)
9. Paint/Graffiti (×3)
10. Bricks (×3)
11. Molotovs (×2)
12. Raid (×3)

### Defenses (15 cards)

1. Security Detail (×3)
2. Counter-Protesters (×3)
3. Legal Team (×3)
4. Bomb Shelter (×2)
5. Fortification (×2)
6. Media Spin (×2)

---

**END OF GAME DESIGN DOCUMENT**
