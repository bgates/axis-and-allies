import { 
  PLAN_COMBAT,
  PLAN_ATTACK,
  PLAN_LAND_PLANES,
  RESOLVE_COMBAT,
  REMOVE_CASUALTIES,
  LOAD_TRANSPORT,
  ROLLS,
  VIEW_TRANSPORT_LOAD_OPTIONS,
  SELECT_PLANE_LANDING_TERRITORY
} from '../actions';

const currentWithout = (state, current, deletedProp) => {
  let newState = Object.assign({}, state, { current });
  delete newState[deletedProp];
  return newState;
}

const currentWithTerritory = (state, current, territory) => (
  { ...state, current, territory }
)

const phase = (state = { current: 'start', minimum: 'start' }, action) => {
  switch (action.type) {
  case '@@router/LOCATION_CHANGE': {
    const { pathname } = action.payload.location;
    const current = pathname === '/' ? 'start' : pathname.replace('/', '');
    return { ...state, current }
  }
  case ROLLS: {
    return { ...state, current: action.phase, minimum: action.phase }
  } 
  case PLAN_ATTACK: {
    return currentWithTerritory(state, 'plan-attack', action.territory)
  } 
  case PLAN_COMBAT: {
    return currentWithout(state, 'plan-combat', 'territory')
  } 
  case PLAN_LAND_PLANES: {
    return currentWithTerritory(state, 'plan-land-planes', action.territory)
  }
  case RESOLVE_COMBAT: {
    return currentWithTerritory(state, 'combat', action.territory || state.territory)
  }
  case REMOVE_CASUALTIES: {
    return { ...state, current: 'remove-casualties' }
  }
  case VIEW_TRANSPORT_LOAD_OPTIONS: {
    return { ...state, current: 'load-transport', transport: { unit: action.transport, id: action.id } }
  }
  case LOAD_TRANSPORT: {
    return currentWithout(state, 'plan-attack', 'transport')
  }
  case SELECT_PLANE_LANDING_TERRITORY: {
    return currentWithout(state, 'land-planes', 'territory')
  }
  default:
    return state
  }
}
export default phase
