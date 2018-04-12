import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import ReactTooltip from 'react-tooltip'
import { UnitImg } from '../../../components/UnitFigure'
import PATHS from '../../../paths'

const PurchaseModal = ({ budget, buildableUnits, purchases, total, increment, decrement, previous, currentPower }) => {
  return (
    <div style={{ minHeight: 580 }}>
      <a data-tip className="help">?</a>
      <h1>Make Purchases</h1>
      <ReactTooltip place="bottom">
        <p><strong>You may purchase new units to use on your next turn.</strong> The units you purchase will not go on the board immediately, you will place them at the end of this turn. The new land units must be placed in territories with an industrial complex that you held before combat this turn. The new sea units must be placed in a friendly sea zone immediately adjacent to an industrial complex that you held before combat this turn. You may not place the new units using an industrial complex in a territory you capture this turn.</p>
        <p>You may place new sea units in a sea zone you capture this turn. However, if you fail to capture the sea zone and there are no other friendly sea zones next to one of your industrial complexes, you will lose the new sea units and not get a refund.</p>
        <p>A territory cannot have more than one antiaircraft gun. Therefore, if you purchase antiaircraft guns but at the end of your turn all your territories with an industrial complex already have an antiaircraft gun (due to failure to capture an adjacent territory, or a transport ship was sunk, etc.), you will lose the new antiaircraft guns and not get a refund, even if you also bought a transport ship you could put one on.</p>
      </ReactTooltip>
      <div className="purchases">
        <table 
          className="outer purchase"
          cellSpacing={0} 
          cellPadding={1}>
          <thead>
            <tr>
              <th colSpan={2}>Unit</th>
              <th>Movement</th>
              <th>Attack</th>
              <th>Defend</th>
              <th>Cost</th>
              <th colSpan={3}>Number</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {buildableUnits.map(unit => <PurchaseRow 
              key={unit.name}
              currentPower={currentPower}
              unit={unit} 
              count={purchases[unit.name] || 0}
              budget={budget}
              increment={increment}
              decrement={decrement}
            />)}
          </tbody>
          <tfoot>
          <tr>
            <th colSpan={8}>Remaining Budget: {budget} I.P.C.s</th>
            <th>Total</th>
            <th>{total}</th>
          </tr>
          </tfoot>
        </table>
      </div>
      <nav>
        <Link to={previous} className="btn">Back</Link>
        <Link to={PATHS.INCOME} className="btn">Purchase</Link>
      </nav>
    </div>
  )
}

export default PurchaseModal

class PurchaseRow extends Component {
  constructor () {
    super()
    this.handleIncrement = this.handleIncrement.bind(this)
    this.handleDecrement = this.handleDecrement.bind(this)
  }
  handleIncrement () {
    this.props.increment(this.props.unit)
  }
  handleDecrement () {
    this.props.decrement(this.props.unit)
  }
  render () {
    const {budget, unit, count, currentPower } = this.props
    return (
      <tr>
        <td>{unit.name}</td>
        <td><UnitImg power={currentPower} name={unit.name}/></td>
        <td>{unit.movement}</td>
        <td>{unit.attack}</td>
        <td>{unit.defend}</td>
        <td>{unit.cost}</td>
        <td><button disabled={budget < unit.cost} onClick={this.handleIncrement}>+</button></td>
        <td>{count}</td>
        <td><button disabled={count === 0} onClick={this.handleDecrement}>-</button></td>
        <td>{count * unit.cost}</td>
      </tr>
    )
  }
}
