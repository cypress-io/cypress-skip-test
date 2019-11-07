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

Cypress.Commands.add('skip', () => {
  cy.state('runnable').ctx.skip()
})

it('skip test using custom command', () => {
  cy.log('about to run custom command to skip this test')
    .wait(1000)
    .skip()
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
