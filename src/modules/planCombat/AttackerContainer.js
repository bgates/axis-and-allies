import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { TransportContainer } from '../transport'
import Attacker from './Attacker'
import { strategicBombing } from './selectors'
import { 
  COMMIT_UNITS, 
  UNCOMMIT_UNITS,
  COMMIT_TO_STRATEGIC_BOMBING
} from '../../actions'

const mapStateToProps = (state, ownProps) => (
  { strategicBombing: strategicBombing(state, ownProps.unit.ids),
    ...ownProps
  }
)

const commitUnits = (originIndex, destinationIndex, unitIds) => {
  return {
    type: COMMIT_UNITS,
    originIndex,
    destinationIndex,
    unitIds
  }
}

const commitToStrategicBombing = (originIndex, destinationIndex, unitIds) => {
  return {
    type: COMMIT_TO_STRATEGIC_BOMBING,
    originIndex,
    destinationIndex,
    unitIds
  }
}

const uncommitCreator = (originIndex, destinationIndex, unitIds) => ({
  type: UNCOMMIT_UNITS,
  originIndex,
  destinationIndex,
  unitIds
})

const unCommitUnits = (destinationIndex, unitIds) => {
  return (dispatch, getState) => {
    const { outboundUnits, transport } = getState()
    const transportId = unitIds.find(id => transport.newlyLoaded.includes(id))
    if (transportId) {
        // just loaded; uncommit separately
      let originIndex = outboundUnits[transportId]
      dispatch(uncommitCreator(originIndex, destinationIndex, [transportId]))
      originIndex = outboundUnits[unitIds.find(id => !transport.newlyLoaded.includes(id))]
      const ids = unitIds.filter(id => !transport.newlyLoaded.includes(id))
      dispatch(uncommitCreator(originIndex, destinationIndex, ids))
    } else {
      const originIndex = outboundUnits[unitIds[0]]
      dispatch(uncommitCreator(originIndex, destinationIndex, unitIds))
    }
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ 
    commitUnits,
    unCommitUnits,
    commitToStrategicBombing
  }, dispatch)
}

const GenericAttacker = (props) => {
  const { unit: { type }} = props
  if (type === 'transport') {
    const { unit, destinationIndex, landAttack, commitUnits, unCommitUnits } = props
    return (
      <TransportContainer
        unit={unit}
        destinationIndex={destinationIndex}
        commitUnits={commitUnits}
        unCommitUnits={unCommitUnits}
        landAttack={landAttack}
      />
    )
  } else {
    const { 
      unit, 
      destinationIndex, 
      committed, 
      hasIndustry, 
      landingSlots, 
      strategicBombing,
      commitUnits, 
      unCommitUnits,
      commitToStrategicBombing
    } = props
    return (
      <Attacker
        unit={unit}
        destinationIndex={destinationIndex}
        committed={committed}
        hasIndustry={hasIndustry}
        landingSlots={landingSlots}
        strategicBombing={strategicBombing}
        commitUnits={commitUnits}
        unCommitUnits={unCommitUnits}
        commitToStrategicBombing={commitToStrategicBombing}
      />
    )
  }
}

const AttackerContainer = connect(mapStateToProps, mapDispatchToProps)(GenericAttacker)

export default AttackerContainer

