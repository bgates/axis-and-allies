import { combineUnits, survivors } from './units'

describe('combineUnits', () => {
  const unit = { type: 'infantry', power: 'Germany', originName: 'Berlin', id: 2 }

  describe('for first unit', () => {
    it('creates array w ids and qty 1', () => {
      const result = combineUnits([], unit)
      expect(result.length).toEqual(1)
      expect(result[0].ids).toEqual([unit.id])
      expect(result[0].qty).toEqual(1)
    })
  })
  const total = [ { type: 'infantry', power: 'Germany', originName: 'Berlin', id: 1, ids: [1], qty: 1 } ]
  describe('units that share type, power, & originName', () => {
    const result = combineUnits(total, unit)
    it('merges into same array element', () => {
      expect(result.length).toEqual(1)
    })
    it('increments qty', () => {
      expect(result[0].qty).toEqual(2)
    })
    it('includes both unit ids in ids array', () => {
      expect(result[0].ids).toContain(unit.id)
    })
  })
  describe('units that differ', () => {
    ['type', 'power', 'originName'].forEach(prop => {
      const differentUnit = { ...unit, [prop]: prop }
      const result = combineUnits(total, differentUnit)
      it('makes new array element', () => {
        expect(result.length).toEqual(2)
      })
      it('does not change qty', () => {
        expect(result[0].qty).toEqual(1)
      })
    })
  })
  describe('transports', () => {
    it('always creates new array element', () => {
      let total = [];
      [1,2,3].forEach(n => {
        total = combineUnits(total, { type: 'transport', power: 'UK', originName: 'Channel', id: n })
      })
      expect(total.length).toEqual(3)
    })
  })
})

describe('survivors', () => {
  const units = [{ id: 1, type: 'infantry' }, { id: 2, type: 'armor' }]
  it('returns units if no casualties', () => {
    const result = survivors(units)
    expect(result).toEqual(units)
  })
  it('removes casualties', () => {
    const result = survivors(units, [2])
    expect(result).toEqual([{ id: 1, type: 'infantry' }])
  })
  describe('when a unit can take damage', () => {
    const units = [{ id: 1, type: 'destroyer' }, { id: 2, type: 'battleship' }]
    it('damages the unit if unit is casualty', () => {
      const result = survivors(units, [2])
      expect(result[1].type).toEqual('damaged battleship')
    })
  })
})
