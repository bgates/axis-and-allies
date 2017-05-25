import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Die from '../../components/Die'
import roll from '../../lib/dieRollRotation'

class ResearchResultsModal extends Component {
  constructor () {
    super()
    this.state = {
      reveal: false
    }
    this.rolledCount = 0
    this.visualizeDice = this.visualizeDice.bind(this)
    this.reveal = this.reveal.bind(this)
  }

  visualizeDice (rolls) {
    return rolls.player.map((die) => roll(die))
      .map((rotation, i) => <Die key={i}
                                 number={rolls.player[i]}
                                 rotateX={rotation[0]}
                                 rotateY={rotation[1]} />)
  }

  componentDidMount () {
    window.addEventListener('transitionend', this.reveal)
  }

  componentWillUnmount () {
    window.removeEventListener('transitionend', this.reveal)
  }

  reveal (event) {
    this.rolledCount += 1
    if (this.rolledCount === this.props.rolls.player.length) {
      setTimeout(this.setState.bind(this, { reveal: true }), 500)
    }
  }

  rocketsOrPurchases () {
    if (this.props.tech.includes('Rockets')) {
      return <Link to="/rockets">Launch Rocket Attacks</Link>
    } else {
      return <Link to="/purchase" className="btn forward">Purchase Units</Link>
    }
  }

  render () {
    const developedTech = this.props.developedTech
    let text = this.state.reveal ? <p>You rolled {this.props.rolls.player.join(',')}. {developedTech ? `You developed ${developedTech}!` : null}</p> : null
    let link = this.state.reveal ? this.rocketsOrPurchases() : null
    return (
      <div>
        <h1>Research Results</h1>
        {this.visualizeDice(this.props.rolls)}
        {text}
        <nav className="forwardOnly">{link}</nav>
      </div>
    )
  }
}

export default ResearchResultsModal
