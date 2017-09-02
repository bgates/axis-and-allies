export const DEVELOP_TECH = 'DEVELOP_TECH';
export const INCREMENT_RESEARCH = 'INCREMENT_RESEARCH';
export const DECREMENT_RESEARCH = 'DECREMENT_RESEARCH';
export const SET_TECH = 'SET_TECH';
export const ATTEMPT_RESEARCH = 'ATTEMPT_RESEARCH';
export const INCREMENT_PURCHASE = 'INCREMENT_PURCHASE';
export const DECREMENT_PURCHASE = 'DECREMENT_PURCHASE';
export const PLAN_ATTACK = 'PLAN_ATTACK';
export const PLAN_COMBAT = 'PLAN_COMBAT';
export const COMMIT_UNITS = 'COMMIT_UNITS';
export const UNCOMMIT_UNITS = 'UNCOMMIT_UNITS';
export const VIEW_TRANSPORT_LOAD_OPTIONS = 'VIEW_TRANSPORT_LOAD_OPTIONS';
export const LOAD_TRANSPORT = 'LOAD_TRANSPORT';
export const COMMIT_AMPHIB_UNITS = 'COMMIT_AMPHIB_UNITS';
export const UNCOMMIT_AMPHIB_UNITS = 'UNCOMMIT_AMPHIB_UNITS';
export const STRATEGIC_BOMB = 'STRATEGIC_BOMB';
export const RESOLVE_COMBAT = 'RESOLVE_COMBAT';
export const ROLLS = 'ROLLS';
export const TOGGLE_CASUALTY = 'TOGGLE_CASUALTY';
export const REMOVE_CASUALTIES = 'REMOVE_CASUALTIES';
export const WIN_ATTACK = 'WIN_ATTACK';
export const LOSE_ATTACK = 'LOSE_ATTACK';
export const PLAN_LAND_PLANES = 'PLAN_LAND_PLANES';
export const SELECT_PLANE_LANDING_OPTION = 'SELECT_PLANE_LANDING_OPTION';
export const SELECT_PLANE_LANDING_TERRITORY = 'SELECT_PLANE_LANDING_TERRITORY';
export const CONFIRM_LAND_PLANES = 'CONFIRM_LAND_PLANES';
export const LAND_PLANES = 'LAND_PLANES';
export const PLAN_MOVEMENT = 'PLAN_MOVEMENT';
export const COMMIT_PLACEMENT = 'COMMIT_PLACEMENT';
export const UNCOMMIT_PLACEMENT = 'UNCOMMIT_PLACEMENT';
export const COMMIT_PLACE_ALL = 'COMMIT_PLACE_ALL';
export const UNCOMMIT_PLACE_ALL = 'UNCOMMIT_PLACE_ALL';
export const PLACE_UNITS = 'PLACE_UNITS';
export const ORDER_UNITS = 'ORDER_UNITS';
export const NEXT_TURN = 'NEXT_TURN';

export const resolveCombat = (territory) => (  
  { type: RESOLVE_COMBAT, territory }
)

export const strategicBomb = (territory) => (  
  { type: STRATEGIC_BOMB, territory }
)

export const removeCasualties = (defenderCasualties, territoryIndex, currentPower) => ( 
  {
    type: REMOVE_CASUALTIES,
    defenderCasualties,
    territoryIndex,
    currentPower
  }
)

export const roll = (phase, rolls) => ( 
  {
    type: ROLLS,
    phase,
    rolls
  }
)

export const planAttack = (territory) => { type: PLAN_ATTACK, territory }

export const planLandPlanes = (territory) => ( 
  {
    type: PLAN_LAND_PLANES,
    territory
  }
)

export const winAttack = (territoryIndex, currentPower) => ( 
  { 
    type: WIN_ATTACK, 
    territoryIndex,
    currentPower
  }
 )

export const planMovement = (territory) => { type: PLAN_MOVEMENT, territory }

export const orderUnits = (territory) => { type: ORDER_UNITS, territory }

