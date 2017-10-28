import { createSelector } from 'reselect'
import { sameSide } from '../config/initialPowers'
import territoryData from '../config/territories.json'

export const getAllUnits = (state) => state.units

export const getTerritoryData = (_, territoryIndex) => territoryData[territoryIndex]

export const getTerritory = (state, territoryIndex) => state.territories[territoryIndex]

export const getTerritoryUnits = createSelector(
  getTerritory,
  getAllUnits,
  (territory, units) => territory.unitIds.map(id => units[id])
)

export const isEnemy = ({ currentPower, unitIds }, activePower, units) => {
  if (currentPower && !['Neutrals', 'Oceans'].includes(currentPower)) {
    return !sameSide(currentPower, activePower)
  }
  return unitIds.map(id => units[id]).some(unit => !sameSide(unit.power, activePower))
}

