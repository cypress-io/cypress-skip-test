/// <reference types="cypress" />
import { skipOn } from '../..'

skipOn('firefox', () => {
  it('runs the current test', () => {
    expect(Cypress.browser.name !== 'firefox', 'should not be firefox!')
  })
})
