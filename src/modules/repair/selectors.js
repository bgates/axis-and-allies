import { createSelector } from 'reselect';
import { getCurrentPower } from '../../selectors/getCurrentPower';
import { mergeBoardAndTerritories } from '../../selectors/mergeBoardAndTerritories';

const hasDamagedShips = (territory) => {
  return territory.units.some(u => u.name.includes('damaged'))
}

const getFriendlyHarbor = (board, power) => {
  return board.filter(territory => territory.seaPort && territory.currentPower === power.name)
}

const damagedShipsInHarbor = (board, power) => {
   return getFriendlyHarbor(board, power).filter(hasDamagedShips)
}

export const hasDamagedShipsInHarbor = createSelector(
  getCurrentPower,
  mergeBoardAndTerritories,
  (power, board) => damagedShipsInHarbor(board, power).length > 0
)
