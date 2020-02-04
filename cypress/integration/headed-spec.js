/// <reference types="cypress" />
import { skipOn } from '../..'

skipOn('headed', () => {
  it('skips the current test in headed mode', () => {
    cy.wrap(true).should('equal', true)
  })
})
