import config from 'config';
import defaultHandleUnauthenticated, { handleUnauthenticatedFactory } from '.';
import { requestFactory, responseFactory, next, hostname } from '../../utils/test-helpers';

const verifyUrl = config.GB.externalApps.verify;
const loginUrl = config.GB.externalApps.login;
const customHandleUnauthenticated = handleUnauthenticatedFactory({
  redirectTo: () => verifyUrl,
});

describe.each([
  [
    '#handleUnauthenticated',
    {
      handleUnauthenticated: defaultHandleUnauthenticated,
      redirectTo: loginUrl,
    },
  ],
  [
    '#customHandleUnauthenticated',
    {
      handleUnauthenticated: customHandleUnauthenticated,
      redirectTo: verifyUrl,
    },
  ],
])('%s', (name, { handleUnauthenticated, redirectTo }) => {
  describe('authenticated', () => {
    const req = requestFactory({
      isAuthenticated: true,
    });
    const res = responseFactory();

    beforeAll(() => {
      handleUnauthenticated(req, res, next);
    });

    it('should call next', () => {
      expect(next).toHaveBeenCalledWith();
    });

    afterAll(() => {
      jest.clearAllMocks();
    });
  });

  describe('unauthenticated', () => {
    const host = `${config.protocol}${hostname}`;
    const location = `${redirectTo}?from=${encodeURIComponent(
      host,
    )}%2Fbase-url%2Furl%3Fparam1%3Dval%26param2%3Dval`;

    describe.each(['html', 'json'])(`[ResponseType: %s]`, (responseType) => {
      const req = requestFactory();
      const res = responseFactory({ responseType });

      beforeAll(() => {
        handleUnauthenticated(req, res, next);
      });

      if (responseType === 'json') {
        it('should call set response location correctly', () =>
          expect(res.location).toHaveBeenCalledWith(location));

        it('should send a 401 response', () => {
          expect(res.status).toHaveBeenCalledWith(401);
        });
      }

      if (responseType === 'html') {
        it('should call res.redirect', () => expect(res.redirect).toHaveBeenCalledWith(location));
      }
    });
  });
});
