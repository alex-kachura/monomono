import 'url-search-params-polyfill';
import React, { memo, useEffect, useRef, useMemo } from 'react';
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

  const inline = useMemo(() => {
    const params = new URLSearchParams(props.location.search.substring(1));

    return params.has('consumer');
  }, [props.location.search]);

  return (
    <React.Fragment>
      <ScrollToTop />
      {!inline && <Header />}
      {!inline && (
        <Grid fixed="lg">
          <Row>
            <Column size={24}>
              <Breadcrumb />
            </Column>
          </Row>
        </Grid>
      )}
      <GridStyled fixed="lg">
        <Row>
          <Column size={24} xl={20} centered>
            {renderRoutes(props.route.routes)}
          </Column>
        </Row>
      </GridStyled>
      {!inline && <Footer />}
    </React.Fragment>
  );
}

App.propTypes = {
  route: PropTypes.object,
  location: PropTypes.shape({
    pathname: PropTypes.string,
    search: PropTypes.string,
  }).isRequired,
};

export default memo(App);
