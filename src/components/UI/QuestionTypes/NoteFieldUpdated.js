import styled from "@emotion/styled";
import React from "react";
import { TextField } from "@mui/material";
import { useController } from "react-hook-form";

const NoteTextField = styled(TextField)(({ theme }) => ({
  "&.MuiTextField-root": {
    "& .css-1d3z3hw-MuiOutlinedInput-notchedOutline": {
      borderRadius: "10px",
    },
    "& .MuiInputBase-input": {
      padding: "14px",
      fontSize: "13px",
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderRadius: "10px",
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
      // fontSize: "16px",
      marginTop: "0",
      // top: "2px",
    },
    // "& .css-1pysi21-MuiFormLabel-root-MuiInputLabel-root": {
    //   fontSize: "13px",
    //   top: "4px",
    // },
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset>legend": {
      fontSize: "10px", //or whatever works for you
    },
  },
}));

const NoteFieldUpdated = ({
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
  control,
  defaultValue,
}) => {
  return (
    <div className={`${hadMargin && "mt-2"}`}>
      <NoteTextField
        // {...register(id)}
        // name={name}
        // id={id}
        type="text"
        variant="outlined"
        fullWidth
        size="small"
        label={question}
        // defaultValue={value}
        onBlur={handleNoteBlur}
        multiline={multiline}
        maxRows={maxRows}
        minRows={minRows}
        // sx={{
        //   "& .css-1pysi21-MuiFormLabel-root-MuiInputLabel-root": {
        //     fontSize: "13px",
        //     top: "2px",
        //   },
        // }}
      />
    </div>
  );
};

export default NoteFieldUpdated;
