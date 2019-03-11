import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { renderRoutes } from 'react-router-config';
import Footer from '../common/footer';
import Header from '../common/header';
import { DefaultThemeProvider } from '@beans/theme';
import { Grid, Column, Row } from '@beans/grid';
import Breadcrumb from '../common/breadcrumb';
import Spinner from '../common/spinner';
import { GlobalStyle, AppContainer, GridStyled } from './styled.js';

const globalStyles = {
  fonts: {
    fileFormats: ['eot', 'woff2', 'woff', 'ttf', 'svg'],
    filePath: '/account/login/fonts',
    styleNames: ['bold', 'regular', 'regularItalic'],
  },
  normalize: true,
};

export class App extends React.Component {
  static propTypes = {
    route: PropTypes.object,
    waiting: PropTypes.bool.isRequired,
  };

  shouldComponentUpdate() {
    return true;
  }

  render() {
    return (
      <DefaultThemeProvider globalStyles={globalStyles}>
        <AppContainer>
          <GlobalStyle />
          <Header />
          <Grid fixed="md">
            <Row>
              <Column size={24}>
                <Breadcrumb />
              </Column>
            </Row>
          </Grid>
          <GridStyled fixed="md">
            <Row>
              <Column size={24} sm={18} md={18} lg={15} xl={12} centered>
                {this.props.waiting ? <Spinner /> : renderRoutes(this.props.route.routes)}
              </Column>
            </Row>
          </GridStyled>
          <Footer />
        </AppContainer>
      </DefaultThemeProvider>
    );
  }
}

function mapStateToProps(state) {
  return {
    waiting: state.getIn(['fetch', 'waiting']),
  };
}

export default connect(mapStateToProps)(App);
