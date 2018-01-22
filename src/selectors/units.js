// @flow
import unitTypes from '../config/unitTypes'
import { getAllUnits } from './stateSlices'
export { getAllUnits }

let n = 0
export const nextId = () => n += 1

const match = unit1 => unit2 => (
  ['type', 'power', 'originName']
    .every(attr => unit1[attr] === unit2[attr])
)

type Unit = { type: string, id: number, power: string, originName?: string }
export const combineUnits = (total: Array<any>, unit: Unit) => {
  let present = total.find(match(unit))
  if (present && unit.type !== 'transport') {
    return [ ...total.filter(u => u !== present), { ...present, ids: [...present.ids, unit.id], qty: present.qty + 1 } ]
  } else {
    return [ ...total, { ...unit, ids: [unit.id], qty: 1 } ]
  }
}

type UnitType = { type: string }
export const attack = (unit:UnitType) => unitTypes[unit.type].attack
export const defend = (unit:UnitType) => unitTypes[unit.type].defend || unitTypes[unit.type].flak
export const land =   (unit:UnitType) => unitTypes[unit.type].land
export const landingSlots = (unit:UnitType) => unitTypes[unit.type].landingSlots
export const movement = (unit:UnitType) => unitTypes[unit.type].movement
export const canBombard = (unit:UnitType) => unitTypes[unit.type].canBombard
export const air = (unit:UnitType) => unitTypes[unit.type].air
export const attacks = (unit:UnitType) => unitTypes[unit.type].numAttack || 1
export const bombCapacity = (unit:UnitType) => unitTypes[unit.type].bomber ? attacks(unit) : 0
const isStrategic = (unit:UnitType) => unit.type.includes('strategic')
export const willDogfight = (unit:UnitType) => air(unit) && !isStrategic(unit)
const dogfight = (unit:UnitType) => isStrategic(unit) ? 1 : 3
export const AA = (unit:UnitType) => unit.type === 'antiaircraft gun'
export const noAA = (unit:UnitType) => unit.type !== 'antiaircraft gun'
    
export const withAttack = (unit:UnitType) => ({ ...unit, attack: attack(unit) })
export const withDefend = (unit:UnitType) => ({ ...unit, defend: defend(unit) })
export const withDogfight = (unit:UnitType) => ({ ...unit, attack: dogfight(unit) })
export const ship = (unit:UnitType) => unitTypes[unit.type].ship

const damaged = (units, casualties) => {
  const damagedUnits = units.filter(unit => casualties.includes(unit.id) && unitTypes[unit.type].canTakeDamage)
  return damagedUnits.map(unit => ({ ...unit, type: `damaged ${unit.type}` }))
}

export const survivors = (units:Array<any>, casualties:Array<any> = []) => {
  const undamagedUnits = units.filter(({ id }) => !casualties.includes(id))
  const damagedUnits = damaged(units, casualties)
  return undamagedUnits.concat(damagedUnits)
}

type Origin = { name: string, index: number }
export const unitWithOrigin = ({ name, index }:Origin, range: string) => (unit:Object) => (
  { 
    ...unit, 
    originName: name, 
    originIndex: index, 
    distance: parseInt(range, 10) 
  } 
)

export const idsToUnits = (ids:Array<number>, units:{ id: number }) => ids.map(id => units[id])

export const nonIndustry = (unit:UnitType) => unit.type !== 'industrial complex'
export const industry = (unit:UnitType) => unit.type === 'industrial complex'
export const antiaircraft = (unit:UnitType) => unit.type === 'anti-aircraft gun'

export const range8 = (unit:UnitType) => movement(unit) === 8

export const range6 = (unit:UnitType) => movement(unit) === 6
