import * as types from '../../actions';
import { validateField, validateAllFields } from '@oneaccount/form-validation';
import { getFocusFieldId, getField } from '../../../utils/validation';

function validate({ fieldName, value, hasBlurred, event }) {
  return (dispatch, getState) => {
    const form = getState().getIn(['payload', 'form']);

    return dispatch({
      type: types.VALIDATE_FIELD,
      updatedField: validateField({
        fields: form.get('fields').toJS(),
        fieldName,
        value,
        hasBlurred,
        formSubmitted: form.get('formSubmitted'),
        event,
      }),
    });
  };
}

export function validateAll() {
  return (dispatch, getState) => {
    const fields = getState()
      .getIn(['payload', 'form', 'fields'])
      .toJS();
    const updatedFields = validateAllFields(fields);
    const isFormValid = updatedFields.every((field) => field.isValid);

    return dispatch({
      type: types.VALIDATE_FIELDS,
      fields: updatedFields,
      isFormValid,
      focusFieldId: getFocusFieldId(updatedFields, isFormValid),
    });
  };
}

export function updateField({ fieldName, value }) {
  return (dispatch, getState) => {
    const fields = getState().getIn(['payload', 'form', 'fields']);
    const field = getField(fields, fieldName);
    const updatedField = field.set('value', value);

    dispatch({
      type: types.UPDATE_FIELD,
      updatedField,
    });
  };
}

export function fieldBlur({ fieldName, value, hasBlurred }) {
  return validate({ fieldName, value, hasBlurred, event: 'onBlur' });
}

export function fieldChange({ fieldName, value, hasBlurred }) {
  return (dispatch, getState) => {
    dispatch(validate({ fieldName, value, hasBlurred, event: 'onChange' }));

    const state = getState();
    const fields = state.getIn(['payload', 'form', 'fields']);
    const field = getField(fields, fieldName);
    const targetFieldName = field.get('triggerValidation');

    // if field we've just validated specifies that another field should be
    // validated (e.g. email address matching)
    if (targetFieldName) {
      // field to trigger validation on
      const fieldToTrigger = getField(fields, targetFieldName);

      return dispatch(
        validate({
          fieldName: fieldToTrigger.get('name'),
          value: fieldToTrigger.get('value'),
          hasBlurred: fieldToTrigger.get('hasBlurred'),
          event: 'onChange',
        }),
      );
    }

    return null;
  };
}
