describe('Verify controller', () => {
  describe('#handshake', () => {
    const mockAccessToken = 'mock-token';
    const mockTracer = 'mock-tracer';
    let mockIdentityHandshake;
    let handshake;

    beforeEach(async () => {
      mockIdentityHandshake = jest.fn();
      jest.doMock('../../services/identity', ()=> ({
        handshake: mockIdentityHandshake,
      }));

      handshake = require('./').handshake;

      await handshake({
        accessToken: mockAccessToken,
        tracer: mockTracer,
      });
    });

    afterEach(() => {
      jest.resetModules();
    });

    it('should call identity handshake method', () => {
      expect(mockIdentityHandshake).toHaveBeenCalledWith({
        targetConfidence: 16,
        accessToken: mockAccessToken,
        tracer: mockTracer,
      });
    });
  });
});
