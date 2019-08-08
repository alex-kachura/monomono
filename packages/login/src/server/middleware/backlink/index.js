import config from 'config';

function isValidBacklink(backUrls, backlink) {
  if (backlink) {
    const decodedBackLink = decodeURIComponent(backlink);

    return backUrls.some((back) => new RegExp(back.url, 'i').test(decodedBackLink));
  }

  return false;
}

export function getBacklink(backUrls, backlink, defaultBackLink) {
  if (backlink) {
    const decodedBackLink = decodeURIComponent(backlink);
    const item = backUrls.find((back) => new RegExp(back.url, 'i').test(decodedBackLink));

    if (item) {
      return {
        label: item.label,
        link: item.url,
      };
    }
  }

  return defaultBackLink;
}

export default function backlinkMiddleware(req, res, next) {
  // Set up the initial state object. We need the backlink because some
  // components behave differently depending on its value. A good example of
  // that is the change password page component which displays a link rather
  // than navigation breadcrumbs when the backlink is Tesco Direct.
  const backlink = res.data && res.data.onwardLocation;
  const backToWhitelist = config[req.region].backToWhitelist;
  const defaultBackLink = {
    label: 'back-to.default',
    link: config[req.region].externalApps.tescoHomepage,
  };

  // Validate backlink with the list of supported accepted urls
  // `backlink` is used to preserve original backlink of the user journey
  // It is passed only if the backlink is one from supported back links
  // and then further carried forward in url query parameters as `backlink`
  // It is used to work out `Back to` link on the page.
  if (isValidBacklink(backToWhitelist, backlink, req.region)) {
    const { link, label } = getBacklink(backToWhitelist, backlink, defaultBackLink);

    res.data = {
      ...res.data,
      backlink: {
        link,
        label,
      },
    };
  } else {
    res.data = {
      ...res.data,
      backlink: defaultBackLink,
    };
  }

  next();
}
