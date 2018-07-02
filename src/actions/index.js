// @flow
export const ROLLS = 'ROLLS'

export const SET_TECH = 'SET_TECH'
export const INCREASE_RESEARCH_BUDGET = 'INCREASE_RESEARCH_BUDGET'
export const DECREASE_RESEARCH_BUDGET = 'DECREASE_RESEARCH_BUDGET'
export const ATTEMPT_RESEARCH = 'ATTEMPT_RESEARCH'
export const DEVELOP_TECH = 'DEVELOP_TECH'

export const SET_ROCKET_TARGET = 'SET_ROCKET_TARGET'
export const ASSESS_ROCKET_DAMAGE = 'ASSESS_ROCKET_DAMAGE'

export const INCREMENT_PURCHASE = 'INCREMENT_PURCHASE'
export const DECREMENT_PURCHASE = 'DECREMENT_PURCHASE'

export const SET_INCOME = 'SET_INCOME'

export const PLAN_ATTACKS = '/plan-attacks'
export const VIEW_ATTACK_OPTIONS = 'VIEW_ATTACK_OPTIONS'
export const COMMIT_UNITS = 'COMMIT_UNITS'
export const UNCOMMIT_UNITS = 'UNCOMMIT_UNITS'
export const VIEW_TRANSPORT_LOAD_OPTIONS = 'VIEW_TRANSPORT_LOAD_OPTIONS'
export const LOAD_TRANSPORT = 'LOAD_TRANSPORT'
export const COMMIT_AMPHIB_UNITS = 'COMMIT_AMPHIB_UNITS'
export const UNCOMMIT_AMPHIB_UNITS = 'UNCOMMIT_AMPHIB_UNITS'
export const VIEW_BOMBARDMENT_OPTIONS = 'VIEW_BOMBARDMENT_OPTIONS'
export const COMMIT_BOMBARDMENT_UNITS = 'COMMIT_BOMBARDMENT_UNITS'
export const UNCOMMIT_BOMBARDMENT_UNITS = 'UNCOMMIT_BOMBARDMENT_UNITS'
export const COMMIT_TO_STRATEGIC_BOMBING = 'COMMIT_TO_STRATEGIC_BOMBING'

export const ENTER_COMBAT_LIFECYCLE = 'ENTER_COMBAT_LIFECYCLE'
export const DOGFIGHT = 'DOGFIGHT'
export const REMOVE_FLAK_CASUALTIES = 'REMOVE_FLAK_CASUALTIES'
export const VIEW_STRATEGIC_BOMBING_RESULTS = 'VIEW_STRATEGIC_BOMBING_RESULTS'

export const RESOLVE_COMBAT = '/resolve-combat';
export const COMBAT_UNDERWAY = 'COMBAT_UNDERWAY'
export const TOGGLE_CASUALTY = 'TOGGLE_CASUALTY'
export const REMOVE_CASUALTIES = 'REMOVE_CASUALTIES'
export const WIN_ATTACK = 'WIN_ATTACK'
export const LOSE_ATTACK = 'LOSE_ATTACK'
export const RETREAT = 'RETREAT'

export const LAND_PLANES = '/land-planes';
export const VIEW_PLANE_LANDING_OPTIONS = 'VIEW_PLANE_LANDING_OPTIONS'
export const SELECT_PLANE_LANDING_OPTION = 'SELECT_PLANE_LANDING_OPTION'
export const SELECT_PLANE_LANDING_TERRITORY = 'SELECT_PLANE_LANDING_TERRITORY';
export const CONFIRM_LAND_PLANES = 'CONFIRM_LAND_PLANES';

export const PLAN_MOVEMENT = '/plan-movement';
export const VIEW_MOVEMENT_OPTIONS = 'VIEW_MOVEMENT_OPTIONS'

export const COMMIT_PLACEMENT = 'COMMIT_PLACEMENT'
export const UNCOMMIT_PLACEMENT = 'UNCOMMIT_PLACEMENT'
export const COMMIT_PLACE_ALL = 'COMMIT_PLACE_ALL'
export const UNCOMMIT_PLACE_ALL = 'UNCOMMIT_PLACE_ALL'
export const PLACE_UNITS = 'PLACE_UNITS'

export const ORDER_UNITS = '/order-units';
export const CONFIRM_FINISH = '/confirm-finish';
export const NEXT_TURN = 'NEXT_TURN'

export const STRATEGIC_BOMB = 'STRATEGIC_BOMB';
export const COMBAT = 'COMBAT';

export const RESET = 'RESET'

export const START_RUSSIAN_WINTER = 'START_RUSSIAN_WINTER'
export const END_RUSSIAN_WINTER = 'END_RUSSIAN_WINTER'

export const enterCombatLifecycle = (territoryIndex: number) => ({
  type: ENTER_COMBAT_LIFECYCLE,
  territoryIndex
})

export const dogfight = (territoryIndex: number) => ({ 
  type: DOGFIGHT, 
  territoryIndex 
})

export const resolveCombat = (territoryIndex: number) => ({ 
  type: RESOLVE_COMBAT, 
  territoryIndex 
})

export const removeFlakCasualties = (casualtyIds: number[], territoryIndex: number) => ({
  type: REMOVE_FLAK_CASUALTIES,
  casualtyIds,
  territoryIndex
})

export const viewStrategicBombingResults = (damage: number, power: { ipc: number, name: string }, targetIndex: number, unitIds: number[]) => (  
  { 
    type: VIEW_STRATEGIC_BOMBING_RESULTS, 
    damage, 
    power,
    targetIndex,
    unitIds
  }
)

export const removeCasualties = (defenderCasualties: number[], attackerCasualties: number[], territoryIndex: number, currentPower: {}) => ( 
  {
    type: REMOVE_CASUALTIES,
    defenderCasualties,
    attackerCasualties,
    territoryIndex,
    currentPower
  }
)

type Profile = { profile: { currentGameId?: number } }
type GFB = () => Object
export const sendToFirebase = ({ profile }: Profile, getFirebase: GFB, action: string, node: string, data?: Object) => {
  const { currentGameId } = profile
  if (currentGameId) {
    const firebase = getFirebase()
    firebase[action](`/games/${currentGameId}/${node}`, data)
  }
}

type GS = () => { firebase: Object }
type Dispatch = (Object) => void
export const roll = (phase:string, rolls:number[]) => ( 
  (dispatch: Dispatch, getState: GS, getFirebase: GFB) => {
    dispatch({
      type: ROLLS,
      phase,
      rolls
    })
    const { firebase } = getState()
    sendToFirebase(firebase, getFirebase, 'push', 'rolls', { phase, rolls })
  }
)

export const viewAttackOptions = (territoryIndex: number) => ({ type: VIEW_ATTACK_OPTIONS, territoryIndex })

export const viewBombardmentOptions = (territoryIndex: number) => ({ type: VIEW_BOMBARDMENT_OPTIONS, territoryIndex })

export const viewPlaneLandingOptions = (territoryIndex: number) => ( 
  { type: VIEW_PLANE_LANDING_OPTIONS, territoryIndex }
)

export const winAttack = (territoryIndex: number, defenderIds: number[], attackerIds: number[], airUnits: Object, casualties: number[], conqueringPower?: {}) => ( 
  { 
    type: WIN_ATTACK, 
    territoryIndex,
    defenderIds,
    attackerIds,
    airUnits,
    casualties,
    conqueringPower
  }
)

export const loseAttack = (territoryIndex: number, attackerCasualties: number[], defenderCasualties: number[]) => (
  {
    type: LOSE_ATTACK,
    territoryIndex,
    attackerCasualties,
    defenderCasualties
  }
)

type Territory = { name: string, index: number }
export const viewMovementOptions = (territory: Territory) => (
  { type: VIEW_MOVEMENT_OPTIONS, territory }
)

export const orderUnits = (territory: any) => (
  { type: ORDER_UNITS, territory }
)

export const reset = () => ({ type: RESET })
