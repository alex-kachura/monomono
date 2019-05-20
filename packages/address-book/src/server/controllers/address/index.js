import contactFactory from '../../utils/contact-service';
import addressFactory from '../../utils/address-service';
import { getServiceToken } from '../../services/identity';
import log from '../../logger';

export async function getAddresses(accessToken, { context = {} } = {}) {
  const contact = contactFactory(accessToken);

  const serviceToken = await getServiceToken();
  const address = addressFactory(serviceToken);

  const res = await contact.getFullAddresses(address, {
    tracer: context.sessionId,
    context,
  });

  return res;
}

export async function deleteAddress(accessToken, contactAddressId, { tracer, context = {} } = {}) {
  const contact = contactFactory(accessToken);

  try {
    await contact.removeAddress(contactAddressId, {
      tracer,
      context,
    });
  } catch (error) {
    log.error('Delete address: service error', error, context);

    return { deleted: false, error };
  }

  return { deleted: true };
}
