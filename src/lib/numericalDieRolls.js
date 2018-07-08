import { times } from 'ramda'

let fakeRolls = [
  2, 3, 4, 5, 5, 1
]

const rollFunction = () => (
  Math.ceil(Math.random() * 6) // fakeRolls.shift()
)
const dieRolls = (n) => {
  return times(rollFunction, n)
}
export default dieRolls
