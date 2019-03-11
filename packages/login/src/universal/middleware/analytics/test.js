describe('Analytics middleware', () => {
  let analyticsMiddleware;
  let mockTrackEvent;
  let mockGetPageName
  let mockGetAnalyticsPayload;
  let mockClearAnalyticsPayload;
  const mockPageName = 'mock-page-name';
  const mockPageNameWithUpdate = 'mock-page-name-with-update';
  const mockPayload = 'mock-payload';

  beforeAll(() => {
    mockTrackEvent = jest.fn();
    mockGetPageName = jest.fn()
      .mockReturnValueOnce(mockPageName)
      .mockReturnValueOnce(mockPageName)
      .mockReturnValueOnce(mockPageNameWithUpdate)
      .mockReturnValueOnce(mockPageNameWithUpdate);
    mockGetAnalyticsPayload = jest.fn(() => mockPayload);
    mockClearAnalyticsPayload = jest.fn();

    jest.doMock('../../../utils/analytics', () => ({
      trackEvent: mockTrackEvent,
      getPageName: mockGetPageName,
      getAnalyticsPayload: mockGetAnalyticsPayload,
      clearAnalyticsPayload: mockClearAnalyticsPayload,
    }));

    analyticsMiddleware = require('./').default;
  });

  afterEach(() => {
    mockTrackEvent.mockClear();
    mockClearAnalyticsPayload.mockClear();
  });

  // Simulate invoking middleware function
  const create = () => {
    const store = {
      getState: jest.fn(() => ({})),
      dispatch: jest.fn(),
    };
    const next = jest.fn();

    const invoke = (action) => analyticsMiddleware(store)(next)(action);

    return { store, next, invoke };
  };

  describe('LOCATION_CHANGE action', () => {
    describe('first one', () => {
      const action = {
        type: '@@router/LOCATION_CHANGE',
        payload: {
          location: {
            pathname: '/mock/path',
          },
        },
      };

      it('should not call trackEvent', () => {
        const { invoke } = create();

        invoke(action);

        expect(mockTrackEvent).not.toHaveBeenCalled();
      });

      it('should call next', () => {
        const { next, invoke } = create();

        invoke(action);

        expect(next).toHaveBeenCalledWith(action);
      });
    });

    describe('second one', () => {
      const action = {
        type: '@@router/LOCATION_CHANGE',
        payload: {
          location: {
            pathname: '/mock/path',
          },
        },
      };

      it('should call trackEvent correctly', () => {
        const { invoke } = create();

        invoke(action);

        expect(mockTrackEvent).toHaveBeenCalledWith(
          'login',
          'page_name',
          mockPageName
        );
      });

      it('should call next', () => {
        const { next, invoke } = create();

        invoke(action);

        expect(next).toHaveBeenCalledWith(action);
      });
    });
  })
});
