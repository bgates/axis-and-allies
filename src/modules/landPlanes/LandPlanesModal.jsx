import React, { Component } from 'react'
import ReactTooltip from 'react-tooltip';

const LandPlanesModal = ({ landingOptions }) => {
  console.log(landingOptions)
  return (
    <div>
    <a data-tip className="help">?</a>
      <h1>Land Planes?</h1>
    <ReactTooltip place="bottom" type="info">
      <p>To land combat aircraft, click the desired landing territory's button in the group. The aircraft are grouped by type and number of spaces they have left to move.</p>
      <p>Aircraft cannot land in territories that were captured this turn.</p>
      <p>Aircraft that cannot land are lost and must be destroyed.</p>
      <p>Aircraft do not have to endure antiaircraft fire during this phase.</p>
      <hr/>
      <p>When you are done choosing where aircraft from this campaign should land, press <button>ok</button></p>
    </ReactTooltip>
    </div>
  )
}
export default LandPlanesModal
