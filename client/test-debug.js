const { GameEngine } = require('./src/utils/gameEngine.ts');
const { FactionType } = require('./src/shared/types/index.ts');

const engine = new GameEngine(FactionType.AUNTY_FAFA);
const state = engine.getState();
const target = state.factions[1];

console.log('Target ID:', target.id);
console.log('Initial population:', target.totalPopulation);
console.log('Population cards:', target.population.map(p => p.value));

// Try to eliminate
engine.damagePopulation(target.id, target.totalPopulation);

const newState = engine.getState();
const updatedTarget = newState.factions[1];
console.log('After damage:');
console.log('Is eliminated:', updatedTarget.isEliminated);
console.log('Total population:', updatedTarget.totalPopulation);
console.log('Population cards:', updatedTarget.population.map(p => p.value));
