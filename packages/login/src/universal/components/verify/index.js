import React from 'react';
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
  }),
};

export default connectPage({ noData: true })(VerifyPage);
