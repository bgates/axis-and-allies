import React from 'react'
import { Link } from 'react-router-dom'
import Forces from '../../components/Forces'
import PATHS from '../../paths'
import '../../assets/styles/combat.css'

const CombatModal = ({ 
  combatants, 
  strengths, 
  territory,
  attackerCasualties,
  defenderCasualties,
  rollForCombat,
  allowRetreat
}) => {
  const { attackers, defenders, bombardingUnits } = combatants
  const supportedAttackers = [ ...attackers, ...bombardingUnits ]
  return (
    <div className="battleBoard">
      <h1>Combat in {territory.name}</h1>
      <h2>Defender</h2>
      <div className="defenderSpace"> 
        {strengths.map(n => {
          return <Forces 
                    key={n}
                    units={defenders.filter(u => u.defend === n && !defenderCasualties.includes(u.id))}/>
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
            <Forces
              key={n}
              units={supportedAttackers.filter(u => u.attack === n)}
            />
          )
        })}
      </div>
      <h2>Attacker</h2>
      <nav>
        <button>Back</button>
        {allowRetreat && <Link className="btn" to={PATHS.RETREAT}>View Retreat Options</Link>}
        <button 
          onClick={rollForCombat.bind(null, territory.index)}
        >Roll for combat</button>
      </nav>
    </div>
  )
}
export default CombatModal

