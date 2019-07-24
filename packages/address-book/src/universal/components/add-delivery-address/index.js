/* eslint-disable react/jsx-no-bind */

import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import DocumentTitle from 'react-document-title';
import Form from '../common/form';
import { connectPage, useAppConfig } from '@oneaccount/react-foundations';
import { trackEvent, Analytics, errorsToPayload, PAYLOAD_TYPES } from '../../../utils/analytics';

const AddDeliveryAddressPage = ({
  initialData: {
    banner: initialBanner = {},
    values: initialValues = {},
    fields,
    errors: initialErrors,
    schema,
  },
  location,
  history,
}) => {
  const { getLocalePhrase, rootPath } = useAppConfig();

  const handleSubmit = useCallback(() => {
    history.replace(`${rootPath}?action=added`);
    trackEvent(Analytics.AddDeliveryAddress.DirectCallRules.SUCCESS);
  }, []);

  const handleErrors = useCallback(
    (errors) => {
      trackEvent(
        Analytics.AddDeliveryAddress.DirectCallRules.VALIDATION_ERRORS,
        PAYLOAD_TYPES.VALIDATION_ERRORS,
        errorsToPayload(errors, fields),
      );
    },
    [fields],
  );

  const handleFailure = useCallback(() => {
    trackEvent(
      Analytics.AddDeliveryAddress.DirectCallRules.FAILURE,
      PAYLOAD_TYPES.VALIDATION_ERRORS,
      {
        errors: 'server error',
      },
    );
  });

  return (
    <React.Fragment>
      <DocumentTitle title={getLocalePhrase('pages.delivery-address.add.title')} />
      <Form
        url={`${location.pathname}${location.search}`}
        title={getLocalePhrase('pages.delivery-address.add.title')}
        initialBanner={initialBanner}
        initialValues={initialValues}
        initialErrors={initialErrors}
        schema={schema}
        fields={fields}
        submitText={getLocalePhrase('pages.delivery-address.add.submit-button')}
        onSubmit={handleSubmit}
        onFailure={handleFailure}
        onErrors={handleErrors}
      />
    </React.Fragment>
  );
};

AddDeliveryAddressPage.propTypes = {
  location: PropTypes.object,
  history: PropTypes.object,
  appConfig: PropTypes.shape({
    csrf: PropTypes.string.isRequired,
    getLocalePhrase: PropTypes.func,
  }),
  initialData: PropTypes.shape({
    values: PropTypes.object,
    errors: PropTypes.object,
    schema: PropTypes.object,
    fields: PropTypes.array,
  }),
};

export default connectPage(({ location }) => ({
  url: location.pathname,
}))(AddDeliveryAddressPage);
