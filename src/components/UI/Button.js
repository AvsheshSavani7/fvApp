import React from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";

const Button = ({
  className,
  id,
  children,
  type,
  onClick,
  disabled,
  style = {},
}) => {
  return (
    <motion.button
      className={` ${className}`}
      id={id}
      type={type}
      onClick={onClick}
      whileTap={{ scale: 0.9 }}
      style={style}
      disabled={disabled}
    >
      {children}
    </motion.button>
  );
};

export default Button;

Button.propTypes = {
  className: PropTypes.string,
  buttonName: PropTypes.string,
  type: PropTypes.string,
  onClick: PropTypes.func,
};
