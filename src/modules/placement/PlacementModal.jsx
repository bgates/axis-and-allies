import React from 'react'
import { Link } from 'react-router-dom'
import ReactTooltip from 'react-tooltip'
import { UnitImg } from '../../components/UnitFigure'

const PlacementModal = ({ 
  industrialComplexes, 
  shipyards, 
  purchases 
}) => {
  console.log(industrialComplexes)
  return (
    <div>
      <a data-tip className="help">?</a>
      <h1>Place Units</h1>
      <ReactTooltip place="bottom">
        <p><strong>Place the new units you purchased at the beginning of your turn.</strong> New land units must be placed in territories with an industrial complex that you held before combat this turn. New sea units must be placed in a friendly sea zone immediately adjacent to an industrial complex that you held before combat this turn.</p>
        <p>You may place new sea units in a sea zone you captured this turn.</p>
      </ReactTooltip>
      {Object.keys(purchases).map(unit => {
        return (
          <div>
            {unit} [{purchases[unit]}] {industrialComplexes.map(territory => <button>{territory.name}</button>)}
          </div>
        )
      })}
      <nav>
        <Link to="/" className="btn">Back</Link>
        <Link to="/confirm" className="btn">Place</Link>
      </nav>
    </div>
  )
}

export default PlacementModal
