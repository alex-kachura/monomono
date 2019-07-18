/* eslint-disable react/jsx-no-bind */

import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import DocumentTitle from 'react-document-title';
import Form from '../common/form';
import { connectPage, useAppConfig } from '@oneaccount/react-foundations';
import { trackEvent, Analytics, errorsToPayload, PAYLOAD_TYPES } from '../../../utils/analytics';

const EditDeliveryAddressPage = ({
  history,
  location,
  initialData: {
    banner: initialBanner = {},
    values: initialValues,
    fields,
    errors: initialErrors,
    schema,
  },
}) => {
  const { getLocalePhrase, rootPath } = useAppConfig();
  const handleSubmit = useCallback(() => {
    trackEvent(Analytics.EditDeliveryAddress.DirectCallRules.SUCCESS);
    history.replace(`${rootPath}?action=updated`);

  }, []);

  const handleErrors = useCallback(
    (errors) => {
      trackEvent(
        Analytics.EditDeliveryAddress.DirectCallRules.VALIDATION_ERRORS,
        PAYLOAD_TYPES.VALIDATION_ERRORS,
        errorsToPayload(errors, fields),
      );
    },
    [fields],
  );

  const handleFailure = useCallback(() => {
    trackEvent(Analytics.EditDeliveryAddress.DirectCallRules.FAILURE);
  });

  return (
    <DocumentTitle title={getLocalePhrase('pages.delivery-address.edit.title')}>
      <Form
        url={`${location.pathname}${location.search}`}
        title={getLocalePhrase('pages.delivery-address.edit.title')}
        initialBanner={initialBanner}
        initialValues={initialValues}
        initialErrors={initialErrors}
        schema={schema}
        fields={fields}
        submitText={getLocalePhrase('pages.delivery-address.edit.submit-button')}
        onSubmit={handleSubmit}
        onErrors={handleErrors}
        onFailure={handleFailure}
      />
    </DocumentTitle>
  );
};

EditDeliveryAddressPage.propTypes = {
  history: PropTypes.object,
  location: PropTypes.object,
  appConfig: PropTypes.shape({
    getLocalePhrase: PropTypes.func,
  }),
  initialData: PropTypes.shape({
    values: PropTypes.object,
    errors: PropTypes.object,
    schema: PropTypes.object,
  }),
};

export default connectPage(({ location }) => ({
  url: `${location.pathname}${location.search}`,
}))(EditDeliveryAddressPage);
