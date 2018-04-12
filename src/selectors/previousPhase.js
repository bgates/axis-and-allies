import { createSelector } from 'reselect'
import { 
  getFlights,
  getPhase, 
  getPurchases, 
  getResearch 
} from './stateSlices'
import { getCurrentPower } from './getCurrentPower'
import { isCombat } from './combatSubphase'
import { planesInAir } from '../modules/postCombat/landPlanes'
import { 
  hasDamagedShipsInHarbor,
  currentPowerHasRockets 
} from '../modules/preCombat'
import PATHS from '../paths'

const territoryInCombat = state => index => isCombat(state, index)
export const noCombat = state => {
  const { unitDestination, amphib } = state
  return !(Object.keys(unitDestination).find(territoryInCombat(state)) ||
         Object.keys(amphib.territory).find(territoryInCombat(state)))
}

const beforePurchase = ({ minimum }, hasRockets) => {
  if (minimum.includes(PATHS.ROCKET_RESULTS)) {
    return PATHS.ROCKET_RESULTS
  } else if (hasRockets) {
    return PATHS.ROCKETS
  } else if (minimum.includes(PATHS.RESEARCH_RESULTS)) {
    return PATHS.RESEARCH_RESULTS
  } else {
    return PATHS.RESEARCH
  }
}

const beforePlanAttacks = ({ name }) => (
  name === 'US' ? PATHS.LEND_LEASE : name === 'China' ? 'start' : PATHS.INCOME
)

const beforePlanMovement = ({ name }, flights, noCombat) => {
  if (Object.keys(flights).length) {
    return name === 'USSR' ? 'russian-winter' : PATHS.LAND_PLANES
  } else if (noCombat) {
    return PATHS.PLAN_ATTACKS
  } else {
    return PATHS.RESOLVE_COMBAT
  }
}

const canPlace = createSelector(
  getCurrentPower,
  getPurchases,
  (currentPower, purchases) => currentPower.name === 'China' || Object.keys(purchases).length
)

export const previousPhase = createSelector(
  getCurrentPower,
  currentPowerHasRockets,
  hasDamagedShipsInHarbor,
  getFlights,
  noCombat,
  getPhase,
  (currentPower, hasRockets, hasDamagedShips, flights, noCombat, phase) => {
    const phases = {
      [PATHS.REPAIR]: () => 'start',
      [PATHS.RESEARCH]: () => hasDamagedShips ? PATHS.REPAIR : 'start',
      [PATHS.RESEARCH_RESULTS]: () => PATHS.RESEARCH_RESULTS,
      [PATHS.ROCKETS]: () => phase.minimum.includes(PATHS.RESEARCH_RESULTS) ? PATHS.RESEARCH_RESULTS : PATHS.RESEARCH,
      [PATHS.ROCKET_RESULTS]: () => PATHS.ROCKET_RESULTS,
      [PATHS.PURCHASE]: () => beforePurchase(phase, hasRockets),
      [PATHS.INCOME]: () => PATHS.PURCHASE,
      [PATHS.LEND_LEASE]: () => PATHS.INCOME,
      [PATHS.PLAN_ATTACKS]: () => beforePlanAttacks(currentPower),
      [PATHS.RESOLVE_COMBAT]: () => PATHS.PLAN_ATTACKS,
      [PATHS.LAND_PLANES]: () => PATHS.RESOLVE_COMBAT,
      [PATHS.PLAN_MOVEMENT]: () => beforePlanMovement(currentPower, flights, noCombat),
      'russian-winter': () => PATHS.PLAN_MOVEMENT,
      [PATHS.PLACE_UNITS]: () => PATHS.PLAN_MOVEMENT,
      'carrier-loading': () => PATHS.PLACE_UNITS, //assuming units placed, otherwise movement
      [PATHS.ORDER_UNITS]: () => 'carrier-loading', //if naval planes purchased & carriers available, otherwise placement or movement
      [PATHS.CONFIRM_FINISH]: () => PATHS.ORDER_UNITS
    }
    return (phases[phase.current] && phases[phase.current]()) || 'start'
  }
)

const afterStart = ({ name }, hasDamagedShips) => (
  name === 'China' ? PATHS.PLAN_ATTACKS : hasDamagedShips ? PATHS.REPAIR : PATHS.RESEARCH
)

const afterResearch = (hasRockets, { attempts } = {}) => (
  attempts ? PATHS.RESEARCH_RESULTS : hasRockets ? PATHS.ROCKETS : PATHS.PURCHASE
)

const afterCombat = (noCombat, planesInAir) => {
  if (noCombat) {
    if (planesInAir) {
      return PATHS.LAND_PLANES
    } else {
      return PATHS.PLAN_MOVEMENT
    }
  } else {
    return PATHS.RESOLVE_COMBAT
  }
}

const afterOrder = () => (
  PATHS.CONFIRM_FINISH //'carrier-loading', //if naval planes purchased & carriers available, otherwise placement
)

export const nextPhase = createSelector(
  getCurrentPower,
  currentPowerHasRockets,
  hasDamagedShipsInHarbor,
  getResearch,
  noCombat,
  getPhase,
  planesInAir,
  (currentPower, hasRockets, hasDamagedShips, research, noCombat, phase, planesInAir) => {
    const phases = {
      start: () => afterStart(currentPower, hasDamagedShips),
      [PATHS.REPAIR]: () => PATHS.RESEARCH,
      [PATHS.RESEARCH]: () => afterResearch(hasRockets, research),
      [PATHS.RESEARCH_RESULTS]: () => afterResearch(hasRockets),
      [PATHS.ROCKETS]: () => PATHS.ROCKET_RESULTS,
      [PATHS.ROCKET_RESULTS]: () => PATHS.PURCHASE,
      [PATHS.PURCHASE]: () => PATHS.INCOME,
      [PATHS.INCOME]: () => currentPower.name === 'US' ? PATHS.LEND_LEASE : PATHS.PLAN_ATTACKS,
      [PATHS.LEND_LEASE]: () => PATHS.PLAN_ATTACKS,
      [PATHS.PLAN_ATTACKS]: () => noCombat ? PATHS.PLAN_MOVEMENT : PATHS.RESOLVE_COMBAT,
      [PATHS.RESOLVE_COMBAT]: () => console.log('how did I get here?') || PATHS.RESOLVE_COMBAT,
      [PATHS.SELECT_CASUALTIES]: () => afterCombat(noCombat, planesInAir),
      [PATHS.LAND_PLANES]: () => PATHS.PLAN_MOVEMENT,
      [PATHS.PLAN_MOVEMENT]: () => currentPower.name === 'USSR' ? 'russian-winter' : PATHS.PLACE_UNITS,
      'russian-winter': () => PATHS.PLACE_UNITS,
      [PATHS.PLACE_UNITS]: () => PATHS.ORDER_UNITS,
      [PATHS.ORDER_UNITS]: () => afterOrder(),
      'carrier-loading': () => PATHS.CONFIRM_FINISH, //assuming units placed, otherwise movement
      [PATHS.CONFIRM_FINISH]: () => 'start'
    }
    return (phases[phase.current] && phases[phase.current]()) || 'start'
  }
)
