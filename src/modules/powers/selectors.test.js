'use strict'

import { nplByPower } from './selectors'

describe('power selectors', () => {
  describe('nplByPower', () => {
    const { resultFunc } = nplByPower
    it('calculates npl by ipc value for most powers', () => {
      const powers = [{ name: 'Germany' }, { name: 'USSR' }]
      const territories = {
        Germany: [ { ipc_value: 4 }, { ipc_value: 8 } ],
        USSR: [ { ipc_value: 2 }, { ipc_value: 1 }, { ipc_value: 1 } ],
      }
      const expected = { Germany: 12, USSR: 4 }
      expect(resultFunc(powers, territories)).toEqual(expected)
    })
    it('calculates npl by territory count for China', () => {
      const powers = [{ name: 'Germany' }, { name: 'China' }]
      const territories = {
        Germany: [ { ipc_value: 4 }, { ipc_value: 8 } ],
        China: [ {}, {}, {} ]
      }
      const expected = { Germany: 12, China: 3 }
      expect(resultFunc(powers, territories)).toEqual(expected)
    })
  })
})

