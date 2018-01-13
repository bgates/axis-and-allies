import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { initialState as unitsAndTerritories } from './config/configureStore'
import { mergeBoardAndTerritories } from './selectors/getTerritory'

const { units, territories } = unitsAndTerritories
export const startingBoard = mergeBoardAndTerritories.resultFunc(units, territories)
export const startingUnits = units

configure({ adapter: new Adapter() })

export const mockRandom = fn => {
  const mockMath = Object.create(global.Math)
  mockMath.random = fn
  global.Math = mockMath
}

// assign so I can mutate within a test without affecting others
export const findTerritory = name => (
  Object.assign({}, startingBoard.find(t => t.name === name))
)
