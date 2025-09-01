import React, { forwardRef } from "react";


const Form = React.memo(
  ({ style: styleProp, children, className, onSubmit }) => {
    return (
      <form style={styleProp} onSubmit={onSubmit} className={`${className}`}>
        {children}
      </form>
    );
  }
);
const Label = ({ style, height, width, htmlFor, children, className }) => {
  return (
    <label
      style={style}
      width={width}
      height={height}
      className={className}
      htmlFor={htmlFor}
    >
      {children}
    </label>
  );
};
const Input = forwardRef(
  ({ style, name, id, value, className, onChange, type, placeholder }, ref) => {
    return (
      <input
        style={style}
        placeholder={placeholder}
        ref={ref}
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        className={className}
        name={name}
      />
    );
  }
);

Form.Label = Label;
Form.Input = Input;
export default Form;
