import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import LandPlanesModal from './LandPlanesModal'
import { landingOptions, airUnits } from './selectors'
import { getCurrentPower } from '../../selectors/getCurrentPower'
import { getFocusTerritory } from '../../selectors/mergeBoardAndTerritories'
import { SELECT_PLANE_LANDING_OPTION } from '../../actions';

const mapStateToProps = (state) => ({
  landingOptions: landingOptions(state),
  airUnits: airUnits(state),
  territory: getFocusTerritory(state)
})

const landPlanes = (unit, originIndex, destinationIndex) => {
  return (dispatch) => {
    dispatch({
      type: SELECT_PLANE_LANDING_OPTION,
      unit,
      destinationIndex,
      originIndex
    })
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ 
    landPlanes 
  }, dispatch)
}

const LandPlanesContainer = connect(mapStateToProps, mapDispatchToProps)(LandPlanesModal)

export default LandPlanesContainer

