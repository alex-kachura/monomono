import { useCallback, useState, useEffect, useRef } from 'react';
import get from 'lodash/get';
import { useAppConfig, useFetch } from '@oneaccount/react-foundations';

export const useAddress = (formik, fields, onError) => {
  const selectRef = useRef();
  const postcodeRef = useRef();
  const { config, region } = useAppConfig();
  const { data, loading, error, load } = useFetch({
    throwErrors: false,
  });

  const [addresses, setAddresses] = useState(data);
  const { values, originalErrors, setFieldValue, setFieldError } = formik;
  const [isFindAddress, setFindAddress] = useState(!values.postcode);
  const handleSelect = useCallback(
    (e) => {
      const address = addresses.find(({ id }) => e.target.value === id);

      fields.forEach(({ name, valuePath }) => {
        if (name.includes('address-line')) {
          const addressLine = address.addressLines.find(
            ({ lineNumber }) => lineNumber === parseInt(valuePath, 10),
          );

          if (addressLine) {
            setFieldValue(name, addressLine.value);
          } else {
            setFieldValue(name, '');
          }
        } else {
          setFieldValue(name, get(address, valuePath, undefined));
        }
      });

      setAddresses(null);
      setFindAddress(false);
    },
    [addresses],
  );

  const handleFindAddress = useCallback(
    () => {
      // eslint-disable-next-line
      if (values.postcode && !originalErrors.postcode) {
        load(
          `${config[region].externalApps.postcodeLookup}?postcode=${values.postcode.replace(
            /\s/,
            '',
          )}`,
        );
      } else if (postcodeRef.current) {
        postcodeRef.current.focus();
      }
    },
    [load, values.postcode, originalErrors.postcode],
  );

  const handleAddressManually = useCallback(() => {
    setFindAddress(false);
  });

  useEffect(
    () => {
      setAddresses(data);
    },
    [data],
  );

  useEffect(
    () => {
      if (selectRef.current) {
        selectRef.current.focus();
      }
    },
    [addresses],
  );

  useEffect(
    () => {
      if (error && error.response.status === 404) {
        setFieldError('postcode', 'address.fields.postcode.error');
      } else if (error && onError) {
        onError(error);
      }
    },
    [error],
  );

  return {
    postcodeRef,
    selectRef,
    addresses,
    loading,
    isFindAddress,
    handleSelect,
    handleFindAddress,
    handleAddressManually,
  };
};
