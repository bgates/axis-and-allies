import { createSelector } from 'reselect'
import { getResearch } from '../../../../selectors/stateSlices'
import { getCurrentPower } from '../../../../selectors/getCurrentPower'
import researchOptions from '../../../../config/research'
export { getCurrentPower }

export const currentPowerHasRockets = createSelector(
  getCurrentPower,
  currentPower => currentPower.tech.includes('Rockets')
)

const allowedFor = currentPower => ({ abbr })=> {
  if (['Germany', 'UK', 'US'].includes(currentPower.name)) {
    return abbr !== 'heavyBomber' || currentPower.tech.includes('Long Range Aircraft')
  } else if (currentPower.name === 'USSR') {
    return ['jets', 'radar', 'longRange'].includes(abbr) || 
      (abbr === 'heavyBomber' && currentPower.tech.includes('Long Range Aircraft'))
  } else if (currentPower.name === 'Japan') {
    return abbr !== 'rockets'
  }
}

export const allowedTech = createSelector(
  getCurrentPower,
  currentPower => (
    { 
      cost: researchOptions.cost,
      availableTech: researchOptions.availableTech.filter(allowedFor(currentPower))
    }
  )
)

export const research = createSelector(
  allowedTech,
  getResearch,
  (tech, research) => ({ ...tech, ...research })
)
