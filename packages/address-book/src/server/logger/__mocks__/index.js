export const mockDebug = jest.fn();
export const mockInfo = jest.fn();
export const mockValidation = jest.fn();
export const mockWarn = jest.fn();
export const mockError = jest.fn();
export const mockMakeOnRequestEventHandler = jest.fn(() => Function);

const mockNodeLogger = jest.fn(() => ({
  debug: mockDebug,
  info: mockInfo,
  validation: mockValidation,
  warn: mockWarn,
  error: mockError,
}));

mockNodeLogger.makeOnRequestEventHandler = mockMakeOnRequestEventHandler;

export default mockNodeLogger;

export const logOutcome = jest.fn((name, outcome, { sessionId, region, lang }) =>
  mockInfo(`address-book:${name}`, {
    outcome,
    tracer: sessionId,
    region,
    lang,
  }),
);
