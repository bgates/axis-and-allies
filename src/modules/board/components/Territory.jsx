import React from 'react';
import classNames from 'classnames';
import { nonIndustry } from '../../../lib/unit';

const setFill = (sea, original_power, currentPower) => {
  if (sea && original_power !== 'Oceans') {
    if (original_power === currentPower){
      return `url(#${original_power.toLowerCase()}_convoy)`
    } else {
      return 'none' //TODO: Needs to be convoy in distress image
    }
  } else {
    return 'none'
  }
}
//TODO: active class shouldn't apply to land-planes spaces until that phase
const klass = (territory, phase, activePower) => {
  const {sea, currentPower, units, unitsFrom, newlyConquered} = territory;
  let currentPowerName = currentPower || ''
  const isOcean = sea && currentPowerName === 'Oceans' 
  const isControlled = !sea && currentPowerName.length
  if (phase === 'order-units') {
  console.log(territory.name, newlyConquered, currentPower, activePower)
 }
  return classNames({
    convoy: sea && currentPower !== 'Oceans',
    [currentPowerName.toLowerCase()]: isOcean || isControlled,
    active: !!newlyConquered && units.filter(u => u.air).length,
    'active-combat': unitsFrom.length,
    'active-order-units': phase === 'order-units' && activePower === currentPower && units.filter(nonIndustry).length > 1
  })
}

const Territory = ({ 
  territory, 
  handleClick, 
  setVisibility, 
  phase,
  activePower
}) => {
  const { dimensions, name, sea, original_power, currentPower, adjacentIndexes } = territory;
  return (
    <path d={dimensions}
      id={adjacentIndexes === null ? name.toLowerCase().replace(/\s/,'_') : null}
      className={klass(territory, phase, activePower)}
      stroke='#000'
      strokeWidth='2'
      onClick={handleClick}
      onMouseOver={setVisibility}
      fill={setFill(sea, original_power, currentPower)} >
    </path>
  )
}

export default Territory
