// @flow
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import Territory from './Territory'
import { 
  getFill, 
  getTerritoryId,
  getTerritoryDimensions,
  getClasses, 
  isAttackable, 
  isOrdering 
} from './selectors'
import { nextCombatSubphase } from '../../../selectors/combatSubphase'
import { getAttackerCasualties as attackerCasualties } from '../../../selectors/stateSlices'
import { defenderCasualties } from '../../combat'
import { getCurrentPowerName } from '../../../selectors/getCurrentPower'
import { bomberPayload, isFriendly, getFlakTargetCount } from '../../../selectors/getTerritory'
import { hasDamagedShipsInHarbor } from '../../repair'
import { overlayPhase } from '../board'
import dice from '../../../lib/numericalDieRolls'
import { 
  viewAttackOptions, 
  dogfight,
  removeCasualties,
  resolveCombat, 
  viewPlaneLandingOptions,
  viewMovementOptions,
  viewBombardmentOptions,
  orderUnits,
  roll
} from '../../../actions'
import PATHS from '../../../paths'
import type { Dispatch } from 'redux';

const mapStateToProps = (state, ownProps) => {
  const { territoryIndex } = ownProps
  return {
    fill: getFill(state, territoryIndex),
    dimensions: getTerritoryDimensions(state, territoryIndex),
    id: getTerritoryId(state, territoryIndex),
    classNames: getClasses(state, territoryIndex),
    ...ownProps
  }
}

const territoryThunk = (territoryIndex) => {
  return (dispatch, getState) => {
    const state = getState()
    if (overlayPhase(state)) {
      return
    }
    const territory = state.territories[territoryIndex]
    const { router, phase, flightDistance, landPlanes, units } = state 
    const currentPower = getCurrentPowerName(state)
    const routes = {
      '/': () => {
        if (currentPower === 'China') {
          dispatch(push(PATHS.PLAN_ATTACKS))
        } else {
          const nextUrl = hasDamagedShipsInHarbor(state) ? PATHS.REPAIR : PATHS.RESEARCH
          dispatch(push(nextUrl)) 
        }
      }, 
      [PATHS.PLAN_ATTACKS]: () => {
        if (isAttackable(state, territoryIndex)) {
          dispatch(viewAttackOptions(territoryIndex))
        }
      },
      [PATHS.RESOLVE_COMBAT]: () => {
        switch (nextCombatSubphase(state, territoryIndex)) {
          case 'awaitNaval': 
            return alert('not yet!')
          case 'flak':
            flakAttack(dispatch, state, territoryIndex)
          case 'dogfight':
            dispatch(dogfight(territoryIndex))
          case 'bombRaid':
            bombRaid(dispatch, state, territoryIndex)
          case 'bombard':
            dispatch(viewBombardmentOptions(territoryIndex))
          case 'normal':
            dispatch(resolveCombat(territoryIndex))
        }
      },
      [PATHS.LAND_PLANES]: () => {
        if (Object.keys(flightDistance).length >= Object.keys(landPlanes).length) {
          dispatch(viewPlaneLandingOptions(territoryIndex))
        }
      },
      [PATHS.PLAN_MOVEMENT]: () => {
        if (isFriendly(territory, currentPower, units)) {
          dispatch(viewMovementOptions(territoryIndex))
        }
      },
      [PATHS.ORDER_UNITS]: () => {
        const { units } = territory
        if (isOrdering(phase.current, currentPower, territory.currentPower, units)) {
          dispatch(orderUnits(territory)) 
        }
      },
      [PATHS.CONFIRM_FINISH]: () => {}
    }
    routes[router.location.pathname]()
  }
}

const flakAttack = (dispatch, state, territoryIndex) => {
  console.log(getFlakTargetCount(state, territoryIndex), territoryIndex)
  const rolls = dice(getFlakTargetCount(state, territoryIndex))
  dispatch(roll(PATHS.FLAK, rolls))
  dispatch(push(PATHS.FLAK))
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

const mapDispatchToProps = (dispatch, ownProps) => {
  const { territoryIndex } = ownProps
  return {
    handleClick: bindActionCreators(territoryThunk.bind(null, territoryIndex), dispatch)
  }
}

const TerritoryContainer = connect(mapStateToProps, mapDispatchToProps)(Territory)

export default TerritoryContainer