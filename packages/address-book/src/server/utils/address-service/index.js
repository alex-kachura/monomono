import AddressService from '@web-foundations/service-address';
import config from 'config';
import log from '../../logger';

const onAddressRequestStart = log.makeOnRequestEventHandler('Address Service Request');
const onAddressRequestEnd = log.makeOnRequestEventHandler('Address Service Response');

export default function addressServiceClientFactory(serviceToken) {
  const address = new AddressService({
    accessToken: serviceToken,
    akamaiAuthToken: config.get('services.akamaiAuthToken'),
    timeout: config.get('services.address.timeout'),
    clientId: config.get('services.clientId'),
    env: {
      protocol: config.get('services.address.protocol'),
      host: config.get('services.address.host'),
      port: config.get('services.address.port'),
    },
  });

  address.on('requestStart', onAddressRequestStart);
  address.on('requestEnd', onAddressRequestEnd);

  return address;
}
