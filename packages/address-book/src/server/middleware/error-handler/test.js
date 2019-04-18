const mockPath = {
  join: () => 'joined-path',
};

const mockFs = {
  readFileSync: () => 'file',
};

const mockRes = {
  status: () => mockRes,
  send: () => {}, // eslint-disable-line no-empty-function
};

describe('Error handling middleware', () => {
  let errorHandler;
  let logErrorSpy;

  beforeEach(() => {
    logErrorSpy = jest.fn();

    const mockLogger = {
      error: logErrorSpy,
    };

    jest.doMock('path', () => mockPath);
    jest.doMock('fs', () => mockFs);
    jest.doMock('../../logger', () => mockLogger);

    errorHandler = require('./').default; // eslint-disable-line global-require
  });

  afterEach(() => {
    jest.resetModules();
  });

  it('should log an error', () => {
    const err = new Error('it');
    const mockReq = {};
    const expectedString = `Application Error: ${err.message}`;

    errorHandler(err, mockReq, mockRes, () => {}); // eslint-disable-line no-empty-function
    expect(logErrorSpy).toHaveBeenCalledWith(expectedString, err, mockReq);
  });

  it('should handle an array of errors', () => {
    const err = [new Error('it'), new Error('it2')];
    const mockReq = {};

    errorHandler(err, mockReq, mockRes, () => {}); // eslint-disable-line no-empty-function
    expect(logErrorSpy).toHaveBeenCalledTimes(2); // eslint-disable-line no-unused-expressions
  });

  it('should load the 500 page', () => {
    const sendStub = jest.fn();
    const statusStub = jest.fn(() => ({
      send: sendStub,
    }));
    const mockResponse = { status: statusStub };

    errorHandler({}, {}, mockResponse, () => {}); // eslint-disable-line no-empty-function

    expect(statusStub).toHaveBeenCalledWith(500);
    expect(sendStub).toHaveBeenCalledWith('file');
  });
});
