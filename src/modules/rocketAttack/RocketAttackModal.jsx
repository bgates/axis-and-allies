import React from 'react';
import { Link } from 'react-router-dom';

const RocketAttackModal = ({ targets, previous }) => {
  //<b>You cannot attack with rockets.</b> There are no enemy industrial complexes %r adjacent spaces or less from any of your antiaircraft guns., - note that aa guns shouldn't really fire these
  console.log(targets)
  return (
    <div>
      <h1>Rocket Attack</h1>
      <p><strong>You may attack with rockets if you wish.</strong> Each of your antiaircraft guns may attack one enemy industrial complex that is within a range of 3 spaces. Roll one die for each attack; the number rolled is the number of I.P.C.s that enemy must surrender. Industrial complexes are never destroyed, and an enemy must surrender only I.P.C.s it possesses (they can't go negative). You can attack one target with multiple rockets, but you cannot inflict more damage on a complex than the I.P.C. value of its territory (so if emplacements in Germany, Western Europe, and Southern Europe all fired at Great Britain and all rolled 6's (Joan!), the U.K. would still pay only 8, which is the I.P.C. value for the British Isles).</p> 
      <p>Choose industrial complexes to attack:</p>
      {targets.map(rocketLocation => rocketLocation.map(target => {
        return <button>{target.name}, {target.currentPower}</button>
      }))}
      <nav>
        <Link to={previous} className="btn">Back</Link>
        <Link to="/purchase" className="btn">Purchase</Link>
      </nav>
    </div>
  )
}
// the rocket attack page needs links, forward and back
// fwd to purchase; back to either research results or research
// also needs list of rocket installations + targets for each
export default RocketAttackModal
