import { createSelector } from 'reselect'
import { getCurrentPowerName } from '../../selectors/getCurrentPower'
import { mergeBoardAndTerritories } from '../../selectors/getTerritory'

const hasDamagedShips = (territory) => {
  return territory.units.some(u => u.type.includes('damaged'))
}

const getFriendlyHarbor = (board, power) => {
  return board.filter(territory => territory.seaPort && territory.currentPower === power)
}

const damagedShipsInHarbor = (board, power) => {
   return getFriendlyHarbor(board, power).filter(hasDamagedShips)
}

export const hasDamagedShipsInHarbor = createSelector(
  mergeBoardAndTerritories,
  getCurrentPowerName,
  (board, power) => damagedShipsInHarbor(board, power).length > 0
)
