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
  const objectives = (board, power) => resultFunc(board, owned(board, power), { name: power })
  describe('for Germany', () => {
    describe('at start', () => {
      const result = objectives(startingBoard, 'Germany')
      it('has four elements', () => {
        expect(result.length).toEqual(4)
      })
      it('has zero value', () => {
        expect(result.map(value)).toEqual([0, 0, 0, 0])
      })
    })
    describe('by conquering East Poland', () => {
      const board = conquer('Germany', ['East Poland'])
      const result = objectives(board, 'Germany')
      it('gets some value', () => {
        expect(result.map(value)).toEqual([5, 0, 0, 0])
      })
    })
    describe('by conquering Leningrad', () => {
      const board = conquer('Germany', ['Leningrad'])
      const result = objectives(board, 'Germany')
      it('gets some value', () => {
        expect(result.map(value)).toEqual([0, 0, 5, 0])
      })
    })
    describe('by conquering three Soviet territories', () => {
      const board = conquer('Germany', ['Western Ukraine', 'Eastern Ukraine', 'Belorussia'])
      const result = objectives(board, 'Germany')
      it('gets some value', () => {
        expect(result.map(value)).toEqual([0, 5, 0, 0])
      })
    })
    describe('by conquering Moscow', () => {
      const board = conquer('Germany', ['Moscow'])
      const result = objectives(board, 'Germany')
      it('gets some value', () => {
        expect(result.map(value)).toEqual([0, 0, 0, 3])
      })
    })
  })
  describe('for USSR', () => {
    describe('at start', () => {
      const result = objectives(startingBoard, 'USSR')
      it('has two elements', () => {
        expect(result.length).toEqual(2)
      })
      it('has zero value', () => {
        expect(result.map(value)).toEqual([0, 0])
      })
    })
    describe('after conquering most of Eastern Europe', () => {
      const board = conquer('USSR', ['Poland', 'Bulgaria', 'Romania', 'Hungary', 'Yugoslavia', 'Greece'])
      const result = objectives(board, 'USSR')
      it('gets some value', () => {
        expect(result.map(value)).toEqual([10, 0])
      })
    })
    describe('after conquering Berlin', () => {
      const board = conquer('USSR', ['Berlin'])
      const result = objectives(board, 'USSR')
      it('gets some value', () => {
        expect(result.map(value)).toEqual([0, 3])
      })
    })
  })
  describe('for Japan', () => {
    describe('at start', () => {
      const result = objectives(startingBoard, 'Japan')
      it('has three elements', () => {
        expect(result.length).toEqual(3)
      })
      it('has zero value', () => {
        expect(result.map(value)).toEqual([0, 0, 0])
      })
    })
    describe('after conquering Co-Prosperity Sphere', () => {
      const board = conquer('Japan', ['Korea', 'Manchuria', 'Peking', 'Shantung', 'Kwangtung', 'Hong Kong', 'Kwangsi', 'French Indochina', 'Saigon', 'Malaysia', 'Thailand'])
      const result = objectives(board, 'Japan')
      it('has value', () => {
        expect(result.map(value)).toEqual([5, 0, 0])
      })
    })
    describe('after conquering Pacific', () => {
      const board = conquer('Japan', ['Sumatra', 'Borneo', 'Java', 'Celebes', 'Philippines', 'Solomon Islands'])
      const result = objectives(board, 'Japan')
      it('has value', () => {
        expect(result.map(value)).toEqual([0, 5, 0])
      })
    })
    describe('after conquering...Moscow', () => {
      const board = conquer('Japan', ['Moscow'])
      const result = objectives(board, 'Japan')
      it('has value', () => {
        expect(result.map(value)).toEqual([0, 0, 3])
      })
    })
  })
  describe('for UK', () => {
    describe('at start', () => {
      const result = objectives(startingBoard, 'UK')
      it('has two elements', () => {
        expect(result.length).toEqual(2)
      })
      it('has value', () => {
        expect(result.map(value)).toEqual([5, 0])
      })
    })
    describe('by losing an important city', () => {
      ['Hong Kong', 'Cairo', 'Gibraltar'].forEach(city => {
        const board = conquer('Germany', [city])
        const result = objectives(board, 'UK')
        it('has no value', () => {
          expect(result.map(value)).toEqual([0, 0])
        })
      })
    })
    describe('by conquering Berlin', () => {
      const board = conquer('UK', ['Berlin'])
      const result = objectives(board, 'UK')
      it('has some value', () => {
        expect(result.map(value)).toEqual([5, 3])
      })
    })
  })
  describe('for Italy', () => {
    describe('at start', () => {
      const result = objectives(startingBoard, 'Italy')
      it('has three elements', () => {
        expect(result.length).toEqual(3)
      })
      it('has zero value', () => {
        expect(result.map(value)).toEqual([0, 0, 0])
      })
    })
    describe('by conquering old empire', () => {
      const board = conquer('Italy', ['Tobruk', 'Upper Egypt', 'Anglo-Egyptian Sudan', 'Cairo', 'Cyprus', 'Malta'])
      it('has some value', () => {
        const result = objectives(board, 'Italy')
        expect(result.map(value)).toEqual([0, 5, 0])
      })
    })
  })
  describe('for US', () => {
    describe('at start', () => {
      const result = objectives(startingBoard, 'US')
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
