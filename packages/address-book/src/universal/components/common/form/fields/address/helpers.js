import { useCallback, useState, useEffect, useRef } from 'react';
import get from 'lodash/get';
import { useAppConfig, useFetch } from '@oneaccount/react-foundations';
import { trackEvent, Analytics } from '../../../../../../utils/analytics';

export const useAddress = (formik, fields, onError) => {
  const selectRef = useRef();
  const postcodeRef = useRef();
  const { rootPath } = useAppConfig();

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

      trackEvent(Analytics.Address.DirectCallRules.ADDRESS_LOOKUP_SELECTED);

      setAddresses(null);
      setFindAddress(false);
    },
    [addresses],
  );

  const handleFindAddress = useCallback(() => {
    if (values.postcode && !originalErrors.postcode) {
      load(`${rootPath}/lookup?postcode=${values.postcode.replace(/\s/, '')}`);
    } else if (postcodeRef.current) {
      postcodeRef.current.focus();
    }
  }, [load, values.postcode, originalErrors.postcode]);

  const handleAddressManually = useCallback(() => {
    setFindAddress(false);
  });

  useEffect(() => {
    setAddresses(data);
    trackEvent(Analytics.Address.DirectCallRules.ADDRESS_LOOKUP_SUCCESS);
  }, [data]);

  useEffect(() => {
    if (selectRef.current) {
      selectRef.current.focus();
    }
  }, [addresses]);

  useEffect(() => {
    if (error && error.response.status === 404) {
      setFieldError('postcode', 'address.fields.postcode.error');
    } else if (error && onError) {
      onError(error);
    }

    trackEvent(Analytics.Address.DirectCallRules.ADDRESS_LOOKUP_FAILURE);
  }, [error]);

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
