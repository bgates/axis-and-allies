// @flow
type PowerName = 'Germany' | 'USSR' | 'Japan' | 'UK' | 'Italy' | 'US' | 'China'
type Tech = 'Jet Power' | 'Rockets' | 'Super Submarines' | 'Long Range Aircraft' | 'Radar' | 'Heavy Bombers'
type Transport = { id: number, originName: string, originIndex: number }
type UnitIdsByIndex = { [string]: Array<number> }

export type Action = 
  { type: 'SET_TECH', tech: Tech }
| { type: 'INCREASE_RESEARCH_BUDGET' }
| { type: 'DECREASE_RESEARCH_BUDGET' }
| { type: 'ATTEMPT_RESEARCH', cost: number, currentPowerIndex: number }
| { type: 'DEVELOP_TECH', currentPowerIndex: number, tech: Tech }
| { type: 'SET_ROCKET_TARGET', launchSite: string, target: number } /*fix*/
| { type: 'INCREMENT_PURCHASE', unit: Object, currentPowerIndex: number } /*fix*/
| { type: 'DECREMENT_PURCHASE', unit: Object, currentPowerIndex: number }
| { type: 'SET_INCOME', amount: number }
| { type: 'PLAN_ATTACKS' }
| { type: 'VIEW_ATTACK_OPTIONS', territoryIndex: number }
| { type: 'COMMIT_UNITS', originIndex: number, targetIndex: number, unitIds: Array<number>, distance: number }
| { type: 'UNCOMMIT_UNITS', originIndex: number, targetIndex: number, unitIds: Array<number> }
| { type: 'VIEW_TRANSPORT_LOAD_OPTIONS', transport: Transport, targetIndex: number }
| { type: 'LOAD_TRANSPORT', transport: Transport, targetIndex: number, unitIds: Array<number>, originIndex: number }
| { type: 'COMMIT_AMPHIB_UNITS', transportId: number, targetIndex: number }
| { type: 'UNCOMMIT_AMPHIB_UNITS', transportId: number, targetIndex: number }
| { type: 'COMMIT_TO_STRATEGIC_BOMBING', originIndex: number, targetIndex: number, unitIds: Array<number>, distance: number }
| { type: 'STRATEGIC_BOMB' } // TODO: remove?
| { type: 'COMBAT' } // TODO: remove?
| { type: 'DOGFIGHT', territoryIndex: number }
| { type: 'VIEW_STRATEGIC_BOMBING_RESULTS', damage: number, power: PowerName, targetIndex: number, unitIds: Array<number> }
| { type: 'RESOLVE_COMBAT', territoryIndex: number }
| { type: 'VIEW_BOMBARDMENT_OPTIONS', territoryIndex: number }
| { type: 'COMMIT_BOMBARDMENT_UNITS', locationIndex: number, targetIndex: number, unitIds: Array<number> }
| { type: 'UNCOMMIT_BOMBARDMENT_UNITS', targetIndex: number, unitIds: Array<number> }
| { type: 'COMBAT_UNDERWAY', territoryIndex: number, transportIds: Array<number>, bombardmentIds: Array<number>,unitIds: Array<number> }
| { type: 'TOGGLE_CASUALTY', id: number }
| { type: 'REMOVE_CASUALTIES', defenderCasualties: Array<number>,attackerCasualties: Array<number>, territoryIndex: number, currentPower: PowerName
  }
| { type: 'RETREAT', battleTerritoryIndex: number, retreatTerritoryIndex: number, survivors: Array<number> }
| { type: 'WIN_ATTACK', territoryIndex: number, defenderIds: Array<number>, attackerIds: Array<number>, airUnits: Array<number>, casualties: Array<number>, conqueringPower: PowerName }
| { type: 'LOSE_ATTACK', territoryIndex: number, attackerCasualties: Array<number>, defenderCasualties: Array<number> }
/*| { type: 'LAND_PLANES', planesFrom: state.landPlanes } ??*/
| { type: 'VIEW_PLANE_LANDING_OPTIONS', territoryIndex: number }
| { type: 'SELECT_PLANE_LANDING_OPTION', unitId: number, territoryIndex: number }
| { type: 'SELECT_PLANE_LANDING_TERRITORY' }
| { type: 'CONFIRM_LAND_PLANES' }
| { type: 'PLAN_MOVEMENT' }
| { type: 'VIEW_MOVEMENT_OPTIONS', territory: any }
| { type: 'START_RUSSIAN_WINTER' }
| { type: 'END_RUSSIAN_WINTER' }
| { type: 'COMMIT_PLACEMENT', unit: string, territoryIndex: number } //TODO: unit sb unitName
| { type: 'COMMIT_PLACE_ALL', unit: string, territoryIndex: number, count: number }
| { type: 'UNCOMMIT_PLACEMENT', unit: string, territoryIndex: number }
| { type: 'UNCOMMIT_PLACE_ALL', unit: string, territoryIndex: number }
| { type: 'PLACE_UNITS', placements: Object, currentPower: string }
| { type: 'ORDER_UNITS', territory: any }
| { type: 'NEXT_TURN', currentPowerIndex: number, income: number, unitOrigin: UnitIdsByIndex, unitDestination: UnitIdsByIndex, newUnits: UnitIdsByIndex, idsByTerritoryIndex: UnitIdsByIndex, landPlanes: UnitIdsByIndex }
| { type: 'RESET' }
/*
 *
export const sendToFirebase = ({ profile }, getFirebase, action, node, data) => {
  const { currentGameId } = profile
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
    const { firebase } = getState()
    sendToFirebase(firebase, getFirebase, 'push', 'rolls', { phase, rolls })
  }
)
*/
