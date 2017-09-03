import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Dice from './Dice'

class DiceResultsModal extends Component {
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

  render () {
    return (
      <div>
        <h1>{this.props.title} Results</h1>
        <Dice
          rolls={this.props.rolls}
          handleReveal={this.reveal}
          goalFunction={this.props.goalFunction} />
        {this.state.reveal && this.props.children}
      </div>
    )
  }
}

export default DiceResultsModal

