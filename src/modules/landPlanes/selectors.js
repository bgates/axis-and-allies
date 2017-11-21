import { createSelector } from 'reselect'
import { getCurrentPower } from '../../selectors/getCurrentPower'
import { 
  getCurrentTerritoryIndex,
  getFocusTerritory,
  getMovedUnitIds,
  isLand,
  mergeBoardAndTerritories, 
  nonNeutral
} from '../../selectors/getTerritory'
import { getAllUnits } from '../../selectors/units'
import { territoriesInRange, getFlights } from '../planCombat'
import unitTypes from '../../config/unitTypes'
import { sameSide } from '../../config/initialPowers'
export { getFocusTerritory }

export const getRecentlyConquered = state => state.conquered

const unitsWithRange = (moved, flights, units, territoryIndex) => (
  moved[territoryIndex].filter(id => flights[id]).map(id => (
   { ...units[id], distance: unitTypes[units[id].type].movement - flights[id] }
  ))
)

export const airUnits = createSelector(
  getMovedUnitIds,
  getFlights,
  getAllUnits,
  getCurrentTerritoryIndex,
  unitsWithRange
)

export const selectedOptions = state => state.landPlanes

const availableForLanding = (currentPower, conquered) => territory => (
  isLand(territory) && 
  !conquered.includes(territory.index) && 
  sameSide(territory.currentPower, currentPower.name)
)

const landingOptionsByUnit = (board, currentPower, territory, airUnits, conquered) => {
  let landingOptions = {}
  airUnits.forEach(unit => {
    const territories = Object.values(territoriesInRange(board, currentPower, territory, nonNeutral, unit.distance)).reduce((all, elm) => all.concat(elm), [])
    landingOptions[unit.id] = territories.filter(availableForLanding(currentPower, conquered))
  })
  return landingOptions
}

export const landingOptions = createSelector(
  mergeBoardAndTerritories,
  getCurrentPower,
  getFocusTerritory,
  airUnits,
  getRecentlyConquered,
  landingOptionsByUnit
)

export const planesInAir = createSelector(
  getFlights,
  flightDistance => Object.keys(flightDistance).length
)

export const allLandingsPlanned = state => (
  planesInAir(state) === Object.keys(state.landPlanes).length
)
