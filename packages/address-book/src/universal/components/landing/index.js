import React, { memo } from 'react';
import PropTypes from 'prop-types';
import DocumentTitle from 'react-document-title';

import { useAppConfig, connectPage } from '@oneaccount/react-foundations';
import PrimaryAddress from '../address/primary';
import { AdditionalPanel } from '../address/additional';
import AddressPanel from '../address/panel';
import Banner from '../banner';

import {
  LandingPageTitle,
  LandingSection,
  AddressRow,
  OtherAddressesRow,
  LandingSectionTitle,
} from './styled';

import AddAddress from '../address/buttons/add';

export function LandingPage(props) {
  const { addresses = {}, banner } = props.initialData;
  const { rootPath, getLocalePhrase } = useAppConfig();
  const pageTitle = getLocalePhrase('pages.landing.title');

  return (
    <React.Fragment>
      <DocumentTitle title={pageTitle} />
      <LandingPageTitle margin>{pageTitle}</LandingPageTitle>
      {banner && banner.bannerType ? <Banner details={banner} /> : null}
      <LandingSection>
        <LandingSectionTitle>
          {getLocalePhrase('pages.landing.primary-address.label')}
        </LandingSectionTitle>
        <AddressRow>
          <PrimaryAddress isClubcard details={addresses['primary-addresses'].clubcard} />
          <PrimaryAddress details={addresses['primary-addresses'].grocery} />
        </AddressRow>
      </LandingSection>
      <LandingSection inverseBackground>
        <LandingSectionTitle>
          {getLocalePhrase('pages.landing.other-addresses.label')}
        </LandingSectionTitle>
        <OtherAddressesRow className="other-address">
          <AdditionalPanel panelButton>
            <AddAddress rootPath={rootPath} />
          </AdditionalPanel>
          {addresses['other-addresses'].map((oth, idx) => (
            <AdditionalPanel key={`other-address-${idx.toString()}`} address={oth}>
              <AddressPanel address={oth} additional />
            </AdditionalPanel>
          ))}
        </OtherAddressesRow>
      </LandingSection>
    </React.Fragment>
  );
}

LandingPage.propTypes = {
  initialData: PropTypes.object,
};

export default connectPage(({ location }) => ({
  url: `${location.pathname}${location.search}`,
}))(memo(LandingPage));
