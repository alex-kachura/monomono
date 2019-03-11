import { fromJS } from 'immutable';
import config from 'config';
import { validateAllFields } from '@oneaccount/form-validation';
import { logOutcome } from '../../logger';
import controllerFactory from '../../controllers';
import { getPhraseFactory } from '../../utils/i18n';
import { getFocusFieldId } from '../../../utils/validation';
import { mergeValuesWithFields } from '../../utils/forms';

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

export function getEditPage(req, res, next) {
  const getLocalePhrase = getPhraseFactory(req.lang);
  const { fields } = config[req.region];

  const payload = {
    breadcrumb: getBreadcrumb(req.lang, getLocalePhrase),
    banner: {
      bannerType: '',
      title: '',
      errorType: '',
    },
    form: {
      fields,
      focusFieldId: fields[0].id,
      isFormValid: true,
      formSubmitted: false,
    },
  };

  logOutcome('edit', 'successful', req);

  return res.format({
    html: () => {
      res.data = res.data.merge(fromJS({ payload }));

      next();
    },
    json: () => res.send({ payload }),
  });
}

export function postEditPage(req, res, next) {
  const getLocalePhrase = getPhraseFactory(req.lang);
  const editExample = controllerFactory('editExample', req.region);

  // Merge posted values with region-specific fields
  const fields = mergeValuesWithFields(req.body, config[req.region].fields);

  // Validate fields against constraints
  const validatedFields = validateAllFields(fields);
  const isFormValid = validatedFields.every(({ isValid }) => isValid);

  // Call the controller method based on the region
  const data = editExample(); // eslint-disable-line

  const payload = {
    breadcrumb: getBreadcrumb(req.lang, getLocalePhrase),
    banner: {
      bannerType: '',
      title: '',
      errorType: '',
    },
    form: {
      fields,
      focusFieldId: getFocusFieldId(fields, isFormValid),
      isFormValid,
      formSubmitted: false,
    },
  };

  logOutcome('edit', 'successful', req);

  return res.format({
    html: () => {
      res.data = res.data.merge(fromJS({ payload }));

      next();
    },
    json: () => res.send({ payload }),
  });
}
