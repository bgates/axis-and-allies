import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Die from '../../components/Die'
import roll from '../../lib/dieRollRotation'

class CombatRollsModal extends Component {
  constructor () {
    super()
    this.state = {
      reveal: false
    }
    this.rolledCount = 0
    this.visualizeDice = this.visualizeDice.bind(this)
    this.reveal = this.reveal.bind(this)
  }

  visualizeDice (rolls, n) {
    return rolls.map((die) => roll(die))
      .map((rotation, i) => <Die key={i}
                                 metGoal={rolls[i] <= n}
                                 reveal={this.reveal.bind(this)}
                                 rotateX={rotation[0]}
                                 rotateY={rotation[1]} />)
  }

  reveal () {
    this.rolledCount += 1
    if (this.rolledCount === this.props.rolls.length) {
      setTimeout(this.setState.bind(this, { reveal: true }), 500)
    }
  }

  rocketsOrPurchases () {
    if (true) {
      return <Link to="/rockets" className="btn forward">Do Next Thing</Link>
    } else {
      return <Link to="/purchase" className="btn forward">Purchase Units</Link>
    }
  }

  text () {
    if (this.state.reveal) {
      const rolls = this.props.rolls.join(', ');
      return <p>You rolled {rolls}.</p> 
    }
  }
  //const rolls = { attackers: { 1: [], 2: [], 3: [] }, def: {} }
  render () {
    const { attackers, defenders } = this.props.rolls
    const strengths = this.props.strengths
    let link = this.state.reveal ? 'link' : null
    return (
      <div className="battleBoard">
        <h1>Combat Results</h1>
        {/*this.visualizeDice(this.props.rolls)*/}
        {/*this.text()*/}
        <h2>Defender</h2>
        <div className="defenderSpace"> 
        {strengths.map(n => {
          return (
            <div key={n}>{this.visualizeDice(defenders[n], n)}</div>
          )
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
            <div key={n}>{this.visualizeDice(attackers[n], n)}</div>
          )
        })}
      </div>
      <h2>Attacker</h2>
      <nav>
        <button 
          className="forwardOnly"
          onClick={()=>console.log('click')}>Roll for combat</button>
      </nav>
    </div>
    )
  }
}

export default CombatRollsModal

