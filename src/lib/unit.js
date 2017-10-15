import uuid from 'uuid/v4'
import unitTypes from '../config/unitTypes'

export const id = () => uuid();

export const isNotSubmerged = (unit) => {
  return !unit.submerged
}

export const unitMatch = (unit, unit2, ...props) => {
  return unit.name === unit2.name && 
    props.every(prop => unit[prop] === unit2[prop])
}

export const unitCount = (total, unit) => total + unit.ids.length;

export const nonIndustry = (unit) => unit.name !== 'industrial complex';

export const duplicateUnit = (original, ...extraAttributes) => {
  const props = ['attack', 'defend', 'power', 'name', 'originIndex', 'cargo', 'ids', 'mission', 'air', ...extraAttributes];
  return props.reduce((result, key) => { 
    if (original[key]) {
      result[key] = original[key]; 
    }
    return result; 
  }, {});
}

const matchedUnit = (unit1, unit2) => (
  { 
    ...unit1, 
    ids: unit1.ids.concat(unit2.ids), 
    originIndexes: (unit1.originIndexes || [unit1.originIndex]).concat(unit2.originIndex) 
  }
)

export const consolidateUnits = (units, ...extraAttributes) => {
  const attributes = [ 'power', 'attack', 'defend', 'mission', ...extraAttributes ]
  return units.reduce((all, unit) => {
    if (unit.name === 'transport') {
      return all.concat(unit);
    }
    let match = all.find(u => unitMatch(u, unit, ...attributes)) 
    if (match) {
      return all.map(u => u === match ? matchedUnit(u, unit) : u)
    } else {
      return all.concat(duplicateUnit(unit, ...extraAttributes));
    }
  }, [])
}

export const bombCapacity = (unit) => {
  if (unit.name.includes('strategic')) {
    return unit.name.includes('heavy') ? 3 : 1
  } 
  return 0
}

export const airComplete = (unit) => unit.air && unit.mission === 'complete'

const damaged = (units, casualties) => {
  const damagedUnits = units.filter(unit => unit.ids.some(id => casualties.includes(id)) && unitTypes[unit.name].canTakeDamage)
  return damagedUnits.map(unit => {
    const damaged = unitTypes[`damaged ${unit.name}`]
    return { 
      ...unit, 
      ids: unit.ids.filter(id => casualties.includes(id)), 
      name: damaged.name, 
      attack: damaged.attack, 
      defend: damaged.defend, 
      movement: damaged.movement, 
      landingSlots: damaged.landingSlots 
    }
  })
}

export const survivors = (units, casualties = [], missionComplete) => {
  const undamagedUnits = units.map(unit => (
    { 
      ...unit, 
      ids: unit.ids.filter(id => !casualties.includes(id)), 
      mission: (missionComplete ? 'complete' : unit.mission) 
    }
  ))
  const damagedUnits = damaged(units, casualties)
  return undamagedUnits.concat(damagedUnits).filter(u => u.ids.length)
}
