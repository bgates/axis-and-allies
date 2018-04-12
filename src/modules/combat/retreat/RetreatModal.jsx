import React, { Component } from 'react'
import BoundButton from '../../../components/BoundButton'

const RetreatModal = ({ territory, retreatOptions, retreat, returnToCombat }) => {
  return (
    <div>
      <h1>Retreat Options from {territory.name}</h1>
      <p>You may retreat all your units to one adjacent friendly territory or sea zone by pressing a button below. You can retreat only to a territory or sea zone from which one of your attacking units came. You will not be able to reassign retreated units to other embattled territories this turn, nor make non-combat moves with them later this turn.</p>
      <ul>
        {retreatOptions.map(option => (
          <li key={option.index}>
            <RetreatButton 
              handleClick={retreat} 
              territoryIndex={territory.index} 
              optionIndex={option.index}>{option.name}</RetreatButton>
          </li>)
        )}
      </ul>
      
      <nav>
        <BoundButton handleClick={returnToCombat} index={territory.index}>Back</BoundButton>
      </nav>
    </div>
  )
}

export default RetreatModal

class RetreatButton extends Component {
  constructor () {
    super()
    this._onClick = this._onClick.bind(this)
  }
  _onClick () {
    this.props.handleClick(this.props.territoryIndex, this.props.optionIndex)
  }
  render () {
    return <button onClick={this._onClick}>{this.props.children}</button>
  }
}
