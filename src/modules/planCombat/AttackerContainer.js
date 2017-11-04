import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import TransportContainer from '../transport'
import Attacker from './Attacker'
import { 
  COMMIT_UNITS, 
  UNCOMMIT_UNITS 
} from '../../actions'

const mapStateToProps = (state, ownProps) => {
  const { committed, unit: { ids } } = ownProps
  return {
    committed: committed.filter(id => ids.includes(id)),
    ...ownProps
  }
}

const commitUnits = (originIndex, destinationIndex, unitIds) => {
  return {
    type: COMMIT_UNITS,
    originIndex,
    destinationIndex,
    unitIds
  }
}

const unCommitUnits = (destinationIndex, unitIds) => {
  return (dispatch, getState) => {
    const { outboundUnits } = getState()
    const originIndex = outboundUnits[unitIds[0]]
    dispatch({ 
      type: UNCOMMIT_UNITS, 
      originIndex, 
      destinationIndex, 
      unitIds 
    })
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ 
    commitUnits,
    unCommitUnits
  }, dispatch)
}

const GenericAttacker = (props) => {
  const { unit: { type }} = props
  if (type === 'transport') {
    const { unit, destinationIndex, commitUnits, unCommitUnits } = props
    return (
      <TransportContainer
        unit={unit}
        destinationIndex={destinationIndex}
        commitUnits={commitUnits}
        unCommitUnits={unCommitUnits}
      />
    )
  } else {
    const { unit, destinationIndex, committed, commitUnits, unCommitUnits } = props
    return (
      <Attacker
        unit={unit}
        destinationIndex={destinationIndex}
        committed={committed}
        commitUnits={commitUnits}
        unCommitUnits={unCommitUnits}
      />
    )
  }
}

const AttackerContainer = connect(mapStateToProps, mapDispatchToProps)(GenericAttacker)

export default AttackerContainer

