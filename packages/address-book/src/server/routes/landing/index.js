import { logOutcome } from '../../logger';
import { getPhraseFactory } from '../../utils/i18n';

export async function getLandingPage(req, res, next) {
  const getLocalePhrase = getPhraseFactory(req.lang);

  const payload = {
    breadcrumb: [
      {
        text: getLocalePhrase('pages.landing.title'),
      },
    ],
    banner: {
      bannerType: '',
      title: '',
      errorType: '',
    },
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
