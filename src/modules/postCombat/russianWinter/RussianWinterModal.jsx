import React from 'react'
import { Link } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import { START_RUSSIAN_WINTER } from '../../../actions'
import PATHS from '../../../paths'

const Modal = ({ startWinter }) => {
  return (
    <div>
      <h1 title="Russian Winter">Русская зима</h1>
      <p>During the bleak Russian winter, infantry in your home territories defend at 3. There can be one harsh Russian winter during the course of the war. <em>Is this the season it happens?</em></p>

      <nav>
        <Link to={PATHS.PLAN_MOVEMENT} className="btn">Back</Link>
        <Link to={PATHS.PLACE_UNITS} className="btn">Not This Year</Link>
        <button onClick={startWinter}>Do it, Al Gore be damned!</button>
      </nav>
    </div>
  )
}
const startWinter = () => ({ type: START_RUSSIAN_WINTER })

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ 
    startWinter
  }, dispatch)
}

const RussianWinterModal = connect(() => {}, mapDispatchToProps)(Modal)

export default RussianWinterModal
