import React from "react";

const RotationIcon = ({
  x,
  y,
  rotationIconColor,
  iconTransform,
  fill,
  ...restProps
}) => {
  return (
    <svg
      x={x}
      y={y}
      width="60"
      height="60"
      viewBox="0 0 256 256"
      fill={fill}
      {...restProps}
    >
      <defs>
        <style>
          {`.cls-11 { fill: ${rotationIconColor}; stroke-width: 0px; }`}
        </style>
      </defs>
      <g transform={iconTransform}>
        <path
          className="cls-11"
          d="M170.5,201.05l-27.92-.82c15.15-48.15,15.15-96.31,0-144.46l27.92-.82c.92-.03,1.22-1.25.42-1.7L106.88,17.27c-.49-.27-1.1-.05-1.3.48l-20.91,56.23c-.29.78.53,1.51,1.27,1.12l17.68-9.19c12.2,41.29,12.19,82.72.18,124.28l-17.85-9.28c-.74-.38-1.56.34-1.27,1.12l20.91,56.23c.19.52.81.75,1.3.48l64.04-35.98c.8-.45.5-1.67-.42-1.7Z"
        />
      </g>
    </svg>
  );
};

export default RotationIcon;
