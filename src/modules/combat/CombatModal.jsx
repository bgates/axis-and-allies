import React from 'react'
import { UnitImg } from '../../components/UnitFigure'
import '../../assets/styles/combat.css'

const CombatModal = ({ 
  combatants, 
  strengths, 
  territory,
  rollCount, 
  rolls, 
  rollForCombat, 
  defenderCasualties, 
  attackerCasualties,
  toggleCasualtyStatus 
}) => {
  const { attackers, defenders } = combatants;
  return (
    <div className="battleBoard">
      <h1>Combat in {territory.name}</h1>
      <h2>Defender</h2>
      <div className="defenderSpace"> 
        {strengths.map(n => {
          return <Defenders key={n}
                    casualties={defenderCasualties}
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
          return (
            <Attackers 
              key={n}
              units={attackers.filter(u => u.attack === n)}
              territoryIndex={territory.index}
              casualties={attackerCasualties}
              handleClick={toggleCasualtyStatus}
            />
          )
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

const Attackers = ({ units, handleClick, territoryIndex, casualties }) => {
  return (
    <div>
      {units.map(unit => {
        return unit.ids.map(id => {
          return (
            <UnitImg 
              key={id} 
              id={id} 
              className={casualties.includes(id) ? 'casualty' : null}
              handleClick={(event) => handleClick(id, territoryIndex)}
              power={unit.power} 
              name={unit.name} />
          )
        })
      })}
    </div>
  )
}
