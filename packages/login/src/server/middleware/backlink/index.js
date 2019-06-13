import url from 'url';
import config from 'config';

const backToWhitelist = config.get('backToWhitelist');

function sanitiseBacklink(backlink) {
  let sanitisedBacklink;

  if (backlink) {
    // Parse url in case there is port number
    let decodedbacklink;

    try {
      decodedbacklink = decodeURIComponent(backlink);
    } catch (err) {
      decodedbacklink = backlink;
    }

    const parsed = url.parse(decodedbacklink);

    if (parsed.protocol && parsed.hostname) {
      sanitisedBacklink = `${parsed.protocol}//${parsed.hostname}${parsed.path}`;
    }
  }

  return sanitisedBacklink;
}

function isValidBacklink(backUrls, backlink, language) {
  if (backlink) {
    const sanitisedBacklink = sanitiseBacklink(backlink);

    if (sanitisedBacklink) {
      const urls = backUrls[language] || backUrls.en;

      return urls.some((back) => new RegExp(back.url, 'i').test(sanitisedBacklink));
    }
  }

  return false;
}

export function getBacklinkLabel(backUrls, backlink, language) {
  if (backlink) {
    const sanitisedBacklink = sanitiseBacklink(backlink.split('?')[0]);

    if (sanitisedBacklink) {
      const urls = backUrls[language] || backUrls.en;
      const active = urls.filter((back) => new RegExp(back.url, 'i').test(sanitisedBacklink));

      if (active) {
        return active[0].label;
      }
    }
  }

  return 'back-to.default';
}

export default function backlinkMiddleware(req, res, next) {
  // Set up the initial state object. We need the backlink because some
  // components behave differently depending on its value. A good example of
  // that is the change password page component which displays a link rather
  // than navigation breadcrumbs when the backlink is Tesco Direct.
  const backlink = res.data && res.data.onwardLocation;

  // Validate backlink with the list of supported accepted urls
  // `backlink` is used to preserve original backlink of the user journey
  // It is passed only if the backlink is one from supported back links
  // and then further carried forward in url query parameters as `backlink`
  // It is used to work out `Back to` link on the page.

  if (isValidBacklink(backToWhitelist, backlink, req.lang)) {
    const label = getBacklinkLabel(backToWhitelist, backlink, req.lang);
    const link = sanitiseBacklink(backlink);

    res.data = {
      ...res.data,
      backlink: {
        link,
        label,
      },
    };
  }

  next();
}
