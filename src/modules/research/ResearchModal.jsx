import React from 'react'
import ReactTooltip from 'react-tooltip'
import { Link } from 'react-router-dom'
import { partial } from 'ramda'
import '../../assets/styles/research.css'

const ResearchModal = ({ currentPower, research, setTech, incrementResearch, decrementResearch, hasRockets, attemptResearch }) => {
  let { cost, attempts, selectedTech, availableTech } = research
  return (
    <div>
      <a data-tip className="help">?</a>
      <h1>Research Weapons Development</h1>
      <ReactTooltip place="bottom">
        <p>Click the name of the technology you want to try to develop, and buy any number of dice rolls for {cost} I.P.C.s each. If you roll a '6' on any of your development dice, you get the development you were after. You may try to develop only one technology per turn. The list of available technologies is below.</p>
        <p>This is your only chance to spend money on weapons development this turn. You will not receive a refund for unsuccessful or unused rolls. Any successful developments are immediately applied to all your present and future units.</p>
      </ReactTooltip>
      <ol className="tech">
        {availableTech.map(tech => {
          return <Technology 
            key={tech.abbr}
            tech={tech} 
            developedTech={currentPower.tech}
            setTech={setTech} 
          />
        })}
      </ol>
      <p>{selectedTech ? <AllocateSpending 
          cost={cost}
          attempts={attempts}
          selectedTech={selectedTech}
          ipc={currentPower.ipc}
          increment={incrementResearch}
          decrement={decrementResearch}
          attempt={attemptResearch} /> :
           'Select a technology to develop'}</p>
      <nav>
        <Link to="/" className="btn">Back</Link>
        {hasRockets ? <Link to="/rockets">Rocket Attack</Link> : <Link to="/purchase" className="btn">Plan Purchases</Link>}
      </nav>
    </div>
  )
}
export default ResearchModal

const Technology = ({ tech, setTech, developedTech }) => {
  return (
    <li>
      <button 
        className={tech.abbr} 
        disabled={developedTech.includes(tech.name)}
        onClick={partial(setTech, [tech.name])}>
        <i></i>
        {tech.name}
      </button> 
      {tech.text}
    </li>
  )
}

const AllocateSpending = ({ cost, attempts, ipc, increment, decrement, attempt, selectedTech }) => {
  return (
    <span>
      {`Allocating ${cost * attempts} I.P.C.s (`}
      <button
        disabled={ipc < cost * (attempts + 1)}
        onClick={increment}>+</button>
      {`/`}
      <button
        disabled={!attempts}
        onClick={decrement}>-</button>
      {`) on ${attempts} chance(s) for ${selectedTech}: `} 
      <button 
        disabled={!attempts} 
        onClick={attempt}>Spend</button>
    </span>
  )
}
