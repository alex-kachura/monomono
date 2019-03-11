import { fromJS } from 'immutable';
import setResponseData from './';
import * as matchers from 'jest-immutable-matchers';

describe('Set response data middleware', () => {
  jest.addMatchers(matchers);

  const mockToken = 'mock-token';
  const mockAuth = 'mock-is-auth';
  const mockGetToken = jest.fn();
  const req = {
    csrfToken: mockGetToken.mockReturnValue(mockToken),
    isAuthenticated: mockAuth,
  };
  const res = {
    data: fromJS({
      foo: 'bar',
    }),
  };
  const next = jest.fn();

  beforeEach(() => {
    setResponseData(req, res, next);
  });

  it('should call get csrf token method', () => {
    expect(mockGetToken).toHaveBeenCalledWith();
  });

  it('should set the correct response data', () => {
    expect(res.data).toEqualImmutable(
      fromJS({
        foo: 'bar',
        isAuthenticated: mockAuth,
        csrf: mockToken,
      }),
    );
  });

  it('should call next', () => {
    expect(next).toHaveBeenCalledWith();
  });
});
