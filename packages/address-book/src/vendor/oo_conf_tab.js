/*
OnlineOpinion v5.9.9
Released: 08/02/2016. Compiled 08/02/2016 02:01:40 PM -0500
Branch: master 2a8b05f36a87035a4e8fac9b85c18815b63da4e3
Components: Full
UMD: disabled
The following code is Copyright 1998-2016 Opinionlab, Inc. All rights reserved. Unauthorized use is prohibited. This product and other products of OpinionLab, Inc. are protected by U.S. Patent No. 6606581, 6421724, 6785717 B1 and other patents pending. http://www.opinionlab.com
*/

/* global window, OOo */

/* [+] Tab configuration */
(function (w, o) {  // eslint-disable-line func-names
  'use strict';

  const query = w.location.search;

  if (!/[?|&]consumer=/.test(query)) {
    const OpinionLabInit = function () { // eslint-disable-line func-names
      o.oo_tab = new o.Ocode({ // eslint-disable-line camelcase
        tab: {
          position: 'right',
          title: 'Feedback',
          tabType: 2,
          verbiage: 'Feedback',
          iconPath: '/account/address-book/images/', // for vertical tab only
        },
        disableMobile: true,
      });
    };

    o.addEventListener(w, 'load', OpinionLabInit, false);
  }
}(window, OOo));
