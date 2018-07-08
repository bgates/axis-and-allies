import { times } from 'ramda'

function* rollMaker() {
  let fakeRolls = [
    2, 3, 4, 5, 5, 1
  ]
  while (true) {
    yield fakeRolls.length ? fakeRolls.shift() : dieRoll(6)
  }
}

const dieRoll = (n) => Math.ceil(Math.random() * n)

const rollGenerator = rollMaker()
const random = false
const rollFunction = () => (
  random ? dieRoll(6) : rollGenerator.next().value
)
const dieRolls = (n) => {
  return times(rollFunction, n)
}
export default dieRolls
