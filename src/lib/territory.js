import { sameSide } from '../config/initialPowers'
import { isNotSubmerged, bombCapacity } from './unit'
import { mergeBoardAndTerritories } from '../selectors/mergeBoardAndTerritories'
import { STRATEGIC_BOMB } from '../actions'

export const isLand = (territory) => !territory.sea;
export const isSea = (territory) => territory.sea;

export const isChina = (territory) => territory.original_power === 'China' || ['Hong Kong', 'Shantung', 'Shansi', 'Peking', 'Chahar', 'Northern Manchuria', 'Manchuria', 'Korea', 'Burma'].includes(territory.name); 

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

export const isAttackable = (territory, currentPower) => {
  const unfriendly = !isFriendly(territory, { name: currentPower }) 
  if (currentPower === 'China') {
    return isChina(territory) && unfriendly
  } else {
    return isSea(territory) || unfriendly
  }
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

export const isBombardable = (board, territory, currentPower) => {
  if (!territory.bombardmentOver) {
    let territories = territory.adjacentIndexes.map(index => board[index]).filter(isSea);
    const cp = territories.reduce((units, territory) => {
      return units.concat(allUnits(territory).filter(unit => {
        return unit.canBombard && unit.power === currentPower
      }))
    }, []);
  }
}
export const awaitingNavalResolution = (territory, state) => {
  if (isAmphib(territory)) {
    const neighbors = mergeBoardAndTerritories(state).filter(t => Object.values(territory.amphib).includes(t.index))
    return neighbors.some(n => isCombat(n))
  }
}
