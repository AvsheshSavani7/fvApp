import { Grid } from "@mui/material";
import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { useReactHookForm } from "../../hooks/useReactHookForm";
import Button from "../UI/Button";
import NoteField from "../UI/QuestionTypes/NoteField";
import { useSelector } from "react-redux";
import BooleanField from "../UI/QuestionTypes/BooleanField";

const RoomItem = ({
  closet,
  handleClosetFieldBlur,
  handleRemoveCloset,
  handleClickBoolean,
  activeRoomobj,
  removed
}) => {
  const singleCustomerData = useSelector(
    (state) => state.customerReducer.singleCustomer
  );
  let defaultValues = {
    itemName: closet?.name,
    SF: closet?.SF,
    LF: closet?.LF
  };

  const { register, getValues, setValue } = useReactHookForm({
    defaultValues: defaultValues,
    mode: "onBlur"
  });

  useEffect(() => {
    setValue("itemName", closet?.name);
    setValue("SF", closet?.SF);
    setValue("LF", closet?.LF);
  }, [activeRoomobj, closet, removed, singleCustomerData]);

  return (
    <Grid container spacing={1} sx={{ py: "5px" }}>
      <Grid item xs={0.9}>
        <div className="flex justify-center items-center h-10">
          <Button
            className="p-2 w-6 h-6 text-sm rounded-full bg-white text-red-700 border-[1px] border-gray-500 flex justify-center items-center"
            onClick={() => handleRemoveCloset(closet?.id)}
          >
            -
          </Button>
        </div>
      </Grid>
      <Grid item xs={4.3}>
        <NoteField
          question="Item Name"
          value={closet?.name}
          handleNoteBlur={(e) => handleClosetFieldBlur(e, closet?.id, "name")}
          register={register}
          id="itemName"
          name="itemName"
          type="text"
          filledOut={true}
        />
      </Grid>
      <Grid item xs={3.3}>
        <NoteField
          question="SF"
          value={closet?.SF}
          handleNoteBlur={(e) => handleClosetFieldBlur(e, closet?.id, "SF")}
          register={register}
          id="SF"
          name="SF"
          type="number"
          filledOut={true}
        />
      </Grid>
      <Grid item xs={3.3}>
        <NoteField
          question="LF"
          value={closet?.SF}
          handleNoteBlur={(e) => handleClosetFieldBlur(e, closet?.id, "LF")}
          register={register}
          id="LF"
          name="LF"
          type="number"
          filledOut={true}
        />
      </Grid>
      {/* <Grid item xs={3.3}>
        <BooleanField
          question="Scope"
          disabled={true}
          value={closet?.scope || 0}
          handleClickBoolean={() =>
            handleClickBoolean(closet?.id, closet?.scope)
          }
          shouldSubQueIconShow={false}
          iconWidth="25"
          iconHeight="25"
          filledOut={true}
        />
      </Grid> */}
    </Grid>
  );
};

export default RoomItem;

RoomItem.propTypes = {
  closet: PropTypes.object,
  handleClosetFieldBlur: PropTypes.func,
  handleRemoveCloset: PropTypes.func,
  activeRoomobj: PropTypes.object,
  removed: PropTypes.bool
};
