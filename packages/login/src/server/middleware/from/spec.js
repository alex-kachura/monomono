import mockery from 'mockery';
import sinon from 'sinon';

const COOKIE_NAME = 'cookie.onwardLocation.name';
const COOKIE_OPTIONS = 'cookie.onwardLocation.options';
const DEFAULT_LOCATION = 'baseHost';
const mockedConfig = {
  get: (key) => {
    switch (key) {
    case 'referrerDomainWhitelist':
      return [
        '^https://example.com',
        '^allowedScheme://',
      ];
    case 'sensitiveDataUrlInjectionWhiteList':
      return ['allowedScheme://'];
    default:
      return key;
    }
  },
};
const mockedExpress = {
  response: {},
};

describe('Onward location middleware', () => {
  let middleware;
  let mockReq;
  let mockRes;
  let mockNext;

  beforeEach(() => {
    mockery.registerMock('express', mockedExpress);
    mockery.registerMock('config', mockedConfig);
    mockery.registerMock('../../assemblylayer/lib/utilities', {
      getAuthData: () => ({
        accessToken: 'aaa123',
        refreshToken: 'zzz321',
      }),
    });
    mockery.enable({
      warnOnUnregistered: false,
    });

    middleware = require('./').default; // eslint-disable-line

    mockReq = {
      language: 'en-GB',
      cookies: {},
      query: {},
    };
    mockRes = {
      clearCookie: sinon.spy(),
      cookie: sinon.spy(),
      redirect: sinon.spy(),
      req: mockReq,
      data: {},
    };
    mockNext = sinon.spy();
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  it('should export a function', () => {
    expect(middleware).to.be.a('function');
  });

  it('should add a "completeJourney" method to the response object', () => {
    middleware(mockReq, mockRes, mockNext);
    expect(mockedExpress.response).to.have.property('completeJourney').that.is.a('function');
  });

  context('request has a "from" parameter', () => {
    beforeEach(() => {
      mockReq.query.from = 'https://example.com';
    });

    it('should set a cookie', () => {
      middleware(mockReq, mockRes, mockNext);
      expect(mockRes.cookie).to.have.been.calledWith(COOKIE_NAME);
    });

    it('should add a property to the request state', () => {
      const expected = encodeURIComponent(mockReq.query.from);

      middleware(mockReq, mockRes, mockNext);
      expect(mockRes.data.onwardLocation).to.equal(expected);
    });

    it('should call "next"', () => {
      middleware(mockReq, mockRes, mockNext);
      expect(mockNext).to.have.been.called; // eslint-disable-line no-unused-expressions
    });
  });

  context('request does not have a "from" parameter', () => {
    it('should not set a cookie', () => {
      middleware(mockReq, mockRes, mockNext);
      expect(mockRes.cookie).not.to.have.been.called; // eslint-disable-line no-unused-expressions
    });

    it('should not add a property to the request state', () => {
      middleware(mockReq, mockRes, mockNext);
      expect(mockRes.data.onwardLocation).to.be.undefined; // eslint-disable-line no-unused-expressions
    });

    it('should call "next"', () => {
      middleware(mockReq, mockRes, mockNext);
      expect(mockNext).to.have.been.called; // eslint-disable-line no-unused-expressions
    });
  });

  context('request has a "bypassFromCookie" parameter', () => {
    beforeEach(() => {
      mockReq.query.from = 'https://example.com';
      mockReq.query.bypassFromCookie = true;
    });

    it('should not set a cookie', () => {
      middleware(mockReq, mockRes, mockNext);
      expect(mockRes.cookie).not.to.have.been.called; // eslint-disable-line no-unused-expressions
    });

    it('should add a property to the request state', () => {
      const expected = encodeURIComponent(mockReq.query.from);

      middleware(mockReq, mockRes, mockNext);
      expect(mockRes.data.onwardLocation).to.equal(expected);
    });

    it('should call "next"', () => {
      middleware(mockReq, mockRes, mockNext);
      expect(mockNext).to.have.been.called; // eslint-disable-line no-unused-expressions
    });
  });

  describe('completeJourney response method', () => {
    beforeEach(() => {
      middleware(mockReq, mockRes, mockNext);
      mockRes.completeJourney = mockedExpress.response.completeJourney;
    });

    context('cookie has a whitelisted value', () => {
      beforeEach(() => {
        mockReq.cookies[COOKIE_NAME] = 'https://example.com';
      });

      it('should redirect to the location specified by the cookie', () => {
        mockRes.completeJourney();
        expect(mockRes.redirect).to.have.been.calledWith('https://example.com');
      });

      it('should clear the cookie', () => {
        mockRes.completeJourney();
        expect(mockRes.clearCookie).to.have.been.calledWith(COOKIE_NAME, COOKIE_OPTIONS);
      });

      it('should allow additional query string parameters to be provided', () => {
        mockRes.completeJourney({
          query: {
            foo: 'bar',
          },
        });
        expect(mockRes.redirect).to.have.been.calledWith('https://example.com/?foo=bar');
      });
    });

    context('cookie has a non-whitelisted value', () => {
      beforeEach(() => {
        mockReq.cookies[COOKIE_NAME] = 'https://evil.com';
      });

      it('should redirect to the default location', () => {
        mockRes.completeJourney();
        expect(mockRes.redirect).to.have.been.calledWith(DEFAULT_LOCATION);
      });

      it('should clear the cookie', () => {
        mockRes.completeJourney();
        expect(mockRes.clearCookie).to.have.been.calledWith(COOKIE_NAME, COOKIE_OPTIONS);
      });
    });

    context('cookie is not present', () => {
      it('should redirect to the default location', () => {
        mockRes.completeJourney();
        expect(mockRes.redirect).to.have.been.calledWith(DEFAULT_LOCATION);
      });
    });

    context('cookie has a whitelisted injection-allowed value', () => {
      beforeEach(() => {
        mockReq.cookies[COOKIE_NAME] = 'allowedScheme://example.com?a=INJECT_ACCESS_TOKEN_HERE&r=INJECT_REFRESH_TOKEN_HERE&c=INJECT_CC_NUMBER_HERE';
        mockRes.data.clubcard = '1234567890';
      });

      it('should replace placeholders in the onward location', () => {
        const expected = `allowedScheme://example.com?a=aaa123&r=zzz321&c=1234567890`;

        mockRes.completeJourney();
        expect(mockRes.redirect).to.have.been.calledWith(expected);
      });
    });

    context('user profile has missing details', () => {
      beforeEach(() => {
        mockRes.data.customer = {
          missingDetails: true,
        };
      });

      it('should redirect to the default missing details location', () => {
        const expected = 'baseHostSecurebasePathen-GB/missing-details';

        mockRes.completeJourney();
        expect(mockRes.redirect).to.have.been.calledWith(expected);
      });

      context('when it has a consumer', () => {
        let expected;

        beforeEach(() => {
          expected = 'baseHostSecurebasePathen-GB/missing-details?consumer=foo';

          mockReq.query.consumer = 'foo';
        });

        it('should persist the "consumer" parameter', () => {
          mockRes.completeJourney();

          expect(mockRes.redirect).to.have.been.calledWith(expected);
        });

        it('should remove the "from" parameter from the query', () => {
          mockReq.query.from = 'bar';
          mockRes.completeJourney();

          expect(mockRes.redirect).to.have.been.calledWith(expected);
        });

        it('should remove the "onwardLocation" parameter from the query', () => {
          mockReq.query['cookie.onwardLocation.name'] = 'bar';
          mockRes.completeJourney();

          expect(mockRes.redirect).to.have.been.calledWith(expected);
        });
      });
    });
  });
});
