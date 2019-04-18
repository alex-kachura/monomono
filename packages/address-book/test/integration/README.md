
<!-- prettier-ignore -->
# address-book Integration Tests <!-- omit in toc -->
- [Installation](#installation)
- [Integration Tests](#integration-tests)
- [Quick Start](#quick-start)
  - [Running Integration Tests](#running-integration-tests)
  - [Running Integration Tests - Against Specific Regions](#running-integration-tests---against-specific-regions)
- [Writing Integration Tests](#writing-integration-tests)
  - [Configuration](#configuration)
  - [Contexts](#contexts)
  - [Utilities](#utilities)
  - [**`Region`**](#region)
  - [**`contexts([regions])`**](#contextsregions)
  - [**`context.exclude([regions])`**](#contextexcluderegions)
  - [**`context.only([regions])`**](#contextonlyregions)
  - [Integration Test - An Example](#integration-test---an-example)
  - [Known Issues](#known-issues)
- [Screenshot tests (Jest-image-snapshot)](#screenshot-tests-jest-image-snapshot)
  - [Types of issues that will be caught:](#types-of-issues-that-will-be-caught)
  - [NPM Tasks](#npm-tasks)


# Installation

- Before running the tests, you need to be logged into the OneAccount Nexus private registry
- Run this command: `npm login`, and enter your username (`<tpxid>.<otp>`) and password
- Install dependencies: `npm install`
- Ensure to use node version 8.9.4

# Integration Tests

The aim of these integration tests is to verify features that should be available are available and working as expected and those features that should be disabled are not available in a multi-region context.

The end to end tests make direct http requests.

The tests can be run against `dev`, `ppe` and `prod`.

Without out any modification integration test will run against all regions defined in the application's `locale` configuration property.

# Quick Start

## Running Integration Tests
The following NPM tasks are available to run the integration tests.

| Command Line | Description |
| --- | --- |
| `npm run integration:dev`  | Runs integration tests against dev        |
| `npm run integration:ppe`  | Runs integration tests against ppe        |
| `npm run integration:prod` | Runs integration tests against production |

By default the above tasks will run against all regions defined in the application's `locale` config property.

## Running Integration Tests - Against Specific Regions
You can control which regions the integrations are run for by setting the `REGIONS` environment variable.

For example, let say our application supports GB, PL & ES and we want to run the integration tests against dev:

| Command Line | Description |
| --- | --- |
| `REGIONS=GB,PL,ES npm run integration:dev`| Runs integration tests against all regions<br/><sup>(equivalent to just running **npm run integration:dev**)</sup> |
| `REGIONS=GB npm run integration:dev`| Runs integration test tests against a single<br/>region<br/><sup>(GB in this use case)</sup> |
| `REGIONS=GB,ES npm run integration:dev` | Run integration tests against a subest<br/>of regions<br/><sup>(GB & ES in this use case)</sup>

If `REGIONS` contains a country code not supported by the application then an exception is thrown.

# Writing Integration Tests
This section will cover the structures and conventions that enable writing multi-region capable integration tests. Previously integration tests duplicated a quite few of the respective application's settings alongside any integration test suite settings. To boot the test suite was incapable of supporting application designed to run in multi-region contexts.

To resolve this an approach was taken that:

- Imports the respective target environments applications configuration, both global and regional. Leveragging the `node-config` module's ability to merge configurations.
- Interrogates application configuration to determine supported regions.
- Exposes both application and test suite configuration in a per region context. This context covers all application and test suite config for target region.
- Leverages `jest` modules capability to run the same tests squites against different data (data being a regional context in our use case). This allows us to write a test suite once but be able to run it against mutliple regions.
- Integration tests run against all identified region contexts with mechanisms to target or exlcude particular regions
  
We'll cover how this done in more depth in the [Confgiuration](#configuration), [Contexts](#contexts) and [Structure](#structure) sections.  If you've read these sections before or you are familiar with the code base you can skip ahead to the the [Integration Test - An Example](#integration-test---an-example) for a refresher.

## Configuration
Application and Integration Test configuration uses the `node-config` library. The full capability of this module is outside ths scope of this document, though we will be touching it's merging, multi-environment and defered loading capabilities as used by the Integration Tests. More information about `node-config` can be found on it's [GitHub page](https://github.com/lorenwest/node-config)


The integration tests define the the following configuration files in `test/integration/config`:


| Config File     | Description                                                                                                                                                                                                                                                              | Loaded when...           |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------ |
| `default.js`    | <ul><li>Base config file</li><li>Always loaded</li><li>Exports default/development configuration</li><li>All other configuration files are merged into this configuration</li></ul>                                                                                      | `NODE_ENV=`              |
| `dev.js`        | <ul><li>Development environment configuration file (Defines no properties and is wrapper for default)</li><li>Targets running integration tests against locally hosted applications</li><li>Merged into default configuration file                                       | `NODE_ENV=dev`</li></ul> |
| `ppe.js`        | <ul><li>Pre-Production environment configuration file</li><li>Targets running integration tests against ppe environment hosted applications</li><li>Merged into default configuration file</li></ul>                                                                     | `NODE_ENV=ppe`           |
| `production.js` | <ul><li>Production environment configuration file</li><li>Targets running integration tests against production environment hosted applications</li><li>Merged into default configuration file</li></ul>                                                                  | `NODE_ENV=production`    |
| `proxy.js`      | <ul><li>Development environment configuration file (Defines no properties and is wrapper for default)</li><li>Targets running integration tests against locally hosted application behind a proxy (e.g. Charles)</li><li>Merged into default configuration file</li><ul> | `NODE_ENV=proxy`         |


The respective configuration files import the corresponding application's config (excluding `dev.js` which is a wrapper for `default.js`) and exposes it via an property named `app`. This property gives us complete access to the application's environment and region specific settings e.g. appPath, basePath etc. 

Additionally they may also define test suite level configuration, for example user accounts (`accounts`), relevant to the corresponding environment. The `accounts` property lists the named accounts for each supported by region (used to login etc). This can be seen in `default.js` and `production.js`. Where `default.js` and `production.js` define an `accounts` property with named accounts consistent with the Enterprise services ultimately targeted, PPE and PROD.

So you can define additional test suite configuration and override them appropriately in the respective environment files as need.

The `default.js` configuration files also exports a property named `contexts`. We'll discuss this in the [Contexts](#contexts) section.


**How does this all hang together?**

I'm glad you asked. So if we take a look at a partial fragment of the base configuration `default.js` it exports two properties, `app` and `accounts` <sup>[Code Fragment 1]</sup>.

The `app` property imports the corresponding application environment's configuration. The `accounts` property defines a single account named `default` for the GB region. There are no named accounts defined for PL at this time.

***Code Fragment 1 - Partial test/integration/config/default.js***
```javascript
import { deferConfig as defer } from 'config/defer';
import { getLocalePhrase } from '../../../src/server/utils/i18n';
import { excludeFactory, includeFactory } from '../utils/contexts/extensions';

module.exports = {
  // Import application configuration
  app: require('../../../src/config/default'), // eslint-disable-line global-require

  // Add named accounts as needed by adding a property for each new account per region needed.
  accounts: {
    GB: {
      default: {
        username: 'oneaccountPPETest@emailsim.io',
        password: 'Password01',
        clubcard: '634004027349392014',
      },
    },
    PL: {
      // None at the moment for Poland. Something the pop up team will need to
      // look into.
    },
  },
  
  ...
};
```

If we now look at the `ppe.js` configuration file you'll see that it defines only the app property <sup>[Code Fragment 2]</sup>.

***Code Fragment 2 - Partial test/integration/config/ppe.js***
```javascript
module.exports = {
  // Import application configuration (override that imported by default.js)
  app: require('../../../src/config/ppe'), // eslint-disable-line global-require

  // No accounts defined here as default.js by default and necessity is configured for PPE.
};
```
The `node-config` library will always load the base configuration (`default.js`). Then depending on the value of the `NODE_CONFIG_ENV` environment variable (dev, ppe, proxy, production etc...) it will load the corresponding `<NODE_CONFIG_ENV>.js` and merge it into the config object exported by the base configuration. 

If we were run the integration test against PPE (`npm run integration:ppe`) the `node-config` library will (this applies for the other environments too):

1. Load `test/integration/config/default.js` importing the applications default config `../../../src/config/default` as the `app` property
2. Load `test/integratoin/config/ppe.js` as identified by `NODE_CONFIG_ENV`, in this case `ppe`
3. As `test/integration/config/ppe.js` also defines an `app` property, load `../../../src/config/ppe.js`
4. Merges the default `app` and ppe `app` properties resulting in a new `app` property. Properties defined in both files, the value from ppe take will take precedence.

The resulting config object now targets PPE and has two properties at the moment `app` and `account` appropriately scoped. This covers how we import and reuse application settings rather than littering the integration tests with duplicated constants or config. 

There is an additional function `default.js` provides us. It defines another property named `contexts`. This how we handle multi-region and expose the application settings loaded as described in this section.


## Contexts
The integration test's `default.js` defines a property named `contexts`. This property is defined only in the `default.js` and has a special role. It defines a callback function which `node-config` will call only when all referenced configuration is loaded and merged. Once this is done the callback is executed and given the final config object

This function parses the `locales` property in the app config and returns an array of context objects. A context object is series of properties and app config for a given region (i.e one for each of the supported regions). This makes much easier to re-use application config rather then duplicating settings in the test config <sup>[Code Fragment 3]</sup>.

***Code Fragment 3 - Defintion of contexts property callback***
```javascript
import { deferConfig as defer } from 'config/defer';
import { getLocalePhrase } from '../../../src/server/utils/i18n';
import { excludeFactory, includeFactory } from '../utils/contexts/extensions';

module.exports = {
 
 ...

 contexts: defer((config) => {
    const { basePath, appPath, protocol, locales } = config.app;

    // eslint-disable-next-line arrow-body-style
    return locales.map((locale) => {
      return {
        // Include local properties
        hostname: locale.hostname,
        region: locale.region,
        lang: locale.languages[0],

        // Include app, base and helpful constructs
        protocol,
        basePath,
        appPath,
        appUrl: `${protocol}${locale.hostname}/${basePath}/${appPath}/${locale.languages[0]}`,
        baseUrl: `${protocol}${locale.hostname}/${basePath}/${appPath}`,

        // Include utility functions.
        getLocalePhrase,
        exclude: excludeFactory(locale.region, locales),
        include: includeFactory(locale.region, locales),

        // Include entire app config for easy access
        appConfig: config.app,
        accounts: config.accounts[locale.region],
      };
    });
  }),
};

```


Some of the application settings are exposed as primary properties just to be helpful so as not require accessing deeply nested properties. Some properties are computed at execution time (e.g. appUrl). This object can be extended as need and replaces direct access to the `node-config`'s `config` object in the integration tests. 

Here is an example of the contexts array returned by the callback when targeting PPE.

```javascript
contexts: [
  {
    hostname: 'www-ppe.tesco.com',
    region: 'GB',
    lang: 'en-GB',
    protocol: 'https://',
    basePath: 'account',
    appPath: 'testapp4',
    appUrl: 'https://www-ppe.tesco.com/account/testapp4/en-GB',
    baseUrl: 'https://www-ppe.tesco.com/account/testapp4',
    getLocalePhrase: [Function],
    exlculde: [Function],
    include: [Function],
    appConfig: { ... },
    accounts: { // account from accounts.GB
      default: { ... },
    },
  },
  {
    hostname: 'www-ppe.tesco.pl',
    region: 'PL',
    lang: 'pl-PL',
    protocol: 'https://',
    basePath: 'account',
    appPath: 'testapp4',
    appUrl: 'https://www-ppe.tesco.pl/account/testapp4/pl-PL',
    baseUrl: 'https://www-ppe.tesco.pl/account/testapp4',
    getLocalePhrase: [Function],
    exlculde: [Function],
    include: [Function],
    appConfig: { ... },
    accounts: { // accounts from accounts.PL
      default: { ... },  
    },
  },

  ... Additional contexts as regional coverage expands ...
]
```


So the `contexts` property gives us away for providing region scoped config and can be iterated over by a test suite. It is intended that direct access `contexts` property is discouraged and that instead the globally scope `contexts(...)` function is used by test suites. See [Utilities](#utilities) section for more information.


## Utilities
The preceding two sections have described how the integration test config imports application config and test suite configuration in an environment and regionally scoped manner. Whilst that is helpful by itself we would quickly find that our integrations test would be littered with plumbing code to detect applicable region contexts or indeed multiple versions for each region.

To help us write clean integration tests and importantly write them once and apply them to multiple regions some utility functions and constants have been added. The together allow to specify region contexts to include or exclude for a give test(s).


## **`Region`**

Globallay scoped static object which has properties for the currently supported regions. Conuntry codes follow ISO 2 Char Country Codes.

**Currently defined country codes**
```
Region.GB
Region.PL
```

## **`contexts([regions])`**

Globally scoped function which returns filterable array of region contexts supported by the applications `locales` configuration.

* **Parameters**

  _`regions`_ (Optional) - An array of regions.

* **Returns**

  If _`regions`_ is supplied returns the region contexts specified otherwise returns all region contexts.

* **Description**

  Given an optoinal array regions, ISO 2 Character Country Code strings, it will return an array of the specified region contexts from the configuration's `contexts` property. 

  If the regions param is empty or not provided all region contexts available are returned.

  Any unsportted regions will cause the function to throw an exception listing the offending regions.

* **Usage**
  
  **Preferred over direct access to the `config` object.**

  Normal usage would be without any parameters, e.g run all contained tests agianst all regions specified, but there will be times where certain regions need to be excluded. 

  So given the `contexts` example in the [Contexts](#contexts) section above

  
  ```javascript
  describe.each(contexts())('Run against all contexts', (context) => {
    // contexts() returns [ { region: 'GB', ...}, { region: 'PL', ... }]  
    // This callback will be called twice, once for GB and PL.
    ...
  });

  describe.each(contexts([Region.GB, Region.PL]))
    ('Run against all contexts', (context) => {
      // Long form, redundant equivalent, to the example above
    ...
  });
  
  describe.each(contexts([Region.GB]))
    ('Run against a specific context', (context) => {
      // contexts() returns [ { region: 'GB', ...}]  
      // This callback will be called once for the GB region context.
    ...
  });

  describe.each(contexts(['IT']))('Will never run', (context) => {
    // The describe.each will not run, an exception will be thrown.
    // Note this situation is easy to spot as we've used a string litteral rather then the Region object.
    ...
  });
  ```

  `contexts()` additionally checks for an environment variable named `REGIONS`. `REGIONS` should be a comma delimited list of country codes. If the `REGIONS` environment variable is set it takes precedence over the those defined programmatically in the integration tests. Note if `REGIONS` contains unsupported region codes an exception is also thrown.

  For example the following would only run the integration tests against GB even for tests that used `contexts()`.

  ```bash
  $ REGION=GB npm run integration:dev
  ```

  This allows you at development or build time to override regions set by calling `contexts(...)`. Normally you would run the integration tests against all supported regions but it is handy to be able to target a specific region or regions. For example you have made changes to GB only copy, so no need to run against every region. 

## **`context.exclude([regions])`**

Context scoped function which can be used to exclude excution of a `describe.each` or `it.each` call back.

* **Parameters**

  _`regions`_ (Optional) - An array of regions to exclude.

* **Returns**

  If the context region is not specified in `regions` then an array with a single value ([region]) is returned (truthy state) otherwise an empty array is returned (falsy state). 

* **Description**

  Provides a mechanism to exclude excution of `desrcibe.each` and/or `it.each's` call backs for the specified regions. You would use this when you know that a particular `describe.each`/`it.each` is not applicable to a region. For example Title field in GB registration whereas this field is not used in Poland.

  An empty `regions` or any unsportted regions will cause the function to throw an exceptions listing the offending regions.

* **Usage**
  
  ```javascript
  describe.each(contexts())('Run tests against all region contexts', (context) => {

    describe.each(context.exclude(['Region.PL']))('My Test',() => {
      // These tests will be exclude if the current context.region is PL
      ...additional describe/it blocks...
    });
  });
  ```

## **`context.only([regions])`**

Context scoped function which can be used to include excution of a `describe.each` or `it.each` call back.

* **Parameters**

  _`regions`_ (Optional) - An array of regions to include.

* **Returns**

  If the context region is not specified in `regions` then an array an empty array (falsy state) is returned otherwise an array with a single value ([region]) is return (truthy state)

* **Description**

  Provides a mechanism to include excution of `desrcibe.each` and/or `it.each's` call backs for the specified regions. You would use this when prameters to `context.exclude` become to unwieldly, you can invert the logic.

  An empty `regions` or any unsportted regions will cause the function to throw an exceptions listing the offending regions.

* **Usage**
  
  ```javascript
  describe.each(contexts())('Run tests against all region contexts', (context) => {

    describe.each(context.only(['Region.PL']))('My Test',() => {
      // These tests will be included if the current context.region is PL
      ...additional describe/it blocks...
    });
  });
  ```


## Integration Test - An Example
Now that we have covered [Configuration](#configuration), [Contexts](#contexts) and [Utilities](#utilities) lest write an example (though not runnable) integration test following best practise and conventions.

**Conventions**

- We use the Jest testing library for our integration tests. 
- Single file per page that supports all regions.
- The file should be named after the page being tested with a suffix of `-page.test.js` e.g `landing-page.test.js, not-found-page.test.js or personal-detials-page.test.js` etc...
- A top level describe block should always be a `describe.each(...)` this allows us to pass the regional contexts as a parameter which Jest will iterate over making each regional context available to the describe block's callback and any nested describe/it blocks. You can have as many top level `describe.each(...)` as needed if it helps strcuture test logically.
- The first child describe block should used to indicate the region, ```describe(`${context.region}`, () => { ... });```. All other blocks should be nested within this block. Test results will be cleanly partitioned by region.
- Test that need to excluded or included only for particular reagions should use `describe.each` and/or `it.each`

**An Example**

```javascript
import { jar } from 'request';
import { getResponse, checkEnvironment } from '@oneaccount/test-common';


checkEnvironment([noPPE], () => {
  describe.each(contexts())('Status Page (/_status)', (context) => {
    const { region, baseUrl } = context;

    const headers = {
      'Content-Type': 'text/html',
      Accept: 'text/html',
    };

    let response;

    describe(`${region}`, () => {
      describe('should render status page', () => {
        beforeAll(async () => {
          response = await getResponse(`${baseUrl}/_status`, { jar, headers });
        });


        // Contrived example to show context.only(...) usage 
        it.each(context.only([Region.GB]))('has a status code of 200', () => {
          expect(response.statusCode).toBe(200);
        });

        // Contrived example to showcase context.exclude(...) usage
        it.each(context.exclude([Region.PL]))('has correct content', () => {
          expect(response.body).toBe('OK');
        });
      });
    });
  });
});
```
## Known Issues
- Jest will only report on test suites and test that have run. So if reagion are excluded they will not be reported on. We can't change this behaviour.

# Screenshot tests (Jest-image-snapshot)
**THIS SECTIONS SEEMS TO BE DEFUNCT!**

Verifies:

- visual comparison between current loaded UI version and saved snapshots as baseline
- uses https://www.npmjs.com/package/jest-image-snapshot to generate and compare screenshots of the pages

The end to end tests make direct http requests. The tests can be run against:

- Proxy
- PPE
- Prod

## Types of issues that will be caught:

- functional regression
- configuration
- deployment
- UI and visual regression

## NPM Tasks

- `npm run screenshots:dev` - Runs screenshots tests against proxy.
- `npm run screenshots:ppe` - Runs screenshots tests against ppe.
