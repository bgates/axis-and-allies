import roll from './dieRollRotation'

it('returns an array of rotations', () => {
  expect(roll(5, 0.1, 0.2)).toEqual(['630deg', '720deg'])
})
