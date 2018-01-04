import React, { Component } from 'react'
import Transition from 'react-inline-transition-group'
import classNames from 'classnames'
import '../assets/styles/die.css'

class Die extends Component {
  constructor () {
    super()
    this.state = {}
  }

  showRed () {
    this.setState({ complete: true })
    if (this.props.reveal) {
      setTimeout(this.props.reveal, 100)
    }
  }

  render () {
    const duration = this.state.complete ? 0 : Math.random() * 5
    const classes = classNames('die', { metGoal: this.props.metGoal && this.state.complete })
    const { rotateX, rotateY } = this.props
    const transform = `rotateX(${rotateX}) rotateY(${rotateY})`
    return (
      <Transition
        className="dieWrapper"
        onPhaseEnd={this.showRed.bind(this)}
        childrenStyles={ { appear: { transform } } }
        >
        <div className={classes} style={ { transition: `transform ${duration}s` }} >
          {['front', 'bottom', 'left', 'right', 'top', 'back'].map((side, n) => (
            <Face key={side} n={n+1} className={side} />
          ))}
        </div>
      </Transition>
    )
  }
}

const Face = ({ n, className }) => (
  <figure className={className}>
    <svg viewBox="0 0 170 170">
      {n % 2 === 1 && <circle cx="85" cy="85" r="24"/>}
      {n > 1 && <circle cx="140" cy="30" r="24" />}
      {n > 1 && <circle cx="30" cy="140" r="24" />}
      {n > 3 && <circle cx="30" cy="30" r="24" />}
      {n > 3 && <circle cx="140" cy="140" r="24" />}
      {n > 5 && <circle cx="30" cy="85" r="24" />}
      {n > 5 && <circle cx="140" cy="85" r="24" />}
    </svg>
  </figure>
)

export default Die
