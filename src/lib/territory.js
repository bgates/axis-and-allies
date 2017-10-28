import { sameSide } from '../config/initialPowers'
import { isNotSubmerged, bombCapacity, canBombard } from './unit'
import { mergeBoardAndTerritories } from '../selectors/mergeBoardAndTerritories'
import { STRATEGIC_BOMB } from '../actions'

export const isLand = (territory) => !territory.sea;
export const isSea = (territory) => territory.sea;

export const isEnemy = (territory, currentPowerName) => {
  let rulingPower = territory.currentPower
  if (rulingPower && !['Neutrals', 'Oceans'].includes(rulingPower)) {
    return !sameSide(rulingPower, currentPowerName)
  }
  return territory.units.some(unit => !sameSide(unit.power, currentPowerName))
}

export const nonNeutral = (territory) => !isNeutral(territory);

const isOccupied = (territory, currentPower, checkLandUnits = true,checkSeaUnits = true, checkAirUnits = true, checkStrategicBombUnits) => {
  if (checkStrategicBombUnits && territory.units.some(unit => unit.strategicBombingRaid)) {
    return true
  }
  return territory.units.some(unit => {
    return isNotSubmerged(unit) &&
      unit.power !== currentPower && (
        (checkLandUnits && unit.land) || 
        (checkSeaUnits && unit.ship && !unit.transport) ||
        (checkAirUnits && unit.air)) 
  })
}

export const isEnemyOccupied = (territory, currentPower, checkLandUnits, checkSeaUnits, checkAirUnits, checkStrategicBombUnits) => {
  return isOccupied(territory, currentPower, checkLandUnits,checkSeaUnits, checkAirUnits, checkStrategicBombUnits)
}

export const isNeutral = (territory) => territory.currentPower === 'Neutrals'

export const isFriendly = (territory, currentPower) => {
  return !isNeutral(territory) && !isEnemy(territory, currentPower.name)
}

export const passableByLandUnit = (territory, currentPower) => {
  return isLand(territory) && isFriendly(territory, currentPower)
}

const canalOpenIfPresent = (territory, currentPower, board, lastTerritory) => {
  return !territory.canalToIndex || 
    territory.canalToIndex !== lastTerritory.index ||
    isFriendly(board[territory.canalControlIndex], currentPower)
}

export const passableBySeaUnit = (territory, currentPower, board, lastTerritory) => {
  return territory.sea && isFriendly(territory, currentPower) && 
    canalOpenIfPresent(territory, currentPower, board, lastTerritory)
}

export const hasIndustrialComplex = (territory) => {
  return territory.units.some(unit => unit.name === 'industrial complex')
}

export const bomberPayload = (territory) => (  
  territory.unitsFrom.reduce((total, unit) => total + bombCapacity(unit), 0)
)

export const allUnits = (territory) => (
  (territory.units || []).concat(territory.unitsFrom || [])
)

const isAmphib = (territory) => territory.amphib && Object.keys(territory.amphib).length

export const isCombat = (territory) => (
  (territory.unitsFrom.length && territory.units.length) || isAmphib(territory)
)

export const isDogfightable = (territory) => (
  territory.units.find(u => u.air) && territory.unitsFrom.find(u => u.air)
)

export const isBombed = (territory) => (
  territory.unitsFrom.find(u => u.mission === STRATEGIC_BOMB)
)

export const bombardmentCapableUnits = (board, targetTerritory, currentPower) => {
    let territories = targetTerritory.adjacentIndexes.map(index => board[index]).filter(isSea)
    return territories.reduce((units, territory) => {
      return units.concat(allUnits(territory).filter(unit => {
        return canBombard(unit) && 
          unit.mission !== 'complete' && 
          unit.power === currentPower.name &&
          (!unit.bombard || Object.keys(unit.bombard).length < unit.ids.length || Object.values(unit.bombard).includes(targetTerritory.index))
      })
      .map(unit => ({ ...unit, locationIndex: territory.index })))
    }, [])
}

export const isBombardable = (territory, currentPower, state) => {
  if (!territory.bombardmentOver) {
    const board = mergeBoardAndTerritories(state)
    const units = bombardmentCapableUnits(board, territory, currentPower)
    return !!units.length
  }
}

export const awaitingNavalResolution = (territory, state) => {
  if (isAmphib(territory)) {
    const neighbors = mergeBoardAndTerritories(state).filter(t => Object.values(territory.amphib).includes(t.index))
    return neighbors.some(n => isCombat(n))
  }
}

export const conquered = (territory, currentPower) => {
  let updatedTerritory = { ...territory, unitsFrom: [], units: territory.unitsFrom }
  if (territory.currentPower !== 'Oceans') {
    updatedTerritory.currentPower = currentPower
    updatedTerritory.newlyConquered = true
  }
  return updatedTerritory
}
