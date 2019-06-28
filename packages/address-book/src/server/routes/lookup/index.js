import { AddressServiceError } from '@web-foundations/service-address';
import getAddressClient from '../../services/address';
import { getServiceToken } from '../../services/identity';

export async function lookup(req, res, next) {
  // not sending postcode is a bad request
  if (!req.query.postcode) {
    return res.status(400).end();
  }
  const serviceAccessToken = await getServiceToken({
    tracer: req.sessionId,
    context: req,
  });

  try {
    const addressService = getAddressClient(serviceAccessToken);

    const response = await addressService.addresses({
      tracer: req.sessionId,
      context: req,
      postcode: req.query.postcode.replace(/\s/g, ''),
    });

    return res.json(response);
  } catch (err) {
    // 404 here means postcode does not match any addresses.
    // In ths case, do not pass onto error middleware as this would
    // return a misleading 500 to the consumer of the service.
    // Instead, pass the response as it is, so consumer can detect 404.
    if (err.message === AddressServiceError.Codes.POSTCODE_NOT_FOUND) {
      return next();
    }

    // If we get here, there's a serious error, e.g. 500 or server timeout
    return next(err);
  }
}
