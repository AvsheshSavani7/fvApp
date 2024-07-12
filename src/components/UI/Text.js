import React from "react";
import PropTypes from "prop-types";

const Text = ({ className = "text-[16px]", children, style }) => {
  return (
    <div className={`${className || "text-black overflow-hidden text-ellipsis"}`} style={style}>
      {children}
    </div>
  );
};

export default Text;

Text.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  style: PropTypes.object,
};
