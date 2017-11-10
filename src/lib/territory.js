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

export const bomberPayload = (territory) => (  
  territory.unitsFrom.reduce((total, unit) => total + bombCapacity(unit), 0)
)

export const allUnits = (territory) => (
  (territory.units || []).concat(territory.unitsFrom || [])
)

export const conquered = (territory, currentPower) => {
  let updatedTerritory = { ...territory, unitsFrom: [], units: territory.unitsFrom }
  if (territory.currentPower !== 'Oceans') {
    updatedTerritory.currentPower = currentPower
    updatedTerritory.newlyConquered = true
  }
  return updatedTerritory
}
