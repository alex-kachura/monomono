import { fromJS } from 'immutable';
import config from 'config';
// import { validateAllFields } from '@oneaccount/form-validation';
import { logOutcome } from '../../logger';
// import controllerFactory from '../../controllers';
import { getPhraseFactory } from '../../utils/i18n';
// import { getFocusFieldId } from '../../../utils/validation';
// import { mergeValuesWithFields } from '../../utils/forms';
import controllerFactory from '../../controllers';

function getBreadcrumb(lang, getLocalePhrase) {
  return [
    {
      text: getLocalePhrase('pages.landing.title'),
      href: `/${config.basePath}/${config.appPath}/${lang}`,
      useAltLink: true,
    },
    {
      text: getLocalePhrase('pages.edit.title'),
    },
  ];
}

export async function getVerifyPage(req, res, next) {
  const getLocalePhrase = getPhraseFactory(req.lang);
  const verifyController = controllerFactory('verify', req.region);
  const { accessToken } = req.getClaims();

  await verifyController.handshake({
    tracer: req.sessionId,
    accessToken,
    context: req,
  });

  const payload = {
    breadcrumb: getBreadcrumb(req.lang, getLocalePhrase),
    banner: {
      bannerType: '',
      title: '',
      errorType: '',
    },
    form: {
      fields: [],
      focusFieldId: undefined,
      isFormValid: true,
      formSubmitted: false,
    },
  };

  logOutcome('verify', 'successful', req);

  return res.format({
    html: () => {
      res.data = res.data.merge(fromJS({ payload }));

      next();
    },
    json: () => res.send({ payload }),
  });
}
