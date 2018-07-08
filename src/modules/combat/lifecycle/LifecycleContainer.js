import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import { Route } from 'react-router-dom'
import LifecycleComponent from './LifecycleComponent'
import PATHS from '../../../paths'
import dice from '../../../lib/numericalDieRolls'
import { nextCombatSubphase } from '../../../selectors/combatSubphase'
import { nextPhase } from '../../../selectors/phase'
import { 
  getAttackerCasualties as attackerCasualties,
  getCurrentTerritoryIndex
} from '../../../selectors/stateSlices'
import { getCurrentPowerName } from '../../../selectors/getCurrentPower'
import { defenderCasualties } from '../combat'
import { 
  bomberPayload, 
  getFlakTargetCount 
} from '../../../selectors/getTerritory'
import { 
  dogfight,
  removeCasualties,
  viewBombardmentOptions,
  roll
} from '../../../actions'
import type { Dispatch } from 'redux'

const flakAttack = (dispatch, state, territoryIndex) => {
  dispatch(push(PATHS.FLAK))
  const rolls = dice(getFlakTargetCount(state, territoryIndex))
  dispatch(roll(PATHS.FLAK, rolls))
}

const startDogfight = (dispatch, state, territoryIndex) => {
  dispatch(dogfight(territoryIndex))
  dispatch(push(PATHS.VIEW_COMBATANTS))
}

export const bombRaid = (dispatch:Dispatch, state:Object, territoryIndex:number) => {
  dispatch(removeCasualties(defenderCasualties(state),
    attackerCasualties(state), 
    territoryIndex, 
    getCurrentPowerName(state)))
  const rolls = dice(bomberPayload(state, territoryIndex))
  dispatch(roll(PATHS.STRATEGIC_BOMB, rolls))
  dispatch(push(PATHS.STRATEGIC_BOMB))
}

const mapStateToProps = (state, { location }) => {
  const territoryIndex = getCurrentTerritoryIndex(state)
  // const nextSubphase = nextCombatSubphase(state, territoryIndex)
  return {
    territoryIndex,
    // nextSubphase,
    location
  }
}

const combatPhaseThunk = (territoryIndex) => {
  return (dispatch, getState) => {
    const state = getState()
    switch (nextCombatSubphase(state, territoryIndex)) {
      case 'awaitNaval': 
        dispatch(push(PATHS.RESOLVE_COMBAT))
        return alert('not yet!')
      case 'flak':
        flakAttack(dispatch, state, territoryIndex)
        break
      case 'dogfight':
        startDogfight(dispatch, state, territoryIndex)
        break
      case 'bombRaid':
        bombRaid(dispatch, state, territoryIndex)
        break
      case 'bombard':
        dispatch(viewBombardmentOptions(territoryIndex))
        break
      case 'normal':
        dispatch(push(PATHS.VIEW_COMBATANTS))
        break
      default:
        dispatch(push(nextPhase(state)))
        return
    }
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onEnter: bindActionCreators(combatPhaseThunk, dispatch)
  }
}

const LifecycleContainer = connect(mapStateToProps, mapDispatchToProps)(LifecycleComponent)

export default LifecycleContainer
