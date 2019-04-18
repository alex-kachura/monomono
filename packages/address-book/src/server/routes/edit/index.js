import config from 'config';
import { logOutcome } from '../../logger';
import { getPhraseFactory } from '../../utils/i18n';
import AJV from 'ajv';
import ajvErrors from 'ajv-errors';
import { convertAJVErrorsToFormik } from '@oneaccount/react-foundations';

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
  const { fields, schema } = config[req.region];

  const payload = {
    breadcrumb: getBreadcrumb(req.lang, getLocalePhrase),
    banner: {
      type: '',
      title: '',
      errorType: '',
    },
    values: {
      name: '',
      age: '',
      password: '',
      confirmPassword: '',
      postcode: '',
      'address-line1': '',
      'address-line2': '',
      'address-line3': '',
      town: '',
      'address-id': '',
    },
    errors: {},
    fields,
    schema,
  };

  logOutcome('edit', 'successful', req);

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

export function postEditPage(req, res, next) {
  const getLocalePhrase = getPhraseFactory(req.lang);
  const { fields, schema } = config[req.region];
  // const editExample = controllerFactory('editExample', req.region);

  // Call the controller method based on the region
  // const data = editExample(); // eslint-disable-line
  const data = req.body;
  let errors = {};

  const ajv = ajvErrors(
    new AJV({ allErrors: true, jsonPointers: true, $data: true, coerceTypes: true }),
    {
      allErrors: true,
    },
  );

  const compiled = ajv.compile(schema);
  const isValid = compiled(data);

  if (!isValid) {
    errors = convertAJVErrorsToFormik(compiled.errors, schema);
  }

  const payload = {
    breadcrumb: getBreadcrumb(req.lang, getLocalePhrase),
    banner: {
      bannerType: '',
      title: '',
      errorType: '',
    },
    values: data,
    errors: {
      ...errors,
      age: 'always error',
    },
    fields,
    schema,
  };

  logOutcome('edit', 'successful', req);

  return res.format({
    html: () => {
      res.data = {
        ...res.data,
        payload,
      };

      next();
    },
    json: () => {
      res.send({ payload });
    },
  });
}
