import Immutable from 'immutable';
import config from 'config';
import handleUnauthenticated from './';

describe('#handleUnauthenticated', () => {
  let req;
  let res;
  let next;
  let responseType;
  const mockHost = 'mock-host';

  beforeEach(() => {
    req = {
      hostname: mockHost,
      baseUrl: '/base-url',
      url: '/url?param1=val&parm2=val',
      region: 'GB',
    };
    res = {
      format: (f) => f[responseType](),
      location: jest.fn(),
      status: jest.fn(() => ({ end: jest.fn() })),
      redirect: jest.fn(),
      data: Immutable.fromJS({}),
    };
    next = jest.fn();
  });

  afterEach(() => {
    res.location.mockClear();
    res.status.mockClear();
    res.redirect.mockClear();
    next.mockClear();
  });

  describe('authenticated', () => {
    beforeEach(() => {
      req.isAuthenticated = true;

      handleUnauthenticated(req, res, next);
    });

    it('should call next', () => {
      expect(next).toHaveBeenCalledWith();
    });
  });

  describe('unauthenticated', () => {
    const host = `${config.protocol}${mockHost}`;
    const loginUrl = config.GB.externalApps.login;
    const location = `${loginUrl}?from=${encodeURIComponent(
      host,
    )}%2Fbase-url%2Furl%3Fparam1%3Dval%26parm2%3Dval`; // eslint-disable-line max-len

    describe('json', () => {
      beforeEach(() => {
        responseType = 'json';
        handleUnauthenticated(req, res, next);
      });

      it('should call set response location correctly', () =>
        expect(res.location).toHaveBeenCalledWith(location));

      it('should send a 401 response', () => {
        expect(res.status).toHaveBeenCalledWith(401);
      });
    });

    describe('html', () => {
      beforeEach(() => {
        responseType = 'html';
        handleUnauthenticated(req, res, next);
      });

      it('should call res.redirect', () => expect(res.redirect).toHaveBeenCalledWith(location));
    });
  });
});
