// Default controller
import { getServiceToken } from '../../../services/identity';
import getContactClient, {
  mapPhoneNumbersToFormValues,
  processedContactData,
} from '../../../services/contact';
import getAddressClient, {
  mapAddressToFormValues,
  extractAddressLines,
} from '../../../services/address';

export async function getAddress({ accessToken, addressId, context, tracer }) {
  const serviceToken = await getServiceToken();

  const contactService = getContactClient(accessToken);
  const addressService = getAddressClient(serviceToken);

  const contactAddress = await contactService.getSingleAddress(addressId, { tracer, context });

  const { addresses, telephoneNumbers } = contactAddress;
  const { addressUuid, tags } = addresses[0];

  if (!tags.includes('primaryLoyalty')) {
    throw new Error('NOT_CLUBCARD_ADDRESS');
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
    throw new Error('NOT_CLUBCARD_ADDRESS');
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
