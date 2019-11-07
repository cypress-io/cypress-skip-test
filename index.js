/// <reference path="./index.d.ts" />
// @ts-check

const { _ } = Cypress

const normalizeName = name => {
  name = name.toLowerCase()

  // values are normalized strings we will use
  const aliases = {
    mac: 'darwin',
    windows: 'win32'
  }
  const normalizedName = aliases[name] ? aliases[name] : name
  return normalizedName
}

const getMochaContext = () => cy.state('runnable').ctx
const skip = () => {
  const ctx = getMochaContext()
  return ctx.skip()
}

const isPlatform = name => ['win32', 'darwin', 'linux'].includes(name)
const isBrowser = name => ['electron', 'chrome', 'firefox'].includes(name)

const matchesUrlPart = normalizedName => {
  // assuming name is part of the url, and the baseUrl should be set
  const url = Cypress.config('baseUrl') || location.origin
  return url && url.includes(normalizedName)
}

/**
 * Skips the current test based on the browser, platform or url.
 */
const skipOn = (name, cb) => {
  if (!_.isString(name) || '') {
    throw new Error(
      'Invalid syntax: cy.skipOn(<name>), for example cy.skipOn("linux")'
    )
  }

  const skip = () => {
    const ctx = getMochaContext()
    return ctx.skip()
  }

  const normalizedName = normalizeName(name)

  if (cb) {
    if (isPlatform(normalizedName)) {
      if (Cypress.platform !== normalizedName) {
        return cb()
      }
      return
    }

    if (isBrowser(normalizedName)) {
      if (Cypress.browser.name !== normalizedName) {
        return cb()
      }
      return
    }

    if (!matchesUrlPart(normalizedName)) {
      return cb()
    }
  } else {
    cy.log(`skipOn **${normalizedName}**`)

    if (isPlatform(normalizedName)) {
      if (Cypress.platform === normalizedName) {
        skip()
      }
      return
    }

    if (isBrowser(normalizedName)) {
      if (Cypress.browser.name === normalizedName) {
        skip()
      }
      return
    }

    if (matchesUrlPart(normalizedName)) {
      return skip()
    }
  }
}

/**
 * Runs the current test only in the specified browser, platform or against url.
 */
const onlyOn = (name, cb) => {
  if (!_.isString(name) || '') {
    throw new Error(
      'Invalid syntax: cy.onlyOn(<name>), for example cy.onlyOn("linux")'
    )
  }

  const normalizedName = normalizeName(name)

  if (cb) {
    if (isPlatform(normalizedName) && Cypress.platform === normalizedName) {
      return cb()
    }

    if (isBrowser(normalizedName) && Cypress.browser.name === normalizedName) {
      return cb()
    }

    if (matchesUrlPart(normalizedName)) {
      return cb()
    }
  } else {
    cy.log(`onlyOn **${normalizedName}**`)

    if (isPlatform(normalizedName)) {
      if (Cypress.platform !== normalizedName) {
        skip()
      }
      return
    }

    if (isBrowser(normalizedName)) {
      if (Cypress.browser.name !== normalizedName) {
        skip()
      }
      return
    }

    if (!matchesUrlPart(normalizedName)) {
      return skip()
    }
  }
}

module.exports = {
  skipOn,
  onlyOn
}
