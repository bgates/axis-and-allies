const phase = (state = { current: 'start', minimum: 'start' }, action) => {
  switch (action.type) {
  case '@@router/LOCATION_CHANGE': {
    const { pathname } = action.payload.location;
    const current = pathname === '/' ? 'start' : pathname.replace('/', '');
    return { ...state, current }
  }
  case 'ROLLS': {
    return { ...state, current: action.phase, minimum: action.phase }
  } 
  case 'PLAN_ATTACK': {
    return { ...state, current: 'plan-attack', territory: action.territory }
  } 
  case 'PLAN_COMBAT': {
    let newState = Object.assign({}, state, { current: 'plan-combat' });
    delete newState['territory'];
    return newState;
  } 
  case 'RESOLVE_COMBAT': {
    return { ...state, current: 'combat', territory: action.territory || state.territory }
  }
  case 'SELECT_CASUALTIES': {
    return { ...state, current: 'select-casualties' }
  }
  case 'REMOVE_CASUALTIES': {
    return { ...state, current: 'remove-casualties' }
  }
  case 'VIEW_TRANSPORT_LOAD_OPTIONS': {
    return { ...state, current: 'load-transport', transport: { unit: action.transport, id: action.id } }
  }
  case 'LOAD_TRANSPORT': {
    let newState = Object.assign({}, state, { current: 'plan-attack' });
    delete newState['transport'];
    return newState;
  }
  default:
    return state
  }
}
export default phase
