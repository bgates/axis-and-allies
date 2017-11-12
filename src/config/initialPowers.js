import germanyFlag from '../assets/images/germany.svg'
import ussrFlag from '../assets/images/ussr.svg'
import japanFlag from '../assets/images/japan.svg'
import ukFlag from '../assets/images/uk.svg'
import italyFlag from '../assets/images/italy.svg'
import usFlag from '../assets/images/us.svg'
import chinaFlag from '../assets/images/china.svg'

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
  {name: 'Japan', ipc: 41, tech: []},
  {name: 'UK', ipc: 70, tech: []},
  {name: 'Italy', ipc: 27, tech: []},
  {name: 'US', ipc: 67, tech: []},
  {name: 'China'}
];
// initial tech "~PA:56|LVTNw:46|DXZ0:40|dFR:73|G:27|MS:66|:0~
export const powerData = {
  Germany: { capital: 'Berlin', side: 'Axis' },
  USSR: { capital: 'Moscow', side: 'Allies' },
  Japan: { capital: 'Japan', side: 'Axis' },
  UK: { capital: 'London', side: 'Allies' },
  Italy: { capital: 'Rome', side: 'Axis' },
  US: { capital: 'Washington', side: 'Allies' },
  China: { side: 'Allies' },
  neutral: { side: 'None' }
};

export const side = (power) => powerData[power].side;

export const allyOf = power => unit => sameSide(power, unit.power)

export const enemyOf = power => unit => !sameSide(power, unit.power)

export const sameSide = (power1, power2) => powerData[power1].side === powerData[power2].side

