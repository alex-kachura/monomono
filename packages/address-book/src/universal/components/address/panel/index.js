import React from 'react';
import PropTypes from 'prop-types';
import { useAppConfig } from '@oneaccount/react-foundations';
import { AddressPanelStyled, WrapTextLabel, WrapTextSubHeading } from './styled';

export default function AddressPanel({ address, isClubcard, additional }) {
  const { getLocalePhrase } = useAppConfig();

  if (!address || !address.addressLines || address.addressLines.length === 0) {
    return (
      <AddressPanelStyled>
        <WrapTextLabel className={`missing-address-${isClubcard ? 'clubcard' : 'delivery'}`}>
          {getLocalePhrase(`pages.landing.missing-address.${isClubcard ? 'clubcard' : 'delivery'}`)}
        </WrapTextLabel>
      </AddressPanelStyled>
    );
  }

  const { label, addressLines, postTown, postCode, telephoneNumbers } = address;

  let phoneNumbers = null;

  if (isClubcard) {
    phoneNumbers = telephoneNumbers && (
      <WrapTextLabel className='telephone-number'>
        {`${getLocalePhrase(`pages.landing.telephone.phone`)}: ${telephoneNumbers[0].value}`}
      </WrapTextLabel>
    );
  } else {
    phoneNumbers =
      telephoneNumbers &&
      telephoneNumbers.map((tele, idx) => (
        <WrapTextLabel className={`telephone-number-${idx.toString()}`} key={`telephone-number-${idx.toString()}`}>
          {`${getLocalePhrase(`pages.landing.telephone.${tele.label.toLocaleLowerCase()}`)}: ${
            tele.value
          }`}
        </WrapTextLabel>
      ));
  }

  return (
    <AddressPanelStyled additional={!!additional}>
      {label && <WrapTextSubHeading className='nickname'>{label}</WrapTextSubHeading>}
      {addressLines.map(({ value }, idx) => (
        <WrapTextLabel className={`address-line-${idx.toString()}`} key={`address-line-${idx.toString()}`}>{value}</WrapTextLabel>
      ))}
      {postTown && <WrapTextLabel className='town'>{postTown}</WrapTextLabel>}
      {postCode && <WrapTextLabel className='postcode'>{postCode}</WrapTextLabel>}
      {phoneNumbers}
    </AddressPanelStyled>
  );
}

AddressPanel.propTypes = {
  address: PropTypes.object.isRequired,
  isClubcard: PropTypes.bool,
  additional: PropTypes.bool,
};
