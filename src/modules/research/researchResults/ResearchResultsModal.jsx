import React from 'react'
import { Link } from 'react-router-dom'
import DiceResultsModal from '../../../components/DiceResultsModal'

class ResearchResultsModal extends DiceResultsModal {

  rocketsOrPurchases () {
    if (this.props.tech.includes('Rockets')) {
      return <Link to="/rockets" className="btn forward">Launch Rocket Attacks</Link>
    } else {
      return <Link to="/purchase" className="btn forward">Purchase Units</Link>
    }
  }

  text () {
    const rolls = this.props.rolls.join(', ')
    const tech = this.props.developedTech
    const sentence = tech ? `You developed ${tech}!` : null
    return (
      <div>
        <p>You rolled {rolls}. {sentence}</p> 
        <nav className="forwardOnly">{this.rocketsOrPurchases()}</nav>
      </div>
    )
  }

  render () {
    return (
      <DiceResultsModal 
        title={'Research'}
        rolls={this.props.rolls}
        goalFunction={value => value === 6} >
        {this.text()}
      </DiceResultsModal>
    )
  }
}

export default ResearchResultsModal
