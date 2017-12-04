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

const allowedFor = name => tech => {
  if (['Germany', 'UK', 'US'].includes(name)) {
    return true
  } else if (name === 'USSR') {
    return ['jets', 'heavyBomber', 'radar', 'longRange'].includes(tech)
  } else if (name === 'Japan') {
    return tech !== 'rockets'
  }
}

export const allowedTech = createSelector(
  getCurrentPower,
  ({ name }) => (
    Object.keys(researchOptions)
      .filter(allowedFor(name))
      .reduce((allowed, tech) => {
        allowed[tech] = researchOptions[tech]
        return allowed
      }, {})
  )
)

export const research = createSelector(
  allowedTech,
  getResearch,
  (tech, research) => ({ ...tech, ...research })
)
