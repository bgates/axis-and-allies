import { createSelector } from 'reselect'
import { getTerritoriesWithIpcValues } from '../../selectors/getTerritory'
import { getSelectedRocketTargets } from '../rocketAttack'
import PATHS from '../../paths'

export const targetValues = createSelector(
  getTerritoriesWithIpcValues,
  getSelectedRocketTargets,
  state => state.rolls[PATHS.ROCKET_RESULTS],
  (territories, targets, rolls) => {
    let obj = {}
    Object.keys(targets).forEach((launchSite, index)=> {
      obj[launchSite] = { ...territories[targets[launchSite]], territoryIndex: targets[launchSite], roll: rolls[index] }
    })
    return obj
  }
)

export const damages = createSelector(
  targetValues,
  targets => {
    let damage = {}
    Object.keys(targets).forEach(launchSite => {
      const { territoryIndex, roll, ipc_value } = targets[launchSite]
      damage[territoryIndex] = Math.min((damage[territoryIndex] || 0) + roll, ipc_value)
    })
    let damageByPower = {}
    Object.keys(targets).forEach(launchSite => {
      const { currentPower, territoryIndex }= targets[launchSite]
      damageByPower[currentPower] = (damageByPower[currentPower] || 0) + damage[territoryIndex]
    })
    return damageByPower
  }
)
