import React from 'react';
import classNames from 'classnames';

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
const klass = ({sea, currentPower, units, unitsFrom, newlyConquered}) => {
  currentPower = currentPower || ''
  const isOcean = sea && currentPower === 'Oceans' 
  const isControlled = !sea && currentPower.length
  return classNames({
    convoy: sea && currentPower !== 'Oceans',
    [currentPower.toLowerCase()]: isOcean || isControlled,
    active: newlyConquered && units.filter(u => u.air).length,
    'active-combat': unitsFrom.length
  })
}

const Territory = ({ territory, handleClick, setVisibility }) => {
  const { dimensions, name, sea, original_power, currentPower, adjacentIndexes } = territory;
  return (
    <path d={dimensions}
      id={adjacentIndexes === null ? name.toLowerCase().replace(/\s/,'_') : null}
      className={klass(territory)}
      stroke='#000'
      strokeWidth='2'
      onClick={handleClick}
      onMouseOver={setVisibility}
      fill={setFill(sea, original_power, currentPower)} >
    </path>
  )
}

export default Territory
