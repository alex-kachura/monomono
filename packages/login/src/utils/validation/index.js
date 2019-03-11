export function getField(fields, fieldName) {
  if (!fields || !fieldName) {
    return undefined;
  }

  return fields.find((field) => field.get('name') === fieldName);
}

// get id of first error field to focus on
export function getFocusFieldId(fields, isFormValid) {
  if (isFormValid || !fields) {
    return null;
  }

  const field = fields.find(({ isValid }) => !isValid);

  return (field && field.id) || null;
}

// Return the error message of a field
// Server-side error takes priority over field constraint errors
export function getErrorMessage(field, getLocalePhrase) {
  if (field.get('isValid') === true) {
    return '';
  }

  if (field.get('serverErrorText')) {
    return field.get('serverErrorText');
  }

  const invalidConstraint = field.get('constraints').find((c) => c.get('isValid') === false);

  return getLocalePhrase(invalidConstraint.get('text'));
}
