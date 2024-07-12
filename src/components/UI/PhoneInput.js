import styled from "@emotion/styled";
import { TextField } from "@mui/material";
import React from "react";
import { Controller } from "react-hook-form";
import InputMask from "react-input-mask";
import { Constants } from "../../utils/Constants";

const StyledInput = styled(TextField)(({ hasPadding, isValid }) => ({
  "&.MuiTextField-root": {
    "& .css-1d3z3hw-MuiOutlinedInput-notchedOutline": {
      borderRadius: "10px",
    },
    "& .MuiInputBase-input": {
      padding: "14px",
      fontSize: "14px",
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
      // marginTop: "3px",
    },
    "& .MuiInputLabel-shrink": {
      marginTop: "0",
    },
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset>legend": {
      fontSize: "10px",
    },
  },
}));

const PhoneInput = ({
  inputVal,
  id,
  name,
  type,
  placeholder,
  label,
  value,
  groupClassName,
  className,
  variant = "outlined",
  hasPadding,
  onBlur,
  isValid,
}) => {
  return (
    <>
      {label ? <label className="form-label">{label || ""}</label> : null}
      <InputMask
        className="w-full"
        mask="(+1)999-999-9999"
        defaultValue={value}
        disabled={false}
        maskChar=" "
        onBlur={onBlur}
      >
        {() => (
          <StyledInput
            isValid={isValid}
            label={placeholder}
            variant={variant}
            fullWidth
            id={id}
            name={name}
            type="tel"
            autoComplete="off"
          />
        )}
      </InputMask>

      {/* <span className="error-msg mb-2">
        {errorMsg || (errors[name] ? errors[name].message : "")}
      </span> */}
    </>
  );
};

export default PhoneInput;
