import React from 'react';

const path = (power, name) => {
  let unitName = name.replace(/\s/g,'_')
  if (unitName === 'industrial_complex') {
    return require(`../assets/images/industrial_complex.png`)
  }
  return require(`../assets/images/units/${power}/${unitName}.png`)
}

export const UnitImg = ({ power, name, handleClick, className }) => {
  return (
    <img 
      src={path(power, name)} 
      alt={`${power} ${name}`} 
      className={className}
      onClick={handleClick} />
  )
}

export const ImgAndQty = ({ unit }) => {
  const { power, name } = unit;
  const qty = unit.ids.length;
  return (
    <span>
      <UnitImg power={power} name={name} />
      {qty > 1 ? <span className={power.toLowerCase()}>{qty}</span> : null}
    </span>
  )
}

export const UnitFigure = ({ unit }) => {
  return (
    <figure>
      <UnitImg name={unit.name} power={unit.power}/>
      <figcaption>{unit.name} - attacks @ {unit.attack}{unit.air && `; ${unit.distance} spaces`}</figcaption>
    </figure>
  )
}

export const TransportFigure = ({ unit }) => {
  const { name, power, attack } = unit;
  const qty = unit.ids.length;
  return (
    <figure className="transported">
      <UnitImg name={name} power={power} />
      {qty > 1 ? <span className={power.toLowerCase()}>{qty}</span> : null}
      <figcaption>{name} (attacks @{attack})</figcaption>
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
