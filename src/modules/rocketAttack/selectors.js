import { territoriesInRange } from '??'
import { isEnemy, hasIndustrialComplex } from '??'
  
export const IndustrialComplexInRocketRange = (board, currentPower, territory) => {
  const all = () => true
  return territoriesInRange(board, currentPower, territory, all, 3)
    .filter(hasIndustrialComplex)
    .filter(territory => isEnemy(territory, currentPower.name))
}


