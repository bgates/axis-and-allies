import { 
  PLAN_ATTACKS,
  VIEW_ATTACK_OPTIONS,
  VIEW_TRANSPORT_LOAD_OPTIONS,
  LOAD_TRANSPORT,
  DOGFIGHT,
  STRATEGIC_BOMB,
  RESOLVE_COMBAT,
  ROLLS,
  PLAN_MOVEMENT,
  VIEW_MOVEMENT_OPTIONS,
  VIEW_PLANE_LANDING_OPTIONS,
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
    const current = pathname === '/' ? 'start' : pathname;
    return { ...state, current }
  }
  case ROLLS: {
    return { ...state, current: action.phase, minimum: action.phase }
  } 
  case STRATEGIC_BOMB: {
    return currentWithTerritory(state, 'strategic-bomb', action.territory)
  }
  case VIEW_PLANE_LANDING_OPTIONS: {
    return currentWithTerritory(state, VIEW_PLANE_LANDING_OPTIONS, action.territory)
  }
  case PLAN_ATTACKS: {
    return currentWithout(state, PLAN_ATTACKS, 'territory')
  } 
  case VIEW_ATTACK_OPTIONS: {
    return currentWithTerritory(state, VIEW_ATTACK_OPTIONS, action.territory)
  } 
  case VIEW_TRANSPORT_LOAD_OPTIONS: {
    return { ...state, current: VIEW_TRANSPORT_LOAD_OPTIONS, transport: { unit: action.transport, id: action.id } }
  }
  case LOAD_TRANSPORT: {
    return currentWithout(state, VIEW_ATTACK_OPTIONS, 'transport')
  }
  case DOGFIGHT: 
  case RESOLVE_COMBAT: {
    return currentWithTerritory(state, 'combat', action.territory || state.territory)
  }
  case SELECT_PLANE_LANDING_TERRITORY: {
    return currentWithout(state, 'land-planes', 'territory')
  }
  case CONFIRM_LAND_PLANES: {
    return { ...state, current: 'confirm-land-planes' }
  }
  case PLAN_MOVEMENT: {
    return currentWithout(state, PLAN_MOVEMENT, 'territory')
  } 
  case VIEW_MOVEMENT_OPTIONS: {
    return currentWithTerritory(state, VIEW_MOVEMENT_OPTIONS, action.territory)
  }
  case ORDER_UNITS: {
    return currentWithout(state, 'order-units', 'territory')
  }
  default:
    return state
  }
}
export default phase
