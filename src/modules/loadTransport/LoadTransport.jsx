import React from 'react';
import ReactTooltip from 'react-tooltip';
import { TransportFigure } from '../../components/UnitFigure';

const LoadTransport = ({ territory, transport, loadableUnits, loadUnits, viewAttackOptions }) => {
  return (
    <div>
      <a data-tip className="help">?</a>
      <h1>Load Transport</h1>
      <p>From {transport.unit.originName}, bound for {territory.name}</p>
      <ReactTooltip place="bottom" type="info">
        <p>A transport can carry one infantry unit <strong>plus</strong> either</p>
        <ul>
          <li>a second infantry</li>
          <li>an armor unit</li> 
          <li>an artillery unit</li>
          <li>or an antiaircraft gun</li>
        </ul> 
        <p>To load and move this transport, choose the desired cargo and where to pick it up from the list below by pressing the appropriate 'Load &amp; Move' button. </p>
        <p>Note that some transports may already have units loaded. These units cannot be unloaded at this time. You can only undo loads.</p>
      </ReactTooltip>
      {loadableUnits.length === 0 && <b>You have no units available for pickup within range of this transport.</b>}
      <table
        className="outer scroll"
        cellSpacing={0} 
        cellPadding={1}>
        <tbody>
        {loadableUnits.map((option, index) => ( 
          <LoadableUnit 
            key={index}
            loadUnits={loadUnits.bind(null, option.units, territory.index, transport)}
            option={option} />
        ))}
        </tbody>
      </table>
      <p>To go back to the previous screen without loading and moving press <button onClick={viewAttackOptions.bind(null, territory)}>Cancel</button></p>
    </div> 
  )
}

export default LoadTransport

const LoadableUnit = ({ option: { originName, units }, loadUnits }) => {
  return (
    <tr>
      <td><strong>{originName}</strong></td>
      {units.map((unit, index) => (        
        <td key={index} className="unit" colSpan={3 - units.length}>
          <TransportFigure unit={unit} />
        </td>
        ))}
      <td className="available">
        <button onClick={loadUnits}>Load &amp; Move</button>
      </td>
    </tr>
  )
}
