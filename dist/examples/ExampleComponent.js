import React from 'react';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Form } from '@edx/paragon';
import { StrictDict } from 'utils';
import ImportedComponent from './ImportedComponent';
import messages from './messages';
import useExampleComponentData from './hooks';
export const testIds = StrictDict({
  fileControl: 'file-control'
});
export const ExampleComponent = () => {
  const {
    fileInputRef,
    handleClickImportedComponent,
    handleFileInputChange,
    formAction
  } = useExampleComponentData();
  const {
    formatMessage
  } = useIntl();
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Form, {
    action: formAction,
    method: "post"
  }, /*#__PURE__*/React.createElement(Form.Group, {
    controlId: "csv"
  }, /*#__PURE__*/React.createElement(Form.Control, {
    type: "file",
    "data-testid": testIds.fileControl,
    label: formatMessage(messages.fileControlLabel),
    onChange: handleFileInputChange,
    ref: fileInputRef
  }))), /*#__PURE__*/React.createElement(ImportedComponent, {
    className: "imported-component",
    label: messages.importedComponentLabel,
    onClick: handleClickImportedComponent
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", null, formatMessage(messages.heading)), /*#__PURE__*/React.createElement("span", null, formatMessage(messages.span))));
};
ExampleComponent.propTypes = {};
export default ExampleComponent;
//# sourceMappingURL=ExampleComponent.js.map