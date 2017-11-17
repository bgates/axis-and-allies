import React from 'react'
import { Link } from 'react-router-dom'

const RocketAttackModal = ({ 
  rocketsAndTargets, 
  previous,
  selected,
  setTarget,
  launchRockets
}) => {
  const rockets = Object.keys(rocketsAndTargets)
  if (rockets.length) {
    return (
      <div>
        <h1>Rocket Attack</h1>
        <p><strong>You may attack with rockets if you wish.</strong> Each of your antiaircraft guns may attack one enemy industrial complex that is within a range of 2 spaces. Roll one die for each attack; the number rolled is the number of I.P.C.s that enemy must surrender. Industrial complexes are never destroyed, and an enemy must surrender only I.P.C.s it possesses (they can't go negative). You can attack one target with multiple rockets, but you cannot inflict more damage on a complex than the I.P.C. value of its territory (so if emplacements in France, Holland, and West Germany all fired at Great Britain and all rolled 6's (Joan!), the U.K. would still pay only 8, which is the I.P.C. value for Great Britain).</p> 
        <p>Choose industrial complexes to attack:</p>
        <ul>
        {rockets.map(rocketLocation => (
          <Rocket 
            key={rocketLocation}
            location={rocketLocation} 
            selected={selected[rocketLocation]}
            targets={rocketsAndTargets[rocketLocation]} 
            handleClick={setTarget} />
        ))}
        </ul>
        <nav>
          <Link to={previous} className="btn">Back</Link>
          <Link to="/purchase" className="btn">Purchase</Link>
          <button onClick={launchRockets}>Launch Rockets</button>
        </nav>
      </div>
    )
  } else {
    <div>
      <h1>Rocket Attack</h1>
      <p><strong>You cannot attack with rockets.</strong></p>
      <p>There are no enemy industrial complexes 3 adjacent spaces or less from any of your antiaircraft guns.</p>
    </div>
  }
}

const Rocket = ({ location, selected, targets, handleClick }) => (
  <li>
    <strong>{location}</strong>
    {targets.map(target => (
      <button 
        key={target.name}
        className={target.index === selected ? 'rockets' : null}
        onClick={handleClick.bind(null, location, target.index)}>
        <i></i>
        {target.name}, {target.currentPower}
      </button>
    ))}
  </li>
)
// the rocket attack page needs links, forward and back
// fwd to purchase; back to either research results or research
export default RocketAttackModal
