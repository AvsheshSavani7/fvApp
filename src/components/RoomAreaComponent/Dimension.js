import { Grid } from "@mui/material";
import React, { useEffect } from "react";
import DropdownField from "../UI/QuestionTypes/DropdownField";
import Input from "../UI/Input";
import { useReactHookForm } from "../../hooks/useReactHookForm";
import Button from "../UI/Button";
import BooleanField from "../UI/QuestionTypes/BooleanField";
import NoteField from "../UI/QuestionTypes/NoteField";
import { useSelector } from "react-redux";

const Dimension = ({
  dimension,
  handleChangeDropdown,
  handleDimensionFieldBlur,
  handleRemoveDim,
  activeRoomobj,
  removed,
  handleClickBoolean,
  setIsDragEnabled,
}) => {
  const singleCustomerData = useSelector(
    (state) => state.customerReducer.singleCustomer
  );
  let defaultValues = {
    [dimension.id + "recLength"]:
      dimension?.shape == "Rectangle" &&
      !!dimension?.length &&
      dimension["length"],
    [dimension.id + "trLength"]:
      dimension?.shape == "Triangle" &&
      !!dimension?.length &&
      dimension["length"],
    [dimension.id + "recWidth"]:
      dimension?.shape == "Rectangle" &&
      !!dimension?.width &&
      dimension["width"],
    [dimension.id + "trWidth"]:
      dimension?.shape == "Triangle" &&
      !!dimension?.width &&
      dimension["width"],
    [dimension.id + "radius1"]: !!dimension?.radius1 && dimension["radius1"],
    [dimension.id + "radius2"]: !!dimension?.radius2 && dimension["radius2"],
  };

  const { register, getValues, setValue } = useReactHookForm({
    defaultValues: defaultValues,
    mode: "onBlur",
  });

  // let getRecWidth = getValues(dimension.id + "recWidth");
  // let getTrWidth = getValues(dimension.id + "trWidth");
  // let getRecLength = getValues(dimension.id + "recLength");
  // let getTrLength = getValues(dimension.id + "trLength");
  // let getRadius1 = getValues(dimension.id + "radius1");
  // let getRadius2 = getValues(dimension.id + "radius2");

  useEffect(() => {
    if (dimension?.shape === "Rectangle") {
      setValue(dimension.id + "trLength", "");
      setValue(dimension.id + "trWidth", "");
      setValue(dimension.id + "recLength", dimension?.length);
      setValue(dimension.id + "recWidth", dimension?.width);
      // setValue(
      //   dimension.id + "recLength",
      //   getValues(dimension.id + "recLength")
      // );
      // setValue(dimension.id + "recWidth", getValues(dimension.id + "recWidth"));
    } else if (dimension?.shape === "Triangle") {
      setValue(dimension.id + "recLength", "");
      setValue(dimension.id + "recWidth", "");
      setValue(dimension.id + "trLength", dimension?.length);
      setValue(dimension.id + "trWidth", dimension?.width);
      // setValue(dimension.id + "trLength", getValues(dimension.id + "trLength"));
      // setValue(dimension.id + "trWidth", getValues(dimension.id + "trWidth"));
    } else if (dimension?.shape === "Semi-Ellipse") {
      setValue(dimension.id + "radius1", dimension?.radius1);
      setValue(dimension.id + "radius2", dimension?.radius2);
    }
  }, [activeRoomobj, dimension, removed, singleCustomerData]);

  return (
    <Grid container spacing={0.8} sx={{ py: "4px" }}>
      {/* <Grid item xs={1}>
        <div className="flex justify-center items-center h-10">
          <Button
            className="p-2 w-6 h-6 text-sm rounded-full bg-white text-red-700 border-[1px] border-gray-500 flex justify-center items-center"
            onClick={() => handleRemoveDim(dimension?.id)}
          >
            -
          </Button>
        </div>
      </Grid> */}
      {/* <Grid item xs={4}>
        <DropdownField
          question="Select Shape"
          handleChangeDropdown={(e) =>
            handleChangeDropdown(e.target.value, dimension?.id)
          }
          value={dimension?.shape}
          options={["Rectangle", "Triangle", "Semi-Ellipse"]}
          filledOut={true}
        />
      </Grid> */}
      {dimension?.hasOwnProperty("length") && (
        <Grid item xs={6}>
          <NoteField
            question="Length"
            value={dimension?.length}
            handleNoteBlur={(e) =>
              handleDimensionFieldBlur(e, dimension?.id, "length")
            }
            register={register}
            id={
              dimension?.shape == "Rectangle"
                ? `${dimension?.id + "recLength"}`
                : dimension?.shape == "Triangle" &&
                  `${dimension?.id + "trLength"}`
            }
            name={
              dimension?.shape == "Rectangle"
                ? `${dimension?.id + "recLength"}`
                : dimension?.shape == "Triangle" &&
                  `${dimension?.id + "trLength"}`
            }
            type="number"
            filledOut={true}
          />
          {/* <Input
            id={
              dimension?.shape == "Rectangle"
                ? `${dimension?.id + "recLength"}`
                : dimension?.shape == "Triangle" &&
                  `${dimension?.id + "trLength"}`
            }
            name={
              dimension?.shape == "Rectangle"
                ? `${dimension?.id + "recLength"}`
                : dimension?.shape == "Triangle" &&
                  `${dimension?.id + "trLength"}`
            }
            placeholder="Length"
            register={register}
            onBlur={(e) =>
              handleDimensionFieldBlur(e.target.value, dimension?.id, "length")
            }
            type="number"
          /> */}
        </Grid>
      )}
      {dimension?.hasOwnProperty("width") && (
        <Grid item xs={6}>
          <NoteField
            question="Width"
            value={dimension?.width}
            handleNoteBlur={(e) =>
              handleDimensionFieldBlur(e, dimension?.id, "width")
            }
            register={register}
            id={
              dimension?.shape == "Rectangle"
                ? `${dimension?.id + "recWidth"}`
                : dimension?.shape == "Triangle" &&
                  `${dimension?.id + "trWidth"}`
            }
            name={
              dimension?.shape == "Rectangle"
                ? `${dimension?.id + "recWidth"}`
                : dimension?.shape == "Triangle" &&
                  `${dimension?.id + "trWidth"}`
            }
            type="number"
            filledOut={true}
          />
          {/* <Input
            id={
              dimension?.shape == "Rectangle"
                ? `${dimension?.id + "recWidth"}`
                : dimension?.shape == "Triangle" &&
                  `${dimension?.id + "trWidth"}`
            }
            name={
              dimension?.shape == "Rectangle"
                ? `${dimension?.id + "recWidth"}`
                : dimension?.shape == "Triangle" &&
                  `${dimension?.id + "trWidth"}`
            }
            placeholder="Width"
            register={register}
            onBlur={(e) =>
              handleDimensionFieldBlur(e.target.value, dimension?.id, "width")
            }
            type="number"
          /> */}
        </Grid>
      )}
      {dimension?.hasOwnProperty("radius1") && (
        <Grid item xs={6}>
          <NoteField
            question="Radius 1"
            value={dimension?.radius1}
            handleNoteBlur={(e) =>
              handleDimensionFieldBlur(e, dimension?.id, "radius1")
            }
            register={register}
            id={`${dimension?.id + "radius1"}`}
            name={`${dimension?.id + "radius1"}`}
            type="number"
            filledOut={true}
          />
          {/* <Input
            id={`${dimension?.id + "radius1"}`}
            name={`${dimension?.id + "radius1"}`}
            placeholder="Radius 1"
            register={register}
            onBlur={(e) =>
              handleDimensionFieldBlur(e.target.value, dimension?.id, "radius1")
            }
            type="number"
          /> */}
        </Grid>
      )}
      {dimension?.hasOwnProperty("radius2") && (
        <Grid item xs={6}>
          <NoteField
            question="Radius 2"
            value={dimension?.radius2}
            handleNoteBlur={(e) =>
              handleDimensionFieldBlur(e, dimension?.id, "radius2")
            }
            register={register}
            id={`${dimension?.id + "radius2"}`}
            name={`${dimension?.id + "radius2"}`}
            type="number"
            filledOut={true}
          />
          {/* <Input
            id={`${dimension?.id + "radius2"}`}
            name={`${dimension?.id + "radius2"}`}
            placeholder="Radius 2"
            register={register}
            onBlur={(e) =>
              handleDimensionFieldBlur(e.target.value, dimension?.id, "radius2")
            }
            type="number"
          /> */}
        </Grid>
      )}
      {/* {dimension?.shape && (
        <Grid item xs={1.5}>
          <Input
            id="sqfeet"
            name="sqfeet"
            placeholder="SF"
            //   readOnlyType={true}
            disabled={true}
            register={register}
            value={dimension?.sqFeet || 0}
            isValid={true}
          />
        </Grid>
      )}
      {dimension?.shape && (
        <Grid item xs={2.1}>
          <BooleanField
            question="Closet"
            disabled={true}
            value={dimension?.closet || 0}
            handleClickBoolean={() =>
              handleClickBoolean(dimension?.id, dimension?.closet, "closet")
            }
            shouldSubQueIconShow={false}
            iconWidth="25"
            iconHeight="25"
            setIsDragEnabled={setIsDragEnabled}
            filledOut={true}
          />
        </Grid>
      )}
      {dimension?.shape && (
        <Grid item xs={2.1}>
          <BooleanField
            question="Scope"
            disabled={true}
            value={dimension?.scope || 0}
            handleClickBoolean={() =>
              handleClickBoolean(dimension?.id, dimension?.scope, "scope")
            }
            shouldSubQueIconShow={false}
            iconWidth="25"
            iconHeight="25"
            filledOut={true}
          />
        </Grid>
      )} */}
    </Grid>
  );
};

export default Dimension;
