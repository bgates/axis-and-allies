const DEVELOP_TECH = 'DEVELOP_TECH';
const INCREMENT_RESEARCH = 'INCREMENT_RESEARCH';
const DECREMENT_RESEARCH = 'DECREMENT_RESEARCH';
const SET_TECH = 'SET_TECH';
const ATTEMPT_RESEARCH = 'ATTEMPT_RESEARCH';
const INCREMENT_PURCHASE = 'INCREMENT_PURCHASE';
const DECREMENT_PURCHASE = 'DECREMENT_PURCHASE';
const PLAN_ATTACK = 'PLAN_ATTACK';
const PLAN_COMBAT = 'PLAN_COMBAT';
const COMMIT_UNITS = 'COMMIT_UNITS';
const UNCOMMIT_UNITS = 'UNCOMMIT_UNITS';
const VIEW_TRANSPORT_LOAD_OPTIONS = 'VIEW_TRANSPORT_LOAD_OPTIONS';
const LOAD_TRANSPORT = 'LOAD_TRANSPORT';
const COMMIT_AMPHIB_UNITS = 'COMMIT_AMPHIB_UNITS';
const UNCOMMIT_AMPHIB_UNITS = 'UNCOMMIT_AMPHIB_UNITS';
const RESOLVE_COMBAT = 'RESOLVE_COMBAT';
const ROLLS = 'ROLLS';
const TOGGLE_CASUALTY = 'TOGGLE_CASUALTY';
const REMOVE_CASUALTIES = 'REMOVE_CASUALTIES';
const WIN_ATTACK = 'WIN_ATTACK';
const LOSE_ATTACK = 'LOSE_ATTACK';
const PLAN_LAND_PLANES = 'PLAN_LAND_PLANES';
const SELECT_PLANE_LANDING_OPTION = 'SELECT_PLANE_LANDING_OPTION';
const SELECT_PLANE_LANDING_TERRITORY = 'SELECT_PLANE_LANDING_TERRITORY';
const CONFIRM_LAND_PLANES = 'CONFIRM_LAND_PLANES';
const LAND_PLANES = 'LAND_PLANES';
const PLAN_MOVEMENT = 'PLAN_MOVEMENT';
const COMMIT_PLACEMENT = 'COMMIT_PLACEMENT';
const UNCOMMIT_PLACEMENT = 'UNCOMMIT_PLACEMENT';
const COMMIT_PLACE_ALL = 'COMMIT_PLACE_ALL';
const UNCOMMIT_PLACE_ALL = 'UNCOMMIT_PLACE_ALL';
const PLACE_UNITS = 'PLACE_UNITS';
const ORDER_UNITS = 'ORDER_UNITS';
const NEXT_TURN = 'NEXT_TURN';

export const resolveCombat = (territory) => {
  return { type: RESOLVE_COMBAT, territory }
}

const removeCasualties = (defenderCasualties, territoryIndex, currentPower) => {
  return {
    type: REMOVE_CASUALTIES,
    defenderCasualties,
    territoryIndex,
    currentPower
  }
}

const roll = (phase, rolls) => {
  return {
    type: ROLLS,
    phase,
    rolls
  }
}

const planAttack = (territory) => {
  return {
    type: PLAN_ATTACK,
    territory
  }
}

const planLandPlanes = (territory) => {
  return {
    type: PLAN_LAND_PLANES,
    territory
  }
}

const winAttack = (territoryIndex, currentPower) => {
  return { 
    type: WIN_ATTACK, 
    territoryIndex,
    currentPower
  }
}

const planMovement = (territory) => {
  return {
    type: PLAN_MOVEMENT,
    territory
  }
}

const orderUnits = (territory) => {
  return {
    type: ORDER_UNITS,
    territory
  }
}


export {
  DEVELOP_TECH,
  INCREMENT_RESEARCH,
  DECREMENT_RESEARCH,
  SET_TECH,
  ATTEMPT_RESEARCH,
  INCREMENT_PURCHASE,
  DECREMENT_PURCHASE,
  PLAN_ATTACK,
  PLAN_COMBAT,
  COMMIT_UNITS,
  UNCOMMIT_UNITS,
  VIEW_TRANSPORT_LOAD_OPTIONS,
  LOAD_TRANSPORT,
  COMMIT_AMPHIB_UNITS,
  UNCOMMIT_AMPHIB_UNITS,
  RESOLVE_COMBAT,
  ROLLS,
  TOGGLE_CASUALTY,
  REMOVE_CASUALTIES,
  WIN_ATTACK,
  LOSE_ATTACK,
  PLAN_LAND_PLANES,
  SELECT_PLANE_LANDING_OPTION,
  SELECT_PLANE_LANDING_TERRITORY,
  CONFIRM_LAND_PLANES,
  LAND_PLANES,
  COMMIT_PLACEMENT,
  UNCOMMIT_PLACEMENT,
  COMMIT_PLACE_ALL,
  UNCOMMIT_PLACE_ALL,
  PLACE_UNITS,
  ORDER_UNITS,
  NEXT_TURN,
  roll,
  removeCasualties,
  planAttack,
  winAttack,
  planMovement,
  planLandPlanes,
  orderUnits
}
