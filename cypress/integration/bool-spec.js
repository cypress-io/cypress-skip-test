/// <reference types="cypress" />
import { onlyOn, skipOn } from '../..'

it('runs on true', () => {
  onlyOn(true)
})

it('skips on true', () => {
  skipOn(true)
})

onlyOn(true, () => {
  it('runs it as callback', () => {})
})

skipOn(true, () => {
  it('skips this completely', () => {})
})

it('runs if task returns production', () => {
  cy.task('getDbName').then(name => cy.onlyOn(name === 'production'))
  // equivalent
  cy.task('getDbName').then(name => onlyOn(name === 'production'))
  // equivalent
  cy.task('getDbName')
    .then(name => name === 'production')
    .then(onlyOn)
})

it('runs when on the set environment', () => {
  Cypress.env('ENVIRONMENT', 'production')
  onlyOn('production')
})

it('skips when on the set environment', () => {
  Cypress.env('ENVIRONMENT', 'production')
  skipOn('production')
})

it('skips if task returns production', () => {
  cy.task('getDbName').then(name => skipOn(name === 'production'))
})
