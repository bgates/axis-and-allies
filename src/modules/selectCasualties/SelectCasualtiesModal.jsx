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
  toggleCasualtyStatus,
  removeCasualties,
  attackerWins,
  defenderWins
}) => {
  const { attackers, defenders } = combatants;
  const attackDefeated = attackers.reduce((total, unit) => total + unit.ids.length, 0) <= attackerCasualtyCount
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
        attackDefeated={attackDefeated}
        defendersLose={defenders.reduce((total, unit) => total + unit.ids.length, 0) <= defenderCasualties.length}
        casualtyCount={attackerCasualtyCount}
        casualties={attackerCasualties}
        removeCasualties={removeCasualties}
        attackerWins={attackerWins}
      />
    </div>
  )
}
export default SelectCasualtiesModal

