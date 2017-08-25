// find the planes in the current territory
// categorize by type and range
// calculate friendly territories in range for each
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import LandPlanesModal from './LandPlanesModal'
import { landingOptions } from './selectors'
import { getCurrentPower } from '../../selectors/getCurrentPower'

const mapStateToProps = (state) => ({
  landingOptions: landingOptions(state),
})

const landPlanes = (territoryIndex) => {
  return (dispatch) => {
    console.log(dispatch)
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ 
    landPlanes 
  }, dispatch)
}

const LandPlanesContainer = connect(mapStateToProps, mapDispatchToProps)(LandPlanesModal)

export default LandPlanesContainer

