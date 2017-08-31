import React, { Component } from 'react'

class DefenseOrderModal extends Component {
  render () {
    return (
      <div>
        <h1>Order Units</h1>
        <p>To order defensive units to this territory, click and drag your units to the desired position. Units at the <strong>end</strong> of the list will be eliminated <strong>first</strong>, while units at the <strong>beginning</strong> will be eliminated <strong>last</strong>.</p>
      <p>Although you can interleave your units with any friendly units however you wish, you can only reorder units of powers you control. Friendly units that you do not control will remain in their respective order.</p>
      </div>
    )
  }
}
export default DefenseOrderModal
