// Define regions supported by the app. Helpful in avoiding littering code with
// string litterals when specifying regions.
export const Region = Object.freeze({
  GB: 'GB',
  PL: 'PL',
});

// Parses an array of region country codes against the applications locales config
// to determine whether they are supported or not.
//
// Returns an object containing supported and unsupported propeties.
// * supported - An array of supported regions (null if none found)
// * unsupported - An array of unsupperted regions (null if non found)
export const parseRegions = (_regions, locales) => {
  const regions = Array.isArray(_regions) ? _regions : [_regions];
  const { supported, unsupported } = regions
    .reduce((result, region) => {
      // Sanitise each region so that its upper cased, trimmed (whitespace removed).
      // If not a string then just leave it.
      const sanitisedRegion = typeof region === 'string' ? region.replace(/ /g, '') : region;

      // Only add the region if its not a duplicate
      if (!result.includes(sanitisedRegion)) {
        result.push(sanitisedRegion);
      }

      return result;
    }, [])
    .reduce(
      (result, region) => {
        // Validate that the items in regions is supported by the application's locales
        if (locales.some((locale) => locale.region === region)) {
          result.supported.push(region);
        } else {
          result.unsupported.push(region);
        }

        return result;
      },
      { supported: [], unsupported: [] },
    );

  return {
    supported: supported.length ? supported : null,
    unsupported: unsupported.length ? unsupported : null,
  };
};

// Factory which given the current context's region and the application's locales
// config will return a function which is used to exclude regions from
// describe.each and it.each blocks.
//
// The returned function takes an array of regions to exclude. If the current
// context region is found in the exclusions an empty array is returned
// otherwise an array containing the region will be returned.
//
// The former causes the it.each or describe.each to be unexecuted whereas the
// latter would be executed.
//
// Retuned function is used by the integration tests config to wire up
// the context.exculde function. An excpetion is thrown if regions not supported
// by the application are detected.
export const excludeFactory = (region, locales) => (exclusions) => {
  const { supported, unsupported } = parseRegions(exclusions, locales);

  if (unsupported) {
    throw new Error(`exclude: Unsupported regions: ${unsupported.join(',') || '(no regions)'}`);
  }

  return supported && supported.includes(region) ? [] : [region];
};

// Factory which given the current context's region and the application's locales
// config will return a function which is used to include only regions
// specified in calls describe.each and it.each blocks.
//
// The returned function takes an array of regions to include. If the current
// context region is found in the inlcusions array containing the region will be
// returned otherwise an empty array is returned
//
// The former causes the it.each or describe.each to be executed whereas the
// latter would be unexecuted.
//
// Retuned function is used by the integration tests config to wire up
// the context.include function. An excpetion is throwm if regions not supported
// by the application are detected.
export const onlyFactory = (region, locales) => (inclusions) => {
  const { supported, unsupported } = parseRegions(inclusions, locales);

  if (unsupported) {
    throw new Error(`only: Unsupported region(s): ${unsupported.join(',')} || '(no regions)'`);
  }

  return supported && supported.includes(region) ? [region] : [];
};

// Factory which given the integration test suite config will return a function
// which is used to return only the contexts for the regions specified.
//
// The returned function if called:
// * Without parameters will return all supported contexts
// * With an array of regions will return all specified contexts
// * With an array containing unsupported regions, an excpetion is thrown.
//
// You can override regoins specified in via the REGIONS environment variable.
// This should be an comma delimited list of region country codes (e.g
// REIGONS="GB,PL" etc)
export const contextsFactory = (config) => (regions) => {
  const regionsEnvVar = process.env.REGIONS ? process.env.REGIONS.split(',') : null;

  if (!regions && !regionsEnvVar) {
    // If falsy then just return all contexts
    return config.contexts;
  }

  const { supported, unsupported } = parseRegions(regionsEnvVar || regions, config.app.locales);

  if (unsupported) {
    throw new Error(`contexts: Unsupported region(s): ${unsupported.join(',')}`);
  }

  // Return only supported regions or all in none
  return !supported
    ? config.contexts
    : config.contexts.filter((context) => supported.includes(context.region));
};
