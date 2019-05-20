import ContactService from '@web-foundations/service-contact';
import config from 'config';
import log from '../../logger';

const onContactRequestStart = log.makeOnRequestEventHandler('Contact Service Request');
const onContactRequestEnd = log.makeOnRequestEventHandler('Contact Service Response');

export default function contactServiceClientFactory(accessToken) {
  const contact = new ContactService({
    accessToken,
    akamaiAuthToken: config.get('services.akamaiAuthToken'),
    timeout: config.get('services.contact.timeout'),
    clientId: config.get('services.clientId'),
    env: {
      protocol: config.get('services.contact.protocol'),
      host: config.get('services.contact.host'),
      port: config.get('services.contact.port'),
    },
  });

  contact.on('requestStart', onContactRequestStart);
  contact.on('requestEnd', onContactRequestEnd);

  return contact;
}
