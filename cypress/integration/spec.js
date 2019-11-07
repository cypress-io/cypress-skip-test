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

it('only runs on Electron', () => {
  cy.skipOn('firefox')
  cy.onlyOn('electron')
    .onlyOn('mac')
    .wait(100)
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
