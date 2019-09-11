import IdentityService from '@web-foundations/service-identity';
import config from 'config';
import log from '../../logger';

const tescoPrefix = config.get('services.tescoPrefix');
const clientId = config.get('services.clientId');
const clientSecret = config.get('services.clientSecret');

// Create an Identity service client that can be used throughout the app. This
// is possible because the service client does not require any user or request
// specific data unlike most of the service clients. By creating one instance at
// the time the app starts we can reduce the overhead of creating one every time
// we handle a request that needs it.
const identity = new IdentityService({
  env: {
    host: config.get('services.identity.host'),
    port: config.get('services.identity.port'),
    protocol: config.get('services.identity.protocol'),
  },
  timeout: config.get('services.identity.timeout'),
  clientId: `${tescoPrefix}:${clientId}`,
  fullyQualifiedClientId: `${tescoPrefix}:${clientId}:${clientSecret}`,
  akamaiAuthToken: config.get('services.akamaiAuthToken'),
});

identity.on('requestStart', log.makeOnRequestEventHandler('Identity Service Request'));
identity.on('requestEnd', log.makeOnRequestEventHandler('Identity Service Response'));

export default identity;

// Helper function to get a service-scoped access token from the Identity
// service.
export async function getServiceToken({ context, tracer } = {}) {
  const result = await identity.getClaims({
    username: config.get('services.identity.username'),
    password: config.get('services.identity.password'),
    scope: IdentityService.OAuthTokenScopes.SERVICE,
    context,
    tracer,
  });

  return result.access_token;
}
