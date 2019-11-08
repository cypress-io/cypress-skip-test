/// <reference path="./index.d.ts" />
// @ts-check

const { _ } = Cypress

/**
 * Cleans up the passed name which could be browser, platform or other.
 * @param {string} name The environment or platform or something else, like url
 * @returns {string} Normalized name
 * @example
 * normalizeName('mac') // 'darwin'
 * normalizeName('windows') // 'win32'
 * normalizeName('WIN') // 'win32'
 * normalizeName('localhost') // 'localhost'
 */
const normalizeName = name => {
  name = name.toLowerCase()

  // values are normalized strings we will use
  const aliases = {
    mac: 'darwin',
    windows: 'win32',
    win: 'win32'
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

const skipOnBool = (flag, cb) => {
  if (!_.isBoolean(flag)) {
    throw new Error(
      'Invalid syntax: cy.skipOn(<boolean flag>), for example cy.skipOn(true)'
    )
  }

  if (cb) {
    if (!flag) {
      return cb()
    }
  } else {
    cy.log(`skipOn **${flag}**`)

    if (flag) {
      skip()
    }
  }
}

/**
 * Skips the current test based on the browser, platform or url.
 */
const skipOn = (name, cb) => {
  if (_.isBoolean(name)) {
    return skipOnBool(name, cb)
  }

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

const onlyOnBool = (flag, cb) => {
  if (!_.isBoolean(flag)) {
    throw new Error(
      'Invalid syntax: cy.onlyOn(<boolean>), for example cy.onlyOn(true)'
    )
  }

  if (cb) {
    if (flag) {
      return cb()
    }
  } else {
    cy.log(`onlyOn **${flag}**`)

    if (!flag) {
      skip()
    }
  }
}

/**
 * Runs the current test only in the specified browser, platform or against url.
 * @param {string|boolean} name - condition, could be platform, browser name, url or true|false.
 * @param {() => void} cb - Optional, run the given callback if the condition passes
 */
const onlyOn = (name, cb) => {
  if (_.isBoolean(name)) {
    return onlyOnBool(name, cb)
  }

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
