// Import all controllers
import deliveryAddress from './delivery-address';
import clubcardAddress from './clubcard-address';

// Define the controller name + region mappings
export const Controllers = {
  'deliveryAddress.default': deliveryAddress.default, // Default version of controller
  'clubcardAddress.default': clubcardAddress.default,
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
