/// <reference types="cypress" />
import { onlyOn, skipOn } from '../..'

onlyOn('mac', () => {
  // this callback will only evaluate on Mac
  // thus the tests will be completely hidden from other platforms
  describe('Mac tests', () => {
    it('works', () => {})
  })
})

skipOn('mac', () => {
  // this test will run on every platform but Mac
  it('hides this test on Mac', () => {})
})

it('runs given function for some environment', () => {
  Cypress.env('ENVIRONMENT', 'test1')
  let called
  onlyOn('test1', () => {
    called = true
  })
  expect(called, 'callback was called').to.be.true
})

it('does not run given function for other environments', () => {
  Cypress.env('ENVIRONMENT', 'test1')
  let called
  onlyOn('testX', () => {
    called = true
  })
  expect(called, 'callback was NOT called').to.be.undefined
})
