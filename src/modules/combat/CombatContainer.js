import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import CombatModal from './CombatModal'
import { BombardmentContainer } from '../bombardment'
import { VIEW_BOMBARDMENT_OPTIONS, COMBAT_UNDERWAY } from '../../actions'

import { 
  allowRetreat,
  attackerCasualties, 
  combatants,
  defenderCasualties, 
  getFocusTerritory, 
  isUnderway,
  rollCount, 
  strengths,
} from './selectors'
import { getCurrentPowerName } from '../../selectors/getCurrentPower'
import { removeCasualties, roll } from '../../actions'
import dice from '../../lib/numericalDieRolls'
import PATHS from '../../paths'

const mapStateToProps = (state) => ({
  allowRetreat: allowRetreat(state),
  combatants: combatants(state),
  defenderCasualties: defenderCasualties(state),
  isUnderway: isUnderway(state),
  strengths: strengths(state),
  territory: getFocusTerritory(state)
})

const markCombatUnderway = (territoryIndex, transportIds, bombardmentIds, unitIds) => (
  {
    type: COMBAT_UNDERWAY,
    territoryIndex,
    transportIds,
    bombardmentIds,
    unitIds
  }
)

const selectBattle = () => dispatch => dispatch(push(PATHS.RESOLVE_COMBAT))

const rollForCombat = (territoryIndex) => {
  return (dispatch, getState) => {
    const state = getState()
    const { amphib, transport, bombardment } = state
    const transportIds = amphib.territory[territoryIndex] || []
    const transportedBy = transportIds.reduce((all, id) => (transport.transporting[id] || []).concat(all), [])
    const bombardmentIds = bombardment.targetTerritories[territoryIndex]
    dispatch(markCombatUnderway(territoryIndex, transportIds, bombardmentIds, transportedBy))
    dispatch(removeCasualties(defenderCasualties(state), attackerCasualties(state), territoryIndex, getCurrentPowerName(state)))
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

