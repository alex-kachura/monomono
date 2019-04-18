/*
OnlineOpinion v5.9.9
Released: 08/02/2016. Compiled 08/02/2016 02:01:40 PM -0500
Branch: master 2a8b05f36a87035a4e8fac9b85c18815b63da4e3
Components: Full
UMD: disabled
The following code is Copyright 1998-2016 Opinionlab, Inc. All rights reserved. Unauthorized use is prohibited. This product and other products of OpinionLab, Inc. are protected by U.S. Patent No. 6606581, 6421724, 6785717 B1 and other patents pending. http://www.opinionlab.com
*/

/* global window, OOo */

/*
Inline configuration
*********************
Object is now being instantiated against the OOo object (1 global class)
To call this object, place the below in the click event
OOo.oo_launch(event, 'oo_feedback1')
*/
(function (w, o) { // eslint-disable-line func-names
  'use strict';

  const OpinionLabInit = function OpinionLabInit() {
    o.oo_feedback = new o.Ocode({}); // eslint-disable-line camelcase

    o.oo_launch = function () { // eslint-disable-line func-names, camelcase
      const evt = { preventDefault: () => void 0 };

      o.oo_feedback.show(evt);
    };
  };

  o.addEventListener(w, 'load', OpinionLabInit, false);
}(window, OOo));
