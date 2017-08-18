import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Attacker from './Attacker'
import { COMMIT_UNITS, UNCOMMIT_UNITS, VIEW_TRANSPORT_LOAD_OPTIONS } from '../../actions';

const mapStateToProps = (state, ownProps) => ({
  ...ownProps
})

const commitUnits = (movingUnit, destinationIndex, mission, ids) => {
  return {
    type: COMMIT_UNITS,
    movingUnit,
    destinationIndex,
    mission,
    ids
  }
}

const unCommitUnits = (unit, destinationIndex, ids) => {
  return {
    type: UNCOMMIT_UNITS,
    unit,
    destinationIndex,
    ids
  }
}

const viewTransportLoadOptions = (transport, id) => {
  return {
    type: VIEW_TRANSPORT_LOAD_OPTIONS,
    transport,
    id
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ 
    commitUnits,
    unCommitUnits,
    viewTransportLoadOptions,
  }, dispatch)
}

const AttackerContainer = connect(mapStateToProps, mapDispatchToProps)(Attacker)

export default AttackerContainer

