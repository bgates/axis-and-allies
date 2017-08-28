import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import PlacementModal from './PlacementModal';
import { industrialComplexes, shipyards, purchases, availables } from './selectors';
import { getCurrentPower } from '../../selectors/getCurrentPower';
import {
  COMMIT_PLACEMENT,
  UNCOMMIT_PLACEMENT,
  COMMIT_PLACE_ALL,
  UNCOMMIT_PLACE_ALL
} from '../../actions';

const mapStateToProps = (state) => {
  return {
    currentPower: getCurrentPower(state),
    industrialComplexes: industrialComplexes(state),
    shipyards: shipyards(state),
    purchases: purchases(state),
    placements: state.placement,
    availables: availables(state)
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

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ 
    commitUnitPlacement,
    commitAllUnitPlacement,
    unCommitUnitPlacement,
    unCommitAllUnitPlacement
  }, dispatch)
}

const PlacementContainer = connect(mapStateToProps, mapDispatchToProps)(PlacementModal)

export default PlacementContainer

