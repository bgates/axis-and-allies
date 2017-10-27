import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import CombatModal from './CombatModal'
import BombardmentContainer from '../bombardment'
import { VIEW_BOMBARDMENT_OPTIONS } from '../../actions';

import { 
  rollCount, 
  getFocusTerritory, 
  shoreBombardment, 
  attackerCasualties, 
  combatants,
  allowRetreat 
} from './selectors'
import { strengths, defenderCasualties, attackerCasualtyCount } from '../combatRolls'
import { getCurrentPower } from '../../selectors/getCurrentPower'
import { removeCasualties, roll } from '../../actions';
import dice from '../../lib/numericalDieRolls'
import PATHS from '../../paths'

const mapStateToProps = (state) => ({
  territory: getFocusTerritory(state),
  combatants: combatants(state),
  strengths: strengths(state),
  defenderCasualties: defenderCasualties(state),
  attackerCasualties: attackerCasualties(state),
  attackerCasualtyCount: attackerCasualtyCount(state),
  allowRetreat: allowRetreat(state)
})

const rollForCombat = (territoryIndex) => {
  return (dispatch, getState) => {
    const state = getState();
    dispatch(removeCasualties(defenderCasualties(state), territoryIndex, getCurrentPower(state).name))
    const rolls = dice(rollCount(getState()));
    dispatch(roll(PATHS.COMBAT_ROLLS, rolls))
    dispatch(push(PATHS.COMBAT_ROLLS));
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ 
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

