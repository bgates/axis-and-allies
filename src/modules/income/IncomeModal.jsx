import React from 'react'
import { Link } from 'react-router-dom'

const IncomeModal = ({ currentPower, npl, objectives, nextNpl }) => {
  return (
    <div>
      <h1>Collect Income</h1>
      <p>
        Since your last turn you have maintained control of territories with a total value of {npl} <abbr title="National Production Level">N.P.L.</abbr></p>
      <h3>{currentPower.name} National Objectives</h3>
      <p>Your forces have made progress towards the following national objectives:</p>
      <NationalObjectives objectives={objectives} />
      <p> so you will be able to use {nextNpl} <abbr title="Industrial Production Certificates">I.P.C.s</abbr> next turn</p>
      <nav>
        <Link to="/purchase" className="btn">Back</Link>
        <Link to="/plan-combat" className="btn">Plan Combat</Link>
      </nav>
    </div>
  )
}

export default IncomeModal

const NationalObjectives = ({ objectives }) => {
  return (
    <ul>
      {objectives.map((objective, index) => <Objective 
        key={index}
        text={objective.text} 
        value={objective.value} />)}
    </ul>
  )
}

const Objective = ({ text, value }) => {
  return (
    <li>{text}: <strong>{value} I.P.C.s</strong></li>
  )
}

