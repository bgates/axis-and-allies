import React, { Component } from 'react'
import Transition from 'react-inline-transition-group'
import classNames from 'classnames'
import '../assets/styles/die.css'

class Die extends Component {
  constructor () {
    super()
    this.state = {}
  }

  showRed (phase) {
    if (phase === 'appear') {
      this.setState({ complete: true })
      if (this.props.reveal) {
        this.props.reveal()
      }
    }
  }

  render () {
    const duration = this.state.complete ? 0 : Math.random() * 3
    const classes = classNames('die', { metGoal: this.props.metGoal && this.state.complete })
    return (
      <Transition
        className="dieWrapper"
        onPhaseEnd={this.showRed.bind(this)}
        childrenStyles={{ appear: { transform: `rotateX(${this.props.rotateX}) rotateY(${this.props.rotateY})` } }}>
        <div className={classes} style={ { transition: `transform ${duration}s` } }>
          <figure className="front">
            <svg viewBox="0 0 170 170">
              <circle cx="85" cy="85" r="24"/>
            </svg>
          </figure>
          <figure className="bottom">
            <svg viewBox="0 0 170 170">
              <circle cx="140" cy="30" r="24" />
              <circle cx="30" cy="140" r="24" />
            </svg>
          </figure>
          <figure className="left">
            <svg viewBox="0 0 170 170">
              <circle cx="140" cy="30" r="24" />
              <circle cx="85" cy="85" r="24"  />
              <circle cx="30" cy="140" r="24" />
            </svg>
          </figure>
          <figure className="right">
            <svg viewBox="0 0 170 170">
              <circle cx="140" cy="30" r="24" />
              <circle cx="30" cy="140" r="24" />
              <circle cx="30" cy="30" r="24"  />
              <circle cx="140" cy="140" r="24"/>
            </svg>
          </figure>
          <figure className="top">
            <svg viewBox="0 0 170 170">
              <circle cx="140" cy="30" r="24" />
              <circle cx="30" cy="140" r="24" />
              <circle cx="85" cy="85" r="24"  />
              <circle cx="30" cy="30" r="24"  />
              <circle cx="140" cy="140" r="24"/>
            </svg>
          </figure>
          <figure className="back">
            <svg viewBox="0 0 170 170">
              <circle cx="140" cy="30" r="24" />
              <circle cx="30" cy="140" r="24" />
              <circle cx="30" cy="30" r="24"  />
              <circle cx="140" cy="140" r="24"/>
              <circle cx="30" cy="85" r="24"  />
              <circle cx="140" cy="85" r="24" />
            </svg>
          </figure>
          <svg width="100" height="50" version="1.1" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="dieGradient" fx="30%" fy="30%">
                <stop offset="5%" stopColor="#333"></stop>
                <stop offset="95%" stopColor="#000"></stop>
              </radialGradient>
            </defs>
          </svg>
        </div>
      </Transition>
    )
  }
}
export default Die
