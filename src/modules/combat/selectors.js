import { createSelector } from 'reselect';
import { combatants as originalCombatants } from '../planCombat';
import { getFocusTerritory } from '../../selectors/mergeBoardAndTerritories';
import { unitCount } from '../../lib/unit';
export { getFocusTerritory }

export const rollCount = createSelector(
  originalCombatants,
  combatants => (combatants.attackers.concat(combatants.defenders)).reduce(unitCount, 0)
)

const modify = (combatants) => {
  let { attackers } = combatants
  const artilleryCount = attackers.filter(u => u.name === 'artillery').reduce((total, unit) => total + unit.ids.length, 0)
  const infantryCount = attackers.filter(u => u.name === 'infantry').reduce((total, unit) => total + unit.ids.length, 0)
  if (infantryCount > artilleryCount) {
    // need separate units
    const infantry = attackers.find(u => u.name === 'infantry')
    const supportedIds = infantry.ids.slice(0, artilleryCount)
    const unsupportedIds = infantry.ids.slice(artilleryCount)
    const supported = { ...infantry, attack: 2, ids: supportedIds }
    const unsupported = { ...infantry, ids: unsupportedIds }
    const newAttackers = [ unsupported, supported, ...attackers.filter(u => u !== infantry) ]
    return { attackers: newAttackers, defenders: combatants.defenders }
  } else if (artilleryCount) {
    const newAttackers = attackers.map(u => u.name === 'infantry' ? { ...u, attack: 2 } : u)
    return { attackers: newAttackers, defenders: combatants.defenders }
  }
  return combatants
}

export const combatants = createSelector(
  originalCombatants,
  combatants => modify(combatants)
)

export const attackerCasualties = createSelector(
  getFocusTerritory,
  territory => territory.attackerCasualties || []
)
