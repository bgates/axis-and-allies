import { createSelector } from 'reselect'
import { hasIndustry } from '../rocketAttack'
import { getRecentlyConquered } from '../landPlanes'
import { hasIndustrialComplex, mergeBoardAndTerritories } from '../../selectors/getTerritory'
import { getCurrentPower } from '../../selectors/getCurrentPower'

const canBuild = (currentPower, conquered) => territory => (     
  territory.currentPower === currentPower.name &&
  hasIndustry(territory) &&
  !conquered.includes(territory.index)
)

export const industrialComplexes = createSelector(
  mergeBoardAndTerritories,
  getCurrentPower,
  getRecentlyConquered,
  (territories, currentPower, conquered) => territories.filter(canBuild(currentPower, conquered))
)

export const shipyards = createSelector(
  industrialComplexes,
  territories => territories.filter(territory => territory.harbor)
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
