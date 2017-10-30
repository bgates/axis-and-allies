const initialState = {
  origin: {},
  destination: {},
  inbound: {},
  outbound: {}
}

const movements = (state = initialState, action) => {
  const { originIndex, destinationIndex, unitIds } = action
  switch (action.type) {
  case 'COMMIT_UNITS': {
    let inbound = { ...state.inbound }
    let outbound = { ...state.outbound }
    unitIds.forEach(id => {
      inbound[id] = destinationIndex
      outbound[id] = originIndex
    })
    return { 
      origin: { 
        ...state.origin, 
        [originIndex]: (state.origin[originIndex] || [] ).concat(unitIds)
      }, 
      destination: {
        ...state.destination,
        [destinationIndex]: (state.destination[destinationIndex] || []).concat(unitIds)
      }, 
      inbound, 
      outbound 
    }
  }
  default:
    return state
  }
}

export default movements

