export const ROLLS = 'ROLLS';

export const SET_TECH = 'SET_TECH';
export const INCREASE_RESEARCH_BUDGET = 'INCREASE_RESEARCH_BUDGET';
export const DECREASE_RESEARCH_BUDGET = 'DECREASE_RESEARCH_BUDGET';
export const ATTEMPT_RESEARCH = 'ATTEMPT_RESEARCH';
export const DEVELOP_TECH = 'DEVELOP_TECH';

export const INCREMENT_PURCHASE = 'INCREMENT_PURCHASE';
export const DECREMENT_PURCHASE = 'DECREMENT_PURCHASE';

export const PLAN_ATTACKS = 'PLAN_ATTACKS';
export const VIEW_ATTACK_OPTIONS = 'VIEW_ATTACK_OPTIONS';
export const COMMIT_UNITS = 'COMMIT_UNITS';
export const UNCOMMIT_UNITS = 'UNCOMMIT_UNITS';
export const VIEW_TRANSPORT_LOAD_OPTIONS = 'VIEW_TRANSPORT_LOAD_OPTIONS';
export const LOAD_TRANSPORT = 'LOAD_TRANSPORT';
export const COMMIT_AMPHIB_UNITS = 'COMMIT_AMPHIB_UNITS';
export const UNCOMMIT_AMPHIB_UNITS = 'UNCOMMIT_AMPHIB_UNITS';

export const DOGFIGHT = 'DOGFIGHT';
export const VIEW_STRATEGIC_BOMBING_RESULTS = 'VIEW_STRATEGIC_BOMBING_RESULTS';
export const STRATEGIC_BOMB_AFTERMATH = 'STRATEGIC_BOMB_AFTERMATH';

export const RESOLVE_COMBAT = 'RESOLVE_COMBAT';
export const TOGGLE_CASUALTY = 'TOGGLE_CASUALTY';
export const REMOVE_CASUALTIES = 'REMOVE_CASUALTIES';
export const WIN_ATTACK = 'WIN_ATTACK';
export const LOSE_ATTACK = 'LOSE_ATTACK';

export const LAND_PLANES = 'LAND_PLANES';
export const VIEW_PLANE_LANDING_OPTIONS = 'VIEW_PLANE_LANDING_OPTIONS';
export const SELECT_PLANE_LANDING_OPTION = 'SELECT_PLANE_LANDING_OPTION';
export const SELECT_PLANE_LANDING_TERRITORY = 'SELECT_PLANE_LANDING_TERRITORY';
export const CONFIRM_LAND_PLANES = 'CONFIRM_LAND_PLANES';

export const PLAN_MOVEMENT = 'PLAN_MOVEMENT';
export const VIEW_MOVEMENT_OPTIONS = 'VIEW_MOVEMENT_OPTIONS';

export const COMMIT_PLACEMENT = 'COMMIT_PLACEMENT';
export const UNCOMMIT_PLACEMENT = 'UNCOMMIT_PLACEMENT';
export const COMMIT_PLACE_ALL = 'COMMIT_PLACE_ALL';
export const UNCOMMIT_PLACE_ALL = 'UNCOMMIT_PLACE_ALL';
export const PLACE_UNITS = 'PLACE_UNITS';

export const ORDER_UNITS = 'ORDER_UNITS';
export const NEXT_TURN = 'NEXT_TURN';

export const STRATEGIC_BOMB = 'STRATEGIC_BOMB';
export const COMBAT = 'COMBAT';

export const dogfight = (territory) => ({ type: DOGFIGHT, territory })

export const resolveCombat = (territory) => (  
  { type: RESOLVE_COMBAT, territory }
)

export const viewStrategicBombingResults = (territory) => (  
  { type: VIEW_STRATEGIC_BOMBING_RESULTS, territory }
)

export const strategicBombAftermath = (damage, power, territoryIndex) => (  
  { 
    type: STRATEGIC_BOMB_AFTERMATH, 
    damage, 
    power,
    territoryIndex
  }
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

export const viewAttackOptions = (territory) => (
  { type: VIEW_ATTACK_OPTIONS, territory }
)

export const viewPlaneLandingOptions = (territory) => ( 
  {
    type: VIEW_PLANE_LANDING_OPTIONS,
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

export const viewMovementOptions = (territory) => (
  { type: VIEW_MOVEMENT_OPTIONS, territory }
)

export const orderUnits = (territory) => (
  { type: ORDER_UNITS, territory }
)

