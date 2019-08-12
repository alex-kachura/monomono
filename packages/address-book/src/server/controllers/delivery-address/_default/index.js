import { getServiceToken } from '../../../services/identity';
import getContactClient, {
  extractPhoneNumber,
  mapPhoneNumbersToFormValues,
  processedContactData,
  validatePhoneNumbers,
} from '../../../services/contact';
import getAddressClient, {
  convertToAddress,
  extractAddressLines,
  mapAddressToFormValues,
} from '../../../services/address';
import { ErrorCodes } from '../../../utils/error-handlers';

export async function getAddress({ accessToken, addressId, context, tracer }) {
  const serviceToken = await getServiceToken();
  const contactService = getContactClient(accessToken);
  const addressService = getAddressClient(serviceToken);
  const contactAddress = await contactService.getSingleAddress(addressId, { tracer, context });
  const { addresses, telephoneNumbers } = contactAddress;
  const { label, addressUuid, tags, isCompleteAddress, legacyAddress } = addresses[0];

  if (!tags.includes('delivery')) {
    throw new Error(ErrorCodes.NOT_DELIVERY_ADDRESS);
  }

  let address;

  if (isCompleteAddress) {
    address = await addressService.getAddress({
      addressId: addressUuid,
      context,
      tracer,
    });
  } else {
    address = convertToAddress(legacyAddress);
  }

  return {
    tags,
    'address-label': label,
    ...mapAddressToFormValues(address),
    ...mapPhoneNumbersToFormValues(telephoneNumbers),
  };
}

export async function createAddress({ accessToken, data, context, tracer }) {
  const contactService = getContactClient(accessToken);
  const serviceToken = await getServiceToken();
  let addressId = data['address-id'];
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

  await validatePhoneNumbers(contactService, phoneNumbers, { tracer, context });

  await contactService.addAddress(addressId, label, phoneNumbers, { tracer, context });
}

export async function updateAddress({ data, addressIndex, accessToken, context, tracer }) {
  const meta = { tracer, context };
  const serviceToken = await getServiceToken(meta);
  const contactService = getContactClient(accessToken);
  const addressService = getAddressClient(serviceToken);
  const contactAddress = await contactService.getSingleAddress(addressIndex, meta);
  const { label, addressUuid, tags, modifiedPhoneNumbers } = processedContactData(
    data,
    contactAddress,
  );

  let addressId = data['address-id'];
  const postcode = data.postcode;

  if (!tags.includes('delivery')) {
    throw new Error(ErrorCodes.NOT_DELIVERY_ADDRESS);
  }

  if (!addressId) {
    const address = await addressService.createAddress({
      postcode,
      address: {
        addressLines: extractAddressLines(data),
      },
      ...meta,
    });

    addressId = address.addressId;
  }

  await validatePhoneNumbers(contactService, modifiedPhoneNumbers, meta);

  await Promise.all(
    modifiedPhoneNumbers.map(({ telephoneNumberIndex, value, oldValue, numberType }) => {
      if (!value) {
        return contactService.deletePhoneNumber(telephoneNumberIndex, meta);
      }

      if (!oldValue) {
        return contactService.createPhoneNumber(
          {
            value,
            label: numberType,
            country: 'GB',
            relatesToAddressIndex: addressIndex,
          },
          meta,
        );
      }

      return contactService.updatePhoneNumber(
        telephoneNumberIndex,
        {
          value,
        },
        meta,
      );
    }),
  );

  if (addressUuid !== addressId || label !== data['address-label']) {
    await contactService.updateAddress(
      addressIndex,
      {
        label: data['address-label'],
        addressUuid: addressId,
      },
      meta,
    );
  }

  return {
    tags,
  };
}
