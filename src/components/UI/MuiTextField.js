import styled from "@emotion/styled";
import { TextField } from "@mui/material";
import PropTypes from "prop-types";
import React from "react";

const CustomTextField = styled(TextField)(() => ({
  "& .MuiOutlinedInput-root": {
    "&.Mui-focused fieldset": {
      borderColor: "black", // Change the border color when focused
      border: "1px solid",
      color: "black",
    },
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "black", // Change the text color when focused
  },
}));

const MuiTextField = ({
  id,
  name,
  label,
  variant = "outlined",
  className,
  register,
  disabled,
  error,
  type,
}) => {
  return (
    <CustomTextField
      disabled={disabled}
      type={type}
      id={id}
      {...register(id)}
      name={name}
      label={label}
      variant={variant}
      className={className}
      helperText={error?.message || ""}
      sx={{
        "& .MuiFormHelperText-root": {
          color: "red", // Change the color of the helper text
        },
      }}
    />
  );
};

export default MuiTextField;

MuiTextField.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  label: PropTypes.string,
  variant: PropTypes.oneOf(["outlined", "filled", "standard"]),
  className: PropTypes.string,
  disabled: PropTypes.bool,
};
