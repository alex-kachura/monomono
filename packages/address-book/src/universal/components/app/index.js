import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { renderRoutes } from 'react-router-config';
import Footer from '../common/footer';
import Header from '../common/header';
import { Grid, Column, Row } from '@beans/grid';
import Breadcrumb from '../common/breadcrumb';
import { GridStyled } from './styled';

function App(props) {
  return (
    <React.Fragment>
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
};

export default memo(App);
