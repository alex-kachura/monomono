import url from 'url';
import config from 'config';
import Immutable from 'immutable';

const backToWhitelist = config.get('backToWhitelist');

function sanitiseReferrer(referrer) {
  let sanitisedReferrer;

  if (referrer) {
    // Parse url in case there is port number
    let decodedReferrer;

    try {
      decodedReferrer = decodeURIComponent(referrer);
    } catch (err) {
      decodedReferrer = referrer;
    }

    const parsed = url.parse(decodedReferrer);

    if (parsed.protocol && parsed.hostname) {
      sanitisedReferrer = `${parsed.protocol}//${parsed.hostname}${parsed.path}`;
    }
  }

  return sanitisedReferrer;
}

function isValidReferrer(backUrls, referrer, language) {
  if (referrer) {
    const sanitisedReferrer = sanitiseReferrer(referrer.split('?')[0]);

    if (sanitisedReferrer) {
      const urls = backUrls[language] || backUrls.en;

      return urls.some((back) => new RegExp(back.url, 'i').test(sanitisedReferrer));
    }
  }

  return false;
}

export function getReferrerLabel(backUrls, referrer, language) {
  if (referrer) {
    const sanitisedReferrer = sanitiseReferrer(referrer.split('?')[0]);

    if (sanitisedReferrer) {
      const urls = backUrls[language] || backUrls.en;
      const active = urls.filter((back) => new RegExp(back.url, 'i').test(sanitisedReferrer));

      if (active) {
        return active[0].label;
      }
    }
  }

  return 'back-to.default';
}

export default function referrerMiddleware(req, res, next) {
  // Set up the initial state object. We need the referrer because some
  // components behave differently depending on its value. A good example of
  // that is the change password page component which displays a link rather
  // than navigation breadcrumbs when the referrer is Tesco Direct.
  const referrer = req.get('referer');

  // Validate referrer with the list of supported accepted urls
  // `referrer` is used to preserve original referrer of the user journey
  // It is passed only if the referrer is one from supported back links
  // and then further carried forward in url query parameters as `referrer`
  // It is used to work out `Back to` link on the page.
  if (isValidReferrer(backToWhitelist, referrer, req.lang)) {
    const label = getReferrerLabel(backToWhitelist, referrer, req.lang);

    res.data = res.data.set(
      'referrer',
      Immutable.fromJS({
        link: referrer,
        label,
      }),
    );

    // Read referrer from url query to preserve original referrer
  } else if (req.query.referrer) {
    if (isValidReferrer(backToWhitelist, req.query.referrer, req.lang)) {
      const label = getReferrerLabel(backToWhitelist, req.query.referrer, req.lang);

      res.data = res.data.set(
        'referrer',
        Immutable.fromJS({
          link: decodeURIComponent(req.query.referrer),
          label,
        }),
      );
    }
  }

  next();
}
