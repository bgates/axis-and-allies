import { sameSide } from '../config/initialPowers'
import { isNotSubmerged } from './unit'

export const isLand = (territory) => !territory.sea;
export const isSea = (territory) => territory.sea;

export const isChina = (territory) => territory.originalPower === 'China'; 

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

export const passableBySeaUnit = (territory, currentPower) => {
  return territory.sea && isFriendly(territory, currentPower)
}

export const hasIndustrialComplex = (territory) => {
  return territory.units.some(unit => unit.name === 'industrial complex')
}

export const unitCount = (units, 
  unitName, 
  power, 
  unmovedOnly = false, 
  notUsedInBattleOnly = true, 
  jointStrike = false) => {
  //if (arguments.length<2) powerIndex=this.holdingPowerIndex;
  return units.filter(unit => {
    return unit.name === unitName && 
      (unit.power === power || (jointStrike && unit.power === 'UK')) &&
      (unmovedOnly || !unit.moved) &&
      (notUsedInBattleOnly || !unit.usedInBattle)
  }).reduce((total, unit) => total + unit.ids.length)
}
