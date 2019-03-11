import { fromJS } from 'immutable';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as types from '../../actions';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('Get data thunk', () => {
  let store;
  let actions;
  let mockFetch;
  let mockEvent;
  const mockUrl = '/get/data/url';
  const mockLocation = 'fiji-please';

  afterEach(() => {
    jest.resetModules();
    mockFetch.mockClear();
  });

  beforeEach(() => {
    mockEvent = {
      preventDefault: jest.fn(),
    };

    store = mockStore(
      fromJS({
        config: {
          baseHost: { gb: 'https://www.testco.com' },
          basePath: 'base-path',
          appPath: 'app-path',
        },
        locale: 'en-GB',
        region: 'gb',
        getLocalePhrase: (key) => key,
      }),
    );
  });

  describe('success response', () => {
    const successPayload = { payload: 'mock-success-payload' };

    beforeEach(async () => {
      mockFetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          status: 200,
          headers: { get: () => mockLocation },
          json: async () => (successPayload),
        }),
      );

      jest.doMock('../../../utils/fetch', () => mockFetch);

      actions = require('./');

      await store.dispatch(
        actions.getData(mockUrl, mockEvent)
      );
    });

    it('should prevent default', () => {
      expect(mockEvent.preventDefault).toHaveBeenCalledWith();
    });

    it('should dispatch 2 actions', () => {
      expect(store.getActions().length).toEqual(2);
    });

    it('should dispatch DATA_LOADING action', () => {
      expect(store.getActions()[0]).toEqual({
        type: types.DATA_LOADING,
      });
    });

    it('should call fetch correctly', () => {
      expect(mockFetch).toHaveBeenCalledWith({
        url: mockUrl,
      });
    });

    it('should dispatch DATA_ARRIVED action', () => {
      expect(store.getActions()[1]).toEqual({
        type: types.DATA_ARRIVED,
        ...successPayload,
        response: {
          status: 200,
          location: mockLocation,
        }
      });
    });
  });

  describe('error response', () => {
    beforeEach(async () => {
      mockFetch = jest.fn(() =>
        Promise.resolve({
          ok: false,
          status: 500,
          headers: { get: () => mockLocation },
          json: async () => ({}),
        }),
      );

      jest.doMock('../../../utils/fetch', () => mockFetch);

      actions = require('./');

      await store.dispatch(
        actions.getData(mockUrl, mockEvent)
      );
    });

    it('should dispatch DATA_ARRIVED action', () => {
      expect(store.getActions()[1]).toEqual({
        type: types.DATA_ARRIVED,
        payload: {
          banner: {
            bannerType: 'error',
            title: 'banners.error.load.title',
            errorType: 'load',
          },
        },
        response: {
          status: 500,
          location: mockLocation,
        },
      });
    });
  });

  describe('fetch throws error', () => {
    beforeEach(async () => {
      mockFetch = jest.fn(() => Promise.reject());

      jest.doMock('../../../utils/fetch', () => mockFetch);

      actions = require('./');

      await store.dispatch(
        actions.getData(mockUrl, mockEvent)
      );
    });

    it('should dispatch DATA_ARRIVED action', () => {
      expect(store.getActions()[1]).toEqual({
        type: types.DATA_ARRIVED,
        payload: {
          banner: {
            bannerType: 'error',
            title: 'banners.error.load.title',
            errorType: 'load',
          },
        },
      });
    });
  });
});
