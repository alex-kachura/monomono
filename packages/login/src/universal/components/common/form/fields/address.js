import React, { memo, useEffect, useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'formik';
import Dropdown from '@beans/dropdown';
import Text from './text';
import { ButtonStyled } from './styled';
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  .display-address {
    display: block;
  }

  .find-address {
    display: none;
  }

  .find-address.is-find-address {
    display: block;
  }

  .display-address.is-find-address {
    display: none;
  }

  html:not(.js) {
    .find-address {
      display: none;
    }
    .display-address.is-find-address {
      display: block;
    }
  }
`;

const useFetch = (url, { autoLoad = true, ...opts } = {}) => {
  const [result, setResult] = useState();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);

  const load = useCallback(async (newUrl, newOpts = opts) => {
    try {
      setLoading(true);

      const response = await fetch(newUrl || url, {
        ...newOpts,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          ...newOpts.headers,
        },
      });

      if (response.status === 404) {
        throw 'Address not found'; // eslint-disable-line
      }

      if (response.status >= 200 && response.status < 300) {
        setResult(await response.json());
      }

      setLoading(false);
      setError(null);
    } catch (err) {
      setLoading(false);
      setError(err);
      setResult(null);
    }
  }, []);

  useEffect(() => {
    if (autoLoad) {
      load();
    }
  }, []);
  if (autoLoad) {
    return [result, loading, error];
  }

  return [result, loading, error, load];
};

const useAddress = () => {
  const [result, loading, error, load] = useFetch(null, { autoLoad: false });

  const loadAddress = useCallback(
    (postalcode) => {
      load(`/account/en-GB/address/addresses?postcode=${postalcode.split(' ').join('')}`);
    },
    [load],
  );

  return [result, loading, error, loadAddress];
};

function Address({ formik }) {
  const { values, setFieldValue } = formik;
  const [isFindAddress, setFindAddress] = useState(true);
  const [addresses, loading, error, loadAddress] = useAddress();
  const handleSelect = useCallback(
    (e) => {
      const address = addresses.find(({ id }) => e.target.value === id);

      setFieldValue('address-id', address.id);
      address.addressLines.forEach(({ lineNumber, value }) => {
        setFieldValue(`address-line${lineNumber}`, value);
      });
      setFieldValue('town', address.postTown);
      setFieldValue('postcode', address.postcode);
      setFindAddress(false);
    },
    [addresses],
  );

  const handleFindAddress = useCallback(() => {
    setFindAddress(true);
    loadAddress(values.postcode);
  }, [loadAddress, values.postcode]);

  const handleAddressManually = useCallback(() => {
    setFindAddress(false);
  });

  useEffect(() => {
    if (!values.postcode) {
      setFindAddress(true);
    }
  }, []);

  return (
    <React.Fragment>
      <GlobalStyle />
      <Text id="postcode" name="postcode" label="Postal Code" required />
      <ButtonStyled onClick={handleFindAddress} className="find-address is-find-address">
        Find Address
      </ButtonStyled>
      <div className={`find-address${isFindAddress ? ` is-find-address` : ''}`}>
        <br />
        {loading && 'loading...'} <br />
        {error && `Error: ${error}`} <br />
        {!loading && addresses && (
          <Dropdown onChange={handleSelect}>
            <option value={-1}>Please select your address</option>
            {addresses.map(({ id, addressLines }) => (
              <option key={id} value={id}>
                {addressLines.map(({ value }) => value).join(', ')}
              </option>
            ))}
          </Dropdown>
        )}
        <br />
        <a onClick={handleAddressManually}>Enter Address Manually</a>
        <br />
      </div>
      <div className={`display-address${isFindAddress ? ` is-find-address` : ''}`}>
        <Text id="address-line1" name="address-line1" label="Address Line 1" required />
        <Text id="address-line2" name="address-line2" label="Address Line 2" />
        <Text id="address-line3" name="address-line3" label="Address Line 3" />
        <Text id="town" name="town" label="town" required />
      </div>
    </React.Fragment>
  );
}

Address.propTypes = {
  formik: PropTypes.object.isRequired,
};

export default connect(memo(Address));
