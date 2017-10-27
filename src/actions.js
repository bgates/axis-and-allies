export const ROLLS = 'ROLLS';

export const SET_TECH = 'SET_TECH';
export const INCREASE_RESEARCH_BUDGET = 'INCREASE_RESEARCH_BUDGET';
export const DECREASE_RESEARCH_BUDGET = 'DECREASE_RESEARCH_BUDGET';
export const ATTEMPT_RESEARCH = 'ATTEMPT_RESEARCH';
export const DEVELOP_TECH = 'DEVELOP_TECH';

export const INCREMENT_PURCHASE = 'INCREMENT_PURCHASE';
export const DECREMENT_PURCHASE = 'DECREMENT_PURCHASE';

export const PLAN_ATTACKS = '/plan-attacks';
export const VIEW_ATTACK_OPTIONS = 'VIEW_ATTACK_OPTIONS';
export const COMMIT_UNITS = 'COMMIT_UNITS';
export const UNCOMMIT_UNITS = 'UNCOMMIT_UNITS';
export const VIEW_TRANSPORT_LOAD_OPTIONS = 'VIEW_TRANSPORT_LOAD_OPTIONS';
export const LOAD_TRANSPORT = 'LOAD_TRANSPORT';
export const COMMIT_AMPHIB_UNITS = 'COMMIT_AMPHIB_UNITS';
export const UNCOMMIT_AMPHIB_UNITS = 'UNCOMMIT_AMPHIB_UNITS';
export const VIEW_BOMBARDMENT_OPTIONS = 'VIEW_BOMBARDMENT_OPTIONS';
export const COMMIT_BOMBARDMENT_UNITS = 'COMMIT_BOMBARDMENT_UNITS';
export const UNCOMMIT_BOMBARDMENT_UNITS = 'UNCOMMIT_BOMBARDMENT_UNITS';

export const DOGFIGHT = 'DOGFIGHT';
export const STRATEGIC_BOMBING_ROLLS = 'STRATEGIC_BOMBING_ROLLS';
export const VIEW_STRATEGIC_BOMBING_RESULTS = 'VIEW_STRATEGIC_BOMBING_RESULTS';

export const RESOLVE_COMBAT = '/resolve-combat';
export const CONTINUE_COMBAT = 'CONTINUE_COMBAT';
export const TOGGLE_CASUALTY = 'TOGGLE_CASUALTY';
export const REMOVE_CASUALTIES = 'REMOVE_CASUALTIES';
export const WIN_ATTACK = 'WIN_ATTACK';
export const LOSE_ATTACK = 'LOSE_ATTACK';
export const RETREAT = 'RETREAT';

export const LAND_PLANES = '/land-planes';
export const VIEW_PLANE_LANDING_OPTIONS = 'VIEW_PLANE_LANDING_OPTIONS';
export const SELECT_PLANE_LANDING_OPTION = 'SELECT_PLANE_LANDING_OPTION';
export const SELECT_PLANE_LANDING_TERRITORY = 'SELECT_PLANE_LANDING_TERRITORY';
export const CONFIRM_LAND_PLANES = 'CONFIRM_LAND_PLANES';

export const PLAN_MOVEMENT = '/plan-movement';
export const VIEW_MOVEMENT_OPTIONS = 'VIEW_MOVEMENT_OPTIONS';

export const COMMIT_PLACEMENT = 'COMMIT_PLACEMENT';
export const UNCOMMIT_PLACEMENT = 'UNCOMMIT_PLACEMENT';
export const COMMIT_PLACE_ALL = 'COMMIT_PLACE_ALL';
export const UNCOMMIT_PLACE_ALL = 'UNCOMMIT_PLACE_ALL';
export const PLACE_UNITS = 'PLACE_UNITS';

export const ORDER_UNITS = '/order-units';
export const CONFIRM_FINISH = '/confirm-finish';
export const NEXT_TURN = 'NEXT_TURN';

export const STRATEGIC_BOMB = 'STRATEGIC_BOMB';
export const COMBAT = 'COMBAT';

export const RESET = 'RESET';

export const dogfight = (territory) => ({ type: DOGFIGHT, territory })

export const resolveCombat = (territory) => (  
  { type: RESOLVE_COMBAT, territory }
)

export const markCombatUnderway = (territory) => (
  { type: CONTINUE_COMBAT, territory }
)

export const strategicBombingRolls = (territory) => (  
  { type: STRATEGIC_BOMBING_ROLLS, territory }
)

export const viewStrategicBombingResults = (damage, power, territoryIndex) => (  
  { 
    type: VIEW_STRATEGIC_BOMBING_RESULTS, 
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

const sendToFirebase = (state, getFirebase, action, node, data) => {
  const { currentGameId } = state.firebase.profile
  if (currentGameId) {
    const firebase = getFirebase()
    firebase[action](`/games/${currentGameId}/${node}`, data)
  }
}

export const roll = (phase, rolls) => ( 
  (dispatch, getState, getFirebase) => {
    dispatch({
      type: ROLLS,
      phase,
      rolls
    })
    const state = getState()
    sendToFirebase(state, getFirebase, 'push', 'rolls', { phase, rolls })
  }
)

export const nextTurn = () => (
  (dispatch, getState, getFirebase) => {
    dispatch({ type: NEXT_TURN })
    const state = getState()
    const boardString = state.boardString
    const index = state.board.currentPowerIndex
    sendToFirebase(state, getFirebase, 'set', 'currentPowerIndex', index)
    sendToFirebase(state, getFirebase, 'push', 'boardStrings', boardString)
    sendToFirebase(state, getFirebase, 'remove', 'patches')
  }
)

export const viewAttackOptions = (territory) => (
  { type: VIEW_ATTACK_OPTIONS, territory }
)

export const viewBombardmentOptions = (territory) => (
  { type: VIEW_BOMBARDMENT_OPTIONS, territory }
)

export const viewPlaneLandingOptions = (territory) => ( 
  { type: VIEW_PLANE_LANDING_OPTIONS, territory }
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

export const reset = () => ({ type: RESET })
