import { memo } from 'react';
import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = memo(
  createGlobalStyle`
  .address {
    &.is-find-address {
      .postcode {
        margin-bottom: 0px;
      }

      .manual-link {
        display: block;
        margin-top: 8px;
        margin-bottom: 16px;
      }

      .address-field:not(.postcode) {
        display: none;
      }
    }

    .manual-link {
      display: none;
    }

    .postcode {
      margin-bottom: 24px;

      + .address-dropdown {
        margin-top: 20px;
        margin-bottom: 15px;
      }
    }

    .address-dropdown {
      margin-top: 20px;
    }
  }

  html:not(.js) {
    .address {
      .postcode {
        margin-bottom: 24px;
      }

      .address-field:not(.postcode) {
        display: block;
      }

      .manual-link {
        display: none;
      }

      .find-address {
        display: none;
      }
    }
  }
`,
);
