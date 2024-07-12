import styled from "@emotion/styled";
import { TextField } from "@mui/material";
import PropTypes from "prop-types";
import React, { forwardRef } from "react";

const CustomTextField = styled(TextField)(() => ({
  "&.MuiTextField-root": {
    "& .MuiInputBase-input": {
      padding: "14px",
      fontSize: "13px",
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderRadius: "50px",
    },
    "& .css-lccy1c-MuiGrid-root": {
      paddingRight: "0",
    },
    "& .MuiInputLabel-root": {
      color: "#202020",
      fontSize: "13px",
      top: "2px",
      marginTop: "3px",
    },
    "& .MuiInputLabel-shrink": {
      marginTop: "0",
    },
  },
  "& .MuiOutlinedInput-root": {
    // height: fullHeight && "105px",
    "& fieldset>legend": {
      fontSize: "10px",
    },
  },
}));

const RoomNameChangeField = forwardRef(
  (
    {
      id,
      name,
      label,
      variant = "outlined",
      className,
      register,
      disabled,
      error,
      type,
      roomIcon,
      handleBlurRoomName,
    },
    ref
  ) => {
    return (
      <CustomTextField
        inputRef={ref}
        disabled={disabled}
        onBlur={handleBlurRoomName}
        type={type}
        id={id}
        name={name}
        label={label}
        variant={variant}
        className={className}
        helperText={error?.message || ""}
        InputProps={{
          startAdornment: roomIcon,
        }}
        sx={{
          "& .MuiFormHelperText-root": {
            color: "red", // Change the color of the helper text
          },
        }}
      />
    );
  }
);

export default RoomNameChangeField;

RoomNameChangeField.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  label: PropTypes.string,
  variant: PropTypes.oneOf(["outlined", "filled", "standard"]),
  className: PropTypes.string,
  disabled: PropTypes.bool,
};
