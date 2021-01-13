/// <reference path="./index.d.ts" />
// @ts-check

const { _ } = Cypress

const checkBrowserName = (name) => {
  if ('isBrowser' in Cypress) {
    // use the new v4.0 method
    // @ts-ignore
    return Cypress.isBrowser(name)
  } else {
    return Cypress.browser.name === name
  }
}

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
const normalizeName = (name) => {
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

/**
 * Returns true if the test is running on the given browser or platform
 * or against given url.
 * @param {string} name Browser name, platform or url.
 * @returns {boolean} Returns true if the test runs against the given condition.
 */
const isOn = (name) => {
  if (!_.isString(name)) {
    throw new Error('Invalid syntax: isOn expects a string argument')
  }

  const normalizedName = normalizeName(name)

  if (isPlatform(normalizedName)) {
    return Cypress.platform === normalizedName
  }

  if (isBrowser(normalizedName)) {
    return checkBrowserName(normalizedName)
  }

  if (isHeadedName(normalizedName)) {
    return headedMatches(normalizedName)
  }

  if (isEnvironment(name)) {
    return true
  }

  return matchesUrlPart(normalizedName)
}

// @ts-ignore "cy.state" is not in the "cy" type
const getMochaContext = () => cy.state('runnable').ctx
const skip = () => {
  const ctx = getMochaContext()
  return ctx.skip()
}

const isPlatform = (name) => ['win32', 'darwin', 'linux'].includes(name)
const isBrowser = (name) => ['electron', 'chrome', 'firefox'].includes(name)
const isHeadedName = (name) => ['headed', 'headless'].includes(name)
const isEnvironmentSet = () =>
  typeof Cypress.env('ENVIRONMENT') === 'string' && Cypress.env('ENVIRONMENT')

const headedMatches = (name) => {
  if (name === 'headed') {
    return Cypress.browser.isHeaded
  }
  if (name === 'headless') {
    return Cypress.browser.isHeadless
  }
  throw new Error(`Do not know how to treat headed flag "${name}"`)
}

/**
 * You can pass custom environment name when running Cypress
 * @example
 * CYPRESS_ENVIRONMENT=staging npx cypress run
 * @param {string} name Is checked against `ENVIRONMENT` value
 * @returns {boolean} true if the given argument matches environment string
 */
const isEnvironment = (name) =>
  Cypress.env('ENVIRONMENT') && Cypress.env('ENVIRONMENT') === name

const matchesUrlPart = (normalizedName) => {
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

  const normalizedName = normalizeName(name)

  if (cb) {
    if (isPlatform(normalizedName)) {
      if (Cypress.platform !== normalizedName) {
        return cb()
      }
      return
    }

    if (isBrowser(normalizedName)) {
      if (!checkBrowserName(normalizedName)) {
        return cb()
      }
      return it(`Skipping test(s) on ${normalizedName}`)
    }

    if (isHeadedName(normalizedName)) {
      if (!headedMatches(normalizedName)) {
        return cb()
      }
      return it(`Skipping test(s) in ${normalizedName} mode`)
    }

    if (isEnvironmentSet()) {
      if (!isEnvironment(normalizedName)) {
        return cb()
      }
      return it(`Skipping test(s) on ${normalizedName} environment`)
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
      if (checkBrowserName(normalizedName)) {
        skip()
      }
      return
    }

    if (isEnvironmentSet()) {
      if (isEnvironment(normalizedName)) {
        return skip()
      }
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

  if (cb) {
    if (isOn(name)) {
      return cb()
    } else {
      return it(`Skipping test(s), not on ${name}`)
    }
  } else {
    const normalizedName = normalizeName(name)
    cy.log(`onlyOn **${normalizedName}**`)
    if (!isOn(name)) {
      return skip()
    }
  }
}

module.exports = {
  skipOn,
  onlyOn,
  isOn
}
