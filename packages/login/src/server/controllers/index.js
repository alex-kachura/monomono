// Import all controllers
import * as verify from './verify';

// Define the controller name + region mappings
export const Controllers = {
  'verify.default': verify, // Default version of controller
};

export default (name, region) => {
  // Get the controller based on name and region. Order of precedence:
  // name.region > named default > implicit default
  const controller =
    Controllers[`${name}.${region}`] || Controllers[`${name}.default`] || Controllers[name];

  if (!controller) {
    throw new Error(`No regional or default contoller ${name} found for ${region}'`);
  }

  return controller;
};
