import { createSelector } from 'reselect'
import { getResearch } from '../../selectors/stateSlices'
import { getCurrentPower } from '../../selectors/getCurrentPower'
import researchOptions from '../../config/research'
export { getCurrentPower }

export const currentPowerHasRockets = createSelector(
  getCurrentPower,
  currentPower => currentPower.tech.includes('Rockets')
)

export const canMakeJets = createSelector(
  getCurrentPower,
  ({ name }) => ['Germany', 'US', 'USSR'].includes(name)
)

const allowedFor = name => ({ abbr })=> {
  if (['Germany', 'UK', 'US'].includes(name)) {
    return true
  } else if (name === 'USSR') {
    return ['jets', 'heavyBomber', 'radar', 'longRange'].includes(abbr)
  } else if (name === 'Japan') {
    return abbr !== 'rockets'
  }
}

export const allowedTech = createSelector(
  getCurrentPower,
  ({ name }) => (
    { 
      cost: researchOptions.cost,
      availableTech: researchOptions.availableTech.filter(allowedFor(name))
    }
  )
)

export const research = createSelector(
  allowedTech,
  getResearch,
  (tech, research) => ({ ...tech, ...research })
)
