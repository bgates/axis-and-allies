import unitTypes from '../config/unitTypes'
export const getAllUnits = state => state.units
export const getAllOutbound = state => state.outboundUnits
export const getAllInbound = state => state.inboundUnits

let n = 0
export const nextId = () => n += 1

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
export const landingSlots = unit => unitTypes[unit.type].landingSlots
export const movement = unit => unitTypes[unit.type].movement
export const canBombard = unit => unitTypes[unit.type].canBombard
export const air = unit => unitTypes[unit.type].air
export const attacks = unit => unitTypes[unit.type].numAttack || 1
export const bombCapacity = unit => unitTypes[unit.type].bomber ? attacks(unit) : 0

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

export const nonIndustry = unit => unit.type !== 'industrial complex'
export const industry = unit => unit.type === 'industrial complex'
export const antiaircraft = unit => unit.type === 'anti-aircraft gun'
