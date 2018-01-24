// @flow
import * as React from 'react'
import Dice from './Dice'

type Props = {
  title: string,
  rolls: Array<number>,
  goalFunction: () => void,
  children: React.Node
}
type State = { reveal: boolean }

class DiceResultsModal extends React.Component<Props, State> {
  rolledCount:number
  constructor () {
    super()
    this.state = {
      reveal: false
    }
    this.rolledCount = 0
  }

  reveal = () => {
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

