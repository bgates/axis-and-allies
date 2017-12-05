import { createSelector } from 'reselect'
import { hasIndustry } from '../rocketAttack'
import { 
  getPlacement,
  getPurchases as getAllPurchases, 
  getRecentlyConquered 
} from '../../selectors/stateSlices'
import { 
  getTerritoriesWithIpcValues,
  mergeBoardAndTerritories 
} from '../../selectors/getTerritory'
import { getCurrentPowerName } from '../../selectors/getCurrentPower'
import { previousPhase } from '../../selectors/previousPhase'
import unitTypes from '../../config/unitTypes'
export { previousPhase }

const CHINA_PRODUCTION_DIVISOR = 2
const INDUSTRY_PRODUCTION_MULTIPLIER = 7

const chinese = territory => territory.currentPower === 'China'
const chineseInfantry = territories => Math.round(territories.filter(chinese).length / CHINA_PRODUCTION_DIVISOR)

const chineseUnits = territories => (
  { 'infantry': chineseInfantry(territories) }
)

export const getPurchases = createSelector(
  getAllPurchases,
  getCurrentPowerName,
  mergeBoardAndTerritories,
  (purchases, currentPower, territories) => (
    currentPower === 'China' ? chineseUnits(territories) : purchases
  )
)

const canBuild = (currentPower, conquered) => territory => (     
  territory.currentPower === currentPower &&
  hasIndustry(territory) &&
  !conquered.includes(territory.index)
)

const indexMatch = a => b => a.index === b.index 

const ipcAndCapacity = (complex, territories, capacities) => {
  const ipc = territories.find(indexMatch(complex)).ipc_value
  const usedCapacity = capacities[complex.index] || 0
  return { ipc, usedCapacity, remainingCapacity: INDUSTRY_PRODUCTION_MULTIPLIER * ipc - usedCapacity }
}

const capacityUsedBy = placement => {
  let capacities = {}
  Object.keys(placement).forEach(type => {
    const units = placement[type]
    const cost = unitTypes[type].cost
    Object.keys(units).forEach(index => {
      capacities[index] = (capacities[index] || 0) + units[index] * cost
    })
  })
  return capacities
}

const complexesWithCapacity = (territories, currentPower, conquered, placement, ipcTerritories) => {
  const complexes = territories.filter(canBuild(currentPower, conquered))
  const capacities = capacityUsedBy(placement)
  return complexes.map(complex => (
    { ...complex, ...ipcAndCapacity(complex, ipcTerritories, capacities)})
  )
}

const chineseCapacity = (territory, placement, territories) => {
  const usedCapacity = (placement.infantry || {})[territory.index] || 0
  const fullCapacity = 2 * territories.find(indexMatch(territory)).ipc_value + 1
  return { usedCapacity, remainingCapacity: fullCapacity - usedCapacity }
}

const chineseProductionCapacity = (territories, placement, ipcTerritories) => {
  return territories.filter(chinese).map(territory => (
    { ...territory, ...chineseCapacity(territory, placement, ipcTerritories) }
  ))
}

const territoriesWithCapacity = (territories, currentPower, conquered, placement, ipcTerritories) => (
  currentPower === 'China' ? 
    chineseProductionCapacity(territories, placement, ipcTerritories) : 
    complexesWithCapacity(territories, currentPower, conquered, placement, ipcTerritories)
)

export const industrialComplexes = createSelector(
  mergeBoardAndTerritories,
  getCurrentPowerName,
  getRecentlyConquered,
  getPlacement,
  getTerritoriesWithIpcValues,
  territoriesWithCapacity
)

export const shipyards = createSelector(
  industrialComplexes,
  territories => territories.filter(territory => territory.harbor)
)

export const availables = createSelector(
  getPlacement,
  getPurchases,
  (placement, purchases) => {
    const available = { ...purchases }
    Object.keys(placement).forEach(unit => {
      const placed = Object.values(placement[unit]).reduce((total, n) => total + n, 0)
      available[unit] = available[unit] - placed
    })
    return available
  }
)
