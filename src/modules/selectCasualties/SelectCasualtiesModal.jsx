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
      <BattleOptions
        casualtyCount={attackerCasualtyCount}
        casualties={attackerCasualties}
        removeCasualties={removeCasualties}
      />
    </div>
  )
}
export default SelectCasualtiesModal

const BattleOptions = ({ casualtyCount, casualties, removeCasualties }) => {
  if (casualtyCount) {
    const casualtyWord = casualtyCount > 1 ? 'casualties' : 'casualty';
    return (
      <nav>
        <button>Back</button>
        <span>mark {casualtyCount} {casualtyWord}</span>
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
        <button 
          disabled={casualties.length < casualtyCount}
        >Remove Casualties?</button>
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
