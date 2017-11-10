import { createSelector } from 'reselect';
import { hasIndustrialComplex } from '../../selectors/getTerritory';
import { getCurrentPower } from '../../selectors/getCurrentPower';
import { mergeBoardAndTerritories } from '../../selectors/mergeBoardAndTerritories';
//TODO: not using hasIndustrialComplex right
const canBuild = currentPower => territory => (     
  territory.units &&
  hasIndustrialComplex(territory) && 
  !territory.newlyConquered && 
  territory.currentPower === currentPower.name
)

const canBuildShips = currentPower => territory => (
  canBuild(currentPower) &&
  territory.harbor
)

export const industrialComplexes = createSelector(
  mergeBoardAndTerritories,
  getCurrentPower,
  (territories, currentPower) => territories.filter(canBuild(currentPower))
)

export const shipyards = createSelector(
  mergeBoardAndTerritories,
  getCurrentPower,
  (territories, currentPower) => territories.filter(canBuildShips(currentPower))

)

export const purchases = state => state.purchases

export const availables = createSelector(
  state => state.placement,
  purchases,
  (placement, purchases) => {
    const available = { ...purchases }
    Object.keys(placement).forEach(unit => {
      const placed = Object.values(placement[unit]).reduce((total, n) => total + n, 0)
      available[unit] = available[unit] - placed
    })
    return available
  }
)
