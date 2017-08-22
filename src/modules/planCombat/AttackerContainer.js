import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Attacker from './Attacker'
import { 
  COMMIT_UNITS, 
  UNCOMMIT_UNITS, 
  COMMIT_AMPHIB_UNITS,
  UNCOMMIT_AMPHIB_UNITS,
  VIEW_TRANSPORT_LOAD_OPTIONS 
} from '../../actions';

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

const commitAmphibUnits = (transport, destinationIndex, id) => {
  return {
    type: COMMIT_AMPHIB_UNITS,
    transport,
    destinationIndex,
    id
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

const unCommitAmphibUnits = (transport, destinationIndex, id) => {
  return {
    type: UNCOMMIT_AMPHIB_UNITS,
    transport,
    destinationIndex,
    id
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
    commitAmphibUnits,
    unCommitAmphibUnits,
    viewTransportLoadOptions,
  }, dispatch)
}

const AttackerContainer = connect(mapStateToProps, mapDispatchToProps)(Attacker)

export default AttackerContainer

