'use strict'

import { territoriesInRange, combatUnitsInRange } from './movement'
import { initialState as unitsAndTerritories } from '../../config/configureStore'
import { mergeBoardAndTerritories } from '../../selectors/getTerritory'
import powers from '../../config/initialPowers'

const { units, territories } = unitsAndTerritories
const startingBoard = mergeBoardAndTerritories.resultFunc(units, territories)

  /*it('gets the board right', () => {
  expect(startingBoard[0]).toEqual([])
})*/

const findTerritory = name => startingBoard.find(t => t.name === name)

describe('territoriesInRange', () => {
  describe('relative to the Strait of Gibraltar', () => {
    const territory = findTerritory('Strait of Gibraltar')
    describe('with no accessibility restrictions', () => {
      const all = () => true
      it('finds the territory as 0 spaces away', () => {
        const self = territoriesInRange(startingBoard, null, territory, all, 1)[0][0]
        expect(self).toMatchObject(territory)
      })
      describe('territories 1 space away', () => {
        const adjacentTerritories = territoriesInRange(startingBoard, null, territory, all, 2)[1]
        it('includes all adjacentIndexes', () => {
          expect(adjacentTerritories.map(t => t.index)).toMatchObject(territory.adjacentIndexes)
        })
        it('has no overlap w territories 2 spaces away', () => {
          const twoSpacesAwaySet = new Set(territoriesInRange(startingBoard, null, territory, all, 2)[2])
          const adjacentSet = new Set(adjacentTerritories)
          const intersection = new Set([...adjacentSet].filter(t => twoSpacesAwaySet.has(t)))
          expect(intersection.size).toEqual(0)
        })
      })
    })
  })
})
//export const combatUnitsInRange = (board, currentPower, territory, inbound, destination, transport, amphib, allUnits) => {

describe('combatUnitsInRange', () => {
  const simpleInRange = (power, territory) => (
    combatUnitsInRange(startingBoard, power, territory, {}, {}, { transporting: {} }, { transport: {} }, units)
  )
  it('returns array of unit objects', () => {
    const unitsInRange = simpleInRange({ name: 'Germany' }, findTerritory('East Poland'))
    expect(Array.isArray(unitsInRange)).toBe(true);
    ['distance', 'ids', 'originIndex', 'originName', 'power', 'qty', 'type'].forEach(prop => (
      expect(unitsInRange[0]).toHaveProperty(prop)
    ))
  })
  describe('simplest conditions (no inbound, outbound, transport, amphib)', () => {
    describe('Gulf of Guinea', () => {
      const territory = findTerritory('Gulf of Guinea')
      powers.forEach(power => {
        it(`finds no units for ${power.name}`, () => {
          expect(simpleInRange(power, territory).length).toEqual(0)
        })
      })     
    })
    describe('east Poland', () => {
      const territory = findTerritory('East Poland')
      const powerUnits = { Germany: 20, UK: 1, Japan: 0, Italy: 0, US: 0 }
      for (const name in powerUnits) {
        it(`finds ${powerUnits[name]} ${name} units in range`, () => {
          expect(simpleInRange({ name }, territory).length).toEqual(powerUnits[name])
        })
      }
    })
    const japan = { name: 'Japan' }
    describe('land in range of carrier air: Hawaiian Islands', () => {
      const territory = findTerritory('Hawaiian Islands')
      it('finds Midway planes in range', () => {
        expect(simpleInRange(japan, territory).filter(unit => unit.type.includes('naval')).length).toEqual(2)
      })
    })
    describe('sea in range of carrier air: Gulf of California', () => {
      const territory = findTerritory('Gulf of California')
      it('finds Midway planes in range', () => {
        expect(simpleInRange(japan, territory).length).toEqual(2)
      })
    })
    describe('land in range of long range bomber: Kansk', () => {
      const territory = findTerritory('Kansk')
      it('finds Japan bomber in range', () => {
        expect(simpleInRange(japan, territory).length).toEqual(1)
      })
    })
    describe('sea in range of naval+air: off Line Islands', () => {
      const territory = findTerritory('off Line Islands')
      it('finds naval, naval air, and ground-based air in range', () => {
        const units = simpleInRange(japan, territory)
        expect(units.length).toEqual(11)
        expect(units.find(unit => unit.type.includes('naval'))).toBeDefined()
        expect(units.find(({ type }) => type.includes('fighter') && !type.includes('naval'))).toBeDefined()
        expect(units.find(unit => unit.type === 'battleship')).toBeDefined()
      })
    })
  })
  describe('naval units', () => {
    const germany = { name: 'Germany' }
    it('can be blocked by enemy', () => {
      const territory = findTerritory('English Channel')
      const blocker = findTerritory('southern North Sea')
      const units = simpleInRange(germany, territory)
      const blockedFromChannel = unit => unit.originName === 'Skagerrak-Kattegat'
      expect(units.find(blockedFromChannel)).toBeUndefined()
      blocker.units = []
      const unblockedUnits = simpleInRange(germany, territory)
      expect(unblockedUnits.find(blockedFromChannel)).toBeDefined()
    })
    describe('traversing canal', () => {
      const gibraltar = findTerritory('Gibraltar')
      const atlanticSide = findTerritory('Strait of Gibraltar')
      const medSide = findTerritory('Alboran Sea')
      atlanticSide.units = []
      medSide.units = []
      const blockedFromMed = unit => unit.originName === 'off Morocco'
      it('can be blocked if enemy controls chokepoint', () => {
        const units = simpleInRange(germany, medSide)
        expect(units.find(blockedFromMed)).toBeUndefined()
      })
      it('can pass canal if self controls chokepoint', () => {
        gibraltar.currentPower = 'Germany'
        const units = simpleInRange(germany, medSide)
        expect(units.find(blockedFromMed)).toBeDefined()
      })
      it('can pass canal if ally controls chokepoint', () => {
        gibraltar.currentPower = 'Italy'
        const units = simpleInRange(germany, medSide)
        expect(units.find(blockedFromMed)).toBeDefined()
      })
    })
  })
  describe('with some units inbound/outbound', () => {
    const territory = findTerritory('East Poland')
    const originalUnitsInRange = simpleInRange({ name: 'Germany' }, territory)
    const deployedUnit = originalUnitsInRange[0]
    describe('to the same territory', () => {
      const inbound = deployedUnit.ids.reduce((obj, id) => ( { ...obj, [id]: territory.index } ), {})
      const unitsInRange = combatUnitsInRange(startingBoard, { name: 'Germany' }, territory, inbound, {}, { transporting: {} }, { transport: {} }, units)
      it('does not change which units are in range', () => {
        expect(unitsInRange).toMatchObject(originalUnitsInRange)
      })
    })
    describe('to another territory', () => {
      const inbound = deployedUnit.ids.reduce((obj, id) => ( { ...obj, [id]: territory.index + 1 } ), {})
      const unitsInRange = combatUnitsInRange(startingBoard, { name: 'Germany' }, territory, inbound, {}, { transporting: {} }, { transport: {} }, units)
      it('does not count those units as in range', () => {
        expect(originalUnitsInRange.slice(1)).toMatchObject(unitsInRange)
      })

    })

  })
})
