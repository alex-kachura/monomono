import { getAddresses, deleteAddress } from '../../controllers/address';
import { logOutcome } from '../../logger';
import { formatAddressesForUse } from '../landing';
import { getPhraseFactory } from '../../utils/i18n';

export async function postDeleteAddressRoute(req, res, next) {
  const contactAddressId = req.body['contact-address-id'];
  const { accessToken } = req.getClaims();
  const getLocalePhrase = getPhraseFactory(req.lang);

  if (!contactAddressId) {
    return res.format({
      html: () => next(new Error('Missing address id.')),
    });
  }

  try {
    await deleteAddress(accessToken, contactAddressId, {
      context: req,
      tracer: req.sessionId,
    });

    let addresses = await getAddresses(accessToken, {
      context: req,
    });

    addresses = formatAddressesForUse(addresses);

    const payload = {
      addresses,
      breadcrumb: [
        {
          text: getLocalePhrase('pages.landing.title'),
        },
      ],
      banner: {
        bannerType: 'success',
        title: getLocalePhrase('pages.landing.banner-messages.deleted'),
        description: '',
      },
    };

    logOutcome('delete-address', 'successful', req);

    return res.format({
      html: () => {
        res.data = {
          ...res.data,
          payload,
        };
        res.status(200);

        next();
      },
      json: () => res.send({ payload }),
    });
  } catch (error) {
    return res.format({
      html: () => void next(error),
    });
  }
}
