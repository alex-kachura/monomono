export const getLocalePhrase = jest.fn((key) => key);
export const getPhraseFactory = jest.fn(() => getLocalePhrase);
