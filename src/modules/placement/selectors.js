import { createSelector } from 'reselect';
import { hasIndustrialComplex } from '../../lib/territory';
import { getCurrentPower } from '../../selectors/getCurrentPower';
import { mergeBoardAndTerritories } from '../../selectors/mergeBoardAndTerritories';

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
