import config from 'config';
import { AddressServiceError } from '@web-foundations/service-address';
import { getAddDeliveryAddressPage, postAddDeliveryAddressPage, getBreadcrumb } from './';
import log, { logOutcome } from '../../logger';
import { send, lang, next, requestFactory, responseFactory } from '../../utils/test-helpers';
import { createAddress } from '../../controllers/delivery-address/_default';
import { getLocalePhrase } from '../../utils/i18n';
import { UNEXPECTED_BANNER } from '../../utils/error-handlers';
import { ContactServiceError } from '@web-foundations/service-contact';

jest.mock('../../controllers/delivery-address/_default');

const payloadFactory = (req, extra) => {
  const { fields, schema } = config[req.region].pages['delivery-address'];
  const defaultValues = {
    'address-id': '',
    'address-label': '',
    'address-line1': '',
    'address-line2': '',
    'address-line3': '',
    day: '',
    evening: '',
    mobile: '',
    postcode: '',
    town: '',
  };

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

describe('[Route: /add-delivery-address]', () => {
  describe.each(['html', 'json'])('[Content-Type: %s]', (responseType) => {
    describe('[GET]', () => {
      describe('[success]', () => {
        const res = responseFactory({ responseType });
        const req = requestFactory();
        const payload = payloadFactory(req);

        beforeAll(async () => {
          await getAddDeliveryAddressPage(req, res, next);
        });

        it('should log correctly', () => {
          expect(logOutcome).toHaveBeenCalledWith('delivery-address:add:get', 'successful', req);
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
    });

    describe('[POST]', () => {
      const values = {
        postcode: 'NE14PQ',
        'address-line1': 'mock-address-line-1',
        'address-line2': '',
        'address-line3': '',
        town: 'mock-town',
        'address-id': '',
        day: '07777888888',
        evening: '07777888888',
        mobile: '',
        'address-label': 'mock-label',
      };
      const body = {
        _csrf: 'mock-csrf',
        ...values,
      };

      const errors = [
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
            errorPayload: {
              errors: {
                'address-line1': 'address.fields.address-line1.error',
              },
            },
            errorCode: 'INVALID_ADDRESS',
            outcome: 'validation-errors',
            log: {
              warn: `address-service:create-address:INVALID_ADDRESS - Invalid address line 1 entered`,
            },
          },
        ],
        [
          'AddressServiceError',
          {
            errorCode: 'POSTCODE_NOT_FOUND',
            error: new AddressServiceError(AddressServiceError.Codes.POSTCODE_NOT_FOUND),
            body,
            errorPayload: {
              errors: {
                postcode: 'address.fields.postcode.error',
              },
            },
            outcome: 'validation-errors',
            log: {
              warn: `address-service:create-address:POSTCODE_NOT_FOUND - Post code not found`,
            },
          },
        ],
        [
          'AddressServiceError',
          {
            errorCode: 'UNEXPECTED_RESPONSE',
            error: new AddressServiceError(AddressServiceError.Codes.UNEXPECTED_RESPONSE),
            body,
            errorPayload: {
              banner: UNEXPECTED_BANNER,
            },
            outcome: 'error',
            log: {
              error: `address-service:create-address - Unexpected error creating address`,
            },
          },
        ],
        [
          'ContactServiceError',
          {
            errorCode: 'UNEXPECTED_RESPONSE',
            error: new ContactServiceError(ContactServiceError.Codes.UNEXPECTED_RESPONSE),
            body,
            errorPayload: {
              banner: UNEXPECTED_BANNER,
            },
            outcome: 'error',
            log: {
              error: `contact-service:create-address - Unexpected error adding address`,
            },
          },
        ],
        [
          'ERROR',
          {
            errorCode: 'UNEXPECTED_ERROR',
            error: new Error('UNEXPECTED_ERROR'),
            body,
            errorPayload: {
              banner: UNEXPECTED_BANNER,
            },
            outcome: 'error',
            log: {
              error: `delivery-address:add:post - Unexpected error`,
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
            errorPayload: {
              errors: {
                'address-label': 'pages.delivery-address.fields.address-nickname.error',
                'address-line1': 'address.fields.address-line1.error',
                day: 'pages.delivery-address.fields.day-number.error',
                evening: 'pages.delivery-address.fields.evening-number.error',
                postcode: 'address.fields.postcode.error',
                town: 'address.fields.town.error',
              },
            },
            outcome: 'validation-errors',
          },
        ],
      ];

      describe('[success]', () => {
        const req = requestFactory({ body });
        const res = responseFactory({ responseType });
        const payload = payloadFactory(req, {
          values,
        });

        beforeAll(async () => {
          await postAddDeliveryAddressPage(req, res, next);
        });

        it('should log correctly', () => {
          expect(logOutcome).toHaveBeenCalledWith('delivery-address:add:post', 'successful', req);
        });

        if (responseType === 'html') {
          it('should set the correct response data', () => {
            expect(res.redirect).toBeCalledWith(`/account/address-book/${lang}?action=added`);
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
              errorCode,
              error,
              outcome,
              errorPayload,
              log: { warn: warnLog, error: errorLog } = {},
            },
          ) => {
            describe(errorCode, () => {
              const { _csrf, ..._values } = _body; // eslint-disable-line
              const req = requestFactory({ body: _body });
              const res = responseFactory({ responseType });
              const payload = payloadFactory(req, {
                values: _values,
                ...errorPayload,
              });

              beforeAll(async () => {
                if (error) {
                  createAddress.mockRejectedValueOnce(error);
                }

                await postAddDeliveryAddressPage(req, res, next);
              });

              it('Should log outcome correctly', () => {
                expect(logOutcome).toBeCalledWith('delivery-address:add:post', outcome, req);
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
                  expect(send).toHaveBeenLastCalledWith({
                    payload,
                  });
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

  describe('disabled by segmentation', () => {
    const reqWithSegment = requestFactory({
      cookies: {
        // eslint-disable-next-line camelcase
        myaccount_segment_singleAddressBook: '{"segment":"disabled","weighting":"100"}',
      },
    });
    const res = responseFactory();

    beforeAll(async () => {
      await getAddDeliveryAddressPage(reqWithSegment, res, next);
    });

    it('should redirect to Address Book in My Account', () => {
      expect(res.redirect).toHaveBeenCalledWith(
        expect.stringContaining('manage/address-book/add-address'),
      );
    });

    afterAll(() => {
      jest.clearAllMocks();
    });
  });
});
