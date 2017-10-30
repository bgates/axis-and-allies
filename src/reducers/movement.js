import { omit } from 'ramda'
import { COMMIT_UNITS, UNCOMMIT_UNITS } from '../actions'
const initialState = {
  origin: {},
  destination: {},
  inbound: {},
  outbound: {}
}

const add = (array = [], ids) => array.concat(ids)

const remove = (array, ids) => array.filter(id => !ids.includes(id))

const movements = (state = initialState, action) => {
  const { originIndex, destinationIndex, unitIds } = action
  switch (action.type) {
  case COMMIT_UNITS: {
    let inbound = { ...state.inbound }
    let outbound = { ...state.outbound }
    unitIds.forEach(id => {
      inbound[id] = destinationIndex
      outbound[id] = originIndex
    })
    return { 
      origin: { 
        ...state.origin, 
        [originIndex]: add(state.origin[originIndex], unitIds)
      }, 
      destination: {
        ...state.destination,
        [destinationIndex]: add(state.destination[destinationIndex], unitIds)
      }, 
      inbound, 
      outbound 
    }
  }
  case UNCOMMIT_UNITS: {
    return { 
      origin: { 
        ...state.origin, 
        [originIndex]: remove(state.origin[originIndex], unitIds)
      }, 
      destination: {
        ...state.destination,
        [destinationIndex]: remove(state.destination[destinationIndex], unitIds)
      }, 
      inbound: omit(unitIds, state.inbound), 
      outbound: omit(unitIds, state.outbound)
    }
  }
  default:
    return state
  }
}

export default movements

