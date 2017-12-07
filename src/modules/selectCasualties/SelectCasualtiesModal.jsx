import React from 'react'
import { air as isAir } from '../../selectors/units'
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
  casualtyCount,
  attackDefeated,
  toggleCasualtyStatus,
  victor,
  dogfight,
  nextStep
}) => {
  const { attackers, defenders } = combatants
  const { air, all } = casualtyCount
  const mayClick = (id, type) => {
    if (attackDefeated) return false
    if (attackerCasualties.includes(id)) return true
    return attackerCasualties.length < all &&
      (isAir({ type }) || 
        airCasualties >= air || 
        attackerCasualties.length < all - air)
  }
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
              classNameFct={id => attackDefeated || attackerCasualties.includes(id) ? 'casualty' : null}
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

