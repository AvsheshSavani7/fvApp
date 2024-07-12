import React from "react";
import { SubmitDialogConstants } from "../../utils/Constants";

const RemainingFieldHeadingText = ({ children, className }) => {
  return (
    <div
      className={`text-[${SubmitDialogConstants.HEADING_FONT_SIZE}px] ${className} font-semibold`}
    >
      {children}
    </div>
  );
};

export default RemainingFieldHeadingText;
