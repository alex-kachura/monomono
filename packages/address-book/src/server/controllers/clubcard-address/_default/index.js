// Default controller
import { ErrorCodes } from '../../../utils/error-handlers';
import { getServiceToken } from '../../../services/identity';
import getContactClient, {
  mapPhoneNumbersToFormValues,
  processedContactData,
  validatePhoneNumbers,
} from '../../../services/contact';
import getAddressClient, {
  mapAddressToFormValues,
  extractAddressLines,
} from '../../../services/address';

export async function getAddress({ accessToken, addressId, context, tracer }) {
  const serviceToken = await getServiceToken({ tracer, context });
  const contactService = getContactClient(accessToken);
  const addressService = getAddressClient(serviceToken);
  const contactAddress = await contactService.getSingleAddress(addressId, { tracer, context });
  const { addresses, telephoneNumbers } = contactAddress;
  const { addressUuid, tags } = addresses[0];

  if (!tags.includes('primaryLoyalty')) {
    throw new Error(ErrorCodes.NOT_CLUBCARD_ADDRESS);
  }

  const address = await addressService.getAddress({
    addressId: addressUuid,
    context,
    tracer,
  });

  const result = {
    ...mapAddressToFormValues(address),
    ...mapPhoneNumbersToFormValues(telephoneNumbers, { isClubcard: true }),
  };

  return result;
}

export async function updateAddress({ data, addressIndex, accessToken, context, tracer }) {
  const serviceToken = await getServiceToken({ context, tracer });
  const contactService = getContactClient(accessToken);
  const addressService = getAddressClient(serviceToken);
  const contactAddress = await contactService.getSingleAddress(addressIndex, { tracer, context });

  const { label, addressUuid, tags, modifiedPhoneNumbers } = processedContactData(
    data,
    contactAddress,
    {
      isClubcard: true,
    },
  );

  let addressId = data['address-id'];
  const postcode = data.postcode;

  if (!tags.includes('primaryLoyalty')) {
    throw new Error(ErrorCodes.NOT_CLUBCARD_ADDRESS);
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

  if (modifiedPhoneNumbers.length > 0) {
    const phones = [
      {
        numberType: 'phone',
        value: modifiedPhoneNumbers[0].value,
      },
    ];

    await validatePhoneNumbers(contactService, phones, { tracer, context });
  }

  await Promise.all(
    modifiedPhoneNumbers
      .filter(({ telephoneNumberIndex }) => Boolean(telephoneNumberIndex))
      .map(({ telephoneNumberIndex, value }) =>
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

  if (addressUuid !== addressId) {
    await contactService.updateAddress(
      addressIndex,
      {
        label,
        addressUuid: addressId,
      },
      {
        tracer,
        context,
      },
    );
  }
}
