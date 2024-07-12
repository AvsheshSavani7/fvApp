import React from "react";
import { SubmitDialogConstants } from "../../utils/Constants";

const RemainingFieldText = ({ children, className }) => {
  return (
    <div
      className={`text-[${SubmitDialogConstants.FONT_SIZE}px] ${className}`}
    >
      {children}
    </div>
  );
};

export default RemainingFieldText;
