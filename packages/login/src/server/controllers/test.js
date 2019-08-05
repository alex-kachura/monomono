describe('Controller factory', () => {
  let factory;

  let mockHandshake;

  let mockController;

  beforeEach(() => {
    mockHandshake = jest.fn();
    mockController = {
      handshake: mockHandshake,
    };

    jest.doMock('./verify', () => mockController);

    factory = require('./').default;
  });

  afterEach(() => {
    jest.resetModules();
  });

  describe('provide invalid name and invalid region', () => {
    it('should throw error', () => {
      expect(() => factory('blah', 'blah')).toThrow(
        /No regional or default contoller blah found for blah/,
      );
    });
  });

  describe('provide invalid name and valid region', () => {
    it('should throw error', () => {
      expect(() => factory('blah', 'PL')).toThrow(
        /No regional or default contoller blah found for PL/,
      );
    });
  });

  describe('provide valid name and invalid region', () => {
    it('should return default controller', () => {
      expect(factory('verify', 'blah')).toEqual({
        default: mockController,
        handshake: mockHandshake,
      });
    });
  });
});
