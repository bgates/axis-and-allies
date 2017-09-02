import uuid from 'uuid/v4'

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

export const duplicateUnit = (original) => {
  const props = ['attack', 'defend', 'power', 'name', 'originIndex', 'cargo', 'ids', 'mission'];
  return props.reduce((result, key) => { 
    result[key] = original[key]; 
    return result; 
  }, {});
}

export const consolidateUnits = (units) => {
  return units.reduce((all, unit) => {
    if (unit.name === 'transport') {
      return all.concat(unit);
    }
    let match = all.find(u => unitMatch(u, unit, 'power', 'attack', 'defend')) 
    if (match) {
      return all.map(u => u === match ? { ...u, ids: u.ids.concat(unit.ids) } : u)
    } else {
      return all.concat(duplicateUnit(unit));
    }
  }, [])
}
