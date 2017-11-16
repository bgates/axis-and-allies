import { createSelector } from 'reselect'
import { getCurrentPowerName } from '../../selectors/getCurrentPower'
import { territoriesInRange } from '../planCombat/movement'
import { mergeBoardAndTerritories, isEnemy } from '../../selectors/getTerritory'
import { industry, antiaircraft } from '../../selectors/units'

const hasIndustry = territory => territory.units.find(industry)
const hasRocket = territory => territory.units.find(antiaircraft)

const industrialComplexInRocketRange = (board, currentPower, territory) => {
  const all = () => true
  const ranges = territoriesInRange(board, currentPower, territory, all, 2)
  let territories = Object.values(ranges).reduce((total, one) => total.concat(one), [])
  return territories
    .filter(hasIndustry)
    .filter(territory => isEnemy(territory, currentPower))
}

const belongsTo = currentPower => territory => territory.currentPower === currentPower
const territoriesWithRockets = (board, currentPower) => (
  board.filter(hasRocket)
       .filter(belongsTo(currentPower))
)

const rocketsAndTargets = (board, currentPower) => {
  let obj = {}
  territoriesWithRockets(board, currentPower).forEach(territory => {
    let targets = industrialComplexInRocketRange(board, currentPower, territory)
    if (targets.length) {
      obj[territory.name] = targets
    }
  })
  return obj
}

export const rocketTargets = createSelector(
  mergeBoardAndTerritories,
  getCurrentPowerName,
  (board, currentPower) => rocketsAndTargets(board, currentPower)
)
