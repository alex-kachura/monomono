const original = jest.requireActual('@web-foundations/service-identity');

export const mockOn = jest.fn();
export const mockGetClaims = jest.fn().mockReturnValue({ access_token: 'test-access-token' }); // eslint-disable-line camelcase

const MockIdentityService = jest.fn(function IdentityServiceMock() {
  Object.assign(this, {
    ...original.default,
    on: mockOn,
    getClaims: mockGetClaims,
  });
});

MockIdentityService.Environments = original.default.Environments;
MockIdentityService.Endpoints = original.default.Endpoints;
MockIdentityService.StateOfOldCard = original.default.StateOfOldCard;
MockIdentityService.Capabilities = original.default.Capabilities;
MockIdentityService.OAuthTokenGrantTypes = original.default.OAuthTokenGrantTypes;
MockIdentityService.OAuthTokenScopes = original.default.OAuthTokenScopes;
MockIdentityService.Schemas = original.default.Schemas;

export default MockIdentityService;
