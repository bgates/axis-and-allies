import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import CombatModal from './CombatModal'
import { BombardmentContainer } from '../bombardment'
import { 
  VIEW_BOMBARDMENT_OPTIONS, 
  COMBAT_UNDERWAY,
  removeCasualties,
  roll,
  winAttack
} from '../../../actions'
import { 
  allowRetreat,
  getAttackerCasualties, 
  combatants,
  defenderCasualties, 
  getFocusTerritory, 
  isUnderway,
  rollCount, 
  strengths,
} from './selectors'
import { getCurrentPowerName } from '../../../selectors/getCurrentPower'
import dice from '../../../lib/numericalDieRolls'
import PATHS from '../../../paths'

const mapStateToProps = (state) => ({
  allowRetreat: allowRetreat(state),
  combatants: combatants(state),
  defenderCasualties: defenderCasualties(state),
  isUnderway: isUnderway(state),
  strengths: strengths(state),
  territory: getFocusTerritory(state)
})

const markCombatUnderway = (territoryIndex, transportIds, bombardmentIds, combatUnderway, unitIds, transportLocations) => (
  {
    type: COMBAT_UNDERWAY,
    territoryIndex,
    transportIds,
    bombardmentIds,
    combatUnderway,
    unitIds,
    transportLocations
  }
)

const selectBattle = () => dispatch => dispatch(push(PATHS.RESOLVE_COMBAT))

const conquerUndefendedLands = (dispatch, conquered, unitDestination, territories, currentPowerName) => {
  if (Object.keys(conquered).length === 0) {
    Object.keys(unitDestination).forEach(index => {
      if (territories[index].unitIds.length === 0 && territories[index].currentPower !== 'Oceans') {
        dispatch(winAttack(Number(index), [], unitDestination[index], [], [], currentPowerName))
      }
    })
  }
}

const rollForCombat = (territoryIndex) => {
  return (dispatch, getState) => {
    const state = getState()
    const { 
      amphib, 
      inboundUnits, 
      transport, 
      bombardment, 
      conquered, 
      combatSubphase,
      unitDestination, 
      territories 
    } = state
    const currentPowerName = getCurrentPowerName(state)
    conquerUndefendedLands(dispatch, conquered, unitDestination, territories, currentPowerName)
    const transportIds = amphib.territory[territoryIndex] || []
    const transportedBy = transportIds.reduce((all, id) => (transport.transporting[id] || []).concat(all), [])
    const bombardmentIds = bombardment.targetTerritories[territoryIndex] || []
    const transportLocations = transportIds.map(id => inboundUnits[id])
    const combatUnderwayHere = combatSubphase[territoryIndex]
    dispatch(markCombatUnderway(territoryIndex, transportIds, bombardmentIds, combatUnderwayHere, transportedBy, transportLocations))
    dispatch(removeCasualties(defenderCasualties(state), getAttackerCasualties(state), territoryIndex, currentPowerName))
    const rolls = dice(rollCount(getState()))
    dispatch(roll(PATHS.COMBAT_ROLLS, rolls))
    dispatch(push(PATHS.COMBAT_ROLLS))
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ 
    selectBattle,
    rollForCombat 
  }, dispatch)
}

const ActualCombatContainer = connect(mapStateToProps, mapDispatchToProps)(CombatModal)

const mapOuterStateToProps = (state) => ({
  phase: state.phase
})

const OuterCombatModal = ({ phase }) => {
  if (phase.current === VIEW_BOMBARDMENT_OPTIONS) {
    return <BombardmentContainer />
  } else {
    return <ActualCombatContainer />
  }
}

const CombatContainer = connect(mapOuterStateToProps)(OuterCombatModal)

export default CombatContainer

