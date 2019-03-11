/* eslint-disable react/jsx-no-bind */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import DocumentTitle from 'react-document-title';
import Input from '@beans/input';
import Panel from '../common/panel';
import * as SaveDataActions from '../../thunks/save-data';
import * as FormActions from '../../thunks/form';
import { PageTitle } from '@beans/typography';
import { FormGroupStyled, ButtonStyled } from './styled';
import { getErrorMessage } from '../../../utils/validation';

export class EditPage extends React.Component {
  static propTypes = {
    fields: PropTypes.object.isRequired,
    csrf: PropTypes.string.isRequired,
    focusFieldId: PropTypes.string,
    getLocalePhrase: PropTypes.func.isRequired,
    saveData: PropTypes.func.isRequired,
    fieldChange: PropTypes.func.isRequired,
    fieldBlur: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.setInputRef = this.setInputRef.bind(this);
    this.setFormRef = this.setFormRef.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.inputRefs = {};
    this.formRef = {};
  }

  componentDidMount() {
    const { focusFieldId } = this.props;

    if (focusFieldId && this.inputRefs[focusFieldId]) {
      this.inputRefs[focusFieldId].focus();
    }
  }

  shouldComponentUpdate() {
    return true;
  }

  componentDidUpdate() {
    const { focusFieldId } = this.props;

    if (focusFieldId && this.inputRefs[focusFieldId]) {
      this.inputRefs[focusFieldId].focus();
    }
  }

  setInputRef(input, id) {
    this.inputRefs[id] = input;
  }

  setFormRef(form) {
    this.formRef = form;
  }

  handleSubmit(e) {
    e.preventDefault();

    this.props.saveData('sampleData');
  }

  render() {
    const { fields, csrf, getLocalePhrase, fieldChange, fieldBlur } = this.props;

    return (
      <DocumentTitle title={getLocalePhrase('pages.landing.title')}>
        <div>
          <PageTitle margin>{getLocalePhrase('pages.edit.title')}</PageTitle>
          <Panel>
            <form
              autoComplete="off"
              noValidate
              method="POST"
              onSubmit={this.handleSubmit}
              ref={this.setFormRef}
            >
              {
                fields.map((field) => {
                  const name = field.get('name');

                  return (
                    <FormGroupStyled
                      key={field.get('label')}
                      labelText={getLocalePhrase(field.get('label'))}
                      id={field.get('id')}
                      required
                      error={!field.get('isValid')}
                      errorMessage={getErrorMessage(field, getLocalePhrase)}
                    >
                      <Input
                        type="text"
                        name={name}
                        id={`${field.get('id')}-input`}
                        value={field.get('value')}
                        domRef={(input) => this.setInputRef(input, field.get('id'))} // eslint-disable-line
                        onChange={(e) =>
                          fieldChange({
                            fieldName: name,
                            value: e.target.value,
                            hasBlurred: field.get('hasBlurred'),
                          })
                        }
                        onBlur={(e) =>
                          fieldBlur({
                            fieldName: name,
                            value: e.target.value,
                            hasBlurred: true,
                          })
                        }
                      />
                    </FormGroupStyled>
                  );
                })
              }
              <input type="hidden" name="_csrf" value={csrf} />
              <ButtonStyled type="submit">
                {getLocalePhrase('pages.edit.submit-btn')}
              </ButtonStyled>
            </form>
          </Panel>
        </div>
      </DocumentTitle>
    );
  }
}

function mapStateToProps(state) {
  const form = state.getIn(['payload', 'form']);

  return {
    fields: form.get('fields'),
    isFormValid: form.get('isFormValid'),
    formSubmitted: form.get('formSubmitted'),
    focusFieldId: form.get('focusFieldId'),
    csrf: state.get('csrf'),
    getLocalePhrase: state.get('getLocalePhrase'),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ ...SaveDataActions, ...FormActions }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(EditPage);
