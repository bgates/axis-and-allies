import { times } from 'ramda'

const dieRolls = (n) => {
  return times(() => Math.ceil(Math.random() * 6), n)
}
export default dieRolls
