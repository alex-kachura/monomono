import getContactClient from '../../services/contact';
import getAddressClient from '../../services/address';
import { getServiceToken } from '../../services/identity';
import log from '../../logger';

export async function getAddresses(accessToken, { context = {} } = {}) {
  const contact = getContactClient(accessToken);
  const serviceToken = await getServiceToken();
  const address = getAddressClient(serviceToken);

  return contact.getFullAddresses(address, {
    tracer: context.sessionId,
    context,
  });
}

export async function deleteAddress(accessToken, contactAddressId, { tracer, context = {} } = {}) {
  const contact = getContactClient(accessToken);

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
