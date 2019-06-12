import 'jest-dom/extend-expect';

jest.mock('@web-foundations/service-contact');
jest.mock('@web-foundations/service-address');
jest.mock('@web-foundations/service-identity');
jest.mock('config');
jest.mock('../src/server/logger');
jest.mock('../src/server/utils/i18n');
