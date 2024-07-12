import styled from "@emotion/styled";
import React, { useEffect } from "react";
import { TextField } from "@mui/material";
import { useReactHookForm } from "../../../hooks/useReactHookForm";
import { Constants } from "../../../utils/Constants";

const NoteTextField = styled(TextField)(({ filledOut }) => ({
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

const SubFloorNoteField = ({
  question,
  value,
  handleNoteBlur,
  hadMargin,
  multiline = false,
  maxRows,
  minRows,
  name,
  id,
  filledOut,
}) => {
  const { register, setValue, errors, watch, getValues } = useReactHookForm({
    defaultValues: { [id]: value },
    mode: "onchange",
  });

  useEffect(() => {
    setValue(id, value);
  }, [id]);

  return (
    <div className={`${hadMargin && "mt-2"}`}>
      <NoteTextField
        {...register(id)}
        name={name}
        filledOut={filledOut}
        id={id}
        type="text"
        variant="outlined"
        fullWidth
        size="small"
        label={question}
        defaultValue={value}
        onBlur={handleNoteBlur}
        multiline={multiline}
        maxRows={maxRows}
        minRows={minRows}
      />
    </div>
  );
};

export default SubFloorNoteField;
