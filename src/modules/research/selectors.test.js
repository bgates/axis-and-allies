'use strict'

import researchOptions from '../../config/research'
import { currentPowerHasRockets } from './selectors'

describe('research selectors', () => {
  describe('currentPowerHasRockets', () => {
    it('is true if power has rocket tech', () => {
      const result = currentPowerHasRockets.resultFunc({ tech: ['Rockets'] })
      expect(result).toBe(true)
    })
    it('is false otherwise', () => {
      const result = currentPowerHasRockets.resultFunc({ tech: ['Radar', 'Long Range Aircraft'] })
      expect(result).toBe(false)
    })
  })

  describe('allowedTech', () => {

  })
})
