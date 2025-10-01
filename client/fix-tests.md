# Test Fixes Needed

## Pattern Replacements:

1. Replace `state.factions[X].isEliminated = true` with `engine.setFactionEliminated(state.factions[X].id, true)`
2. Replace `state.factions[X].population = [...]` and `state.factions[X].totalPopulation = Y` with `engine.setFactionPopulation(state.factions[X].id, Y)`
3. Replace `state.factions[X].buildingHP = Y` with `engine.setFactionBuildingHP(state.factions[X].id, Y)`
4. Replace `state.factions[X].capturedBuildings = [...]` with `engine.setFactionCapturedBuildings(state.factions[X].id, [...])`
5. Replace `attacker.organizations.push(mockOrg)` with `engine.addOrganizationToFaction(attacker.id, mockOrg)`
6. Replace `state.phase = GamePhase.CONFLICT` with `engine.setPhase(GamePhase.CONFLICT)`

This ensures tests manipulate the actual internal state, not a copy.
