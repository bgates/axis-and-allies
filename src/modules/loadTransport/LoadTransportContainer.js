import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import LoadTransport from './LoadTransport'
import { getCurrentPower, getFocusTerritory, getLoadableUnits } from './selectors'

const mapStateToProps = (state) => ({
  currentPower: getCurrentPower(state),
  territory: getFocusTerritory(state),
  loadableUnits: getLoadableUnits(state),
  transport: state.phase.transport
})

const loadUnits = (units, destinationIndex, transport) => {
  return {
    type: 'LOAD_TRANSPORT',
    units,
    destinationIndex,
    transport
  }
}

const planAttack = (territory) => {
  return {
    type: 'PLAN_ATTACK',
    territory
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ 
    loadUnits,
    planAttack
  }, dispatch)
}

const LoadTransportContainer = connect(mapStateToProps, mapDispatchToProps)(LoadTransport)

export default LoadTransportContainer
