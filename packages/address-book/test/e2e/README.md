<!-- prettier-ignore -->
# address-book E2E TestCafe Integration Tests <!-- omit in toc -->

- [Installation](#installation)
- [E2E Integration Tests](#E2E-TestCafe-Integration-Tests)
- [Quick Start](#quick-start)
  - [Running Integration Tests](#running-integration-tests)
  - [Configuration](#configuration)

# Installation

- Before running the tests, you need to be logged into the OneAccount Nexus private registry
- Run this command: `npm login`, and enter your username (`<tpxid>.<otp>`) and password
- Install dependencies: `npm install`
- Ensure to use node version 8.9.4

# E2E TestCafe Integration Tests

The aim of these UI E2E integration tests is to verify mostly cliend side functionality (client side errors, click on various dropdowns etc) and end to end intergration between multiple apps.

The end to end tests use browsers to complete the journeys, similiar to what a user will do.

The tests can be run against `dev`, `ppe` and `prod`.

# Quick Start

## Running Integration Tests

The following NPM tasks are available to run the integration tests.

| Command Line       | Description                                   |
| ------------------ | --------------------------------------------- |
| `npm run e2e:dev`  | Runs e2e integration tests against dev        |
| `npm run e2e:ppe`  | Runs e2e integration tests against ppe        |
| `npm run e2e:prod` | Runs e2e integration tests against production |

## Configuration

Application and Integration Test configuration uses the `node-config` library. The full capability of this module is outside the scope of this document, though we will be touching it's merging, multi-environment and defered loading capabilities as used by the Integration Tests. More information about `node-config` can be found on it's [GitHub page](https://github.com/lorenwest/node-config)

The integration tests define the the following configuration files in `test/e2e/config`:

| Config File     | Description                                                                                                                                                                                                                        | Loaded when...           |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------ |
| `default.js`    | <ul><li>Base config file</li><li>Always loaded</li><li>Exports default/development configuration</li><li>All other configuration files are merged into this configuration</li></ul>                                                | `NODE_ENV=`              |
| `dev.js`        | <ul><li>Development environment configuration file (Defines no properties and is wrapper for default)</li><li>Targets running integration tests against locally hosted applications</li><li>Merged into default configuration file | `NODE_ENV=dev`</li></ul> |
| `ppe.js`        | <ul><li>Pre-Production environment configuration file</li><li>Targets running integration tests against ppe environment hosted applications</li><li>Merged into default configuration file</li></ul>                               | `NODE_ENV=ppe`           |
| `production.js` | <ul><li>Production environment configuration file</li><li>Targets running integration tests against production environment hosted applications</li><li>Merged into default configuration file</li></ul>                            | `NODE_ENV=production`    |
