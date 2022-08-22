import React from 'react';
import { FormGroup, Input, Label } from 'reactstrap';
import './Switch.css';

const Switch = (props) => {
  return (
    <FormGroup check switch>
      <Input
        className="react-switch-checkbox"
        id={`react-switch-new`}
        type="checkbox"
        onChange={() => (props.handleToggle(currentValue => !currentValue))}
      />
      Make Requestor User?
      <Label
        className="react-switch-label"
        htmlFor={`react-switch-new`}
      >
        <span className={`react-switch-button`} />
      </Label>
    </FormGroup>
  );
};

export default Switch;