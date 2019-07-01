import React, { memo, useRef, useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'formik';
import { FormGroupStyled } from '../styled';
import BaseInput from '@beans/input';
import BeansTooltip from '@beans/tooltip';
import { BodyText } from '@beans/typography';
import { useAppConfig } from '@oneaccount/react-foundations';

const Input = memo(BaseInput);

function Tooltip({ tooltip, ...props }) {
  return (
    <BeansTooltip {...props}>
      <BodyText>{tooltip}</BodyText>
    </BeansTooltip>
  );
}

const MemoToolTip = memo(Tooltip);

const Text = memo(
  ({
    id,
    label,
    className,
    placeholder,
    hidden,
    required,
    name,
    error,
    value,
    onChange,
    onBlur,
    tooltip,
    autoFocus,
  }) => {
    const [open, setOpen] = useState(false);
    const [isMounted, setMount] = useState(false);
    const { getLocalePhrase } = useAppConfig();
    const localeError = error ? getLocalePhrase(error) : undefined;
    const helpLinkRef = useRef();
    const boundingRef = useRef();

    const handleTooltipChange = useCallback(({ open: isOpen }) => {
      setOpen(!isOpen);
    }, []);

    useEffect(() => {
      if (tooltip) {
        setMount(true);
      }
    }, []);

    const input = (
      <Input
        autoFocus={autoFocus}
        hidden={hidden}
        type="text"
        name={name}
        placeholder={placeholder}
        id={id}
        value={value}
        onChange={onChange} // eslint-disable-line react/jsx-handler-names
        onBlur={onBlur} // eslint-disable-line react/jsx-handler-names
      />
    );

    const formGroup = (
      <FormGroupStyled
        helpLinkText={tooltip && "What's this?"}
        helpLinkProps={{
          domRef: helpLinkRef,
        }}
        labelText={label}
        id={id}
        required={required}
        error={Boolean(error)}
        errorMessage={localeError}
        className={className}
      >
        {input}
      </FormGroupStyled>
    );

    if (hidden) {
      return input;
    }

    if (tooltip) {
      return (
        <div ref={boundingRef}>
          {formGroup}
          {isMounted && (
            <MemoToolTip
              open={open}
              onChange={handleTooltipChange}
              position="top"
              boundingRef={boundingRef}
              triggerRefs={helpLinkRef}
              tooltipWidth={660}
              tooltip={getLocalePhrase(tooltip)}
            />
          )}
        </div>
      );
    }

    return formGroup;
  },
);

function WrapText({ name, ...props }) {
  return (
    <Field name={name} {...props}>
      {({ field, form }) => <Text {...field} {...props} error={form.errors[name]} />}
    </Field>
  );
}

WrapText.propTypes = {
  name: PropTypes.string.isRequired,
};

Text.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  className: PropTypes.string,
  required: PropTypes.bool,
  hidden: PropTypes.bool,
  placeholder: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.any,
  error: PropTypes.string,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  tooltip: PropTypes.string,
  autoFocus: PropTypes.bool,
};

Tooltip.propTypes = {
  tooltip: PropTypes.string.isRequired,
};

export default memo(WrapText);
