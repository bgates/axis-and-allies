import React from 'react'
import ReactTooltip from 'react-tooltip'
import Attacker from '../../components/Attacker'

const Bombardment = ({ 
  territory, 
  bombardmentCapableUnits, 
  committed,
  commitBombardmentUnits, 
  uncommitBombardmentUnits, 
  resolveCombat
}) => {
  return (
    <div>
      <a data-tip className="help">?</a>
      <h1>Naval Support for Assault on {territory.name}</h1>
      <ReactTooltip place="bottom" type="info">
        <p>A battleship or cruiser that has not engaged in naval combat is eligible to support an amphibious assault on an adjacent territory.</p>
        <p>Defenders cannot hit naval vessels.</p>
      </ReactTooltip>
      <table
        className="outer scroll"
        cellSpacing={0} 
        cellPadding={1}>
        <tbody>
        {bombardmentCapableUnits.map((unit, index) => ( 
          <Attacker
            key={index}
            commitUnits={commitBombardmentUnits}
            unCommitUnits={uncommitBombardmentUnits}
            committed={committed.filter(id => unit.ids.includes(id))}
            targetIndex={territory.index}
            unit={unit} />
        ))}
        </tbody>
      </table>
      <p>When you have selected the units you want to engage in shore bombardment, press <button onClick={resolveCombat.bind(null, territory.index)}>continue</button></p>
    </div> 
  )
}

export default Bombardment

