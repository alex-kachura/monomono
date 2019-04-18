describe('#addressSearch (entry point)', () => {
  const mockDefault = 'mock-default';
  const mockPL = 'mock-pl';
  let module;

  beforeEach(() => {
    jest.doMock('./_default', () => mockDefault);
    jest.doMock('./pl', () => mockPL);

    module = require('./');
  });

  afterEach(() => {
    jest.resetModules();
  });

  describe('default export', () => {
    it('should contain default and PL controllers', () => {
      expect(module.default).toEqual({
        default: mockDefault,
        PL: mockPL,
      });
    });
  });
});
