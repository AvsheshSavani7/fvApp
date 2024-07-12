import styled from "@emotion/styled";
import React from "react";
import GetIconFile from "../../../assets/GetIconFile";
import { Constants } from "../../../utils/Constants";

const StyledQueInput = styled("div")(({ decreasePadding, filledOut }) => ({
  // width: "259px",
  height: "48px",
  padding: decreasePadding ? "10px 12px 10px 12px" : "10px 12px 10px 20px",
  display: "flex !important",
  alignItems: "center",
  position: "relative",
  gap: "10px",
  flexShrink: 0,
  border: filledOut
    ? "1.5px solid #D8D8D8"
    : `1.5px solid ${Constants.MANDATE_BORDER_COLOR}`,
  borderRadius: "10px",
  backgroundColor: "#FFF",
}));

const BooleanField = ({
  question,
  value,
  shouldSubQueIconShow,
  handleClickBoolean,
  handleClickSbuQueIcon,
  decreasePadding,
  level,
  hasFullWidth,
  iconWidth,
  iconHeight,
  filledOut,
  subQueFilledOut,
}) => {
  return (
    <StyledQueInput
      disabled
      decreasePadding={decreasePadding}
      className={`${!shouldSubQueIconShow && "!pl-[12px]"}`}
      filledOut={filledOut}
    >
      {/* ${hasFullWidth ? "w-full" : "w-[187px]"} */}
      <div className={`w-full text-[12px] text-start`}>{question}</div>
      <div className="w-[30px] h-[30px] flex justify-center items-center">
        {typeof value === "string" ? (
          <GetIconFile
            onClick={handleClickBoolean}
            iconName="default-icon"
            data={{ width: iconWidth, height: iconHeight }}
          />
        ) : value ? (
          <GetIconFile
            onClick={handleClickBoolean}
            iconName="yes-icon"
            data={{ width: iconWidth, height: iconHeight }}
          />
        ) : (
          <GetIconFile
            onClick={handleClickBoolean}
            iconName="no-icon"
            data={{ width: iconWidth, height: iconHeight }}
          />
        )}
      </div>
      {shouldSubQueIconShow && level === 1 && (
        <div
          className="absolute top-[25%] -left-3"
          onClick={handleClickSbuQueIcon}
        >
          <GetIconFile
            iconName="expand-icon"
            data={
              subQueFilledOut
                ? {}
                : { secondColor: Constants.MANDATE_BORDER_COLOR }
            }
          />
        </div>
      )}
    </StyledQueInput>
  );
};

export default BooleanField;
