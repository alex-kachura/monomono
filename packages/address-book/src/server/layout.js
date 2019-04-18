import serialize from 'serialize-javascript';

function dataLayerTemplate(analytics) {
  return `
  <script type='text/javascript' id='dataLayerBlock'>
    var dataLayer = ${analytics.dataLayer};
  </script>`;
}

function headerScriptTemplate(analytics) {
  return `<script type='text/javascript' src=${analytics.headerScript}></script>`;
}

function footerScriptTemplate(analytics) {
  return `
  <script type='text/javascript'>
    ${analytics.footerScript}
  </script>`;
}

function appDynamicsScript(appKey) {
  return `
    <script>
      window['adrum-start-time'] = new Date().getTime();
      window['adrum-app-key'] = "${appKey}"
    </script>`;
}

export default (data, html, state, assets, styles) => `<!DOCTYPE html>
<html data-lang="${data.lang}">
  <head>
    <title>${data.title}</title>
    <script>document.documentElement.className = "js"</script>
    <link rel=styleSheet href="${assets.bundle.css}" type="text/css" />
    <link rel="shortcut icon" href="/account/address-book/favicon.ico" type="image/x-icon" />
    <meta name="viewport" content="width=device-width, initial-scale=1">
    ${data.appDynamics && data.appDynamics.appKey ? appDynamicsScript(data.appDynamics.appKey) : ''}
    ${data.analytics.active && data.analytics.dataLayer ? dataLayerTemplate(data.analytics) : ''}
    ${
      data.analytics.active && data.analytics.headerScript
        ? headerScriptTemplate(data.analytics)
        : ''
    }
    ${styles}
  </head>
  <body>
    <div id="main">${html}</div>
    <script>
      window.__INITIAL_STATE__ = ${serialize(state, { isJSON: true })}
    </script>
    <script id="config" type="application/json">
      ${serialize(data.config, { isJSON: true })}
    </script>
    <script id="dictionary" type="application/json">
      ${serialize(data.dictionary.phrases, { isJSON: true })}
    </script>
    <script src=${assets.bundle.js}></script>
    <script src=${assets.vendor.js}></script>
    ${
      data.analytics.active && data.analytics.footerScript
        ? footerScriptTemplate(data.analytics)
        : ''
    }
  </body>
</html>`;
