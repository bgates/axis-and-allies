import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import LandPlanesModal from './LandPlanesModal'
import { 
  landingOptions, 
  airUnits, 
  selectedOptions,
  getFocusTerritory,
  allLandingsPlanned
} from './selectors'
import { getCurrentPower } from '../../selectors/getCurrentPower'
import { 
  SELECT_PLANE_LANDING_OPTION,
  SELECT_PLANE_LANDING_TERRITORY,
  CONFIRM_LAND_PLANES
} from '../../actions';

const mapStateToProps = (state) => ({
  landingOptions: landingOptions(state),
  airUnits: airUnits(state),
  selectedOptions: selectedOptions(state),
  territory: getFocusTerritory(state)
})

const selectLandingOption = (unit, originIndex, destinationIndex) => {
  return (dispatch) => {
    dispatch({
      type: SELECT_PLANE_LANDING_OPTION,
      unit,
      destinationIndex,
      originIndex
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

