import React from 'react'
import Forces from '../../components/Forces'
import { UnitImg } from '../../components/UnitFigure'
import BattleStatus from './BattleStatus'
import '../../assets/styles/combat.css'

const SelectCasualtiesModal = ({ 
  combatants, 
  strengths, 
  territory,
  defenderCasualties, 
  attackerCasualties,
  attackerCasualtyCount,
  attackDefeated,
  toggleCasualtyStatus,
  victor,
  nextStep
}) => {
  const { attackers, defenders } = combatants;
  return (
    <div className="battleBoard">
      <h1>Combat in {territory.name}</h1>
      <h2>Defender</h2>
      <div className="defenderSpace"> 
        {strengths.map(n => {
          return (
            <Forces
              key={n}
              units={defenders.filter(u => u.defend === n)}
              classNameFct={(id) => defenderCasualties.includes(id) ? 'casualty' : null}
            />
          )
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
              units={attackers.filter(u => u.attack === n)}
              classNameFct={id => attackDefeated || attackerCasualties.includes(id) ? 'casualty' : null}
              handleClick={id => e => (
                !attackDefeated && 
                (attackerCasualties.includes(id) || 
                 attackerCasualties.length < attackerCasualtyCount) &&
                toggleCasualtyStatus(id, territory.index)
              )}
            />
          )
        })}
      </div>
      <h2>Attacker</h2>
      <BattleStatus
        victor={victor}
        casualtyCount={attackerCasualtyCount}
        casualties={attackerCasualties}
        nextStep={nextStep}
        territoryIndex={territory.index}
      />
    </div>
  )
}
export default SelectCasualtiesModal

