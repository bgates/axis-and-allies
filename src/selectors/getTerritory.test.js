import { getUnits } from './getTerritory'
import { findTerritory, startingBoard, startingUnits } from '../setupTests'

describe('getUnits', () => {
  const { resultFunc } = getUnits
  const simpleCase = (territory, units) => resultFunc(territory, units, [], [], '', {}, {}, null)

  describe('groups units based on type and power', () => {
    const units = { 
      1: { type: 'infantry', power: 'Germany', id: 1 },
      2: { type: 'infantry', power: 'Germany', id: 2 },
      3: { type: 'infantry', power: 'Germany', id: 3 },
      4: { type: 'infantry', power: 'Germany', id: 4 },
      5: { type: 'fighter', power: 'Germany', id: 5 },
      6: { type: 'armor', power: 'Germany', id: 6 },
      7: { type: 'infantry', power: 'USSR', id: 7 },
    }
    it('maps unitIds to units', () => {
      const result = simpleCase({ unitIds: [1] }, units)[0];
      ['type', 'power', 'id', 'qty'].forEach(prop => expect(result).toHaveProperty(prop))
    })
    const result = simpleCase({ unitIds: [1,2,3] }, units)
    it('combines units with matching type+power', () => {
      expect(result.length).toEqual(1)
    })
    it('stores number of units in qty', () => {
      expect(result[0].qty).toEqual(3)
    })
    it('separates units of different type', () => {
      const result = simpleCase({ unitIds: [1, 6] }, units)
      expect(result.length).toEqual(2)
    })
    it('separates units of different power', () => {
      const result = simpleCase({ unitIds: [1, 7] }, units)
      expect(result.length).toEqual(2)
    })
    it('removes outbound units', () => {
      const result = resultFunc({ unitIds: [1, 2, 3] }, units, [2], [], '', {}, {}, null)
      expect(result[0].qty).toEqual(2)
    })
    it('adds inbound units', () => {
      const result = resultFunc({ unitIds: [1, 2, 3] }, units, [], [4], '', {}, {}, null)
      expect(result[0].qty).toEqual(4)
    })
    const territoryId = 100
    const elsewhereId = 200
    describe('landing planes', () => {
      it('are removed if landing elsewhere', () => {
        const landPlanes = { 5: elsewhereId }
        const result = resultFunc({ unitIds: [1, 2, 5] }, units, [], [], '', {}, landPlanes, territoryId)
        expect(result.length).toEqual(1)
      })
      it('are re-included if landing in territory', () => {
        const landPlanes = { 5: territoryId }
        const result = resultFunc({ unitIds: [1, 2, 5] }, units, [], [], '', {}, landPlanes, territoryId)
        expect(result.length).toEqual(2)
      })
    })
    describe('new units', () => {
      const placement = {
        infantry: { [territoryId]: 5, [elsewhereId]: 2 }
      }
      const result = resultFunc({ unitIds: [] }, units, [], [], 'Germany', placement, {}, territoryId)
      it('are included for territory', () => {
        expect(result.length).toEqual(1)
        expect(result[0].qty).toEqual(5)
      })
      it('belong to current power', () => {
        expect(result[0].power).toEqual('Germany')
      })
    })
  })
})
