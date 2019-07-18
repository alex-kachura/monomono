import { useEffect, useRef } from 'react';
import { connect } from 'formik';

export const Analytics = connect(({ onErrors, formik }) => {
  const isSubmittingRef = useRef(false);

  useEffect(() => {
    if (
      isSubmittingRef.current === true &&
      formik.isSubmitting === false &&
      Object.keys(formik.errors).length
    ) {
      onErrors(formik.errors);
    }

    isSubmittingRef.current = formik.isSubmitting;
  });

  return null;
});
