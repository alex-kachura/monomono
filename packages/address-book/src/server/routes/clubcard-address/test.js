import config from 'config';
import { AddressServiceError } from '@web-foundations/service-address';
import { getClubcardAddressPage, postClubcardAddressPage, getBreadcrumb } from './';
import log, { logOutcome } from '../../logger';
import { send, lang, next, requestFactory, responseFactory } from '../../utils/test-helpers';
import { getAddress, updateAddress } from '../../controllers/clubcard-address/_default';
import { getLocalePhrase } from '../../utils/i18n';
import { UNEXPECTED_BANNER, ErrorCodes } from '../../utils/error-handlers';
import { ContactServiceError } from '@web-foundations/service-contact';

jest.mock('../../controllers/clubcard-address/_default');

const testAddress = {
  postcode: 'NE14PQ',
  'address-line1': 'mock-address-line-1',
  'address-line2': '',
  'address-line3': '',
  town: 'mock-town',
  'address-id': '',
  phone: '07777888888',
};

const query = {
  id: 'test-id',
};

const payloadFactory = (req, extra) => {
  const { fields, schema } = config[req.region].pages['clubcard-address'];
  const defaultValues = testAddress;

  return {
    breadcrumb: getBreadcrumb(req.lang, getLocalePhrase),
    fields,
    schema,
    values: defaultValues,
    errors: {},
    banner: {},
    ...extra,
  };
};

describe('[Route: /edit-clubcard-address]', () => {
  describe.each(['html', 'json'])('[Content-Type: %s]', (responseType) => {
    describe('[GET]', () => {
      const errors = [
        [
          'ERROR',
          {
            error: new Error(ErrorCodes.CONTACT_ADDRESS_ID_REQUIRED),
            errorCode: ErrorCodes.CONTACT_ADDRESS_ID_REQUIRED,
            outcome: 'error',
            query: {},
            log: {
              warn: "clubcard-address:edit:get - 'id' was not provided",
            },
          },
        ],
        [
          'ERROR',
          {
            error: new Error('NOT_CLUBCARD_ADDRESS'),
            errorPayload: {},
            errorCode: 'NOT_CLUBCARD_ADDRESS',
            outcome: 'error',
            query,
            log: {
              warn: `clubcard-address:edit:get - Address is not a clubcard address`,
            },
          },
        ],
        [
          'ContactServiceError',
          {
            error: new ContactServiceError(ContactServiceError.Codes.ADDRESS_NOT_FOUND),
            errorPayload: {},
            errorCode: 'ADDRESS_NOT_FOUND',
            outcome: 'error',
            query,
            log: {
              warn: 'contact-service:get-address:ADDRESS_NOT_FOUND - Address not found',
            },
          },
        ],
      ];

      describe('[success]', () => {
        const res = responseFactory({ responseType });
        const req = requestFactory({
          query: {
            id: 'test-id',
          },
        });
        const payload = payloadFactory(req);

        beforeAll(async () => {
          getAddress.mockResolvedValueOnce(testAddress);

          await getClubcardAddressPage(req, res, next);
        });

        it('should log correctly', () => {
          expect(logOutcome).toHaveBeenCalledWith('clubcard-address:edit:get', 'successful', req);
        });

        if (responseType === 'html') {
          it('should set the correct response data', () => {
            expect(res.data).toEqual({
              payload,
            });
          });

          it('should call next correctly', () => {
            expect(next).toHaveBeenCalledWith();
          });
        }

        if (responseType === 'json') {
          it('should set the correct response data', () => {
            expect(send).toHaveBeenCalledWith({
              payload,
            });
          });
        }

        afterAll(() => {
          jest.clearAllMocks();
        });
      });

      describe('[failure]', () => {
        describe.each(errors)(
          '[%s]',
          (
            errorName,
            {
              errorCode,
              error,
              outcome,
              query: errorQuery,
              log: { warn: warnLog, error: errorLog } = {},
            },
          ) => {
            describe(errorCode, () => {
              const req = requestFactory({
                method: 'GET',
                query: errorQuery,
              });
              const res = responseFactory({ responseType });

              beforeAll(async () => {
                if (error && error.message !== ErrorCodes.CONTACT_ADDRESS_ID_REQUIRED) {
                  getAddress.mockRejectedValueOnce(error);
                }

                await getClubcardAddressPage(req, res, next);
              });

              it('Should log outcome correctly', () => {
                expect(logOutcome).toBeCalledWith('clubcard-address:edit:get', outcome, req);
              });

              if (warnLog) {
                it('Should log warning correctly', () => {
                  expect(log.warn).toHaveBeenCalledWith(warnLog, error, req);
                });
              }

              if (errorLog) {
                it('Should log error correctly', () => {
                  expect(log.error).toHaveBeenCalledWith(errorLog, error, req);
                });
              }

              it('should call next correctly', () => {
                expect(next).toHaveBeenCalledWith(error);
              });

              afterAll(() => {
                jest.clearAllMocks();
              });
            });
          },
        );
      });
    });

    describe('[POST]', () => {
      const values = {
        postcode: 'NE14PQ',
        'address-line1': 'mock-address-line-1',
        'address-line2': '',
        'address-line3': '',
        town: 'mock-town',
        'address-id': '',
        phone: '07777888888',
      };
      const body = {
        _csrf: 'mock-csrf',
        ...values,
      };

      const errors = [
        [
          'ERROR',
          {
            error: new Error(ErrorCodes.CONTACT_ADDRESS_ID_REQUIRED),
            errorCode: ErrorCodes.CONTACT_ADDRESS_ID_REQUIRED,
            outcome: 'error',
            body,
            query: {},
            log: {
              warn: "clubcard-address:edit:post - 'id' was not provided",
            },
          },
        ],
        [
          'AddressServiceError',
          {
            error: new AddressServiceError(AddressServiceError.Codes.INVALID_ADDRESS, {
              violations: [
                {
                  lineNumber: 1,
                },
              ],
            }),
            body,
            query,
            errorPayload: {
              errors: {
                'address-line1': 'address.fields.address-line1.error',
              },
            },
            errorCode: 'INVALID_ADDRESS',
            outcome: 'validation-errors',
            log: {
              warn: `address-service:update-address:INVALID_ADDRESS - Invalid address line 1 entered`,
            },
          },
        ],
        [
          'AddressServiceError',
          {
            errorCode: 'POSTCODE_NOT_FOUND',
            error: new AddressServiceError(AddressServiceError.Codes.POSTCODE_NOT_FOUND),
            body,
            query,
            errorPayload: {
              errors: {
                postcode: 'address.fields.postcode.error',
              },
            },
            outcome: 'validation-errors',
            log: {
              warn: `address-service:update-address:POSTCODE_NOT_FOUND - Post code not found`,
            },
          },
        ],
        [
          'AddressServiceError',
          {
            errorCode: 'UNEXPECTED_RESPONSE',
            error: new AddressServiceError(AddressServiceError.Codes.UNEXPECTED_RESPONSE),
            body,
            query,
            errorPayload: {
              banner: UNEXPECTED_BANNER,
            },
            outcome: 'error',
            log: {
              error: `address-service:update-address - Unexpected error creating address`,
            },
          },
        ],
        [
          'ContactServiceError',
          {
            errorCode: 'UNEXPECTED_RESPONSE',
            error: new ContactServiceError(ContactServiceError.Codes.UNEXPECTED_RESPONSE),
            body,
            query,
            errorPayload: {
              banner: UNEXPECTED_BANNER,
            },
            outcome: 'error',
            log: {
              error: `contact-service:update-address - Unexpected error adding address`,
            },
          },
        ],
        [
          'ERROR',
          {
            errorCode: 'UNEXPECTED_ERROR',
            error: new Error('UNEXPECTED_ERROR'),
            body,
            query,
            errorPayload: {
              banner: UNEXPECTED_BANNER,
            },
            outcome: 'error',
            log: {
              error: `clubcard-address:edit:post - Unexpected error`,
            },
          },
        ],
        [
          'FORMIK_VALIDATION_ERROR',
          {
            errorCode: 'Invalid Body',
            error: null,
            body: {
              _csrf: 'mock-csrf',
            },
            query,
            errorPayload: {
              errors: {
                'address-line1': 'address.fields.address-line1.error',
                phone: 'pages.clubcard-address.fields.phone-number.error',
                postcode: 'address.fields.postcode.error',
                town: 'address.fields.town.error',
              },
            },
            outcome: 'validation-errors',
          },
        ],
      ];

      describe('[success]', () => {
        const req = requestFactory({
          query: {
            id: 'test-id',
          },
          body,
        });
        const res = responseFactory({ responseType });
        const payload = payloadFactory(req, {
          values,
        });

        beforeAll(async () => {
          await postClubcardAddressPage(req, res, next);
        });

        it('should log correctly', () => {
          expect(logOutcome).toHaveBeenCalledWith('clubcard-address:edit:post', 'successful', req);
        });

        if (responseType === 'html') {
          it('should set the correct response data', () => {
            expect(res.redirect).toBeCalledWith(
              `/account/address-book/${lang}?action=clubcard-updated`,
            );
          });
        }

        if (responseType === 'json') {
          it('should set the correct response data', () => {
            expect(send).toHaveBeenLastCalledWith({
              payload,
            });
          });
        }

        afterAll(() => {
          jest.clearAllMocks();
        });
      });

      describe('[failure]', () => {
        describe.each(errors)(
          '[%s]',
          (
            errorName,
            {
              body: _body,
              query: queryError,
              errorCode,
              error,
              outcome,
              errorPayload,
              log: { warn: warnLog, error: errorLog } = {},
            },
          ) => {
            describe(errorCode, () => {
              const { _csrf, ..._values } = _body; // eslint-disable-line
              const req = requestFactory({
                query: queryError,
                body: _body,
              });
              const res = responseFactory({ responseType });
              const payload = payloadFactory(req, {
                values: _values,
                ...errorPayload,
              });

              beforeAll(async () => {
                if (error && error.message !== ErrorCodes.CONTACT_ADDRESS_ID_REQUIRED) {
                  updateAddress.mockRejectedValueOnce(error);
                }

                await postClubcardAddressPage(req, res, next);
              });

              it('Should log outcome correctly', () => {
                expect(logOutcome).toBeCalledWith('clubcard-address:edit:post', outcome, req);
              });

              if (warnLog) {
                it('Should log warning correctly', () => {
                  expect(log.warn).toHaveBeenCalledWith(warnLog, error, req);
                });
              }

              if (errorLog) {
                it('Should log error correctly', () => {
                  expect(log.error).toHaveBeenCalledWith(errorLog, error, req);
                });
              }

              if (
                (!error || error.message !== ErrorCodes.CONTACT_ADDRESS_ID_REQUIRED) &&
                responseType === 'html'
              ) {
                it('should set the correct response data', () => {
                  expect(res.data).toEqual({
                    payload,
                  });
                });

                it('should call next correctly', () => {
                  expect(next).toHaveBeenCalledWith();
                });
              }

              if (
                (!error || error.message !== ErrorCodes.CONTACT_ADDRESS_ID_REQUIRED) &&
                responseType === 'json'
              ) {
                it('should set the correct response data', () => {
                  expect(send).toHaveBeenLastCalledWith({
                    payload,
                  });
                });
              }

              if (error && error.message === ErrorCodes.CONTACT_ADDRESS_ID_REQUIRED) {
                it('should call next correctly', () => {
                  expect(next).toHaveBeenCalledWith(error);
                });
              }

              afterAll(() => {
                jest.clearAllMocks();
              });
            });
          },
        );
      });
    });
  });
});
