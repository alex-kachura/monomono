import path from 'path';
import fs from 'fs';
import log from '../../logger';

let errorPage;

// The NODE_ENV check is necessary because in development mode the app runs
// from the src directory and in production mode it runs from the dist directory
// This means that in development the path to the 500.html is different than it is in production
if (process.env.NODE_ENV === 'development') {
  errorPage = `${path.join(__dirname, '../../../../dist/public')}/500.html`;
} else {
  errorPage = `${path.join(__dirname, '../../../public')}/500.html`;
}

const templateContent = fs.readFileSync(errorPage, 'utf8');

function logError(error, req) {
  log.error(`Application Error: ${error.message}`, error, req);
}

// eslint-disable-next-line no-unused-vars
export default function errorHandler(error, req, res, next) {
  if (Array.isArray(error)) {
    error.forEach((err) => logError(err, req));
  } else {
    logError(error, req);
  }

  return res.status(500).send(templateContent);
}
