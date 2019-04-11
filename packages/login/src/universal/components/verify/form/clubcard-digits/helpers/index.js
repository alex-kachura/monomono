import { useRef, useCallback, useEffect } from 'react';

export function getNumberProps(inputType) {
  return inputType === 'number' ? {
    min: "0",
    inputMode: "numeric",
    pattern: "[0-9]*",
  } : {};
}

export function getFormErrorMsg(formik) {
  let formErrorMsg;

  if ((formik.errors && formik.submitCount) || Object.keys(formik.initialErrors).length) {
    Object.keys(formik.errors).forEach((key) => {
      formErrorMsg = formik.errors[key];

      return false;
    });
  }

  return formErrorMsg;
}

function focusField(fields, fieldIndex, submitRef) {
  if (fields[fieldIndex]) {
    const { id } = fields[fieldIndex];
    const element = document.getElementById(id);

    if (element) {
      element.focus();
      element.select();
    }
  }

  if (fieldIndex === fields.length) {
    submitRef.current.focus();
  }
}

function isValidDigit(value) {
  return /^(?:[0-9])$/.test(value) || value === '';
}

function getFieldIndex(fields, fieldName) {
  return fields.findIndex(({ name }) => fieldName === name);
}

export function useFieldLogic(fields, formik, submitRef) {
  const currentFieldRef = useRef(0);

  // Filter to only allow numbers on change
  const handleChange = useCallback((e) => {
    if (isValidDigit(e.target.value)) {

      // Update React's reference to the current field index
      currentFieldRef.current = getFieldIndex(fields, e.target.name);

      // If a value was entered, update reference to next field's index
      if (e.target.value !== '') {
        currentFieldRef.current++;
      }

      formik.handleChange(e);
    }
  }, []);

  const handleKeyDown = useCallback((e) => {

    // Get React's reference to current field index
    currentFieldRef.current = getFieldIndex(fields, e.target.name);

    if (e.key === 'Backspace' && formik.values[e.target.name] === '') {
      // We need to prevent the default action of Backspace deleting a character.
      // The reason is that we're going to focus on the previous input given
      // that the current input is empty.
      // Otherwise, the previous input's value would be cleared by this event
      e.preventDefault();

      // Point at previous field
      currentFieldRef.current--;

      // Focus on given field
      focusField(fields, currentFieldRef.current, submitRef);
    }

    // If keyed value equals existing value of input
    if (e.key === formik.values[e.target.name]) {

      // Point at next field
      currentFieldRef.current++;

      // Focus on given field
      focusField(fields, currentFieldRef.current, submitRef);
    }

  }, [formik.values]);

  const handleClick = useCallback((e) => {
    e.currentTarget.select();
  }, []);

  // Handle focusing on first field or next one after typing a value.
  // Called on initial render and for every form value change.
  useEffect(() =>
    focusField(fields, currentFieldRef.current, submitRef),
    [formik.values]
  );

  return { handleChange, handleKeyDown, handleClick };
}
