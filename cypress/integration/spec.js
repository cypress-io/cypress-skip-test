// enables intelligent code completion for Cypress commands
// https://on.cypress.io/intelligent-code-completion
/// <reference types="Cypress" />

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

const isPlatform = name => ['win32', 'darwin', 'linux'].includes(name)
const isBrowser = name => ['electron', 'chrome', 'firefox'].includes(name)
const matchesPlatform = normalizedName =>
  isPlatform(normalizedName) && Cypress.platform === normalizedName
const matchesBrowser = normalizedName =>
  isBrowser(normalizedName) && Cypress.browser.name === normalizedName
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

  if (matchesPlatform(normalizedName)) {
    return skip()
  }

  if (matchesBrowser(normalizedName)) {
    return skip()
  }

  if (matchesUrlPart(normalizedName)) {
    return skip()
  }
})

it('skip test using custom command', () => {
  cy.log('about to run custom command to skip this test')
    .wait(1000)
    .skipOn('mac')
})

it('skips on Electron', () => {
  cy.skipOn('electron')
})

it('skips on example.cypress.io', () => {
  // cy.visit('https://example.cypress.io')
  cy.skipOn('example.cypress.io')
})

// it('puts things into Mocha context', function () {
//   cy.log('adding a property to ctx')
//   cy.state('runnable').ctx.foo = 'bar'

//   expect(this.foo, 'context property is now available').to.equal('bar')

//   // cy.wrap('bar')
//   //   .as('foo')
//   //   .then(() => {
//   //     console.log('Mocha context')
//   //     console.log(cy.state('runnable').ctx)
//   //   })

//   // but to add it to aliases we need to place into state("aliases") too
//   const addAlias = (name, value) => {
//     const aliases = cy.state('aliases') ? cy.state('aliases') : {}
//     cy.state('runnable').ctx[name] = value
//     // under aliases, it is kept in an object
//     aliases[name] = {
//       alias: name,
//       subject: value,
//       command: {
//         get () {
//           // cy.get("@alias") checks the command name that saved the alias
//           // using alias.command.get('name')
//           // so we return undefined here to duck type it
//         }
//       }
//     }
//     cy.state('aliases', aliases)
//   }

//   addAlias('foo', 'bar')
//   cy.get('@foo').should('equal', 'bar')
// })
