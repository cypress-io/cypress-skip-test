/// <reference types="cypress" />
import { onlyOn, skipOn } from '../..'

it('runs only on Mac', () => {
  // using the exported function instead of
  // the custom command cy.onlyOn(...)
  onlyOn('mac')
})

it('skips on Mac', () => {
  skipOn('darwin')
})
