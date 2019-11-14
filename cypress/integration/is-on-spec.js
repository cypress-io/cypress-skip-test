/// <reference types="cypress" />
import { isOn } from '../..'

it('returns true for current browser', () => {
  expect(isOn(Cypress.browser.name)).to.be.true
})

it('returns true for current platform', () => {
  expect(isOn(Cypress.platform)).to.be.true
})

it('returns true for current url', () => {
  const url = Cypress.config('baseUrl')
  expect(url).to.be.a('string')
  expect(isOn(url)).to.be.true
  expect(isOn('foo.com')).to.be.false
})

it('uses variable ENVIRONMENT', () => {
  Cypress.env('ENVIRONMENT', 'current test')
  expect(isOn('current test'), 'matches current ENVIRONMENT').to.be.true
  expect(isOn('anywhere else'), 'any other value').to.be.false

  Cypress.env('ENVIRONMENT', 'test env 2')
  expect(isOn('test env 2'), 'matches second ENVIRONMENT').to.be.true
})
