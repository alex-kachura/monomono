import ContactService from '@web-foundations/service-contact';
import config from 'config';

export function extractPhoneNumber(data, { isClubcard = false } = {}) {
  return ['day', 'evening', 'mobile'].reduce((result, numberType) => {
    let value;

    if (isClubcard) {
      value = data.phone;
    } else {
      value = data[numberType];
    }

    if (value) {
      result.push({
        numberType,
        value,
      });
    }

    return result;
  }, []);
}

export function getModifiedPhoneNumbers(phoneNumbers, OriginalPhoneNumbers) {
  return phoneNumbers
    .map(({ numberType, value }) => {
      const original = OriginalPhoneNumbers.find(
        ({ label: phoneLabel }) => phoneLabel.toLowerCase() === numberType,
      );

      return {
        telephoneNumberIndex: original.telephoneNumberIndex,
        value,
        oldValue: original.value,
      };
    })
    .filter(({ value, oldValue }) => value !== oldValue);
}

export function processedContactData(data, contactAddress, { isClubcard = false } = {}) {
  const { addresses, telephoneNumbers } = contactAddress;
  const { label, addressUuid, tags } = addresses[0];

  const phoneNumbers = extractPhoneNumber(data, {
    isClubcard,
  });
  const modifiedPhoneNumbers = getModifiedPhoneNumbers(phoneNumbers, telephoneNumbers);

  return {
    label,
    addressUuid,
    tags,
    modifiedPhoneNumbers,
  };
}

export function mapPhoneNumbersToFormValues(phoneNumbers, { isClubcard = false } = {}) {
  const result = {};

  phoneNumbers.forEach(({ label: phoneLabel, value }) => {
    let label = phoneLabel.toLowerCase();

    if (isClubcard) {
      label = 'phone';
    }
    result[label] = value;
  });

  return result;
}

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

  return contact;
}
