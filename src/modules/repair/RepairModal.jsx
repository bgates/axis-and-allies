import React, { Component } from 'react'

class RepairModal extends Component {
  render () {
    return (
      <div>
        <h1>Repair Damaged Capital Ships</h1>
        <button onClick={this.props.handleClick}>Advance</button>
      </div>
    )
  }
}
export default RepairModal
