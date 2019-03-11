import { fromJS } from 'immutable';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as types from '../../actions';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('Save data thunk', () => {
  let store;
  let actions;
  let mockFetch;
  let mockPush;
  const mockRootPath = '/mock-path';
  const mockLocation = 'fiji-please';
  const mockValidationService = {
    validateAllFields: jest.fn((fields) => fields),
  };
  const mockValidationUtils = {
    getFocusFieldId: jest.fn(() => 'mockFieldId'),
  };
  const validFields = [
    {
      value: 'mock-title',
      name: 'title',
      isValid: true,
    },
    {
      value: 'mock-first-name',
      name: 'first-name',
      isValid: true,
    },
    {
      value: 'mock-last-name',
      name: 'last-name',
      isValid: true,
    },
    {
      value: 'mock-middle-initials',
      name: 'middle-initials',
      isValid: true,
    },
  ];
  const dataType = 'sampleData';

  function createStoreValidFields(fields) {
    store = mockStore(
      fromJS({
        payload: {
          form: {
            fields,
          },
        },
        config: {
          basePath: 'base-path',
          appPath: 'app-path',
        },
        rootPath: mockRootPath,
        locale: 'en-GB',
        getLocalePhrase: (key) => key,
      }),
    );
  }

  afterEach(() => {
    jest.resetModules();
    mockFetch.mockClear();
    mockValidationService.validateAllFields.mockClear();
    mockValidationUtils.getFocusFieldId.mockClear();
  });

  describe('edit', () => {
    describe('success response', () => {
      const successPayload = { updated: true, payload: { foo: 'bar' } };

      beforeEach(async () => {
        mockPush = jest.fn(() => ({ type: 'PUSH' }));

        createStoreValidFields(validFields);

        mockFetch = jest.fn(() =>
          Promise.resolve({
            ok: true,
            status: 200,
            headers: { get: () => mockLocation },
            json: async () => successPayload,
          }),
        );

        jest.doMock('connected-react-router', () => ({ push: mockPush }));
        jest.doMock('@oneaccount/form-validation', () => mockValidationService);
        jest.doMock('../../../utils/fetch', () => mockFetch);
        jest.doMock('../../../utils/validation', () => mockValidationUtils);

        actions = require('./');

        await store.dispatch(actions.saveData(dataType));
      });

      it('should validate fields', () => {
        expect(mockValidationService.validateAllFields).toHaveBeenCalledWith(validFields);
      });

      it('should dispatch 3 actions', () => {
        expect(store.getActions().length).toEqual(3);
      });

      it('should dispatch DATA_LOADING action', () => {
        expect(store.getActions()[0]).toEqual({
          type: types.DATA_LOADING,
        });
      });

      it('should call fetch correctly', () => {
        expect(mockFetch).toHaveBeenCalledWith({
          method: 'POST',
          url: '/mock-path/edit',
          body: {
            title: 'mock-title',
            'first-name': 'mock-first-name',
            'last-name': 'mock-last-name',
            'middle-initials': 'mock-middle-initials',
          },
        });
      });

      it('should dispatch DATA_ARRIVED action', () => {
        expect(store.getActions()[1]).toEqual({
          type: types.DATA_ARRIVED,
          payload: successPayload.payload,
          response: {
            status: 200,
            location: mockLocation,
          },
        });
      });

      it('should dispatch push action', () => {
        expect(store.getActions()[2]).toEqual({
          type: 'PUSH',
        });
      });

      it('should call push correctly', () => {
        expect(mockPush).toHaveBeenCalledWith('/mock-path');
      });
    });

    describe('error response', () => {
      beforeEach(async () => {
        mockPush = jest.fn(() => ({ type: 'PUSH' }));

        createStoreValidFields(validFields);

        mockFetch = jest.fn(() =>
          Promise.resolve({
            ok: false,
            status: 200,
            headers: { get: () => mockLocation },
            json: async () => ({}),
          }),
        );

        jest.doMock('connected-react-router', () => ({ push: mockPush }));
        jest.doMock('@oneaccount/form-validation', () => mockValidationService);
        jest.doMock('../../../utils/fetch', () => mockFetch);
        jest.doMock('../../../utils/validation', () => mockValidationUtils);

        actions = require('./');

        await store.dispatch(actions.saveData(dataType));
      });

      it('should dispatch DATA_ARRIVED action', () => {
        expect(store.getActions()[1]).toEqual({
          type: types.DATA_ARRIVED,
          payload: {
            banner: {
              bannerType: 'error',
              title: 'banners.error.update.title',
              errorType: 'update',
            },
          },
          response: {
            status: 200,
            location: mockLocation,
          },
        });
      });
    });

    describe('fetch throws error', () => {
      beforeEach(async () => {
        mockPush = jest.fn(() => ({ type: 'PUSH' }));

        createStoreValidFields(validFields);

        mockFetch = jest.fn(() => Promise.reject());

        jest.doMock('connected-react-router', () => ({ push: mockPush }));
        jest.doMock('@oneaccount/form-validation', () => mockValidationService);
        jest.doMock('../../../utils/fetch', () => mockFetch);
        jest.doMock('../../../utils/validation', () => mockValidationUtils);

        actions = require('./');

        await store.dispatch(actions.saveData(dataType));
      });

      it('should dispatch DATA_ARRIVED action', () => {
        expect(store.getActions()[1]).toEqual({
          type: types.DATA_ARRIVED,
          payload: {
            banner: {
              bannerType: 'error',
              title: 'banners.error.update.title',
              errorType: 'update',
            },
          },
        });
      });
    });

    describe('401 response', () => {
      beforeEach(async () => {
        mockPush = jest.fn(() => ({ type: 'PUSH' }));

        createStoreValidFields(validFields);

        mockFetch = jest.fn(() =>
          Promise.resolve({
            ok: false,
            status: 401,
            headers: { get: () => mockLocation },
            json: async () => ({}),
          }),
        );

        jest.doMock('connected-react-router', () => ({ push: mockPush }));
        jest.doMock('@oneaccount/form-validation', () => mockValidationService);
        jest.doMock('../../../utils/fetch', () => mockFetch);
        jest.doMock('../../../utils/validation', () => mockValidationUtils);

        actions = require('./');

        await store.dispatch(actions.saveData(dataType));
      });

      it('should dispatch DATA_ARRIVED action', () => {
        expect(store.getActions()[1]).toEqual({
          type: types.DATA_ARRIVED,
          response: {
            status: 401,
            location: mockLocation,
          },
        });
      });
    });

    describe('invalid fields', () => {
      const invalidFields = [
        {
          value: 'mock-title',
          isValid: true,
        },
        {
          value: 'mock-first-name',
          isValid: false,
        },
        {
          value: 'mock-last-name',
          isValid: false,
        },
        {
          value: 'mock-middle-initials',
          isValid: true,
        },
      ];

      beforeEach(async () => {
        mockPush = jest.fn(() => ({ type: 'PUSH' }));

        store = mockStore(
          fromJS({
            payload: {
              form: {
                fields: invalidFields,
              },
            },
            config: {
              basePath: 'base-path',
              appPath: 'app-path',
            },
            locale: 'en-GB',
            getLocalePhrase: (key) => key,
          }),
        );

        mockFetch = jest.fn(() =>
          Promise.resolve({
            ok: true,
            status: 200,
            headers: { get: () => mockLocation },
            json: async () => ({}),
          }),
        );

        jest.doMock('connected-react-router', () => ({ push: mockPush }));
        jest.doMock('@oneaccount/form-validation', () => mockValidationService);
        jest.doMock('../../../utils/fetch', () => mockFetch);
        jest.doMock('../../../utils/validation', () => mockValidationUtils);

        actions = require('./');

        await store.dispatch(actions.saveData(dataType));
      });

      it('should dispatch one action', () => {
        expect(store.getActions().length).toEqual(1);
      });

      it('should dispatch VALIDATE_FIELDS action', () => {
        expect(store.getActions()[0]).toEqual({
          type: types.VALIDATE_FIELDS,
          fields: invalidFields,
          isFormValid: false,
          focusFieldId: 'mockFieldId',
        });
      });
    });
  });
});
