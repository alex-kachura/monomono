describe.skip('Controller factory', () => {
  const mockDefault = 'mock-default';
  const mockPL = 'mock-pl';
  let factory;

  beforeEach(() => {
    jest.doMock('./edit-example', () => ({
      default: mockDefault,
      PL: mockPL,
    }));

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
      expect(factory('editExample', 'blah')).toEqual(mockDefault);
    });
  });

  describe('provide valid name and valid region', () => {
    it('should return PL controller', () => {
      expect(factory('editExample', 'PL')).toEqual(mockPL);
    });
  });
});
