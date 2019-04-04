import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import DocumentTitle from 'react-document-title';
import FormGroup from '@beans/form-group';
import { PageTitle, BodyText } from '@beans/typography';
import Panel from '../common/panel';
import Banner from '../common/banner';
import { InputContainer, InputStyled, ButtonStyled } from '../common/styled-components';

export function VerifyPage({ fields, banner, accountLocked, stateToken, csrf, getLocalePhrase }) {
  const pageTitle = getLocalePhrase('pages.verify.title');

  return (
    <DocumentTitle title={pageTitle}>
      <div>
        <PageTitle margin>{pageTitle}</PageTitle>
        <BodyText margin>{getLocalePhrase('pages.verify.sub-title')}</BodyText>
        <Banner {...banner} />
        {!accountLocked ?
          <Panel>
            <BodyText>{getLocalePhrase('pages.verify.digits-prompt')}</BodyText>
            <form method="POST" autoComplete="off" noValidate>
              {
                fields && fields.map((field) => {
                  const { name, id } = field;

                  return (
                    <InputContainer key={name}>
                      <FormGroup
                        labelText={field.label}
                        id={id}
                        required
                        error={!field.isValid}
                        errorMessage=""
                      >
                        <InputStyled
                          id={`${id}-input`}
                          value={field.value}
                          name={name}
                        />
                      </FormGroup>
                    </InputContainer>
                  );
                })
              }
              <input
                id="state"
                name="state"
                type="hidden"
                defaultValue={stateToken}
              />
              <input type="hidden" name="_csrf" value={csrf} />
              <ButtonStyled type="submit" variant="primary">
                {getLocalePhrase('pages.verify.buttons.submit')}
              </ButtonStyled>
            </form>
          </Panel> : null
        }
      </div>
    </DocumentTitle>
  );
}

VerifyPage.propTypes = {
  fields: PropTypes.array.isRequired,
  stateToken: PropTypes.string,
  csrf: PropTypes.string.isRequired,
  getLocalePhrase: PropTypes.func.isRequired,
  banner: PropTypes.object.isRequired,
  accountLocked: PropTypes.bool,
};

function mapStateToProps(state) {
  return {
    fields: state.payload.form.fields,
    stateToken: state.payload.stateToken,
    csrf: state.csrf,
    getLocalePhrase: state.getLocalePhrase,
    banner: state.payload.banner,
    accountLocked: state.payload.accountLocked,
  };
}

export default connect(mapStateToProps)(VerifyPage);
