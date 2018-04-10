import { 
  getUnits, 
  getIndustry, 
  getSide
} from './selectors'

const unfilteredUnits = [
  { type: 'infantry' }, 
  { type: 'armor' },
  { type: 'industrial complex' }
]

describe('getUnits', () => {
  const { resultFunc } = getUnits
  it('filters out industry', () => {
    const result = resultFunc(unfilteredUnits)
    expect(result.length).toEqual(2)
  })
})

describe('getIndustry', () => {
  const { resultFunc } = getIndustry
  it('finds the industry', () => {
    const result = resultFunc(unfilteredUnits)
    expect(result).toMatchObject({ type: 'industrial complex' })
  })
})

describe('getSide', () => {
  const { resultFunc } = getSide
  it('reports whose side current power is on', () => {
    expect(resultFunc('Germany')).toEqual('Axis')
    expect(resultFunc('US')).toEqual('Allies')
  })
})
