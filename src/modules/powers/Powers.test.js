'use strict'

import React from 'react'
import Powers from './Powers'
import renderer from 'react-test-renderer'
import powers from '../../config/initialPowers'

const npl = powers.reduce((obj, power) => {
  obj[power.name] = power.ipc
  return obj
}, {})

it('renders correctly', () => {
  const tree = renderer.create(
    <Powers powers={powers} npl={npl} currentPower={'Germany'} />
  ).toJSON()
  expect(tree).toMatchSnapshot()
})

