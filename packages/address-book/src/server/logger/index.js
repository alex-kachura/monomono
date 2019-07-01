import config from 'config';
import winston from 'winston';
import loggerFactory from '@web-foundations/logger';
import { clearTextWhitelist } from '@oneaccount/node-logger-whitelists/lib/whitelists/clear-text';
import { redactedWhitelist } from '@oneaccount/node-logger-whitelists/lib/whitelists/redacted';
import { regexRedactedWhitelist } from '@oneaccount/node-logger-whitelists/lib/whitelists/regex-redacted';
import { messageFilterRegexes } from '@oneaccount/node-logger-whitelists/lib/filters/message';
import preParseRewriterFactory from '@oneaccount/node-logger-whitelists/lib/rewriters/pre-parser';
import clearTextRewriterFactory from '@web-foundations/logger/lib/rewriters/clear-text';
import redactedRewriterFactory from '@web-foundations/logger/lib/rewriters/redacted';
import regexRedactedRewriterFactory from '@web-foundations/logger/lib/rewriters/regex-redacted';
import messageFilterFactory from '@web-foundations/logger/lib/filters/message';

const transports = [
  new winston.transports.Console({
    colorize: process.env.NODE_ENV === 'development',
    datePattern: config.log.datePattern,
    json: true,
    level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
    prettyPrint: process.env.NODE_ENV === 'development',
    stringify:
      process.env.NODE_ENV === 'development'
        ? (_) => JSON.stringify(_, null, 2)
        : (_) => JSON.stringify(_),
    timestamp: () => new Date().toJSON(),
  }),
];

const nodeEnv = process.env.NODE_ENV;
const logConf = config.log;

const encryptionConfig = {
  key: logConf.encryptionKey,
  disabled: logConf.encryptionDisabled,
};

const clearTextRewriter = clearTextRewriterFactory({
  whitelist: clearTextWhitelist,
});

const redactedRewriter = redactedRewriterFactory({
  whitelist: redactedWhitelist,
  encryptionConfig,
  nodeEnv,
});

const regexRedactedRewriter = regexRedactedRewriterFactory({
  whitelist: regexRedactedWhitelist,
  encryptionConfig,
  nodeEnv,
});

const messageFilter = messageFilterFactory({
  encryptionConfig,
  messageFilterRegexes,
  nodeEnv,
});

const preParseRewriter = preParseRewriterFactory({
  application: config.name,
});

const rewriters = [preParseRewriter, clearTextRewriter, redactedRewriter, regexRedactedRewriter];
const filters = [messageFilter];
const logger = loggerFactory({ transports, rewriters, filters });

logger.makeOnRequestEventHandler = function makeOnRequestEventHandler(message) {
  return function onRequestEvent(data) {
    const { context, ...meta } = data;

    if (meta.startTime && meta.endTime) {
      meta.ms = meta.endTime - meta.startTime;
    }

    logger.info(message, meta, context);
  };
};

export const logOutcome = (name, outcome, { sessionId, region, lang }) =>
  logger.info(`address-book:${name}`, {
    outcome,
    tracer: sessionId,
    region,
    lang,
  });

export default logger;
