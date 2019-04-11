import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import DocumentTitle from 'react-document-title';
import { PageTitle } from '@beans/typography';
import { Formik, connectPage, useAppConfig } from '@oneaccount/react-foundations';
import VerifyForm from './form';
import ClubcardInfo from './clubcard-info';
import OrderClubcard from './order-clubcard';
import ContactInfo from './contact-info';
import Banner from '../common/banner';
import { FormSection, MainCopy } from './styled';

export function VerifyPage({ initialData }) {
  const submitRef = useRef();

  const { getLocalePhrase, csrf } = useAppConfig();

  const {
    banner,
    accountLocked,
    stateToken,
    values: initialValues,
    errors,
    schema,
    fields,
  } = initialData;

  const pageTitle = getLocalePhrase('pages.verify.title');

  return (
    <DocumentTitle title={pageTitle}>
      <div>
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
                  fields={fields}
                  stateToken={stateToken}
                  csrf={csrf}
                  submitRef={submitRef}
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
  }),
};

export default connectPage({ noData: true })(VerifyPage);
