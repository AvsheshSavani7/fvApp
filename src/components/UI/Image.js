import React from "react";
import PropTypes from "prop-types";

const Image = ({ className = "w-15 h-15", src,onClick }) => {
  return <img className={`${className}`} src={src} onClick={onClick}/>;
};

export default Image;

Image.propTypes = {
  src: PropTypes.string,
  className: PropTypes.string,
  onClick: PropTypes.func
};
