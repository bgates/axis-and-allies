import { groupWith } from 'ramda'
import { id } from './unit'
import { allUnits } from './territory'
import powers from '../config/initialPowers'
import unitTypes from '../config/unitTypes'

const powersWithNeutral = powers.concat({name: 'neutral'})

const unitNameArray = Object.keys(unitTypes)

const unitStringParser = (string) => {
  return {
    ...unitTypes[unitNameArray[string.charCodeAt(1) - 60]],
    power: powersWithNeutral[parseInt(string[0], 10)].name
  }
}

export const matchingUnit = (unit, other) => {
  return unit.name === other.name && unit.power === other.power
}

const assignIds = (units) => {
  return { ...units[0], ids: units.map(id) }
}

const territoryStringParser = (string) => {
  const unitStrings = string.split(/(\d\S(?:_.*_)?)/).filter(str => str.length)
  return groupWith(matchingUnit, unitStrings.map(unitStringParser))
    .map(assignIds)
}

const powerNames = powersWithNeutral.map(p => p.name)

const unitStringCreator = (unit) => {
  const single = powerNames.indexOf(unit.power) + 
    String.fromCharCode(60 + unitNameArray.indexOf(unit.name))
  return single.repeat(unit.ids.length)
}

const territoryStringCreator = (units) => (  
  units.reduce((string, unit) => string + unitStringCreator(unit), '')
)

export const dehydrate = (board) => (  
  board.map(allUnits).map(territoryStringCreator).join('|')
)

const Parser = {
  hydrate (boardString) {
    const territoryStrings = boardString.split('|')
    return territoryStrings.map(territoryStringParser)
  },
}

export default Parser

