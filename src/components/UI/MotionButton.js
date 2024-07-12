import React from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";

const MotionButton = ({ children, onClick, className, ...rest }) => {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      className={`p-2 text-sm shadow-md borde-black rounded-lg min-w-[120px] select-none ${className}`}
      onClick={onClick}
      {...rest}
    >
      {children}
    </motion.button>
  );
};

export default MotionButton;

MotionButton.propTypes = {
  children: PropTypes.node,
  onClick: PropTypes.func,
  className: PropTypes.string,
};
