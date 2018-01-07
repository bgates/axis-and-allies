'use strict'

import researchOptions from '../../config/research'
import { 
  currentPowerHasRockets,
  allowedTech
} from './selectors'

describe('research selectors', () => {
  describe('currentPowerHasRockets', () => {
    const { resultFunc } = currentPowerHasRockets
    it('is true if power has rocket tech', () => {
      const result = resultFunc({ tech: ['Rockets'] })
      expect(result).toBe(true)
    })
    it('is false otherwise', () => {
      const result = resultFunc({ tech: ['Radar', 'Long Range Aircraft'] })
      expect(result).toBe(false)
    })
  })

  describe('allowedTech', () => {
    const { resultFunc } = allowedTech
    describe('for Germany/UK/US', () => {
      ['Germany', 'UK', 'US'].forEach(name => {
        it('can make any tech but bombers initially', () => {
          const result = resultFunc({ name, tech: [] })
          const tech = researchOptions.availableTech.filter(t => t.abbr !== 'heavyBomber')
          expect(JSON.stringify(result.availableTech)).toEqual(JSON.stringify(tech))
        })
        it('can make bombers after making long range aircraft', () => {
          const result = resultFunc({ name, tech: ['Long Range Aircraft'] })
          const tech = researchOptions.availableTech
          expect(JSON.stringify(result.availableTech)).toEqual(JSON.stringify(tech))
        })
      })
    })
    describe('for USSR', () => {
      it('can make jets, radar, and long range aircraft initially', () => {
        const result = resultFunc({ name: 'USSR', tech: [] }).availableTech.map(tech => tech.abbr)
        expect(result).toEqual(['jets', 'longRange', 'radar'])
      })
      it('can make bombers after long range aircraft', () => {
        const result = resultFunc({ name: 'USSR', tech: ['Long Range Aircraft'] }).availableTech.map(tech => tech.abbr)
        expect(result).toEqual(['jets', 'longRange', 'radar', 'heavyBomber'])

      })
    })

  })
})
