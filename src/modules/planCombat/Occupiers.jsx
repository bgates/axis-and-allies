import React from 'react'
import { ImgAndQty } from '../../components/UnitFigure'

const mission = (unit, strategicBombing) => {
  if (strategicBombing.includes(unit.id)) {
    return unit.type.includes('strategic') ? 'strategic bombing' : 'bomber escort'
  }
}

const Occupiers = ({ combatants, sea, strategicBombing = [], showStrength }) => {
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
          mission={mission(unit, strategicBombing)}
          showStrength={showStrength}
          isDefender={defenders.includes(unit)} />
      ))}
      </ul>
    )
  }
}

const Occupier = ({ unit, isDefender, mission, showStrength }) => {
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
      <ImgAndQty unit={unit} mission={mission} />
      {showStrength ?  <span>{value}</span> : null}
      {unit.mission ? <sup title={unit.mission}>*</sup> : null}
    </li>
  )
}

export default Occupiers
