import React, { Component } from 'react'
import ReactTooltip from 'react-tooltip'
import { TransportFigure } from '../../components/UnitFigure'
import BoundButton from '../../components/BoundButton'

const LoadTransport = ({ territory, transport, loadableUnits, loadUnits, viewAttackOptions }) => {
  return (
    <div>
      <a data-tip className="help">?</a>
      <h1>Load Transport</h1>
      <p>From {transport.originName}, bound for {territory.name}</p>
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
        {loadableUnits.map(({ originName, originIndex, units }) => ( 
          <LoadableUnit 
            key={units.map(u => u.id)}
            transport={transport}
            territoryIndex={territory.index}
            originIndex={originIndex}
            loadUnits={loadUnits}
            name={originName}
            units={units} />
        ))}
        </tbody>
      </table>
      <p>To go back to the previous screen without loading and moving press <BoundButton handleClick={viewAttackOptions} index={territory.index} >Cancel</BoundButton></p>
    </div> 
  )
}

export default LoadTransport

class LoadableUnit extends Component {
  constructor () {
    super()
    this._onClick = this._onClick.bind(this)
  }
  _onClick () {
    const { transport, territoryIndex, units, originIndex } = this.props
    this.props.loadUnits(transport, territoryIndex, units.map(u => u.id), originIndex)
  }
  render () {
    const { name, units } = this.props
    return (
      <tr>
        <td><strong>{name}</strong></td>
        {units.map((unit, index) => (        
          <td key={index} className="unit" colSpan={3 - units.length}>
            <TransportFigure unit={unit} />
          </td>
          ))}
        <td className="available">
          <button onClick={this._onClick}>Load &amp; Move</button>
        </td>
      </tr>
    )
  }
}
