export const debug = jest.fn();
export const info = jest.fn();
export const validation = jest.fn();
export const warn = jest.fn();
export const error = jest.fn();
export const makeOnRequestEventHandler = jest.fn(() => Function);

const mockNodeLogger = {
  debug,
  info,
  validation,
  warn,
  error,
};

mockNodeLogger.makeOnRequestEventHandler = makeOnRequestEventHandler;

export default mockNodeLogger;

export const logOutcome = jest.fn((name, outcome, { sessionId, region, lang }) =>
  info(`address-book:${name}`, {
    outcome,
    tracer: sessionId,
    region,
    lang,
  }),
);
