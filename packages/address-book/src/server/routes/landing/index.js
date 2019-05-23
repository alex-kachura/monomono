import config from 'config';
import { logOutcome } from '../../logger';
import { getPhraseFactory } from '../../utils/i18n';
import { getAddresses } from '../../controllers/address';

const acceptedActions = [
  'added',
  'changed-alternate',
  'changed-default',
  'clubcard-updated',
  'deleted',
  'multiple-addresses',
  'updated',
];

function emptyOrEqualCheck(str1, str2) {
  return (!str1 && !str2) || (str1 && str2 && str1.trim() === str2.trim());
}

function addressEqualComparison(addr1, addr2) {
  // If either address has missing mandatory information, then it's a malformed / missing address and outside the scope of a banner for the time being.
  if (
    !addr1.addressLines ||
    !addr2.addressLines ||
    !addr1.postTown ||
    !addr2.postTown ||
    !addr1.postcode ||
    !addr2.postcode
  ) {
    return true;
  }

  if (
    addr1.addressLines.length !== addr2.addressLines.length ||
    emptyOrEqualCheck(addr1.postTown, addr2.postTown) ||
    emptyOrEqualCheck(addr1.postcode, addr2.postcode)
  ) {
    return false;
  }

  return addr1.addressLines.every(({ label, value }) => {
    const foundLine = addr2.addressLines.filter((addr) => addr.label === label);

    if (!foundLine || foundLine.length === 0) {
      return false;
    }

    return emptyOrEqualCheck(value, foundLine[0].value);
  });
}

function getBannerProps(req, groceryAddr, clubcardAddr) {
  const { action } = req.query;
  const getLocalePhrase = getPhraseFactory(req.lang);

  const banner = {
    bannerType: '',
    title: '',
    description: '',
  };

  if (action && acceptedActions.indexOf(action) > -1) {
    banner.bannerType = 'success';
    banner.title = getLocalePhrase(`pages.landing.banner-messages.${action}`);

    const addressesEqual = addressEqualComparison(groceryAddr, clubcardAddr);

    if (!addressesEqual) {
      switch (action) {
        case 'changed-default':
          if (clubcardAddr && clubcardAddr.addressIndex) {
            banner.description = getLocalePhrase(
              'pages.landing.banner-messages.update-clubcard-account',
              {
                baseHostSecure: `/${config.basePath}/${config.appPath}/${req.lang}`,
                id: clubcardAddr.addressIndex,
              },
            );
          }
          break;
        case 'clubcard-updated':
          if (groceryAddr && groceryAddr.addressIndex) {
            banner.description = getLocalePhrase(
              'pages.landing.banner-messages.update-primary-delivery-account',
              {
                baseHostSecure: `/${config.basePath}/${config.appPath}/${req.lang}`,
                id: groceryAddr.addressIndex,
              },
            );
          }
          break;
        default:
          break;
      }
    }
  }

  return banner;
}

export function formatAddressesForUse(addresses) {
  const formattedAddresses = {
    'primary-addresses': {
      clubcard: {},
      grocery: {},
    },
    'other-addresses': [],
  };

  if (!addresses || addresses.length === 0) {
    // TODO:: Throw a better error...
    throw new Error('Error: No addresses found for user');
  }

  addresses.forEach((addr) => {
    const addressTags = addr.tags || [];

    if (addressTags.includes('primaryLoyalty')) {
      formattedAddresses['primary-addresses'].clubcard = addr;
    } else if (addressTags.includes('primaryDelivery')) {
      formattedAddresses['primary-addresses'].grocery = addr;
    } else {
      formattedAddresses['other-addresses'].push(addr);
    }
  });

  return formattedAddresses;
}

export async function getLandingPage(req, res, next) {
  const getLocalePhrase = getPhraseFactory(req.lang);
  const claims = req.getClaims();
  let addresses;

  try {
    addresses = await getAddresses(claims.accessToken, {
      context: req,
    });

    addresses = formatAddressesForUse(addresses);
  } catch (err) {
    return res.format({
      html: () => void next(err),
    });
  }

  const { clubcard, grocery } = addresses['primary-addresses'];
  const bannerProps = getBannerProps(req, grocery, clubcard);
  const payload = {
    addresses,
    breadcrumb: [
      {
        text: getLocalePhrase('pages.account.title'),
        href: `/${config.basePath}/${req.lang}/manage`,
      },
      {
        current: true,
        text: getLocalePhrase('pages.landing.title'),
      },
    ],
    banner: bannerProps,
  };

  logOutcome('landing', 'successful', req);

  return res.format({
    html: () => {
      res.data = {
        ...res.data,
        payload,
      };

      next();
    },
    json: () => res.send({ payload }),
  });
}
