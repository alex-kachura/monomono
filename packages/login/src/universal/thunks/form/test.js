import { fromJS } from 'immutable';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as types from '../../actions';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
let invalidFields;

const mockValidationService = {
  validateField: jest.fn((val) => val.fields.find((field) => field.name === val.fieldName)),
  validateAllFields: jest.fn((fields) => fields),
};

const mockValidationUtils = {
  getFocusFieldId: jest.fn(() => 'mockFieldId'),
  getField: jest.fn((fields, fieldName) => fields.find((field) => field.get('name') === fieldName)),
};

function resetMocks() {
  mockValidationService.validateField.mockClear();
  mockValidationService.validateAllFields.mockClear();
  mockValidationUtils.getFocusFieldId.mockClear();
}

const mockFields = fromJS([
  {
    name: 'postcode',
    id: 'postcode',
    hasBlurred: false,
    isValid: true,
    value: 'DA1 1QT',
    constraints: [],
    triggerValidation: 'addressLine1',
  },
  {
    name: 'addressLine1',
    id: 'address-line-1',
    hasBlurred: false,
    isValid: true,
    value: '',
    constraints: [],
  },
]);

describe('Form thunks', () => {
  let store;
  let actions;
  let result; // eslint-disable-line no-unused-vars

  beforeEach(() => {
    jest.doMock('@oneaccount/form-validation', () => mockValidationService);
    jest.doMock('../../../utils/validation', () => mockValidationUtils);

    actions = require('./');
  });

  afterEach(() => {
    jest.resetModules();
  });

  describe('#validateAll', () => {
    afterEach(() => {
      resetMocks();
    });

    it('should dispatch VALIDATE_FIELDS correctly if the form is valid', () => {
      store = mockStore(
        fromJS({
          payload: {
            form: {
              fields: mockFields,
              formSubmitted: true,
            },
          },
          config: {
            basePath: '/account/',
            appPath: '/manage',
          },
          locale: 'en-GB',
        }),
      );

      result = store.dispatch(actions.validateAll());

      expect(store.getActions().length).toBe(1);
      expect(store.getActions()[0]).toEqual({
        type: 'VALIDATE_FIELDS',
        fields: mockFields.toJS(),
        isFormValid: true,
        focusFieldId: 'mockFieldId',
      });
    });

    it('should dispatch VALIDATE_FIELDS correctly if form is invalid', () => {
      invalidFields = fromJS([
        {
          name: 'postcode',
          id: 'postcode',
          hasBlurred: false,
          isValid: true,
          value: 'DA1 1QT',
          constraints: [],
        },
        {
          name: 'addressLine1',
          id: 'address-line-1',
          hasBlurred: false,
          isValid: false,
          value: '',
          constraints: [],
        },
      ]);

      store = mockStore(
        fromJS({
          payload: {
            form: {
              fields: invalidFields,
              formSubmitted: true,
            },
          },
          config: {
            basePath: '/account/',
            appPath: '/manage',
          },
          locale: 'en-GB',
        }),
      );

      result = store.dispatch(actions.validateAll());

      expect(store.getActions().length).toBe(1);
      expect(store.getActions()[0]).toEqual({
        type: types.VALIDATE_FIELDS,
        fields: invalidFields.toJS(),
        isFormValid: false,
        focusFieldId: 'mockFieldId',
      });
    });

    it('should dispatch VALIDATE_FIELDS correctly if a field has server error', () => {
      invalidFields = fromJS([
        {
          name: 'postcode',
          id: 'postcode',
          hasBlurred: false,
          isValid: false,
          value: 'EC1R 5SR',
          serverErrorText: 'Please enter a valid postcode',
          constraints: [],
        },
        {
          name: 'addressLine1',
          id: 'address-line-1',
          hasBlurred: false,
          isValid: true,
          value: 'Line 1',
          constraints: [],
        },
      ]);

      store = mockStore(
        fromJS({
          payload: {
            form: {
              fields: invalidFields,
              formSubmitted: true,
            },
          },
          config: {
            basePath: '/account/',
            appPath: '/manage',
          },
          locale: 'en-GB',
        }),
      );

      result = store.dispatch(actions.validateAll());

      expect(store.getActions().length).toBe(1);
      expect(store.getActions()[0]).toEqual({
        type: types.VALIDATE_FIELDS,
        fields: invalidFields.toJS(),
        isFormValid: false,
        focusFieldId: 'mockFieldId',
      });
    });
  });

  describe('updateField', () => {
    it('should dispatch UPDATE_FIELD', () => {
      store = mockStore(
        fromJS({
          payload: {
            form: {
              fields: mockFields,
              formSubmitted: true,
            },
          },
          config: {
            basePath: '/account/',
            appPath: '/manage',
          },
          locale: 'en-GB',
        }),
      );

      result = store.dispatch(
        actions.updateField({
          fieldName: 'postcode',
          value: 'test',
        }),
      );

      expect(store.getActions().length).toBe(1);
      expect(store.getActions()[0]).toEqual({
        type: 'UPDATE_FIELD',
        updatedField: fromJS({
          name: 'postcode',
          id: 'postcode',
          hasBlurred: false,
          isValid: true,
          value: 'test',
          constraints: [],
          triggerValidation: 'addressLine1',
        }),
      });
    });
  });

  describe('#fieldBlur', () => {
    it('should call the validate action with correct field data', () => {
      store = mockStore(
        fromJS({
          payload: {
            form: {
              fields: mockFields,
              formSubmitted: true,
            },
          },
          config: {
            basePath: '/account/',
            appPath: '/manage',
          },
          locale: 'en-GB',
        }),
      );

      store.dispatch(
        actions.fieldBlur({
          doValidation: true,
          fields: mockFields,
          fieldName: 'postcode',
          value: 'a value',
          hasBlurred: false,
          formSubmitted: false,
        }),
      );

      expect(store.getActions()[0]).toEqual({
        type: types.VALIDATE_FIELD,
        updatedField: mockFields.toJS()[0],
      });
    });
  });

  describe('#fieldChange', () => {
    beforeEach(() => {
      resetMocks();

      store = mockStore(
        fromJS({
          payload: {
            form: {
              fields: mockFields,
              formSubmitted: true,
            },
          },
          config: {
            basePath: '/account/',
            appPath: '/manage',
          },
          locale: 'en-GB',
        }),
      );

      store.dispatch(
        actions.fieldChange({
          doValidation: true,
          fieldName: 'postcode',
          value: 'a value',
          hasBlurred: true,
        }),
      );
    });

    it('should call the validate action with correct field data', () => {
      expect(store.getActions()[0]).toEqual({
        type: types.VALIDATE_FIELD,
        updatedField: mockFields.toJS()[0],
      });
    });

    it('should validate the specified target field', () => {
      expect(store.getActions()[1]).toEqual({
        type: types.VALIDATE_FIELD,
        updatedField: mockFields.toJS()[1],
      });
    });
  });
});
