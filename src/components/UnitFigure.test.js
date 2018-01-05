'use strict'

import React from 'react'
import { UnitImg, ImgAndQty } from './UnitFigure'
import unitTypes from '../config/unitTypes'
import renderer from 'react-test-renderer'

const fullPowers = ['UK', 'US']
const allUnits = Object.keys(unitTypes)

fullPowers.forEach(power => {
  allUnits.forEach(unit => {
    it(`correctly renders a ${power} ${unit}`, () => {
      const tree = renderer.create(
        <UnitImg power={power} name={unit} />
      ).toJSON()
      expect(tree).toMatchSnapshot()
    })
  })
})

const germanProducible = unitName => !unitName.includes('long range naval')

allUnits.filter(germanProducible).forEach(unit => {
  it(`correctly renders a German ${unit}`, () => {
    const tree = renderer.create(
      <UnitImg power="Germany" name={unit} />
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })
})

const japanProducible = unitName => (
  !unitName.startsWith('naval') && 
  !unitName.startsWith('fighter') && 
  !unitName.startsWith('tactical') &&
  !unitName.startsWith('strategic') &&
  !unitName.startsWith('heavy') &&
  !unitName.startsWith('jet')
)
allUnits.filter(japanProducible).forEach(unit => {
  it(`correctly renders a Japanese ${unit}`, () => {
    const tree = renderer.create(
      <UnitImg power="Japan" name={unit} />
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })
})

const sovietProducible = unitName => (
  !unitName.includes('naval') && 
  !unitName.startsWith('strategic') &&
  !unitName.includes('aircraft') &&
  !unitName.startsWith('heavy') &&
  !unitName.startsWith('jet')
)
allUnits.filter(sovietProducible).forEach(unit => {
  it(`correctly renders a Soviet ${unit}`, () => {
    const tree = renderer.create(
      <UnitImg power="USSR" name={unit} />
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })
})

//TODO: Italian naval tactical bomber, damaged carrier
const italianProducible = unitName => (
  !unitName.startsWith('long') &&
  !unitName.startsWith('heavy') &&
  !unitName.startsWith('super') &&
  !unitName.startsWith('naval tactical') &&
  !unitName.startsWith('damaged aircraft') &&
  !unitName.startsWith('jet')
)
allUnits.filter(italianProducible).forEach(unit => {
  it(`correctly renders a Italian ${unit}`, () => {
    const tree = renderer.create(
      <UnitImg power="Italy" name={unit} />
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })
})

const chineseUnits = ['infantry', 'artillery', 'fighter']

chineseUnits.forEach(unit => {
  it(`correctly renders a Chinese ${unit}`, () => {
    const tree = renderer.create(
      <UnitImg power="China" name={unit} />
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })
})

it('correctly renders a single German infantry', () => {
  const tree = renderer.create(
    <ImgAndQty unit={ { power: 'Germany', type: 'infantry', qty: 1 } }/>
  ).toJSON()
  
})
