import R from 'ramda';

const dieRolls = (n) => {
  return R.times(() => Math.ceil(Math.random() * 6), n)
}
export default dieRolls;
