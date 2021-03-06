import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import LoadTransport from './LoadTransport'
import { getFocusTerritory, getLoadableUnits } from './selectors'
import { getCurrentPower } from '../../selectors/getCurrentPower'
import { LOAD_TRANSPORT, viewAttackOptions } from '../../actions'

const mapStateToProps = (state) => ({
  currentPower: getCurrentPower(state),
  territory: getFocusTerritory(state),
  loadableUnits: getLoadableUnits(state),
  transport: state.phase.transport
})

const loadUnits = (transport, targetIndex, unitIds, originIndex) => {
  return {
    type: LOAD_TRANSPORT,
    transport,
    targetIndex,
    unitIds,
    originIndex
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ 
    loadUnits,
    viewAttackOptions
  }, dispatch)
}

const LoadTransportContainer = connect(mapStateToProps, mapDispatchToProps)(LoadTransport)

export default LoadTransportContainer
