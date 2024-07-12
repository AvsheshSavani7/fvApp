import React from "react";
import { TextField, styled } from "@mui/material";

const WallLengthTextField = styled(TextField)(({}) => ({
  "&.MuiTextField-root": {
    "& .MuiInputBase-input": {
      padding: "10px",
      fontSize: "13px",
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderRadius: "10px",
    },
    "& .css-lccy1c-MuiGrid-root": {
      paddingRight: "0",
    },
    "& .MuiInputLabel-root": {
      color: "#202020",
      fontSize: "13px",
      marginTop: "-5px",
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

const WallLengthField = (props) => {
  const {
    onChange,
    disabled,
    label,
    value,
    type = "number",
    ...restProps
  } = props;

  return (
    <WallLengthTextField
      label={label}
      type={type}
      value={value}
      onChange={onChange}
      disabled={disabled}
      {...restProps}
    />
  );
};

export default WallLengthField;
