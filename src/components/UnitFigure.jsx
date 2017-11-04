import React from 'react';
import { unitCount } from '../lib/unit'
import unitTypes from '../config/unitTypes'

const path = (power, name) => {
  let unitName = name.replace(/\s/g,'_')
  if (unitName === 'industrial_complex') {
    return require(`../assets/images/industrial_complex.png`)
  }
  return require(`../assets/images/units/${power}/${unitName}.png`)
}

export const UnitImg = ({ power, name, handleClick, className }) => (
  <img 
    src={path(power, name)} 
    alt={`${power} ${name}`} 
    className={className}
    onClick={handleClick} />
)

export const ImgAndQty = ({ unit }) => {
  const { power, type, qty } = unit
  return (
    <span>
      <UnitImg power={power} name={type} />
      {qty > 1 ? <span className={power.toLowerCase()}>{qty}</span> : null}
    </span>
  )
}

export const UnitFigure = ({ unit: { type, power, distance } }) => (
  <figure>
    <UnitImg name={type} power={power}/>
    <figcaption>{type} - attacks @ {unitTypes[type].attack}{unitTypes[type].air && `; ${distance} spaces`}</figcaption>
  </figure>
)

export const TransportFigure = ({ unit }) => {
  const { type, power, attack, qty } = unit
  return (
    <figure className="transported">
      <UnitImg name={type} power={power} />
      {qty ? <span className={power.toLowerCase()}>{qty}</span> : null}
      <figcaption>{type} (attacks @{attack})</figcaption>
    </figure>
  )
}

export const UnitFigTableData = ({ unit }) => {
  return (
    <td className="unit">
      <strong>{unit.originName}</strong>
      <UnitFigure unit={unit} />
    </td>
  )
}
