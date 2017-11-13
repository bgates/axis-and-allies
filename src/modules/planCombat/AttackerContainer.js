import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { TransportContainer } from '../transport'
import Attacker from '../../components/Attacker'
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

const commitUnits = (originIndex, targetIndex, unitIds) => {
  return {
    type: COMMIT_UNITS,
    originIndex,
    targetIndex,
    unitIds
  }
}

const commitToStrategicBombing = (originIndex, targetIndex, unitIds) => {
  return {
    type: COMMIT_TO_STRATEGIC_BOMBING,
    originIndex,
    targetIndex,
    unitIds
  }
}

const uncommitCreator = (originIndex, targetIndex, unitIds) => ({
  type: UNCOMMIT_UNITS,
  originIndex,
  targetIndex,
  unitIds
})

const unCommitUnits = (targetIndex, unitIds) => {
  return (dispatch, getState) => {
    const { outboundUnits, transport } = getState()
    const transportId = unitIds.find(id => transport.newlyLoaded.includes(id))
    if (transportId) {
        // just loaded; uncommit separately
      let originIndex = outboundUnits[transportId]
      dispatch(uncommitCreator(originIndex, targetIndex, [transportId]))
      originIndex = outboundUnits[unitIds.find(id => !transport.newlyLoaded.includes(id))]
      const ids = unitIds.filter(id => !transport.newlyLoaded.includes(id))
      dispatch(uncommitCreator(originIndex, targetIndex, ids))
    } else {
      const originIndex = outboundUnits[unitIds[0]]
      dispatch(uncommitCreator(originIndex, targetIndex, unitIds))
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
    const { unit, targetIndex, landAttack, commitUnits, unCommitUnits } = props
    return (
      <TransportContainer
        unit={unit}
        targetIndex={targetIndex}
        commitUnits={commitUnits}
        unCommitUnits={unCommitUnits}
        landAttack={landAttack}
      />
    )
  } else {
    const { 
      unit, 
      targetIndex, 
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
        targetIndex={targetIndex}
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

