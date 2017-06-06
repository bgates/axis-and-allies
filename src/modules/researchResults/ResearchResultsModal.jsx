import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Dice from '../../components/Dice'

class ResearchResultsModal extends Component {
  constructor () {
    super()
    this.state = {
      reveal: false
    }
    this.rolledCount = 0
    this.reveal = this.reveal.bind(this)
  }

  reveal () {
    this.rolledCount += 1
    if (this.rolledCount === this.props.rolls.length) {
      setTimeout(this.setState.bind(this, { reveal: true }), 500)
    }
  }

  rocketsOrPurchases () {
    if (this.props.tech.includes('Rockets')) {
      return <Link to="/rockets" className="btn forward">Launch Rocket Attacks</Link>
    } else {
      return <Link to="/purchase" className="btn forward">Purchase Units</Link>
    }
  }

  text () {
    if (this.state.reveal) {
      const rolls = this.props.rolls.join(', ');
      const tech = this.props.developedTech
      const sentence = tech ? `You developed ${tech}!` : null;
      return <p>You rolled {rolls}. {sentence}</p> 
    }
  }

  render () {
    let link = this.state.reveal ? this.rocketsOrPurchases() : null
    return (
      <div>
        <h1>Research Results</h1>
        <Dice
          rolls={this.props.rolls}
          handleReveal={this.reveal}
          goalFunction={value => value === 6} />
        {this.text()}
        <nav className="forwardOnly">{link}</nav>
      </div>
    )
  }
}

export default ResearchResultsModal
