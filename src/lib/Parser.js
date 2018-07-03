import powers from '../config/initialPowers'
import unitTypes from '../config/unitTypes'

const powersWithNeutral = powers.concat({ name: 'Neutrals' })

const unitNameArray = Object.keys(unitTypes)

const unitStringParser = (string) => {
  return {
    type: unitNameArray[string.charCodeAt(1) - 60],
    power: powersWithNeutral[parseInt(string[0], 10)].name
  }
}

export const matchingUnit = (unit, other) => {
  return unit.name === other.name && unit.power === other.power
}

const territoryStringParser = (string) => (
  string
    .split(/(\d\S(?:_.*_)?)/)
    .filter(str => str.length)
    .map(unitStringParser)
)

const powerNames = powersWithNeutral.map(p => p.name)

const unitStringCreator = unit => (  
  powerNames.indexOf(unit.power) + 
  String.fromCharCode(60 + unitNameArray.indexOf(unit.name))
)

const territoryStringCreator = (units) => (  
  units.reduce((string, unit) => string + unitStringCreator(unit), '')
)

  /*export const dehydrate = (board) => (  
  board.map(allUnits).map(territoryStringCreator).join('|')
) */

const Parser = {
  hydrate (boardString) {
    const territoryStrings = boardString.split('|')
    return territoryStrings.map(territoryStringParser)
  },
}

export const newParse = (boardString) => ( 
  boardString
    .split('|')
    .map(territoryStringParser)
 )
export default Parser

