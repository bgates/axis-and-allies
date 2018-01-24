// @flow
import germanyFlag from '../assets/images/germany.svg'
import ussrFlag from '../assets/images/ussr.svg'
import japanFlag from '../assets/images/japan.svg'
import ukFlag from '../assets/images/uk.svg'
import italyFlag from '../assets/images/italy.svg'
import usFlag from '../assets/images/us.svg'
import chinaFlag from '../assets/images/china.svg'
import type { PowerName } from '../actions/types'

export const flags = {
  germany: germanyFlag,
  ussr: ussrFlag,
  japan: japanFlag,
  uk: ukFlag,
  italy: italyFlag,
  us: usFlag,
  china: chinaFlag
}

export default [
  {name: 'Germany', ipc: 56, tech: []},
  {name: 'USSR', ipc: 46, tech: []},
  {name: 'Japan', ipc: 41, tech: ['longRange']},
  {name: 'UK', ipc: 70, tech: []},
  {name: 'Italy', ipc: 27, tech: []},
  {name: 'US', ipc: 67, tech: []},
  {name: 'China'}
];
// initial tech "~PA:56|LVTNw:46|DXZ0:40|dFR:73|G:27|MS:66|:0~
const powerData = {
  Germany: { capital: 'Berlin', side: 'Axis' },
  USSR: { capital: 'Moscow', side: 'Allies' },
  Japan: { capital: 'Japan', side: 'Axis' },
  UK: { capital: 'London', side: 'Allies' },
  Italy: { capital: 'Rome', side: 'Axis' },
  US: { capital: 'Washington', side: 'Allies' },
  China: { capital: null, side: 'Allies' },
  Neutrals: { capital: undefined, side: 'None' },
  Oceans: { capital: undefined, side: 'None' }
};

export const side = (power:PowerName) => powerData[power].side

export const sameSide = (power1:PowerName, power2:PowerName) => (
 powerData[power1].side === powerData[power2].side
)

export const allyOf = (power:PowerName) => (unit:{ power:PowerName}) => (
  sameSide(power, unit.power)
)

export const enemyOf = (power:PowerName) => (unit:{ power:PowerName}) => (
  !sameSide(power, unit.power)
)

export const opponents = (power:PowerName) => {
  const opponent = powerData[power].side === 'Axis' ? 'Allies' : 'Axis'
  return Object.keys(powerData)
    .filter(_power => side(_power) === opponent)
    .map(_power => powerData[_power])
}
