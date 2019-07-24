import config from 'config';
import { AddressServiceError } from '@web-foundations/service-address';
import { getEditDeliveryAddressPage, postEditDeliveryAddressPage, getBreadcrumb } from './';
import log, { logOutcome } from '../../logger';
import { send, lang, next, requestFactory, responseFactory } from '../../utils/test-helpers';
import { getAddress, updateAddress } from '../../controllers/delivery-address/_default';
import { getLocalePhrase } from '../../utils/i18n';
import { UNEXPECTED_BANNER, ErrorCodes } from '../../utils/error-handlers';
import { ContactServiceError } from '@web-foundations/service-contact';

jest.mock('../../controllers/delivery-address/_default');

const testAddress = {
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

const payloadFactory = (req, extra) => {
  const { fields, schema } = config[req.region].pages['delivery-address'];
  const defaultValues = testAddress;

  return {
    breadcrumb: getBreadcrumb(req, getLocalePhrase),
    fields,
    schema,
    values: defaultValues,
    errors: {},
    banner: {},
    ...extra,
  };
};

describe('[Route: /edit-delivery-address]', () => {
  describe.each(['html', 'json'])('[Content-Type: %s]', (responseType) => {
    describe('[GET]', () => {
      const errors = [
        [
          'ERROR',
          {
            error: new Error(ErrorCodes.NOT_DELIVERY_ADDRESS),
            errorPayload: {},
            errorCode: ErrorCodes.NOT_DELIVERY_ADDRESS,
            outcome: 'error',
            log: {
              warn: `delivery-address:edit:get - Address is not a delivery address`,
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

          await getEditDeliveryAddressPage(req, res, next);
        });

        it('should log correctly', () => {
          expect(logOutcome).toHaveBeenCalledWith('delivery-address:edit:get', 'successful', req);
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
            { errorCode, error, outcome, log: { warn: warnLog, error: errorLog } = {} },
          ) => {
            describe(errorCode, () => {
              const req = requestFactory({
                method: 'GET',
                query: {
                  id: 'test-id',
                },
              });

              const res = responseFactory({ responseType });

              beforeAll(async () => {
                if (error) {
                  getAddress.mockRejectedValueOnce(error);
                }

                await getEditDeliveryAddressPage(req, res, next);
              });

              it('Should log outcome correctly', () => {
                expect(logOutcome).toBeCalledWith('delivery-address:edit:get', outcome, req);
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
        day: '07777888888',
        evening: '07777888888',
        mobile: '',
        'address-label': 'mock-label-2',
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
                'address-line1': [
                  {
                    error: {
                      code: 'Invalid address.',
                      name: 'AddressServiceError',
                      violations: [
                        {
                          lineNumber: 1,
                        },
                      ],
                    },
                    keyword: 'required',
                    type: 'server',
                  },
                ],
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
            errorPayload: {
              errors: {
                postcode: [
                  {
                    error: {
                      code: 'Postcode not found.',
                      name: 'AddressServiceError',
                    },
                    keyword: 'not-found',
                    type: 'server',
                  },
                ],
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
            errorPayload: {
              banner: UNEXPECTED_BANNER,
            },
            outcome: 'error',
            log: {
              error: `delivery-address:edit:post - Unexpected error`,
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
                postcode: [
                  {
                    type: 'ajv',
                    keyword: 'required',
                    error: {
                      keyword: 'required',
                      dataPath: '',
                      schemaPath: '#/required',
                      params: { missingProperty: 'postcode' },
                      message: "should have required property 'postcode'",
                    },
                  },
                ],
                'address-line1': [
                  {
                    type: 'ajv',
                    keyword: 'required',
                    error: {
                      keyword: 'required',
                      dataPath: '',
                      schemaPath: '#/required',
                      params: { missingProperty: 'address-line1' },
                      message: "should have required property 'address-line1'",
                    },
                  },
                ],
                town: [
                  {
                    type: 'ajv',
                    keyword: 'required',
                    error: {
                      keyword: 'required',
                      dataPath: '',
                      schemaPath: '#/required',
                      params: { missingProperty: 'town' },
                      message: "should have required property 'town'",
                    },
                  },
                ],
                day: [
                  {
                    type: 'ajv',
                    keyword: 'required',
                    error: {
                      keyword: 'required',
                      dataPath: '',
                      schemaPath: '#/required',
                      params: { missingProperty: 'day' },
                      message: "should have required property 'day'",
                    },
                  },
                ],
                evening: [
                  {
                    type: 'ajv',
                    keyword: 'required',
                    error: {
                      keyword: 'required',
                      dataPath: '',
                      schemaPath: '#/required',
                      params: { missingProperty: 'evening' },
                      message: "should have required property 'evening'",
                    },
                  },
                ],
                'address-label': [
                  {
                    type: 'ajv',
                    keyword: 'required',
                    error: {
                      keyword: 'required',
                      dataPath: '',
                      schemaPath: '#/required',
                      params: { missingProperty: 'address-label' },
                      message: "should have required property 'address-label'",
                    },
                  },
                ],
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
          bannerAction: 'updated',
          values,
        });

        beforeAll(async () => {
          await postEditDeliveryAddressPage(req, res, next);
        });

        it('should log correctly', () => {
          expect(logOutcome).toHaveBeenCalledWith('delivery-address:edit:post', 'successful', req);
        });

        if (responseType === 'html') {
          it('should set the correct response data', () => {
            expect(res.redirect).toBeCalledWith(`/account/address-book/${lang}?action=updated`);
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

              const req = requestFactory({
                query: {
                  id: 'test-id',
                },
                body: _body,
              });

              const res = responseFactory({ responseType });

              const payload = payloadFactory(req, {
                values: _values,
                ...errorPayload,
              });

              beforeAll(async () => {
                if (error) {
                  updateAddress.mockRejectedValueOnce(error);
                }

                await postEditDeliveryAddressPage(req, res, next);
              });

              it('Should log outcome correctly', () => {
                expect(logOutcome).toBeCalledWith('delivery-address:edit:post', outcome, req);
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
      query: {
        id: 'GHS_12345',
      },
    });

    const res = responseFactory();

    beforeAll(async () => {
      await getEditDeliveryAddressPage(reqWithSegment, res, next);
    });

    it('should redirect to Address Book in My Account', () => {
      expect(res.redirect).toHaveBeenCalledWith(
        expect.stringContaining('manage/address-book/change-address?id=12345'),
      );
    });

    afterAll(() => {
      jest.clearAllMocks();
    });
  });
});
