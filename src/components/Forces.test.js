'use strict'

import React from 'react'
import Forces from './Forces'
import renderer from 'react-test-renderer'


it('correctly renders a pair of German infantry', () => {
  const units = [
    { id: 1, power: 'Germany', type: 'infantry' },
    { id: 2, power: 'Germany', type: 'infantry' }
  ]
  const tree = renderer.create(
    <Forces units={units} />
  ).toJSON()
  expect(tree).toMatchSnapshot()
})

