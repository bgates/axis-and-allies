import { 
  DOGFIGHT,
  VIEW_STRATEGIC_BOMBING_RESULTS,
  RESOLVE_COMBAT,
  RETREAT,
  CONTINUE_COMBAT,
  TOGGLE_CASUALTY,
  REMOVE_CASUALTIES,
  COMMIT_UNITS,
  UNCOMMIT_UNITS,
  COMMIT_AMPHIB_UNITS,
  UNCOMMIT_AMPHIB_UNITS,
  LOAD_TRANSPORT,
  WIN_ATTACK,
  LOSE_ATTACK,
  LAND_PLANES,
  PLAN_MOVEMENT,
  PLACE_UNITS
} from '../../../actions';
import {
  commitUnits,
  uncommitUnits,
  commitAmphibUnits,
  uncommitAmphibUnits,
  loadTransport,
  landPlanes,
  retreat
} from './moveUnitReducerFunctions';
import {
  removeCasualties,
  toggleCasualties,
  defenderWins,
  attackerWins
} from './casualtyReducerFunctions';
import { completeMission } from './completeMissionReducerFunction';
import { modifyUnits, dogfight, continueCombat, clearUnits } from './modifyUnitsReducerFunction';
import { placeUnits } from './placeUnitReducerFunction';

const boardHelper = (state, action) => {
  switch (action.type) {
    case '@@router/LOCATION_CHANGE':
      return action.payload.location.pathname === PLAN_MOVEMENT ? clearUnits(state) : state.territories
    case VIEW_STRATEGIC_BOMBING_RESULTS: return completeMission(state, action);
    case DOGFIGHT: return dogfight(state, action);
    case CONTINUE_COMBAT: return continueCombat(state, action);
    case RESOLVE_COMBAT: return modifyUnits(state, action);
    case RETREAT: return retreat(state, action);
    case COMMIT_UNITS: return commitUnits(state, action);
    case UNCOMMIT_UNITS: return uncommitUnits(state, action);
    case COMMIT_AMPHIB_UNITS: return commitAmphibUnits(state, action);
    case UNCOMMIT_AMPHIB_UNITS: return uncommitAmphibUnits(state, action);
    case LOAD_TRANSPORT: return loadTransport(state, action);
    case REMOVE_CASUALTIES: return removeCasualties(state, action);
    case TOGGLE_CASUALTY: return toggleCasualties(state, action);
    case LOSE_ATTACK: return defenderWins(state, action);
    case WIN_ATTACK: return attackerWins(state, action);
    case LAND_PLANES: return landPlanes(state, action);
    case PLACE_UNITS: return placeUnits(state, action);
    default:
      return state.territories
  }
}
export default boardHelper

