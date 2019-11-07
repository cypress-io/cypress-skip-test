/// <reference path="./index.d.ts" />
// @ts-check

// it('skips test', function () {
//   cy.log('skipping')
//   cy.wrap('foo').should('equal', 'foo')
//   this.skip()
// })

// it('finds Mocha context', () => {
//   cy.log('finding context')
//     .wait(1000)
//     .then(() => {
//       cy.state('runnable').ctx.skip()
//     })
// })

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

Cypress.Commands.add('skipOn', name => {
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
})

Cypress.Commands.add('onlyOn', name => {
  if (!_.isString(name) || '') {
    throw new Error(
      'Invalid syntax: cy.onlyOn(<name>), for example cy.onlyOn("linux")'
    )
  }

  const normalizedName = normalizeName(name)

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
})
