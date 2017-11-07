import React from 'react'
import { ImgAndQty } from '../../components/UnitFigure'

const Occupiers = ({ combatants, sea, showStrength }) => {
  const { attackers, defenders } = combatants
  if (defenders.length === 0 && attackers.length === 0) {
    return <p>There are no units {sea ? 'occupying this sea zone' : 'defending this territory' }.</p>
  } else {
    let allUnits = defenders.concat(attackers)
    return (
      <ul>
      {allUnits.map((unit, index) => (
        <Occupier 
          key={index} 
          unit={unit} 
          showStrength={showStrength}
          isDefender={defenders.includes(unit)} />
      ))}
      </ul>
    )
  }
}

const Occupier = ({ unit, isDefender, showStrength }) => {
  const value = isDefender ? `defends @${unit.defend}` : `attacks @${unit.attack}`
  if (unit.cargo) {
    return (
      <li>
        <ImgAndQty unit={unit}/>
        {showStrength ? <span>{value}</span> : null}
        {unit.cargo.map((u, index) => <ImgAndQty key={index} unit={u} />)}
      </li>
    )
  }
  return (
    <li>
      <ImgAndQty unit={unit}/>
      {showStrength ?  <span>{value}</span> : null}
      {unit.mission ? <sup title={unit.mission}>*</sup> : null}
    </li>
  )
}

export default Occupiers
