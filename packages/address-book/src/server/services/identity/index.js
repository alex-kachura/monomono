import IdentityService from '@web-foundations/service-identity';
import config from 'config';
import log from '../../logger';

// Identity service client does not require any user or request
// specific data unlike most of the service clients.
// That's why it can be cached.
let identity;

export default function getIdentityClient(noCache) {
  if (!noCache && identity) {
    return identity;
  }

  identity = new IdentityService({
    env: {
      host: config.get('services.identity.host'),
      port: config.get('services.identity.port'),
      protocol: config.get('services.identity.protocol'),
    },
    timeout: config.get('services.identity.timeout'),
    clientId: config.get('services.clientId'),
    fullyQualifiedClientId: config.get('services.fullyQualifiedClientId'),
    akamaiAuthToken: config.get('services.akamaiAuthToken'),
  });

  identity.on('requestStart', log.makeOnRequestEventHandler('Identity Service Request'));
  identity.on('requestEnd', log.makeOnRequestEventHandler('Identity Service Response'));

  return identity;
}

// Helper function to get a service-scoped access token from the Identity service.
export async function getServiceToken({ context, tracer } = {}) {
  const result = await getIdentityClient().getClaims({
    username: config.get('services.identity.username'),
    password: config.get('services.identity.password'),
    scope: IdentityService.OAuthTokenScopes.SERVICE,
    context,
    tracer,
  });

  return result.access_token;
}
