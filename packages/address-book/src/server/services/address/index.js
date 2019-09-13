import AddressService from '@web-foundations/service-address';
import config from 'config';
import log from '../../logger';

const onAddressRequestStart = log.makeOnRequestEventHandler('Address Service Request');
const onAddressRequestEnd = log.makeOnRequestEventHandler('Address Service Response');

export function extractAddressLines(data) {
  const addressLine = 'address-line';

  const addresLinesKeys = Object.keys(data)
    .filter((key) => key.includes(addressLine) && data[key])
    .sort(
      // Make sure that the address are sorted
      (a, b) => parseInt(a.replace(addressLine, ''), 10) - parseInt(b.replace(addressLine, ''), 10),
    );

  return addresLinesKeys.map((key, index) => ({ value: data[key].trim(), lineNumber: index + 1 }));
}

export function mapAddressToFormValues(address) {
  const { id = '', postTown = '', postcode = '', addressLines } = address;

  const result = {
    postcode,
    'address-id': id,
    town: postTown,
    'address-line1': '',
    'address-line2': '',
    'address-line3': '',
  };

  addressLines.forEach(({ lineNumber, value }) => {
    if (lineNumber <= 3) result[`address-line${lineNumber}`] = value;
  });

  return result;
}

export function convertToAddress(legacyAddress) {
  return {
    ...legacyAddress,
    addressLines: legacyAddress.addressLines.map(({ lineNumber, value }) => {
      return {
        value,
        lineNumber: lineNumber + 1,
      };
    }),
  };
}

export default function getAddressClient(accessToken) {
  const tescoPrefixCid = config.get('services.tescoPrefixCid');
  const clientId = config.get('services.clientId');

  const address = new AddressService({
    accessToken,
    env: {
      host: config.get('services.address.host'),
      port: config.get('services.address.port'),
      protocol: config.get('services.address.protocol'),
    },
    timeout: config.get('services.address.timeout'),
    clientId: `${tescoPrefixCid}:${clientId}`,
    akamaiAuthToken: config.get('services.akamaiAuthToken'),
  });

  address.on('requestStart', onAddressRequestStart);
  address.on('requestEnd', onAddressRequestEnd);

  return address;
}
