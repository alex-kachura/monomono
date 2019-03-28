import identity from '../../services/identity';

export async function handshake({ accessToken, tracer }) {

  // Call handshake with confidence level 16
  await identity.handshake({
    targetConfidence: 16,
    accessToken,
    tracer,
  });
}
