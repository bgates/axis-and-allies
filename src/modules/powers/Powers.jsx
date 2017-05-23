import React from 'react'
import classNames from 'classnames'
import germanyFlag from '../../assets/images/germany.svg'
import ussrFlag from '../../assets/images/ussr.svg'
import japanFlag from '../../assets/images/japan.svg'
import ukFlag from '../../assets/images/uk.svg'
import italyFlag from '../../assets/images/italy.svg'
import usFlag from '../../assets/images/us.svg'
import chinaFlag from '../../assets/images/china.svg'
import '../../assets/styles/powers.css'

const flags = {
  germany: germanyFlag,
  ussr: ussrFlag,
  japan: japanFlag,
  uk: ukFlag,
  italy: italyFlag,
  us: usFlag,
  china: chinaFlag
}

const Powers = ({ powers, currentPower, npl }) => {
  return (
    <ul id="powers">
      {powers.map((power, index) => {
        return <Power
          power={power}
          currentPower={currentPower}
          npl={npl[power.name]}
          key={index} />
        }
      )}
    </ul>
  )
}

const normalPowerIPC = (power, npl) => {
  return (
    <div>
      <h1>{power.name}</h1>
      <h2>{power.ipc} I.P.C.s</h2>
      <h2>{npl} N.P.L.</h2>
    </div>
  )
}

const chinaIPC = (npl) => {
  return (
    <div title={`${npl} Territories`}>
      <h1>China</h1>
      <h2>{npl}</h2>
    </div>
  )
}

const renderIPC = (power, npl) => {
  return power.name === 'China' ? chinaIPC(npl) : normalPowerIPC(power, npl)
}

const Power = ({power, currentPower, npl}) => {
  const powerName = power.name.toLowerCase()
  const liClass = classNames(powerName, { active: currentPower === power })
  return (
    <li className={liClass}>
      <div className="flag">
        <img
          className="round"
          src={flags[powerName]}
          alt={power.name} />
      </div>
      {renderIPC(power, npl)}
    </li>
  )
}
export default Powers
