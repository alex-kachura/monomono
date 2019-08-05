import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import DocumentTitle from 'react-document-title';
import { PageTitle } from '@beans/typography';
import { Formik, connectPage, useAppConfig } from '@oneaccount/react-foundations';
import VerifyForm from './form';
import ClubcardInfo from './clubcard-info';
import OrderClubcard from './order-clubcard';
import ContactInfo from './contact-info';
import Banner from '../common/banner';
import { FormSection, MainCopy, LinkStyled } from './styled';
import { trackEvent, Analytics, PAYLOAD_TYPES, errorsToPayload } from '../../../utils/analytics';

export function VerifyPage({ initialData }) {
  const { getLocalePhrase, csrf } = useAppConfig();

  const {
    banner,
    accountLocked,
    stateToken,
    values: initialValues,
    errors,
    schema,
    fields,
    backlink,
  } = initialData;

  const pageTitle = getLocalePhrase('pages.verify.title');
  const link = backlink.link || '';
  const label = getLocalePhrase(backlink.label) || '';

  const onErrors = useCallback((formErrors) => {
    trackEvent(
      Analytics.Verify.DirectCallRules.VALIDATION_ERRORS,
      PAYLOAD_TYPES.VALIDATION_ERRORS,
      errorsToPayload(formErrors),
    );
  }, []);

  return (
    <DocumentTitle title={pageTitle}>
      <div>
        {link ? (
          <LinkStyled
            href={link}
            emphasized
            icon={{ graphic: 'backwardLink', position: { global: 'left' } }}
            variant="standalone"
          >
            {`${getLocalePhrase('pages.verify.backward-link')} ${label}`}
          </LinkStyled>
        ) : null}
        <PageTitle margin>{pageTitle}</PageTitle>

        <MainCopy hasBanner={banner && banner.type !== ''}>
          {getLocalePhrase('pages.verify.sub-title')}
        </MainCopy>
        <Banner {...banner} />
        {!accountLocked ? (
          <React.Fragment>
            <FormSection>
              <Formik
                initialValues={initialValues}
                initialErrors={errors}
                validationJSONSchema={schema}
              >
                <VerifyForm
                  onErrors={onErrors}
                  fields={fields}
                  stateToken={stateToken}
                  csrf={csrf}
                  getLocalePhrase={getLocalePhrase}
                />
              </Formik>
            </FormSection>
            <ClubcardInfo />
          </React.Fragment>
        ) : null}
        <OrderClubcard />
        <ContactInfo />
      </div>
    </DocumentTitle>
  );
}

VerifyPage.propTypes = {
  appConfig: PropTypes.shape({
    csrf: PropTypes.string.isRequired,
    getLocalePhrase: PropTypes.func,
  }),
  initialData: PropTypes.shape({
    values: PropTypes.object,
    errors: PropTypes.object,
    schema: PropTypes.object,
    banner: PropTypes.shape({
      type: PropTypes.string,
    }),
    accountLocked: PropTypes.bool,
    stateToken: PropTypes.any,
    fields: PropTypes.array,
    backlink: PropTypes.shape({
      link: PropTypes.string,
      label: PropTypes.string,
    }),
  }),
};

export default connectPage({ noData: true })(VerifyPage);
