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
  describe('simplest conditions (no inbound, outbound, transport, amphib)', () => {
    const simpleInRange = (power, territory) => (
      combatUnitsInRange(startingBoard, power, territory, {}, {}, { transporting: {} }, { transport: {} }, units)
    )
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
    describe('land in range of carrier air: Hawaiian Islands', () => {
      const territory = findTerritory('Hawaiian Islands')
      it('finds Midway planes in range', () => {
        expect(simpleInRange({ name: 'Japan' }, territory).filter(unit => unit.type.includes('naval')).length).toEqual(2)
      })
    })
    describe('sea in range of carrier air: Gulf of California', () => {
      const territory = findTerritory('Gulf of California')
      it('finds Midway units in range', () => {
        expect(simpleInRange({ name: 'Japan' }, territory).length).toEqual(2)
      })
    })
  })
})
