describe('Fetch data middleware', () => {
  let fetchDataMiddleware;
  let mockGetData;

  beforeAll(() => {
    mockGetData = jest.fn();
    jest.doMock('../../thunks/get-data', () => ({ getData: mockGetData }));

    fetchDataMiddleware = require('./').default;
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

    const invoke = (action) => fetchDataMiddleware(store)(next)(action);

    return { store, next, invoke };
  };

  it('should not call getData for first location change', () => {
    const { invoke } = create();
    const action = {
      type: '@@router/LOCATION_CHANGE',
      payload: {
        location: {
          pathname: '/mock/path',
        },
      },
    };

    invoke(action);

    expect(mockGetData).not.toHaveBeenCalled();
  });

  it('should call getData for second location change', () => {
    const { invoke } = create();
    const action = {
      type: '@@router/LOCATION_CHANGE',
      payload: {
        location: {
          pathname: '/mock/path',
        },
      },
    };

    invoke(action);

    expect(mockGetData).toHaveBeenCalledWith('/mock/path');
  });

  it('should pass through for non-location change action', () => {
    const { next, invoke } = create();
    const action = { type: 'TEST' };

    invoke(action);

    expect(mockGetData).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(action);
  });
});
