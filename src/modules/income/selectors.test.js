import { startingBoard } from '../../setupTests'
import { 
  territoriesOwnedBy,
  nationalObjectives
} from './selectors'

describe('territoriesOwnedBy', () => {
  const { resultFunc } = territoriesOwnedBy
  const german = { currentPower: 'Germany' }
  const ussr = { currentPower: 'USSR' }
  const uk = { currentPower: 'UK' }
  const territories = [ german, ussr, uk, german, ussr, german ]
  it('groups by power', () => {
    const result = resultFunc(territories)
    expect(result['Germany'].length).toEqual(3)
  })
})

const owned = (board, power) => (
  { [power]: board.filter(t => t.currentPower === power) }
)
const value = elm => elm.value

const conquer = (power, names) => startingBoard.map(territory => (
  names.includes(territory.name) ? { ...territory, currentPower: power } : territory
))

describe('nationalObjectives', () => {
  const { resultFunc } = nationalObjectives
  describe('for Germany', () => {
    const germany = { name: 'Germany' }
    describe('at start', () => {
      const result = resultFunc(startingBoard, owned(startingBoard, 'Germany'), germany)
      it('has four elements', () => {
        expect(result.length).toEqual(4)
      })
      it('has zero value', () => {
        expect(result.map(value)).toEqual([0, 0, 0, 0])
      })
    })
    describe('by conquering East Poland', () => {
      const board = conquer('Germany', ['East Poland'])
      const result = resultFunc(board, owned(board, 'Germany'), germany)
      it('gets some value', () => {
        expect(result.map(value)).toEqual([5, 0, 0, 0])
      })
    })
    describe('by conquering Leningrad', () => {
      const board = conquer('Germany', ['Leningrad'])
      const result = resultFunc(board, owned(board, 'Germany'), germany)
      it('gets some value', () => {
        expect(result.map(value)).toEqual([0, 0, 5, 0])
      })
    })
  })
  describe('for USSR', () => {
    describe('at start', () => {
      const result = resultFunc(startingBoard, owned(startingBoard, 'USSR'), { name: 'USSR' })
      it('has two elements', () => {
        expect(result.length).toEqual(2)
      })
      it('has zero value', () => {
        expect(result.map(value)).toEqual([0, 0])
      })
    })
  })
  describe('for Japan', () => {
    describe('at start', () => {
      const result = resultFunc(startingBoard, owned(startingBoard, 'Japan'), { name: 'Japan' })
      it('has three elements', () => {
        expect(result.length).toEqual(3)
      })
      it('has zero value', () => {
        expect(result.map(value)).toEqual([0, 0, 0])
      })
    })
  })
  describe('for UK', () => {
    const uk = { name: 'UK' }
    describe('at start', () => {
      const result = resultFunc(startingBoard, owned(startingBoard, 'UK'), uk)
      it('has two elements', () => {
        expect(result.length).toEqual(2)
      })
      it('has value', () => {
        expect(result.map(value)).toEqual([5, 0])
      })
    })
    describe('by losing an important city', () => {
      ['Hong Kong', 'Cairo', 'Gibraltar'].forEach(city => {
        const board = startingBoard.map(territory => (
          territory.name === city ? { ...territory, currentPower: 'Not UK' } : territory
        ))
        const result = resultFunc(board, owned(board, 'UK'), uk)
        it('has no value', () => {
          expect(result.map(value)).toEqual([0, 0])
        })
      })
    })
  })
  describe('for Italy', () => {
    describe('at start', () => {
      const result = resultFunc(startingBoard, owned(startingBoard, 'Italy'), { name: 'Italy' })
      it('has three elements', () => {
        expect(result.length).toEqual(3)
      })
      it('has zero value', () => {
        expect(result.map(value)).toEqual([0, 0, 0])
      })
    })
  })
  describe('for US', () => {
    describe('at start', () => {
      const result = resultFunc(startingBoard, owned(startingBoard, 'US'), { name: 'US' })
      it('has one element', () => {
        expect(result.length).toEqual(1)
      })
      it('has zero value', () => {
        expect(result.map(value)).toEqual([0])
      })
    })
  })
  it('returns empty array for China', () => {
    expect(resultFunc([], { China: [] }, { name: 'China' })).toEqual([])
  })
})
