import Immutable from 'immutable';
import * as types from '../../actions';
import formReducer from './';

describe('Form reducer', () => {
  const mockFocusId = 'mockFocusId';
  let mockFields = Immutable.fromJS([
    {
      name: 'hello123',
      value: 'some-val',
    },
    {
      name: 'test123',
      value: 'test-val',
    },
  ]);
  const mockField = Immutable.fromJS({
    name: 'test123',
    value: 'new-value',
  });
  const updatedFields = Immutable.fromJS([
    {
      name: 'hello123',
      value: 'some-val',
    },
    {
      name: 'test123',
      value: 'new-value',
    },
  ]);
  const mockAddressId = 'mockAddressId';
  let result;
  let state;

  describe('VALIDATE_FIELD action', () => {
    beforeEach(() => {
      mockFields = Immutable.fromJS([
        {
          name: 'hello123',
          value: 'some-val',
        },
        {
          name: 'test123',
          value: 'test-val',
        },
      ]);

      state = Immutable.fromJS({
        fields: mockFields,
        formSubmitted: false,
        isFormValid: true,
        focusFieldId: mockFocusId,
        addressId: mockAddressId,
        isPrimary: true,
      });
    });

    it('should return correct new state', () => {
      result = formReducer(state, {
        type: types.VALIDATE_FIELD,
        updatedField: mockField,
        focusFieldId: mockFocusId,
      });

      expect(result).toEqual(
        Immutable.fromJS({
          fields: updatedFields,
          formSubmitted: false,
          isFormValid: true,
          focusFieldId: mockFocusId,
        }),
      );
    });
  });

  describe('UPDATE_FIELD action', () => {
    beforeEach(() => {
      mockFields = Immutable.fromJS([
        {
          name: 'text-input1',
          value: 'some-val',
        },
        {
          name: 'text-input2',
          value: 'some-val',
        },
      ]);

      state = Immutable.fromJS({
        fields: mockFields,
        formSubmitted: false,
        isFormValid: true,
      });
    });

    it('should return correct new state', () => {
      const modifiedField = Immutable.fromJS({
        name: 'text-input2',
        value: 'modified-value',
      });

      const expectedFields = Immutable.fromJS([
        {
          name: 'text-input1',
          value: 'some-val',
        },
        {
          name: 'text-input2',
          value: 'modified-value',
        },
      ]);

      result = formReducer(state, {
        type: types.UPDATE_FIELD,
        updatedField: modifiedField,
      });

      expect(result).toEqual(
        Immutable.fromJS({
          fields: expectedFields,
          formSubmitted: false,
          isFormValid: true,
          focusFieldId: null,
        }),
      );
    });
  });

  describe('UPDATE_FIELDS action', () => {
    beforeEach(() => {
      mockFields = Immutable.fromJS([
        {
          name: 'hello123',
          value: 'some-val',
        },
        {
          name: 'test123',
          value: 'test-val',
        },
      ]);

      state = Immutable.fromJS({
        fields: mockFields,
        formSubmitted: false,
        isFormValid: true,
        focusFieldId: mockFocusId,
        addressId: mockAddressId,
        isPrimary: true,
      });
    });

    it('should return correct new state', () => {
      result = formReducer(state, {
        type: types.UPDATE_FIELDS,
        updatedFields: mockField,
      });

      expect(result).toEqual(
        Immutable.fromJS({
          fields: mockField,
          formSubmitted: false,
          isFormValid: true,
          focusFieldId: null,
        }),
      );
    });
  });

  describe('FOCUS_FIELD action', () => {
    beforeEach(() => {
      mockFields = Immutable.fromJS([
        {
          name: 'hello123',
          value: 'some-val',
        },
        {
          name: 'test123',
          value: 'test-val',
        },
      ]);

      state = Immutable.fromJS({
        fields: mockFields,
        formSubmitted: false,
        isFormValid: true,
        focusFieldId: mockFocusId,
        addressId: mockAddressId,
        isPrimary: true,
      });
    });

    it('should return correct new state', () => {
      result = formReducer(state, {
        type: types.FOCUS_FIELD,
        focusFieldId: 'some-field',
      });

      expect(result).toEqual(
        Immutable.fromJS({
          fields: mockFields,
          formSubmitted: false,
          isFormValid: true,
          focusFieldId: 'some-field',
        }),
      );
    });
  });
});
