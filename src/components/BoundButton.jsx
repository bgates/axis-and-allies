import React, { Component } from 'react'

class BoundButton extends Component {
  constructor () {
    super()
    this._onClick = this._onClick.bind(this)
  }
  _onClick () {
    this.props.handleClick(this.props.index)
  }
  render () {
    return <button onClick={this._onClick}>{this.props.children}</button>
  }
}

export default BoundButton
