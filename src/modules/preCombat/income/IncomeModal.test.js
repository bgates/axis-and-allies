'use strict'

import React from 'react'
import { MemoryRouter } from 'react-router'
import IncomeModal from './IncomeModal'
import renderer from 'react-test-renderer'
import { mount } from 'enzyme'

describe('IncomeModal', () => {
  const objectives = [ 
    { text: 'goal 1', value: 1 }, { text: 'goal 2', value: 2 }
  ]
  it('renders correctly', () => {
    const tree = renderer.create(
      <MemoryRouter>
        <IncomeModal 
          currentPower={ { name: 'Germany' } }
          npl={60}
          objectives={objectives}
          nextNpl={63}
          setIncome={() => {}}
        />
      </MemoryRouter>
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })
  it('calls props.setIncome if no props.income', () => {
    const setIncome = jest.fn()
    mount(
      <MemoryRouter>
        <IncomeModal
          currentPower={ { name: 'Germany' } }
          npl={60}
          objectives={objectives}
          nextNpl={63}
          setIncome={setIncome}
        />
      </MemoryRouter>
    )
    expect(setIncome.mock.calls.length).toBe(1)
  })
  it('does not call props.setIncome if props.income', () => {
    const setIncome = jest.fn()
    mount(
      <MemoryRouter>
        <IncomeModal
          currentPower={ { name: 'Germany' } }
          npl={60}
          objectives={objectives}
          nextNpl={63}
          income={63}
          setIncome={setIncome}
        />
      </MemoryRouter>
    )
    expect(setIncome.mock.calls.length).toBe(0)
  })

})
