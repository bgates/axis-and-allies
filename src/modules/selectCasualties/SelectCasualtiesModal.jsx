import React from 'react'
import { UnitImg } from '../../components/UnitFigure'
import '../../assets/styles/combat.css'

const SelectCasualtiesModal = ({ 
  combatants, 
  strengths, 
  territory,
  defenderCasualties, 
  attackerCasualties,
  attackerCasualtyCount,
  toggleCasualtyStatus,
  removeCasualties
}) => {
  const { attackers, defenders } = combatants;
  const attackDefeated = attackers.reduce((total, unit) => total + unit.ids.length, 0) <= attackerCasualtyCount
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
              casualtyCount={attackerCasualtyCount}
              handleClick={toggleCasualtyStatus}
              attackDefeated={attackDefeated}
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
      />
    </div>
  )
}
export default SelectCasualtiesModal

// one option if all attackers are casualties
// another if all defenders are casualties
// third if there are no casualties
// fourth if battle can continue

const BattleStatus = ({ 
  attackDefeated,
  defendersLose,
  casualtyCount, 
  casualties, 
  removeCasualties 
}) => {
  if (attackDefeated) {
    return <nav>Attackers lose!</nav>
  } else if (defendersLose) {
    return <nav>Defenders lose!</nav>
  } else if (casualtyCount) {
    const count = casualtyCount - casualties.length;
    const casualtyWord = casualtyCount > 1 ? 'casualties' : 'casualty';
    return (
      <nav>
        <button>Back</button>
        <span>mark {count} {casualtyWord}</span>
        <button 
          onClick={removeCasualties}
          disabled={casualties.length < casualtyCount}
        >Remove Casualties</button>
      </nav>
    )
  } else {
    return (
      <nav>
        <button>Back</button>
        Everybody missed!
        <button 
          disabled={casualties.length < casualtyCount}
        >Continue</button>
      </nav>
    )
  }
}

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

const Attackers = ({ 
  units, 
  handleClick, 
  territoryIndex, 
  casualties, 
  casualtyCount,
  attackDefeated
}) => {
  const allowClick = (id) => (    
    !attackDefeated && 
    (casualties.includes(id) || casualties.length < casualtyCount)
  )
  return (
    <div>
      {units.map(unit => {
        return unit.ids.map(id => {
          const cn = attackDefeated || casualties.includes(id) ? 'casualty' : null;
          return (
            <UnitImg 
              key={id} 
              id={id} 
              className={cn}
              handleClick={(event) => allowClick(id) && handleClick(id, territoryIndex)}
              power={unit.power} 
              name={unit.name} />
          )
        })
      })}
    </div>
  )
}
