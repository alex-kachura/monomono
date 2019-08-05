import config from 'config';
import handleAuthenticated from './';

describe('#handleAuthenticated', () => {
  let req;

  let res;

  let next;

  let mockRedirect;

  beforeEach(() => {
    mockRedirect = jest.fn();
    next = jest.fn();

    req = {
      region: 'GB',
      hostname: 'mock-hostname',
      baseUrl: '/mock-base-url',
      url: '/mock-url',
    };
    res = {
      redirect: mockRedirect,
    };
  });

  describe('request path is /verify', () => {
    describe('user is not authenticated', () => {
      it('should redirect to login correct', () => {
        req = {
          ...req,
          path: '/verify',
          isAuthenticated: false,
        };

        handleAuthenticated(req, res, next);

        expect(mockRedirect).toHaveBeenCalledWith(
          `${config[req.region].externalApps.login}?from=https%3A%2F%2Fmock-hostname%2Fmock-base-url%2Fmock-url`,
        );
      });
    });

    describe('user is authenticated', () => {
      it('should call next', () => {
        req = {
          ...req,
          path: '/verify',
          isAuthenticated: true,
        };

        handleAuthenticated(req, res, next);

        expect(next).toHaveBeenCalledWith();
      });
    });
  });

  describe('request path is not /verify', () => {
    it('should call next', () => {
      req = {
        ...req,
        path: '/verify',
        isAuthenticated: true,
      };

      handleAuthenticated(req, res, next);

      expect(next).toHaveBeenCalledWith();
    });
  });
});
