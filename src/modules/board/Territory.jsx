import React from 'react'

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

const klass = (sea, currentPower, unitsFrom) => {
  if (sea) {
    return currentPower === 'Oceans' ? 'oceans' : 'convoy'
  } else if (currentPower) {
    if (unitsFrom.length) {
      return `${currentPower.toLowerCase()} active`
    }
    return currentPower.toLowerCase()
  }
}

const Territory = ({ territory, handleClick, setVisibility }) => {
  const { dimensions, name, sea, original_power, currentPower, adjacentIndexes, unitsFrom } = territory;
  return (
    <path d={dimensions}
      id={adjacentIndexes === null ? name.toLowerCase().replace(/\s/,'_') : null}
      className={klass(sea, currentPower, unitsFrom)}
      stroke='#000'
      strokeWidth='2'
      onClick={handleClick}
      onMouseOver={setVisibility}
      fill={setFill(sea, original_power, currentPower)} >
    </path>
  )
}

export default Territory
