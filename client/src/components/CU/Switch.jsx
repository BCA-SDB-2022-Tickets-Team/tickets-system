import React from 'react';
import './Switch.css';

const Switch = (props) => {
  return (
    <>
      <input 
        className="react-switch-checkbox"
        id={`react-switch-new`}
        type="checkbox"
        onChange={()=>(props.handleToggle(currentValue => !currentValue))}
      />
       Make Requestor User?
      <label
        className="react-switch-label"
        htmlFor={`react-switch-new`}
      >
        <span className={`react-switch-button`} />
      </label>
    </>
  );
};

export default Switch;