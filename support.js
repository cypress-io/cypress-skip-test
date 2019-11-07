/// <reference path="./index.d.ts" />
// @ts-check

const { skipOn, onlyOn } = require('.')

Cypress.Commands.add('skipOn', skipOn)

Cypress.Commands.add('onlyOn', onlyOn)
