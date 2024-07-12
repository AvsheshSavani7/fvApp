import styled from "@emotion/styled";
import { TextField } from "@mui/material";
import React from "react";
import { Constants } from "../../utils/Constants";

const StyledInput = styled(TextField)(({ hasFixWidth, isValid }) => ({
  "&.MuiTextField-root": {
    width: hasFixWidth && "64px",
    "& .MuiInputBase-input": {
      padding: "14px",
      fontSize: "13px",
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderRadius: "10px",
      borderColor: !isValid && Constants.MANDATE_BORDER_COLOR,
    },
    "& .css-lccy1c-MuiGrid-root": {
      paddingRight: "0",
    },
    "& .MuiInputLabel-root": {
      color: "#202020",
      fontSize: "13px",
      // top: "2px",
      marginTop: "-2px",
    },
    "& .MuiInputLabel-shrink": {
      marginTop: "2px",
    },
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset>legend": {
      fontSize: "10px",
    },
  },
}));

const Input = ({
  inputVal,
  id,
  name,
  type,
  placeholder,
  label,
  rules,
  errors,
  register,
  disabled,
  errorMsg,
  value,
  readOnlyType,
  onFocusEvent,
  inputGroupText,
  copyIcon,
  groupClassName,
  className,
  pattern,
  option,
  variant = "outlined",
  height,
  hasPadding,
  error,
  hasFixWidth,
  ...restVal
}) => {
  const { ref, ...rest } = register(name, rules || {});

  return (
    <>
      {label ? <label className="form-label">{label || ""}</label> : null}
      <div className={groupClassName || ""}>
        <StyledInput
          hasFixWidth={hasFixWidth}
          label={placeholder}
          hasPadding={hasPadding}
          variant={variant}
          id={id}
          name={name}
          type={type}
          autoComplete="off"
          inputRef={ref}
          disabled={disabled}
          value={value}
          readOnly={readOnlyType || false}
          onFocus={onFocusEvent}
          className={`${className || ""} ${
            type === "textarea" ? "textarea" : ""
          }`}
          sx={{
            width: "100%",
            "& .MuiFormHelperText-root": {
              color: "red",
            },
          }}
          {...rest}
          {...restVal}
          helperText={error?.message || ""}
        />
      </div>
    </>
  );
};

export default Input;
