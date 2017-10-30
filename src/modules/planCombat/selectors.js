import { createSelector } from 'reselect'
import { getCurrentPower, getCurrentPowerName } from '../../selectors/getCurrentPower'
import { 
  getAllUnits,
  getFocusTerritory, 
  mergeBoardAndTerritories 
} from '../../selectors/getTerritory'
import { combineUnits } from '../../selectors/units'
import { combatUnitsInRange } from './movement'
import { allyOf, enemyOf } from '../../config/initialPowers'
import { nonIndustry, unitCount, totalCount } from '../../lib/unit'
import { allUnits, isLand } from '../../lib/territory'
export { getCurrentPower, getFocusTerritory }

const committedUnits = (state) => []

export const unitsInRange = createSelector(
  mergeBoardAndTerritories,
  getCurrentPower,
  getFocusTerritory,
  committedUnits,
  combatUnitsInRange
)

const amphibFor = ({ amphib }, board) => {
  return Object.keys(amphib).reduce((array, id) => {
    const territory = board[amphib[id]];
    const transport = (allUnits(territory)).find(unit => unit.ids.includes(id));
    return array.concat(transport.cargo[id]);
  }, [])
}

const _combatants = (currentPower, territory, units, unitIds) => {
  const combatUnits = territory.units.filter(nonIndustry)
  let attackers = combatUnits
    .filter(allyOf(currentPower))
    .concat(unitIds.map(id => units[id]))
    .reduce(combineUnits, [])
  let defenders = combatUnits
    .filter(enemyOf(currentPower))
    .reduce(combineUnits, [])
    /*if (territory.amphib) {
    attackers = attackers.concat(amphibFor(territory, board))
  }*/
  //attackers = consolidateUnits(attackers)
  if (territory.dogfight) {
    defenders = defenders.filter(u => u.air && !u.name.includes('strategic'))
    attackers = attackers.filter(u => u.air)
  }
  return { attackers, defenders }
}

const getMovedUnitIds = state => state.movements.destination

export const committed = createSelector(
  getFocusTerritory,
  getMovedUnitIds,
  ({ index }, movedUnitIds) => movedUnitIds[index] || []
)

export const combatants = createSelector(
  getCurrentPowerName,
  getFocusTerritory,
  getAllUnits,
  committed,
  (currentPower, territory, units, unitIds) => _combatants(currentPower, territory, units, unitIds)
)

export const landingSlots = createSelector(
  getCurrentPower,
  getFocusTerritory,
  (currentPower, territory) => {
    if (isLand(territory)) {
      return 1000
    }
    const requiredLandingSlots = territory.units.filter(unit => unit.air && unit.distance === unit.movement)
      .reduce(totalCount, 0)
    if (!requiredLandingSlots) {
      return 1000
    }
    const totalLandingSlots = allUnits(territory).filter(unit => unit.power === currentPower.name && unit.landingSlots)
      .reduce((total, unit) => total + unitCount(unit) * unit.landingSlots, 0)
    return totalLandingSlots - requiredLandingSlots
  }
)
