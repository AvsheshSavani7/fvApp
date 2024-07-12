import React from "react";
import PropTypes from "prop-types";
import { Button } from "@mui/material";

const MuiButton = ({
  className,
  color = "primary",
  size = "small",
  variant = "contained",
  style = { gap: 3, padding: "6px 20px" },
  type,
  children,
  onClick,
}) => {
  return (
    <Button
      className={className}
      color={color}
      size={size}
      variant={variant}
      type={type}
      style={style}
      onClick={onClick}
    >
      {children}
    </Button>
  );
};

export default MuiButton;

MuiButton.propTypes = {
  className: PropTypes.string,
  buttonName: PropTypes.string,
  type: PropTypes.string,
  variant: PropTypes.string,
  color: PropTypes.string,
  style: PropTypes.object,
  onClick: PropTypes.func,
};
