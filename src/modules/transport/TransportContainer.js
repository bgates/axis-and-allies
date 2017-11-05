import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import AmphibiousAssault from './AmphibiousAssault'
import Transport from './Transport'
import {
  getCargo,
  getAvailability
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
    ...ownProps
  }
}

const commitAmphibUnits = (transportOriginIndex, cargoOriginIndex, destinationIndex, transportId, ids) => (
  {
    type: COMMIT_AMPHIB_UNITS,
    transportOriginIndex,
    cargoOriginIndex,
    destinationIndex,
    transportId,
    ids
  }
)

const unCommitAmphibUnits = (transport, destinationIndex, id) => (
  {
    type: UNCOMMIT_AMPHIB_UNITS,
    transport,
    destinationIndex,
    id
  }
)

const viewTransportLoadOptions = (transport, destinationIndex) => (
  {
    type: VIEW_TRANSPORT_LOAD_OPTIONS,
    transport,
    destinationIndex
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
    const { unit, destinationIndex, cargo, commitAmphibUnits, unCommitAmphibUnits } = props
    return (
      <AmphibiousAssault 
        unit={unit}
        destinationIndex={destinationIndex}
        commitAmphibUnits={commitAmphibUnits}
        unCommitAmphibUnits={unCommitAmphibUnits}
      />
    )
  } else {
    const { 
      unit, 
      available,
      cargo,
      destinationIndex, 
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
        destinationIndex={destinationIndex}
        commitUnits={commitUnits}
        unCommitUnits={unCommitUnits}
        viewTransportLoadOptions={viewTransportLoadOptions}
      />
    )
  }
}

const TransportContainer = connect(mapStateToProps, mapDispatchToProps)(GenericTransport)

export default TransportContainer

