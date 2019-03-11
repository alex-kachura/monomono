describe('Fetch helper', () => {
  let fetchHelper;
  const mockUrl = 'mock-url';
  const mockBody = {
    foo: 'bar',
  };
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'csrf-token': '',
  };

  beforeEach(() => {
    jest.doMock('isomorphic-fetch', () => fetch);
    fetchHelper = require('./').default;
  });

  describe('only url is provided', () => {
    it('should call fetch correctly', async () => {
      await fetchHelper({ url: mockUrl });

      expect(fetch).toHaveBeenCalledWith(mockUrl, {
        method: 'GET',
        credentials: 'same-origin',
        redirect: 'manual',
        headers,
      });
    });
  });

  describe('all parameters provided', () => {
    it('should call fetch correctly', async () => {
      await fetchHelper({
        url: mockUrl,
        method: 'POST',
        body: mockBody,
      });

      expect(fetch).toHaveBeenCalledWith(mockUrl, {
        method: 'POST',
        credentials: 'same-origin',
        redirect: 'manual',
        headers,
        body: JSON.stringify(mockBody),
      });
    });
  });
});
