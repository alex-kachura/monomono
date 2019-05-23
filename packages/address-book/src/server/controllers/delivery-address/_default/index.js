import { getServiceToken } from '../../../services/identity';
import getContactClient, {
  extractPhoneNumber,
  processedContactData,
  mapPhoneNumbersToFormValues,
} from '../../../services/contact';
import getAddressClient, {
  extractAddressLines,
  mapAddressToFormValues,
} from '../../../services/address';

export async function getAddress({ accessToken, addressId, context, tracer }) {
  const serviceToken = await getServiceToken();

  const contactService = getContactClient(accessToken);
  const addressService = getAddressClient(serviceToken);

  const contactAddress = await contactService.getSingleAddress(addressId, { tracer, context });

  const { addresses, telephoneNumbers } = contactAddress;
  const { label, addressUuid, tags } = addresses[0];

  if (!tags.includes('delivery')) {
    throw new Error('NOT_DELIVERY_ADDRESS');
  }

  const address = await addressService.getAddress({
    addressId: addressUuid,
    context,
    tracer,
  });

  const result = {
    'address-label': label,
    ...mapAddressToFormValues(address),
    ...mapPhoneNumbersToFormValues(telephoneNumbers),
  };

  return result;
}

export async function createAddress({ accessToken, data, context, tracer }) {
  const contactService = getContactClient(accessToken);

  const serviceToken = await getServiceToken();
  let addressId = data.addressId;
  const postcode = data.postcode;

  if (!addressId) {
    const addressService = getAddressClient(serviceToken);
    const address = await addressService.createAddress({
      postcode,
      address: {
        addressLines: extractAddressLines(data),
      },
      context,
      tracer,
    });

    addressId = address.addressId;
  }

  const label = data['address-label'];
  const phoneNumbers = extractPhoneNumber(data);

  await contactService.addAddress(addressId, label, phoneNumbers, { tracer, context });
}

export async function updateAddress({ data, addressIndex, accessToken, context, tracer }) {
  const serviceToken = await getServiceToken({ context, tracer });
  const contactService = getContactClient(accessToken);
  const addressService = getAddressClient(serviceToken);
  const contactAddress = await contactService.getSingleAddress(addressIndex, { tracer, context });
  const { label, addressUuid, tags, modifiedPhoneNumbers } = processedContactData(
    data,
    contactAddress,
  );

  let addressId = data['address-id'];
  const postcode = data.postcode;

  if (!tags.includes('delivery')) {
    throw new Error('NOT_DELIVERY_ADDRESS');
  }

  if (!addressId) {
    const address = await addressService.createAddress({
      postcode,
      address: {
        addressLines: extractAddressLines(data),
      },
      context,
      tracer,
    });

    addressId = address.addressId;
  }

  await Promise.all(
    modifiedPhoneNumbers.map(({ telephoneNumberIndex, value }) =>
      contactService.updatePhoneNumber(
        telephoneNumberIndex,
        {
          value,
        },
        {
          tracer,
          context,
        },
      ),
    ),
  );

  if (addressUuid !== addressId || label !== data['address-label']) {
    await contactService.updateAddress(
      addressIndex,
      {
        label: data['address-label'],
        addressUuid: addressId,
      },
      {
        tracer,
        context,
      },
    );
  }
}
