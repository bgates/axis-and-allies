import { createSelector } from 'reselect'
import { hasIndustry } from '../rocketAttack'
import { getRecentlyConquered } from '../landPlanes'
import { 
  getTerritoriesWithIpcValues,
  hasIndustrialComplex, 
  mergeBoardAndTerritories 
} from '../../selectors/getTerritory'
import { getCurrentPower } from '../../selectors/getCurrentPower'
import unitTypes from '../../config/unitTypes'

export const purchases = state => state.purchases

const getPlacement = state => state.placement

const canBuild = (currentPower, conquered) => territory => (     
  territory.currentPower === currentPower.name &&
  hasIndustry(territory) &&
  !conquered.includes(territory.index)
)

const indexMatch = a => b => a.index === b.index 

const ipcAndCapacity = (complex, territories, capacities) => {
  const ipc = territories.find(indexMatch(complex)).ipc_value
  const usedCapacity = capacities[complex.index] || 0
  return { ipc, usedCapacity, remainingCapacity: 7 * ipc - usedCapacity }
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

export const industrialComplexes = createSelector(
  mergeBoardAndTerritories,
  getCurrentPower,
  getRecentlyConquered,
  getPlacement,
  getTerritoriesWithIpcValues,
  complexesWithCapacity
)

export const shipyards = createSelector(
  industrialComplexes,
  territories => territories.filter(territory => territory.harbor)
)

export const availables = createSelector(
  getPlacement,
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
//TODO: capacity - each IC can produce units w total cost = 7 * territory IPC value
