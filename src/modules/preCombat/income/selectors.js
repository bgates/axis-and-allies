// @flow
import { createSelector } from 'reselect'
import { groupBy } from 'ramda'
import { getCurrentPower } from '../../../selectors/getCurrentPower'
import { ship } from '../../../selectors/units'
import { mergeBoardAndTerritories, getTerritoriesWithIpcValues } from '../../../selectors/getTerritory'
import { opponents } from '../../../config/initialPowers'
// import unitTypes from '../../config/unitTypes'
// capturing capital: 3; losing capital: -5

const capitalCapture = (territoryNames, currentPower) => (
  opponents(currentPower).reduce((total, power) => (
    total + territoryNames.includes(power.capital) ? 3 : 0
  ), 0)
)

const hasAll = (subcollection, collection) => {
  return subcollection.every(member => collection.includes(member))
}

const hasEnough = (subcollection, collection, n) => {
  return subcollection.filter(member => collection.includes(member)).length >= n 
}

const homelandControl = (territoryNames) => {
  const homeland = ['Berlin', 'West Germany', 'Bavaria', 'Austria', 'Denmark', 'Holland', 'France', 'Western France', 'Vichy France', 'Yugoslavia', 'Bulgaria', 'Romania', 'Hungary', 'Poland', 'East Poland']
  return hasAll(homeland, territoryNames) ? 5 : 0
}

const lebensraumControl = (territoryNames) => {
  const lebensraum = ['Baltic States', 'Western Ukraine', 'Eastern Ukraine', 'Belorussia', 'Orel-Kursk']
  return hasEnough(lebensraum, territoryNames, 3) ? 5 : 0
}

const groBdeutschland = (territoryNames) => {
  return territoryNames.includes('Leningrad') || 
    territoryNames.includes('Stalingrad') ? 5 : 0
}

const GermanNationalObjectives = (territoryNames) => (
  [      
    { text: "For controlling all of the traditional German homeland (Berlin, West Germany, Bavaria, Austria, Denmark, Holland, France, Western France, Vichy France, Yugoslavia, Bulgaria, Romania, Hungary, Poland, and East Poland)", value: homelandControl(territoryNames) },
    { text: "For controlling at least three of the more-or-less empty spaces to the east (Baltic States, Western Ukraine, Eastern Ukraine, Belorussia, Orel-Kursk)", value: lebensraumControl(territoryNames) },
    { text: "For controlling either of the soon-to-be-traditionally German cities of Leningrad or Stalingrad", value: groBdeutschland(territoryNames) },
    { text: "For capturing enemy capitals", value: capitalCapture(territoryNames, 'Germany') }
  ]
)

const bufferStates = (territoryNames) => {
  const states = ['Norway', 'Finland', 'Poland', 'Bulgaria', 'Romania', 'Hungary', 'Yugoslavia', 'Greece', 'Albania']
  return hasEnough(states, territoryNames, 6) ? 10 : 0
}

const RussianNationalObjectives = (territoryNames) => (
  [ 
    { text: "For controlling a buffer zone to the West (at least six of Norway, Finland, Poland, Bulgaria, Romania, Hungary, Yugoslavia, Greece, and Albania)", value: bufferStates(territoryNames) },
    { text: "For capturing enemy capitals", value: capitalCapture(territoryNames, 'USSR') }
  ]
)

const greaterEastAsiaControl = (territoryNames) => {
  const greaterEastAsia = ['Korea', 'Manchuria', 'Peking', 'Shantung', 'Kwangtung', 'Hong Kong', 'Kwangsi', 'French Indochina', 'Saigon', 'Malaysia', 'Thailand']
  return hasAll(greaterEastAsia, territoryNames) ? 5 : 0
}

const oceaniaControl = (territoryNames) => {
  const oceania = ['Sumatra', 'Borneo', 'Java', 'Celebes', 'Philippines', 'Dutch New Guinea', 'Solomon Islands']
  return hasEnough(oceania, territoryNames, 6) ? 5 : 0 
}

const JapaneseNationalObjectives = (territoryNames) => {
  return [ 
    { text: "For controlling the mainland region of the Greater East Asia Co-Prosperity Sphere (Korea, Manchuria, Peking, Shantung, Kwangtung, Hong Kong, Kwangsi, French Indochina, Saigon, Malaysia, and Thailand)", value: greaterEastAsiaControl(territoryNames) },
    { text: "For controlling the Pacific region of the Greater East Asia Co-Prosperity Sphere (at least six of Sumatra, Borneo, Java, Celebes, Philippines, Dutch New Guinea, Solomon Islands)", value: oceaniaControl(territoryNames) },
    { text: "For capturing enemy capitals", value: capitalCapture(territoryNames, 'Japan') }
  ]
}

const empireControl = (territoryNames) => {
  const imperialCities = ['Bombay', 'Cairo', 'Calcutta', 'Gibraltar', 'Hong Kong', 'London', 'New South Wales', 'Ontario', 'South Africa', 'Tehran', 'Malaysia']
  return hasAll(imperialCities, territoryNames) ? 5 : 0
}

const BritishNationalObjectives = (territoryNames) => {
  return [
    { text: "For keeping the Empire together (holding all of Bombay, Cairo, Calcutta, Gibraltar, Hong Kong, London, New South Wales, Ontario, South Africa, Tehran, and Malaysia)", value: empireControl(territoryNames) },
    { text: "For capturing enemy capitals", value: capitalCapture(territoryNames, 'UK') }
  ]
}

const alliedSurfaceShip = (unit) => {
  const allies = ['US', 'UK', 'USSR']
  return ship(unit) && allies.includes(unit.power)
}

const mareNostrum = (territories) => {
  const med = [252, 253, 254, 255, 256, 257, 258, 260, 261, 262, 263, 373]
  return med.some(n => territories[n].units.some(alliedSurfaceShip)) ? 0 : 5
}

const romanEmpire = (territories, territoryNames) => {
  const originalHoldings = territories.filter(territory => territory.original_power === 'Italy').map(t => t.name)
  const empire = ['Tobruk', 'Upper Egypt', 'Anglo-Egyptian Sudan', 'Cairo', 'Cyprus', 'Malta'].concat(originalHoldings)
  return hasAll(empire, territoryNames) ? 5 : 0
}

const ItalianNationalObjectives = (territoryNames, territories) => {
  return [ 
    { text: "For making the Mediterranean an Italian lake (with no Allied surface combat vessels present)", value: mareNostrum(territories) },
    { text: "For restoring the Roman Empire (controlling all original Italian territories plus Tobruk, Upper Egypt, the Sudan, Cairo, Cyprus, and Malta)", value: romanEmpire(territories, territoryNames) },
    { text: "For capturing enemy capitals", value: capitalCapture(territoryNames, 'Italy') }
  ]
}

const AmericanNationalObjectives = (territoryNames) => {
  return [
    { text: "For capturing enemy capitals", value: capitalCapture(territoryNames, 'US') }
  ]
}

const objectivesByNation = (territories, ownedTerritories, powerName) => {
  const territoryNames = ownedTerritories.map(territory => territory.name)
  const objectives = {
    'Germany': GermanNationalObjectives,
    'USSR': RussianNationalObjectives,
    'Japan': JapaneseNationalObjectives,
    'UK': BritishNationalObjectives,
    'Italy': ItalianNationalObjectives,
    'US': AmericanNationalObjectives,
    'China': () => []
  }
  return objectives[powerName](territoryNames, territories)
}

export const territoriesOwnedBy = createSelector(
  getTerritoriesWithIpcValues,
  territories => groupBy(territory => territory.currentPower)(territories)
)

export const nationalObjectives = createSelector(
  mergeBoardAndTerritories,
  territoriesOwnedBy,
  getCurrentPower,
  (allTerritories, ownedTerritories, { name }) => objectivesByNation(allTerritories, ownedTerritories[name], name)
)
 
export const calculateNPL = (territories:{ sea:boolean, currentPower: string, original_power:string, ipc_value:number }[]) => {
  return territories.filter(({ sea, currentPower, original_power }) => (
    !(sea && currentPower !== original_power)
  )).reduce((sum, territory) => sum + (territory.ipc_value || 0), 0)
}

export const currentPowerNPL = createSelector(
  getCurrentPower,
  territoriesOwnedBy,
  (power, territories) => calculateNPL(territories[power.name])
);
 
const nextNpl = (currentPower, npl, objectives) => {
  return currentPower.ipc + npl + objectives.reduce((total, objective) => total + objective.value, 0)
}

export const nextNPL = createSelector(
  getCurrentPower,
  currentPowerNPL,
  nationalObjectives,
  (currentPower, npl, objectives) => nextNpl(currentPower, npl, objectives)
);

