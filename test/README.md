# End-to-end tests

Each test in spec files in this folder starts Cypress via NPM module API with different parameters and then checks if the executed tests returned in the results object match the tests we expected to run / skip.

To debug a test, run with with environment variable `DEBUG=test`, it will print more verbose logs
