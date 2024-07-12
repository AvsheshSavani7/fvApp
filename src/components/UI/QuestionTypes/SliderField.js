import styled from "@emotion/styled";
import { Slider, TextField } from "@mui/material";
import React from "react";
import { Constants } from "../../../utils/Constants";

const CustomSlider = styled(Slider)(({}) => ({
  "& .MuiSlider-rail": {
    background:
      "var(--linear, linear-gradient(90deg, #4AA91D 0%, #D3E31F 26.56%, #FFF620 46.88%, #FFDF1D 69.79%, #F00 100%))",
    borderRadius: "4px",
    height: "8px",
    opacity: "unset",
  },
  "& .MuiSlider-track": {
    backgroundColor: "unset",
    border: "none",
  },
  "& .MuiSlider-thumb": {
    width: "24px",
    height: "24px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "50%",
    backgroundColor: "white",
    boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.3)",
    zIndex: 2,
    position: "relative",
    fontSize: "14px",
    fontWeight: "bold",
  },
  "& .MuiSlider-mark": {
    height: "6px",
  },
}));

const StyledTextField = styled(TextField)(({ filledOut }) => ({
  "& .MuiInputBase-input[type='file']": {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "50px",
    opacity: 0,
    cursor: "pointer",
  },
  "&.MuiTextField-root": {
    "& .MuiInputBase-input": {
      padding: "14px",
      fontSize: "13px",
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderRadius: "10px",
      borderColor: !filledOut && Constants.MANDATE_BORDER_COLOR,
    },
    "& .MuiInputLabel-root": {
      color: "#202020",
      fontSize: "14px",
      top: "2px",
      marginTop: "3px",
    },
    "& .MuiInputLabel-shrink": {
      marginTop: "0",
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset>legend": {
        fontSize: "10.4px",
      },
    },
  },
}));

const SliderField = ({
  handleChangeSlider,
  value,
  question,
  setIsDragEnabled,
  filledOut,
}) => {
  return (
    <StyledTextField
      sx={{ width: "100%" }}
      label={question}
      filledOut={filledOut}
      InputProps={{
        readOnly: true,
        startAdornment: (
          <CustomSlider
            sx={{ width: "2300%", marginLeft: "30px" }}
            aria-label="Point"
            value={value}
            // valueLabelDisplay="on"
            onChange={handleChangeSlider}
            valueLabelDisplay="auto"
            step={1}
            marks
            min={1}
            max={10}
            onMouseEnter={() => setIsDragEnabled(false)}
            onMouseLeave={() => setIsDragEnabled(true)}
            onTouchStart={() => setIsDragEnabled(false)}
            onTouchEnd={() => setIsDragEnabled(true)}
          />
        ),
      }}
    />
  );
};

export default SliderField;
