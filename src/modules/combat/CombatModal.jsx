import React from 'react'
import { UnitImg } from '../../components/UnitFigure'
import '../../assets/styles/combat.css'

const CombatModal = ({ combatants }) => {
  const { attackers, defenders } = combatants;
  const dieMax = Math.max(...attackers.map(u => u.attack), 
    ...defenders.map(u => u.defend))
  const rolls = Array(dieMax).fill().map((n, i) => i + 1)
  return (
    <div className="battleBoard">
      <h1>Combat in Eastern Europe</h1>
      <h2>Defender</h2>
      <div className="defenderSpace"> 
        {rolls.map(n => {
          return <Defenders key={n}
                    units={defenders.filter(u => u.defend === n)}/>
        })}
      </div>
      <div className="midSpace">
        {rolls.map(n => {
          return <div>{n}{n > 1 ? <span>or less</span> : ''}</div>
        })}                       
      </div>
      <div className="attackerSpace"> 
        {rolls.map(n => {
          return <Attackers key={n}
                    units={attackers.filter(u => u.attack === n)}/>
        })}
      </div>
      <h2>Attacker</h2>
      <nav>
        <button>Back</button>
        <button>Roll for combat</button>
      </nav>
    </div>
  )
}
export default CombatModal

const Defenders = ({ units }) => {
  return (
    <div>
      {units.map(unit => {
        return unit.ids.map(id => {
          return (
            <UnitImg 
              key={id} 
              id={id} 
              power={unit.power} 
              name={unit.name} />
          )
        })
      })}
    </div>
  )
}

const Attackers = ({ units }) => {
  return (
    <div>
      {units.map(unit => {
        return unit.ids.map(id => {
          return (
            <UnitImg 
              key={id} 
              id={id} 
              handleClick={() => {console.log(id)}}
              power={unit.power} 
              name={unit.name} />
          )
        })
      })}
    </div>
  )
}
