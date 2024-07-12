import styled from "@emotion/styled";
import React, { useEffect, useState } from "react";
import { TextField } from "@mui/material";
import { Constants } from "../../../utils/Constants";

const NoteTextField = styled(TextField)(({ fullHeight, filledOut }) => ({
  "&.MuiTextField-root": {
    "& .MuiInputBase-input": {
      padding: fullHeight ? "0" : "14px",
      fontSize: "13px",
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderRadius: "10px",
      borderColor: !filledOut && Constants.MANDATE_BORDER_COLOR,
    },
    "& .css-lccy1c-MuiGrid-root": {
      paddingRight: "0",
    },
    "& .MuiInputLabel-root": {
      color: "#202020",
      fontSize: "13px",
      top: "2px",
      marginTop: "3px",
    },
    "& .MuiInputLabel-shrink": {
      marginTop: "0",
    },
  },
  "& .MuiOutlinedInput-root": {
    // height: fullHeight && "105px",
    "& fieldset>legend": {
      fontSize: "10px",
    },
  },
}));

const NoteField = ({
  question,
  value,
  handleNoteBlur,
  hadMargin,
  multiline = false,
  maxRows,
  minRows,
  name,
  id,
  register,
  latestValue,
  type = "text",
  fullHeight,
  filledOut,
}) => {
  const [focused, setFocused] = useState(false);

  const handleFocus = () => {
    setFocused(true);
  };

  const handleBlur = async (e) => {
    await handleNoteBlur(e);
    setFocused(false);
  };

  useEffect(() => {
    setFocused(false);
  }, [id]);

  return (
    <div className={`${hadMargin && "mt-2"}`}>
      <NoteTextField
        {...register(id)}
        name={name}
        fullHeight={fullHeight}
        filledOut={filledOut}
        id={id}
        type={type}
        variant="outlined"
        fullWidth
        size="small"
        onFocus={handleFocus}
        label={question}
        InputLabelProps={{ shrink: focused || Boolean(latestValue || value) }}
        onBlur={handleBlur}
        multiline={multiline}
        maxRows={maxRows}
        minRows={minRows}
      />
    </div>
  );
};

export default NoteField;
