import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import AmphibiousAssault from './AmphibiousAssault'
import Transport from './Transport'
import {
  getCargo,
  getAvailability,
  isCommittedHere
} from './selectors'
import { 
  COMMIT_AMPHIB_UNITS,
  UNCOMMIT_AMPHIB_UNITS,
  VIEW_TRANSPORT_LOAD_OPTIONS 
} from '../../actions'

const mapStateToProps = (state, ownProps) => {
  const { unit: {id} } = ownProps
  return {
    cargo: getCargo(state, id),
    available: getAvailability(state, id),
    committedHere: isCommittedHere(state, id),
    ...ownProps
  }
}

const commitAmphibUnits = (transportId, targetIndex) => (
  {
    type: COMMIT_AMPHIB_UNITS,
    transportId,
    targetIndex
  }
)

const unCommitAmphibUnits = (transportId, targetIndex) => (
  {
    type: UNCOMMIT_AMPHIB_UNITS,
    transportId,
    targetIndex
  }
)

const viewTransportLoadOptions = (transport, targetIndex) => (
  {
    type: VIEW_TRANSPORT_LOAD_OPTIONS,
    transport,
    targetIndex
  }
)

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ 
    commitAmphibUnits,
    unCommitAmphibUnits,
    viewTransportLoadOptions,
  }, dispatch)
}

const GenericTransport = (props) => {
  const { landAttack } = props
  if (landAttack) {
    const { unit, committedHere, targetIndex, cargo, commitAmphibUnits, unCommitAmphibUnits } = props
    return (
      <AmphibiousAssault 
        unit={unit}
        amphibiousUnits={cargo}
        committedHere={committedHere}
        targetIndex={targetIndex}
        commitAmphibUnits={commitAmphibUnits}
        unCommitAmphibUnits={unCommitAmphibUnits}
      />
    )
  } else {
    const { 
      unit, 
      available,
      cargo,
      targetIndex, 
      commitUnits, 
      unCommitUnits, 
      viewTransportLoadOptions
    } = props
    return (
      <Transport
        unit={unit}
        available={available}
        cargo={cargo}
        unitIds={[unit.id].concat(cargo.map(u => u.id))}
        targetIndex={targetIndex}
        commitUnits={commitUnits}
        unCommitUnits={unCommitUnits}
        viewTransportLoadOptions={viewTransportLoadOptions}
      />
    )
  }
}

const TransportContainer = connect(mapStateToProps, mapDispatchToProps)(GenericTransport)

export default TransportContainer

