import React from 'react'
import { Link } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import { phases } from '../selectors'
import { getCurrentPowerName } from '../../../selectors/getCurrentPower'
import { nextId } from '../../../selectors/units'
import {
  SELECT_PLANE_LANDING_TERRITORY,
  LAND_PLANES,
  NEXT_TURN,
  sendToFirebase,
  CONFIRM_FINISH
} from '../../../actions'
import PATHS from '../../../paths'

const mapStateToProps = (state) => ({
  phases: phases(state)
})

const idsAndUnits = (placement, power) => {
  const idsByTerritoryIndex = {}
  let newUnits = {}
  Object.keys(placement).forEach(type => {
    Object.keys(placement[type]).forEach(index => {
      idsByTerritoryIndex[index] = idsByTerritoryIndex[index] || []
      for (let i = 0; i < placement[type][index]; i++) {
        const id = nextId()
        newUnits[id] = { id, type, power }
        idsByTerritoryIndex[index].push(id)
      }
    })
  })
  return { newUnits, idsByTerritoryIndex }
}

const endCurrentTurn = (dispatch, getState) => {
  const state = getState()
  const { currentPowerIndex, income, placement, unitOrigin, unitDestination } = state
  const currentPower = getCurrentPowerName(state)
  const { newUnits, idsByTerritoryIndex }= idsAndUnits(placement, currentPower)
  dispatch({ type: NEXT_TURN, currentPowerIndex, income, unitOrigin, unitDestination, newUnits, idsByTerritoryIndex })
}

export const nextTurn = () => (
  (dispatch, getState, getFirebase) => {
    endCurrentTurn(dispatch, getState)
    const { boardString, currentPowerIndex, firebase } = getState()
    sendToFirebase(firebase, getFirebase, 'set', 'currentPowerIndex', currentPowerIndex)
    sendToFirebase(firebase, getFirebase, 'push', 'boardStrings', boardString)
    sendToFirebase(firebase, getFirebase, 'remove', 'patches')
  }
)

const changePhaseThunk = (dir = 'fwd') => {
  return (dispatch, getState) => {
    const state = getState()
    const { phase } = state 
    const phases = {
      'confirm-land-planes-fwd': () => {
        dispatch({ type: LAND_PLANES, planesFrom: state.landPlanes })
        dispatch(push(PATHS.PLAN_MOVEMENT))
      },
      'confirm-land-planes-back': () => dispatch({ type: SELECT_PLANE_LANDING_TERRITORY }),
      [`${CONFIRM_FINISH}-fwd`]: () => {
        dispatch(nextTurn())
        dispatch(push('/'))
      },
      [`${CONFIRM_FINISH}-back`]: () => dispatch({ type: 'backToOrder' })
    }
    return phases[`${phase.current}-${dir}`]()
  }
}

const advancePhase = () => changePhaseThunk()
const regressPhase = () => changePhaseThunk('back')

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ 
    advancePhase,
    regressPhase,
  }, dispatch)
}

// the advance button won't allow forward progress during resolve-combat if any combat is unresolved, and won't allow back movement if any combat has begun.
const NavLinks = ({ fwd, back, text }) => {
  return (
    <div className="changePhase">
      <Link to={fwd} className="btn">{text || 'Done'}</Link>
      <Link to={back} className="btn">Back</Link>
    </div>
  )
}

const AdvanceButtonComponent = ({ phases, advancePhase, regressPhase }) => {
  if (typeof phases.next === 'string') {
    return <NavLinks fwd={phases.next} back={phases.last} text={phases.text} />
  } else {
    return (
      <div className="changePhase">
        <button className="btn" onClick={advancePhase}>Done</button>
        <button className="btn" onClick={regressPhase}>Back</button>
      </div>
    )
  }
}
const AdvanceButton = connect(mapStateToProps, mapDispatchToProps)(AdvanceButtonComponent)

export default AdvanceButton

