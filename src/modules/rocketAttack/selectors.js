import { createSelector } from 'reselect';
import { getCurrentPower } from '../../selectors/getCurrentPower';
import { mergeBoardAndTerritories } from '../../selectors/mergeBoardAndTerritories';
import { territoriesInRange } from '../planCombat/movement';
import { isEnemy } from '../../lib/territory';
import { hasIndustrialComplex } from '../../selectors/getTerritory'
//TODO: not using hasIndustrialComplex right
const industrialComplexInRocketRange = (board, currentPower, territory) => {
  const all = () => true
  const ranges = territoriesInRange(board, currentPower, territory, all, 2)
  let territories = Object.values(ranges).reduce((total, one) => total.concat(one), [])
  return territories
    .filter(hasIndustrialComplex)
    .filter(territory => isEnemy(territory, currentPower.name))
}

const territoriesWithRockets = (board, currentPower) => {
  return board.filter(territory => {
    return territory.currentPower === currentPower.name && 
      territory.units.some(unit => unit.name === 'anti-aircraft gun')
  })
}

const _rocketTargets = (board, currentPower) => {
  return territoriesWithRockets(board, currentPower).map(territory => industrialComplexInRocketRange(board, currentPower, territory))
}

export const rocketTargets = createSelector(
  getCurrentPower,
  mergeBoardAndTerritories,
  (currentPower, board) => _rocketTargets(board, currentPower)
)
