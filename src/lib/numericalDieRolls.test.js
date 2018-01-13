import { mockRandom } from '../setupTests'
import dieRolls from './numericalDieRolls'

const pseudoRandom = [ 0.1, 0.49, 0.5, 0.1, 0.9 ]
mockRandom(() => pseudoRandom.shift())

describe('dieRolls', () => {
  it('returns an array of numbers between 1 and 6', () => {
    const result = dieRolls(5)
    expect(result).toMatchObject([1, 3, 3, 1, 6])
  })
})
