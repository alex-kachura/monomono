import IdentityService, { mockGetClaims } from '@web-foundations/service-identity';
import getIdentityClient, { getServiceToken } from '.';

describe('[Utility: Identity service]', () => {
  describe('[Export: default]', () => {
    it('should be a factory function', () => {
      expect(typeof getIdentityClient).toBe('function');
    });

    it('should return an instance of mock Identity service', () => {
      expect(IdentityService.mock).toBeTruthy();
      expect(getIdentityClient(true)).toBeInstanceOf(IdentityService);
    });

    it('should set up request event handlers', () => {
      const identity = getIdentityClient();

      expect(identity.on).toHaveBeenCalledWith('requestStart', expect.any(Function));
      expect(identity.on).toHaveBeenCalledWith('requestEnd', expect.any(Function));
    });

    it('should cache identity client', () => {
      expect(getIdentityClient()).toBe(getIdentityClient());
    });

    it('should allow disabling cache', () => {
      expect(getIdentityClient()).not.toBe(getIdentityClient(true));
    });
  });

  describe('[Export: getServiceToken]', () => {
    it('returns an access token', async () => {
      const result = await getServiceToken({
        context: 'test-context',
        tracer: 'test-tracer',
      });

      expect(result).toEqual('test-access-token');
      expect(mockGetClaims).toHaveBeenCalledWith({
        username: 'services.identity.username',
        password: 'services.identity.password',
        scope: 'service',
        context: 'test-context',
        tracer: 'test-tracer',
      });
    });
  });
});
