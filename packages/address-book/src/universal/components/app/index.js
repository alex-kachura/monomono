import React, { memo, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { renderRoutes } from 'react-router-config';
import Footer from '../common/footer';
import Header from '../common/header';
import { Grid, Column, Row } from '@beans/grid';
import Breadcrumb from '../common/breadcrumb';
import ScrollToTop from '../common/scroll-top';
import { GridStyled } from './styled';
import { trackEvent, getPageName, PAYLOAD_TYPES, Analytics } from '../../../utils/analytics';

function App(props) {
  const isMountedRef = useRef(false);

  useEffect(() => {
    if (isMountedRef.current) {
      trackEvent(
        Analytics.Location.DirectCallRules.LOCATION_CHANGE,
        PAYLOAD_TYPES.PAGE_NAME,
        getPageName(props.location.pathname),
      );
    }

    isMountedRef.current = true;
  }, [props.location.pathname]);

  return (
    <React.Fragment>
      <ScrollToTop />
      <Header />
      <Grid fixed="lg">
        <Row>
          <Column size={24}>
            <Breadcrumb />
          </Column>
        </Row>
      </Grid>
      <GridStyled fixed="lg">
        <Row>
          <Column size={24} xl={20} centered>
            {renderRoutes(props.route.routes)}
          </Column>
        </Row>
      </GridStyled>
      <Footer />
    </React.Fragment>
  );
}

App.propTypes = {
  route: PropTypes.object,
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }).isRequired,
};

export default memo(App);
