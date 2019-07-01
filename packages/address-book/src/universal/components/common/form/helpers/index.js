import { useState, useCallback, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { useAppConfig } from '@oneaccount/react-foundations';

export function useForm(url, onSubmit, initialBanner = {}) {
  const { fetch, getLocalePhrase } = useAppConfig();

  const [banner, setBanner] = useState(() => ({
    type: initialBanner.type,
    text: initialBanner.text && getLocalePhrase(initialBanner.text),
    title: initialBanner.title && getLocalePhrase(initialBanner.title),
  }));

  const handleSubmit = useCallback(async (values, { setSubmitting, setErrors }) => {
    const { payload } = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(values),
    });

    const { banner: payloadBanner = {}, errors } = payload;
    const hasErrors = Object.keys(errors).length > 0;

    ReactDOM.unstable_batchedUpdates(() => {
      if (payloadBanner) {
        setBanner({
          type: payloadBanner.type,
          text: payloadBanner.text && getLocalePhrase(payloadBanner.text),
          title: payloadBanner.title && getLocalePhrase(payloadBanner.title),
        });
      }

      if (hasErrors) {
        setErrors(errors);
      }

      setSubmitting(false);

      if (payloadBanner.type !== 'error' && !hasErrors) {
        onSubmit();
      }
    });
  }, []);

  const handleError = useCallback((error) => {
    if (error.message === 'Unexpected Response from Server') {
      setBanner({
        type: 'error',
        title: getLocalePhrase('pages.address.error.unexpected.title'),
        text: getLocalePhrase('pages.address.error.unexpected.text'),
      });
    }
  }, []);

  return { handleSubmit, banner, handleError };
}

export function useFields(fields, errors, onError) {
  const { getLocalePhrase } = useAppConfig();

  const [autoFocus] = useState(() => {
    let focus = '';

    for (let i = 0; i < fields.length; i++) {
      const name = fields[i].name;

      if (fields[i].hidden) continue;
      if (!focus) {
        focus = name;
      }

      if (errors[name]) {
        focus = name;
        break;
      }
    }

    return focus;
  });

  const augmentedFields = useMemo(
    () =>
      fields.map((field) => ({
        ...field,
        autoFocus: autoFocus === field.name,
        onError,
      })),
    [onError, fields],
  );

  const addressFields = useMemo(
    () =>
      augmentedFields.reduce((result, field) => {
        if (field.xtype === 'address') {
          result.push({
            ...field,
            label: getLocalePhrase(field.label),
            placeholder: getLocalePhrase(field.placeholder),
          });
        }

        return result;
      }, []),
    [augmentedFields],
  );

  return { augmentedFields, addressFields };
}
