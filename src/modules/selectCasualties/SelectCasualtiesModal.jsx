import React from 'react'
import Forces from '../../components/Forces'
import BattleStatus from './BattleStatus'
import '../../assets/styles/combat.css'

const SelectCasualtiesModal = ({ 
  combatants, 
  strengths, 
  territory,
  defenderCasualties, 
  attackerCasualties,
  airCasualties,
  classNameFct,
  casualtyCount,
  attackDefeated,
  toggleCasualtyStatus,
  victor,
  dogfight,
  nextStep,
  mayClick
}) => {
  const { attackers, defenders } = combatants
  return (
    <div className="battleBoard">
      <h1>Combat in {territory.name}</h1>
      <h2>Defender</h2>
      <div className="defenderSpace"> 
        {strengths.map(n => (
          (
            <Forces
              key={n}
              units={defenders.filter(u => u.defend === n)}
              classNameFct={(id) => defenderCasualties.includes(id) ? 'casualty' : null}
            />
          )
        ))}
      </div>
      <div className="midSpace">
        {strengths.map(n => (
          <div key={n}>{n}{n > 1 ? <span>or less</span> : ''}</div>
        ))}                       
      </div>
      <div className="attackerSpace"> 
        {strengths.map(n => (
          (
            <Forces
              key={n}
              units={attackers.filter(u => u.attack === n)}
              classNameFct={classNameFct}
              handleClick={(id, type) => e => (
                mayClick(id, type) && toggleCasualtyStatus(id)
              )}
            />
          )
        ))}
      </div>
      <h2>Attacker</h2>
      <BattleStatus
        victor={victor}
        dogfight={dogfight}
        airCasualties={airCasualties}
        casualtyCount={casualtyCount}
        casualties={attackerCasualties}
        defenderCasualtiesCount={defenderCasualties.length}
        nextStep={nextStep}
        territoryIndex={territory.index}
      />
    </div>
  )
}
export default SelectCasualtiesModal

