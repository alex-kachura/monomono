import * as _default from './_default';

// Here is how we export controller as whole to the wider application.
// We export the default version of the controller hopefully use by most if not all regions idealy
// We export region sepcific version of the controller as needed.
export default {
  default: _default,
};

// NOTE: This file is not needed if a controller supports all app regions.
// you would just implement controller/index.js - this is handled in the controller factory
