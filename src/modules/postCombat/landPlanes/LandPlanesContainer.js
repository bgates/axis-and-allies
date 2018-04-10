import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import LandPlanesModal from './LandPlanesModal'
import { 
  landingOptions, 
  airUnits, 
  getLandingPlanes,
  getFocusTerritory,
  allLandingsPlanned
} from './selectors'
import { 
  SELECT_PLANE_LANDING_OPTION,
  SELECT_PLANE_LANDING_TERRITORY,
  CONFIRM_LAND_PLANES
} from '../../../actions'

const mapStateToProps = (state) => ({
  airUnits: airUnits(state),
  landingOptions: landingOptions(state),
  territory: getFocusTerritory(state),
  selectedOptions: getLandingPlanes(state)
})

const selectLandingOption = (unitId, territoryIndex) => {
  return (dispatch) => {
    dispatch({
      type: SELECT_PLANE_LANDING_OPTION,
      unitId,
      territoryIndex
    })
  }
}

const landingThunk = () => {
  return (dispatch, getState) => { 
    const state = getState()
    if (allLandingsPlanned(state)) {
      dispatch({ type: CONFIRM_LAND_PLANES })
    } else {
      dispatch({ type: SELECT_PLANE_LANDING_TERRITORY })
    }
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ 
    selectLandingOption,
    landingThunk
  }, dispatch)
}

const LandPlanesContainer = connect(mapStateToProps, mapDispatchToProps)(LandPlanesModal)

export default LandPlanesContainer

