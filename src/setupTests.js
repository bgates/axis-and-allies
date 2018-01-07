import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

configure({ adapter: new Adapter() })

export const mockRandom = fn => {
  const mockMath = Object.create(global.Math)
  mockMath.random = fn
  global.Math = mockMath
}
