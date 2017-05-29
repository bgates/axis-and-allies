import React, { Component } from 'react';
import Transition from 'react-inline-transition-group';
import classNames from 'classnames';
import '../assets/styles/die.css';

class Die extends Component {
  constructor () {
    super()
    this.state = {}
  }
  /*
  hideOtherSides () {
    if (!this.visible) {
      for(var i = 1; i < 7; i++){
        if (i !== this.props.number) {
          this[`_${i}`].style.display = 'none'
        }
      }
      this.visible = true
    }
  }*/

  showRed (phase) {
    if (phase === 'appear') {
      this.setState({ complete: true })
      this.props.reveal()
    }
  }

  render () {
    let duration = this.state.complete ? 0 : Math.random() * 3;
    const classes = classNames('die', { metGoal: this.props.metGoal && this.state.complete })
    return (
      <Transition
        className="dieWrapper"
        onPhaseEnd={this.showRed.bind(this)}
        childrenStyles={{ appear: { transform: `rotateX(${this.props.rotateX}) rotateY(${this.props.rotateY})` } }}>
        <div className={classes} style={ { transition: `transform ${duration}s` } }>
          <figure className="front" ref={(f) => this._1 = f}>
            <svg viewBox="0 0 170 170">
              <circle cx="85" cy="85" r="24"/>
            </svg>
          </figure>
          <figure className="bottom" ref={(f) => this._2 = f}>
            <svg viewBox="0 0 170 170">
              <circle cx="140" cy="30" r="24" />
              <circle cx="30" cy="140" r="24" />
            </svg>
          </figure>
          <figure className="left" ref={(f) => this._3 = f}>
            <svg viewBox="0 0 170 170">
              <circle cx="140" cy="30" r="24" />
              <circle cx="85" cy="85" r="24"  />
              <circle cx="30" cy="140" r="24" />
            </svg>
          </figure>
          <figure className="right" ref={(f) => this._4 = f}>
            <svg viewBox="0 0 170 170">
              <circle cx="140" cy="30" r="24" />
              <circle cx="30" cy="140" r="24" />
              <circle cx="30" cy="30" r="24"  />
              <circle cx="140" cy="140" r="24"/>
            </svg>
          </figure>
          <figure className="top" ref={(f) => this._5 = f}>
            <svg viewBox="0 0 170 170">
              <circle cx="140" cy="30" r="24" />
              <circle cx="30" cy="140" r="24" />
              <circle cx="85" cy="85" r="24"  />
              <circle cx="30" cy="30" r="24"  />
              <circle cx="140" cy="140" r="24"/>
            </svg>
          </figure>
          <figure className="back" ref={(f) => this._6 = f}>
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
export default Die;
