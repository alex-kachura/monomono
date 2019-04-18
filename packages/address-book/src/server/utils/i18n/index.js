// Internationalisation setup module for one place bootstrapping
// and helper methods that can be used on the server-side.

import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import Polyglot from 'node-polyglot';

// Set up i18n translations. The content files are written in YAML because
// it's easier to read and write than JSON.
const LOCALE_FILES_DIR = path.join(__dirname, '..', '..', '..', 'locales');
const localeFiles = fs.readdirSync(LOCALE_FILES_DIR);
const languages = {};

localeFiles.forEach((file) => {
  const localePath = path.join(LOCALE_FILES_DIR, file);
  const phrases = yaml.safeLoad(fs.readFileSync(localePath));
  const locale = file.slice(0, file.length - 4);

  languages[file] = new Polyglot({
    phrases,
    locale,
  });
});

export function getDictionary(lang) {
  return languages[`${lang}.yml`];
}

export function getLocalePhrase(lang, key, variables) {
  return getDictionary(lang).t(key, variables);
}

export function getPhraseFactory(lang) {
  return (key, variables) => getLocalePhrase(lang, key, variables);
}
