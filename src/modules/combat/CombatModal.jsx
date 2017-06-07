import React from 'react'
import { UnitImg } from '../../components/UnitFigure'
import '../../assets/styles/combat.css'

const CombatModal = ({ combatants, strengths, rollCount, rolls, rollForCombat, casualties }) => {
  console.log(casualties);
  const { attackers, defenders } = combatants;
  return (
    <div className="battleBoard">
      <h1>Combat in Eastern Europe</h1>
      <h2>Defender</h2>
      <div className="defenderSpace"> 
        {strengths.map(n => {
          return <Defenders key={n}
                    casualties={casualties}
                    units={defenders.filter(u => u.defend === n)}/>
        })}
      </div>
      <div className="midSpace">
        {strengths.map(n => {
          return <div key={n}>{n}{n > 1 ? <span>or less</span> : ''}</div>
        })}                       
      </div>
      <div className="attackerSpace"> 
        {strengths.map(n => {
          return <Attackers key={n}
                    units={attackers.filter(u => u.attack === n)}/>
        })}
      </div>
      <h2>Attacker</h2>
      <nav>
        <button>Back</button>
        <button 
          onClick={rollForCombat.bind(null, rollCount)}>Roll for combat</button>
      </nav>
    </div>
  )
}
export default CombatModal

const Defenders = ({ units, casualties }) => {
  return (
    <div>
      {units.map(unit => {
        return unit.ids.map(id => {
          return (
            <UnitImg 
              key={id} 
              id={id} 
              power={unit.power} 
              className={casualties.includes(id) ? 'casualty' : null}
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
