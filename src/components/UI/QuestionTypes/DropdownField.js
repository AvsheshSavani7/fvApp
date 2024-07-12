import styled from "@emotion/styled";
import React from "react";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import GetIconFile from "../../../assets/GetIconFile";
import { Constants } from "../../../utils/Constants";

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  // width: 259,
  height: 48,
  background: "var(--white, #FFF)",
  position: "relative",
}));

const StyledSelect = styled(Select)(({ filledOut }) => ({
  fontSize: "13px",
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: !filledOut && Constants.MANDATE_BORDER_COLOR,
  },
  // [`& .css-11u53oe-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input`]:
  //   {
  //     padding: "4px 0",
  //     textAlign: "start",
  //   },
}));

const StyledInputLabel = styled(InputLabel)(({ theme }) => ({
  fontSize: "13px",
  marginLeft: "2px",
  color: "#202020",
  fontWeight: 400,
  textAlign: "start",
  position: "absolute",
  pointerEvents: "none",
  transformOrigin: "top left",
  transition: "transform 0.2s ease-out",
  transform: "translate(10px, 14px) scale(1)",

  "&.MuiInputLabel-shrink": {
    transform: "translate(13px, -6px) scale(0.75)",
  },
}));

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  fontSize: "13px",
}));

const ArrowDropDownIcon = () => {
  return <GetIconFile iconName="dropdown-icon" />;
};

const DropdownField = ({
  question,
  value,
  shouldSubQueIconShow,
  options,
  level,
  handleChangeDropdown,
  handleClickSbuQueIcon,
  filledOut,
  subQueFilledOut,
}) => {
  return (
    <StyledFormControl variant="outlined" sx={{ width: "100%", height: 48 }}>
      <StyledInputLabel>{question}</StyledInputLabel>
      <StyledSelect
        filledOut={filledOut}
        value={value || ""}
        onChange={handleChangeDropdown}
        style={{ borderColor: "red !important" }}
        // defaultValue={value || ''}
        label={question}
        sx={{
          padding: "10px 12px 10px 20px",
          borderRadius: "10px",
          "& .MuiInputBase-input": {
            padding: "4px 0",
            textAlign: "start",
            paddingRight: "3px !important",
          },
        }}
        IconComponent={ArrowDropDownIcon}
      >
        {options?.map((option) => (
          <StyledMenuItem value={option}>{option}</StyledMenuItem>
        ))}
      </StyledSelect>
      {shouldSubQueIconShow && level === 1 && (
        <div
          className="absolute top-[22%] -left-3"
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
    </StyledFormControl>
  );
};

export default DropdownField;
