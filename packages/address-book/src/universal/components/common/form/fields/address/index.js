import React, { memo, useCallback } from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';
import { connect } from 'formik';
import Dropdown from '@beans/dropdown';
import Button from '@beans/button';
import Text from '../text';
import Postcode from './postcode';
import { useAddress } from './helpers';
import { useAppConfig, LocalePhrase } from '@oneaccount/react-foundations';
import { GlobalStyle } from './styled';

function AddressDropdown({ addresses, className, handleSelect, handleAddressManually }) {
  const { getLocalePhrase } = useAppConfig();

  return (
    <React.Fragment>
      {addresses && (
        <Dropdown className={className} onChange={handleSelect}>
          <option value={-1}>{getLocalePhrase('address.select-address')}</option>
          {addresses.map(({ id, addressLines }) => (
            <option key={id} value={id}>
              {addressLines.map(({ value }) => value).join(', ')}
            </option>
          ))}
        </Dropdown>
      )}
      <Button onClick={handleAddressManually} variant="link">
        <LocalePhrase id={'address.address-manually'} />
      </Button>
    </React.Fragment>
  );
}

function Address({ formik, fields, onError }) {
  const { getLocalePhrase } = useAppConfig();
  const {
    addresses,
    loading,
    isFindAddress,
    handleSelect,
    handleFindAddress,
    handleAddressManually,
    selectRef,
    postcodeRef,
  } = useAddress(formik, fields, onError);

  const handleChange = useCallback((e) => {
    if (e.target.name !== 'address-id') {
      formik.setFieldValue('address-id', '');
    }
    formik.handleChange(e);
  }, []);

  const content = [];

  fields.forEach(({ name, ...rest }) => {
    if (name === 'postcode') {
      content.push(
        <Postcode
          domRef={postcodeRef}
          key={name}
          name={name}
          loading={loading}
          className={'address-field postcode'}
          onChange={handleChange}
          handleFindAddress={handleFindAddress}
          {...rest}
        />,
      );
      content.push(
        addresses && (
          <Dropdown
            domRef={selectRef}
            key={'select'}
            className={'address-dropdown'}
            onChange={handleSelect}
          >
            <option value={-1}>{getLocalePhrase('address.select-address')}</option>
            {addresses.map(({ id, addressLines }) => (
              <option key={id} value={id}>
                {addressLines.map(({ value }) => value).join(', ')}
              </option>
            ))}
          </Dropdown>
        ),
      );
      content.push(
        <Button
          key={'manual-address'}
          className={'manual-link'}
          onClick={handleAddressManually}
          variant="link"
        >
          {getLocalePhrase('address.address-manually')}
        </Button>,
      );
    } else {
      content.push(
        <Text
          key={name}
          name={name}
          onChange={handleChange}
          className={'address-field'}
          {...rest}
        />,
      );
    }
  });

  return (
    <div className={cn('address', { 'is-find-address': isFindAddress })}>
      <GlobalStyle />
      {content}
    </div>
  );
}

Address.propTypes = {
  formik: PropTypes.object.isRequired,
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      xtype: PropTypes.string,
      name: PropTypes.string.isRequired,
    }),
  ).isRequired,
  onError: PropTypes.func,
};

AddressDropdown.propTypes = {
  addresses: PropTypes.array,
  className: PropTypes.string,
  handleSelect: PropTypes.func.isRequired,
  handleAddressManually: PropTypes.func.isRequired,
};

export default connect(memo(Address));
