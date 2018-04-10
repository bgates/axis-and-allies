import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import PlacementModal from './PlacementModal'
import { 
  availables,
  industrialComplexes, 
  getPurchases, 
  previousPhase,
  shipyards, 
} from './selectors'
import { getCurrentPowerName } from '../../../selectors/getCurrentPower'
import {
  COMMIT_PLACEMENT,
  UNCOMMIT_PLACEMENT,
  COMMIT_PLACE_ALL,
  UNCOMMIT_PLACE_ALL,
  PLACE_UNITS
} from '../../../actions'

const mapStateToProps = (state) => {
  return {
    availables: availables(state),
    currentPower: getCurrentPowerName(state),
    industrialComplexes: industrialComplexes(state),
    placements: state.placement,
    purchases: getPurchases(state),
    shipyards: shipyards(state),
    previousPhase: previousPhase(state)
  }
}

const commitUnitPlacement = (unit, territoryIndex) => {
  return { 
    type: COMMIT_PLACEMENT,
    unit,
    territoryIndex
  }
}

const commitAllUnitPlacement = (unit, territoryIndex, count) => {
  return { 
    type: COMMIT_PLACE_ALL,
    unit,
    territoryIndex,
    count
  }
}

const unCommitUnitPlacement = (unit, territoryIndex) => {
  return { 
    type: UNCOMMIT_PLACEMENT,
    unit,
    territoryIndex 
  }
}

const unCommitAllUnitPlacement = (unit, territoryIndex) => {
  return { 
    type: UNCOMMIT_PLACE_ALL,
    unit,
    territoryIndex 
  }
}

const place = () => {
  return (dispatch, getState) => {
    const state = getState()
    const placements = state.placement
    const currentPower = getCurrentPowerName(state)
    dispatch({ 
      type: PLACE_UNITS, 
      placements,
      currentPower
    })
    if (false) {
      dispatch(push('load-carriers'))
    } else {
      dispatch(push('order-units'))
    }
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ 
    commitUnitPlacement,
    commitAllUnitPlacement,
    unCommitUnitPlacement,
    unCommitAllUnitPlacement,
    place
  }, dispatch)
}

const PlacementContainer = connect(mapStateToProps, mapDispatchToProps)(PlacementModal)

export default PlacementContainer

