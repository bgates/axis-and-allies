import { 
  PLAN_COMBAT,
  PLAN_ATTACK,
  VIEW_TRANSPORT_LOAD_OPTIONS,
  LOAD_TRANSPORT,
  DOGFIGHT,
  STRATEGIC_BOMB,
  RESOLVE_COMBAT,
  ROLLS,
  REMOVE_CASUALTIES,
  PLAN_LAND_PLANES,
  SELECT_PLANE_LANDING_TERRITORY,
  CONFIRM_LAND_PLANES,
  ORDER_UNITS
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
  case STRATEGIC_BOMB: {
    return currentWithTerritory(state, 'strategic-bomb', action.territory)
  }
  case PLAN_LAND_PLANES: {
    return currentWithTerritory(state, 'plan-land-planes', action.territory)
  }
  case PLAN_COMBAT: {
    return currentWithout(state, 'plan-combat', 'territory')
  } 
  case PLAN_ATTACK: {
    return currentWithTerritory(state, 'plan-attack', action.territory)
  } 
  case VIEW_TRANSPORT_LOAD_OPTIONS: {
    return { ...state, current: 'load-transport', transport: { unit: action.transport, id: action.id } }
  }
  case LOAD_TRANSPORT: {
    return currentWithout(state, 'plan-attack', 'transport')
  }
  case DOGFIGHT: 
  case RESOLVE_COMBAT: {
    return currentWithTerritory(state, 'combat', action.territory || state.territory)
  }
  case REMOVE_CASUALTIES: {
    return { ...state, current: 'remove-casualties' }
  }
  case SELECT_PLANE_LANDING_TERRITORY: {
    return currentWithout(state, 'land-planes', 'territory')
  }
  case CONFIRM_LAND_PLANES: {
    return { ...state, current: 'confirm-land-planes' }
  }
  case ORDER_UNITS: {
    return currentWithout(state, 'order-units', 'territory')
  }
  default:
    return state
  }
}
export default phase
