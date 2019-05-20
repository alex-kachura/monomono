import React from 'react';
import PropTypes from 'prop-types';
import { useAppConfig } from '@oneaccount/react-foundations';
import { Signpost } from '@beans/typography';
import AddressPanel from '../panel';
import EditButton from '../buttons/edit';
import {
  AddressPanelStyled,
  AddressFooter,
  AddressHeader,
  HeaderIcon,
  FooterLabel,
  AddressHeaderText,
} from './styled';

export default function PrimaryAddress({ isClubcard, details }) {
  const { getLocalePhrase } = useAppConfig();

  // TODO: Clubcard Icon
  const iconGraphic = <HeaderIcon graphic={isClubcard ? 'basket' : 'basket'} size="sm" />;
  const headerText = (
    <Signpost>
      {getLocalePhrase(
        `pages.landing.primary-address.header.${isClubcard ? 'clubcard' : 'grocery'}`,
      )}
    </Signpost>
  );
  const additionalText = getLocalePhrase(
    `pages.landing.primary-address.additional.${isClubcard ? 'clubcard' : 'grocery'}`,
  );

  return (
    <AddressPanelStyled size={24} sm={11.7} gutter={'0px'}>
      <AddressHeader className="primary-address__address-header">
        {iconGraphic}
        <AddressHeaderText>{headerText}</AddressHeaderText>
      </AddressHeader>
      <AddressPanel address={details} isClubcard />
      <AddressFooter>
        {details.addressIndex && (
          <React.Fragment>
            <EditButton itemId={details.addressIndex} isMCA={isClubcard} />
            <FooterLabel>{additionalText}</FooterLabel>
          </React.Fragment>
        )}
      </AddressFooter>
    </AddressPanelStyled>
  );
}

PrimaryAddress.propTypes = {
  isClubcard: PropTypes.bool,
  details: PropTypes.object.isRequired,
};
