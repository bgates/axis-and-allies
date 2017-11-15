import unitTypes from '../config/unitTypes'
export const getAllUnits = state => state.units
export const getAllOutbound = state => state.outboundUnits
export const getAllInbound = state => state.inboundUnits

const match = unit1 => unit2 => (
  ['type', 'power', 'originName']
    .every(attr => unit1[attr] === unit2[attr])
)

export const combineUnits = (total, unit) => {
  let present = total.find(match(unit))
  if (present && unit.type !== 'transport') {
    return [ ...total.filter(u => u !== present), { ...present, ids: [...present.ids, unit.id], qty: present.qty + 1 } ]
  } else {
    return [ ...total, { ...unit, ids: [unit.id], qty: 1 } ]
  }
}

export const attack = unit => unitTypes[unit.type].attack
export const defend = unit => unitTypes[unit.type].defend
export const land =   unit => unitTypes[unit.type].land
export const canBombard = unit => unitTypes[unit.type].canBombard
export const air = unit => unitTypes[unit.type].air
export const attacks = unit => unitTypes[unit.type].numAttack || 1

export const withAttack = unit => ({ ...unit, attack: attack(unit) })
export const withDefend = unit => ({ ...unit, defend: defend(unit) })

const damaged = (units, casualties) => {
  const damagedUnits = units.filter(unit => casualties.includes(unit.id) && unitTypes[unit.type].canTakeDamage)
  return damagedUnits.map(unit => ({ ...unit, type: `damaged ${unit.type}` }))
}

export const survivors = (units, casualties = []) => {
  const undamagedUnits = units.filter(({ id }) => !casualties.includes(id))
  const damagedUnits = damaged(units, casualties)
  return undamagedUnits.concat(damagedUnits)
}

export const unitWithOrigin = ({ name, index }, range) => unit => (
  { 
    ...unit, 
    originName: name, 
    originIndex: index, 
    distance: parseInt(range, 10) 
  } 
)

export const idsToUnits = (ids, units) => ids.map(id => units[id])

