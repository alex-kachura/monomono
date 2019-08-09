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
    tags,
  },
}) => {
  const { getLocalePhrase, rootPath } = useAppConfig();
  const handleSubmit = useCallback(() => {
    const eventName = tags.includes('primaryDelivery')
      ? Analytics.EditGroceryAddress.DirectCallRules.SUCCESS
      : Analytics.EditDeliveryAddress.DirectCallRules.SUCCESS;

    trackEvent(eventName);

    let action = 'updated';

    if (tags.includes('primaryDelivery')) {
      action = 'changed-default';
    }

    history.replace(`${rootPath}?action=${action}`);
  }, []);

  const handleErrors = useCallback(
    (errors) => {
      const eventName = tags.includes('primaryDelivery')
        ? Analytics.EditGroceryAddress.DirectCallRules.VALIDATION_ERRORS
        : Analytics.EditDeliveryAddress.DirectCallRules.VALIDATION_ERRORS;

      trackEvent(eventName, PAYLOAD_TYPES.VALIDATION_ERRORS, errorsToPayload(errors, fields));
    },
    [fields],
  );

  const handleFailure = useCallback(() => {
    const eventName = tags.includes('primaryDelivery')
      ? Analytics.EditGroceryAddress.DirectCallRules.FAILURE
      : Analytics.EditDeliveryAddress.DirectCallRules.FAILURE;

    trackEvent(eventName, PAYLOAD_TYPES.VALIDATION_ERRORS, {
      errors: 'server error',
    });
  });

  return (
    <React.Fragment>
      <DocumentTitle title={getLocalePhrase('pages.delivery-address.edit.title')} />
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
    </React.Fragment>
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
    tags: PropTypes.array,
  }),
};

export default connectPage(({ location }) => ({
  url: `${location.pathname}${location.search}`,
}))(EditDeliveryAddressPage);
