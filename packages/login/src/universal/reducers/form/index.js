import Immutable from 'immutable';
import * as types from '../../actions';

const initialState = Immutable.fromJS({});

export default function formReducer(state = initialState, action) {
  const fields = state.get('fields');

  switch (action.type) {
    case types.VALIDATE_FIELD: {
      const oldFieldIndex = fields.findIndex(
        (field) => field.get('name') === action.updatedField.name,
      );

      const updatedField = Immutable.fromJS(action.updatedField);

      // replace old field with updated field in state
      return Immutable.fromJS({
        fields: fields.update(oldFieldIndex, () => updatedField),
        formSubmitted: state.get('formSubmitted'),
        isFormValid: state.get('isFormValid'),
        focusFieldId: action.focusFieldId || null,
      });
    }
    case types.VALIDATE_FIELDS: {
      return Immutable.fromJS({
        fields: action.fields,
        formSubmitted: true,
        isFormValid: action.isFormValid,
        focusFieldId: action.focusFieldId,
      });
    }
    case types.UPDATE_FIELD: {
      const oldFieldIndex = fields.findIndex(
        (field) => field.get('name') === action.updatedField.get('name'),
      );

      // replace old field with updated field in state
      return Immutable.fromJS({
        fields: fields.update(oldFieldIndex, () => action.updatedField),
        formSubmitted: state.get('formSubmitted'),
        isFormValid: state.get('isFormValid'),
        focusFieldId: action.focusFieldId || null,
      });
    }
    case types.UPDATE_FIELDS:
      return Immutable.fromJS({
        fields: action.updatedFields,
        formSubmitted: state.get('formSubmitted'),
        isFormValid: state.get('isFormValid'),
        focusFieldId: null,
      });
    case types.DISABLE_FIELDS: {
      // disable a set of fields based on indexes and enable the rest
      const updatedFields = fields.map((field, index) =>
        field.set('enabled', !action.fieldIndexes.includes(index)),
      );

      return Immutable.fromJS({
        fields: updatedFields,
        formSubmitted: state.get('formSubmitted'),
        isFormValid: state.get('isFormValid'),
      });
    }
    case types.FOCUS_FIELD:
      return Immutable.fromJS({
        fields: state.get('fields'),
        formSubmitted: state.get('formSubmitted'),
        isFormValid: state.get('isFormValid'),
        focusFieldId: action.focusFieldId,
      });
    case types.RESET_FORM:
      return initialState;
    default:
      return state;
  }
}
