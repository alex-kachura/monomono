import { DATA_ARRIVED } from '../../actions';

describe('Handle unauthenticated middleware', () => {
  let middleware;
  let mockGetData;

  const locationSpy = jest.fn();

  // eslint-disable-next-line accessor-pairs
  Reflect.defineProperty(window, 'location', {
    set: locationSpy,
    enumerable: true,
    configurable: true,
  });

  beforeEach(() => {
    mockGetData = jest.fn();

    middleware = require('./').default;
  });

  afterEach(() => {
    mockGetData.mockClear();
  });

  // Simulate invoking middleware function
  const create = () => {
    const store = {
      getState: jest.fn(() => ({})),
      dispatch: jest.fn(),
    };
    const next = jest.fn();

    const invoke = (action) => middleware(store)(next)(action);

    return { store, next, invoke };
  }

  describe('DATA_ARRIVED dispatched', () => {
    it('should passthrough and call next', () => {
      const { next, invoke } = create();
      const action = {
        type: DATA_ARRIVED,
        response: {
          status: 200,
        },
      };

      invoke(action);

      expect(next).toHaveBeenCalledWith(action);
    });
  });

  describe('DATA_ARRIVED dispatched and 401 status', () => {
    it('should set window location correctly', () => {
      const { invoke } = create();
      const action = {
        type: DATA_ARRIVED,
        response: {
          status: 401,
          location: '/some/location',
        },
      };

      invoke(action);

      expect(locationSpy).toHaveBeenCalledWith('/some/location');
    });
  });
});
