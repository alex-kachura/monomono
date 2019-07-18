import {
  errorsToPayload,
  clearAnalyticsPayload,
  trackEvent,
  updateDataLayer,
  getPageName,
} from './';

describe('Analytics utilities', () => {
  describe('#errorsToPayload', () => {
    // field IDs mapped to how analytics would want the properties named
    // when sent to them

    it('should return the correct payload for an empty', () => {
      const payload = errorsToPayload({ name: [{ keyword: 'required' }] });

      expect(payload).toEqual({
        name: 'empty',
      });
    });
  });

  describe('#clearAnalyticsPayload', () => {
    beforeEach(() => {
      global.window.dataLayer = {
        some_property: { foo: 'bar' }, // eslint-disable-line camelcase
      };
    });

    it('should clear passed in property on dataLayer', () => {
      clearAnalyticsPayload('some_property');

      expect(global.window.dataLayer.some_property).toEqual({});
    });

    it('should clear not clear property if not key is passed in', () => {
      clearAnalyticsPayload();

      expect(global.window.dataLayer.some_property).toEqual({ foo: 'bar' });
    });
  });

  describe('#updateDataLayer', () => {
    const payload = { foo: 'bar' };

    afterEach(() => {
      Reflect.deleteProperty(global, 'window'); // eslint-disable-line
    });

    it('should payload to dataLayer', () => {
      global.window.dataLayer = {
        page_name: 'apage', // eslint-disable-line camelcase
      };
      updateDataLayer('something_changed', payload);
      expect(global.window.dataLayer['something_changed']).toBe(payload); // eslint-disable-line
    });
  });

  describe('#trackEvent', () => {
    const payload = { foo: 'bar' };
    const prop = 'mock_prop';
    let trackMock;

    beforeEach(() => {
      trackMock = jest.fn();
      global.window = {};
      // eslint-disable-next-line no-underscore-dangle
      global.window._satellite = {
        track: trackMock,
      };
    });

    afterEach(() => {
      Reflect.deleteProperty(global, 'window'); // eslint-disable-line
      trackMock.mockClear();
    });

    it('should track events when the dataLayer is available', () => {
      global.window.dataLayer = {
        page_name: 'apage', // eslint-disable-line camelcase
      };
      trackEvent('an_event', prop, payload);

      expect(global.window.dataLayer[prop]).toEqual(payload);
      expect(trackMock).toHaveBeenCalledWith('an_event');
    });
  });

  describe('#getPageName', () => {
    describe('landing page', () => {
      it('should return the correct page name', () => {
        expect(getPageName('/basePath/appPath/locale')).toEqual('appPath:landing');
      });
    });

    describe('specific page', () => {
      it('should return the correct page name', () => {
        expect(getPageName('/basePath/appPath/locale/page')).toEqual('appPath:page');
      });
    });

    describe('specific page with extra', () => {
      it('should return the correct page name', () => {
        expect(getPageName('/basePath/appPath/locale/page', 'updated')).toEqual(
          'appPath:page updated',
        );
      });
    });
  });
});
