import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { renderRoutes } from 'react-router-config';
import Footer from '../common/footer';
import Header from '../common/header';
import { Grid, Column, Row } from '@beans/grid';
import { RootElement } from '@beans/foundation';
import Breadcrumb from '../common/breadcrumb';
import { GlobalStyle, GridStyled } from './styled.js';

function App(props) {
  return (
    <RootElement>
      <GlobalStyle />
      <Header />
      <Grid fixed="md">
        <Row>
          <Column size={24}>
            <Breadcrumb />
          </Column>
        </Row>
      </Grid>
      <GridStyled fixed="sm">
        <Row>
          <Column size={24} sm={24} md={18} lg={14.4} xl={12} centered>
            {renderRoutes(props.route.routes)}
          </Column>
        </Row>
      </GridStyled>
      <Footer />
    </RootElement>
  );
}

App.propTypes = {
  route: PropTypes.object,
};

export default memo(App);
