import styled from "@emotion/styled";
import React, { useCallback, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import { Grid } from "@mui/material";
import BooleanField from "./BooleanField";
import NoteField from "./NoteField";
import DropdownField from "./DropdownField";
import { useDispatch, useSelector } from "react-redux";
import {
  setImageLoading,
  setImageQuestionId,
  singleCustomer,
} from "../../../redux/customer";
import {
  checkFilledOutFromAnswer,
  findSubofSubQueAndSetAnswer,
  getSubofSubQuestions,
  handleImageCompression,
} from "../../../helper/helper";
import { useReactHookForm } from "../../../hooks/useReactHookForm";
import { uploadImage } from "../../../services/customers.service";
import ImageField from "./ImageField";

const SubofSubQueGrid = ({
  queObj,
  questionId,
  setSubQuesionsShow,
  checkListIndex,
  setSubofSubQuestions,
  subofSubQuestions,
  storeKeyToUpdate,
  hadMargin,
  setIsDragEnabled,
}) => {
  const singleCustomerData = useSelector(
    (state) => state.customerReducer.singleCustomer
  );

  const dispatch = useDispatch();

  let shouldSubQueIconShow;

  if (queObj?.type == "BOOLEAN") {
    shouldSubQueIconShow = queObj?.subQuestion?.some(
      (subQue) => subQue?.whenToShow == queObj?.answer
    );
  }

  const handleFileChange = async (event, currentImages, queObj) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      dispatch(setImageLoading(true));
      dispatch(setImageQuestionId(queObj?.id));

      const compressedFile = await handleImageCompression(selectedFile);

      let formData = new FormData();
      formData.append("file", compressedFile);
      formData.append("originalname", selectedFile?.name);

      let imageUploaded = await uploadImage(formData);

      if (imageUploaded.data.status) {
        let updatedImagesArray = [
          ...currentImages,
          imageUploaded?.data?.entity,
        ];

        findSubofSubQueAndSetAnswer(
          singleCustomerData,
          questionId,
          queObj,
          checkListIndex,
          updatedImagesArray,
          dispatch,
          storeKeyToUpdate
        );
        let tmpSubofSubQue = [...subofSubQuestions];
        let findSubofSubQue = tmpSubofSubQue?.find(
          (que) => que?.id == queObj?.id
        );
        let updateSubofSubQue = {
          ...findSubofSubQue,
          answer: updatedImagesArray,
        };

        let subofSubQueIndex = tmpSubofSubQue?.findIndex(
          (que) => que?.id === queObj?.id
        );
        tmpSubofSubQue[subofSubQueIndex] = updateSubofSubQue;
        setSubofSubQuestions(tmpSubofSubQue);
      }
      // else {
      //   setOpen(true);
      //   setMessage(imageUploaded?.data?.message || "Something went wrong");
      //   setType("error");
      // }
      dispatch(setImageLoading(false));
    }
  };

  const handleNoteBlur = (e) => {
    // if (!!e.target.value) {
    findSubofSubQueAndSetAnswer(
      singleCustomerData,
      questionId,
      queObj,
      checkListIndex,
      e.target.value,
      dispatch,
      storeKeyToUpdate
    );

    let tmpSubofSubQue = [...subofSubQuestions];
    let findSubofSubQue = tmpSubofSubQue?.find((que) => que?.id == queObj?.id);
    let updateSubofSubQue = { ...findSubofSubQue, answer: e.target.value };

    let subofSubQueIndex = tmpSubofSubQue?.findIndex(
      (que) => que?.id === queObj?.id
    );
    tmpSubofSubQue[subofSubQueIndex] = updateSubofSubQue;
    setSubofSubQuestions(tmpSubofSubQue);
    // }
  };

  const { register, setValue, errors, watch, getValues } = useReactHookForm({
    defaultValues: { [queObj?.id]: queObj?.answer },
    mode: "onchange",
  });

  useEffect(() => {
    setValue(queObj?.id, queObj?.answer);
  }, [queObj?.id]);

  let filledOut = useMemo(() => {
    let fill = checkFilledOutFromAnswer(
      queObj,
      queObj?.type === "TEXT" ? getValues(queObj?.id) : queObj?.answer
    );
    return fill;
  }, [singleCustomerData]);

  const renderQuestions = (type) => {
    console.log("subofsub", queObj);
    switch (type) {
      case "BOOLEAN":
        return (
          <BooleanField
            level={queObj?.level}
            decreasePadding={true}
            question={queObj?.question}
            value={queObj?.answer}
            // handleClickBoolean={() => handleClickBoolean(queObj?.answer)}
            shouldSubQueIconShow={shouldSubQueIconShow}
            filledOut={filledOut}
          />
        );
      case "TEXT":
        return (
          <NoteField
            question={queObj?.question}
            value={queObj?.answer}
            shouldSubQueIconShow={shouldSubQueIconShow}
            handleNoteBlur={handleNoteBlur}
            hadMargin={hadMargin}
            register={register}
            id={queObj?.id}
            name={queObj?.id}
            latestValue={getValues(queObj?.id) || ""}
            filledOut={filledOut}
          />
        );
      case "DROPDOWN":
        return (
          <DropdownField
            level={queObj?.level}
            question={queObj?.question}
            value={queObj?.answer}
            options={queObj?.option}
            shouldSubQueIconShow={shouldSubQueIconShow}
            filledOut={filledOut}
          />
        );
      case "IMAGE":
        return (
          <ImageField
            level={queObj?.level}
            question={queObj?.question}
            questionId={queObj?.id}
            value={queObj?.answer}
            handleFileChange={(e) =>
              handleFileChange(e, queObj?.answer, queObj)
            }
            files={queObj?.answer || []}
            hasMargin={true}
            setIsDragEnabled={setIsDragEnabled}
            filledOut={filledOut}
            type="CHECKLIST"
            checkListIndex={checkListIndex}
            storeKeyToUpdate={storeKeyToUpdate}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Grid item xs={12} md={queObj?.col} key={queObj?.id}>
      {renderQuestions(queObj?.type)}
    </Grid>
    // <div className={`col-span-${queObj?.col}`} key={queObj?.question}>
    //   {renderQuestions(queObj?.type)}
    // </div>
  );
};

export default SubofSubQueGrid;

SubofSubQueGrid.propTypes = {
  queObj: PropTypes.object,
  shouldSubQueIconShow: PropTypes.bool,
  setSubQuesionsShow: PropTypes.bool,
  setSubofSubQuestions: PropTypes.array,
  storeKeyToUpdate: PropTypes.string,
};
