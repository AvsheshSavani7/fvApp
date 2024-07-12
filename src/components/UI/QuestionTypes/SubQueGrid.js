import styled from "@emotion/styled";
import React, { useCallback, useEffect, useMemo, useState } from "react";
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
  checkFilledOut,
  checkFilledOutFromAnswer,
  checkSubQueFilledOut,
  findSubQueAndSetAnswer,
  handleImageCompression,
} from "../../../helper/helper";
import _ from "lodash";
import { useReactHookForm } from "../../../hooks/useReactHookForm";
import ImageField from "./ImageField";
import { uploadImage } from "../../../services/customers.service";

const SubQueGrid = ({
  queObj,
  questionId,
  setSubQuesionsShow,
  checkListIndex,
  setSubofSubQuestions,
  setSubofSubQuestionObj,
  subQuestions,
  setSubQuestions,
  storeKeyToUpdate,
  hadMargin,
  setIsDragEnabled,
}) => {
  const singleCustomerData = useSelector(
    (state) => state.customerReducer.singleCustomer
  );

  const dispatch = useDispatch();

  let shouldSubQueIconShow = queObj?.subQuestion?.some(
    (subQue) => subQue?.whenToShow == queObj?.answer
  );
  // if (queObj?.type == "BOOLEAN") {
  // }

  const getSubofSubQue = (queObj, value) => {
    let filteredSubsQuestions = queObj?.subQuestion?.filter(
      (que) => que?.whenToShow == value
    );

    console.log("filteredSubsQuestions", filteredSubsQuestions, value);
    setSubofSubQuestionObj({
      subQueId: queObj?.id,
      checkListIndex: checkListIndex,
    });

    let tmpSubQue = [...subQuestions?.subQuestions];
    let findSubQue = tmpSubQue?.find((que) => que?.id == queObj?.id);
    let updateSubQue = { ...findSubQue, answer: value };

    let subQueIndex = tmpSubQue?.findIndex((que) => que?.id === queObj?.id);
    tmpSubQue[subQueIndex] = updateSubQue;

    setSubQuestions({
      ...subQuestions,
      subQuestions: tmpSubQue,
    });

    if (
      storeKeyToUpdate === "existing_materials" &&
      subQuestions?.mainQuestion === "Are there any bevels"
    ) {
      if (filteredSubsQuestions?.length > 0) {
        setSubofSubQuestions(filteredSubsQuestions);
      }
    } else {
      if (filteredSubsQuestions?.length > 0) {
        setSubofSubQuestions((prev) => {
          return [...prev, ...filteredSubsQuestions];
        });
      } else {
        setSubofSubQuestions((prev) => {
          const updatedSubQuestions = _.differenceWith(
            prev,
            queObj?.subQuestion,
            _.isEqual
          );
          return updatedSubQuestions;
        });
      }
    }
  };

  const handleClickBoolean = (value) => {
    if (typeof value === "string") {
      findSubQueAndSetAnswer(
        singleCustomerData,
        questionId,
        queObj,
        checkListIndex,
        false,
        dispatch,
        storeKeyToUpdate
      );
      getSubofSubQue(queObj, false);
    } else {
      findSubQueAndSetAnswer(
        singleCustomerData,
        questionId,
        queObj,
        checkListIndex,
        !value,
        dispatch,
        storeKeyToUpdate
      );
      getSubofSubQue(queObj, !value);
    }
  };

  const handleNoteBlur = (e) => {
    // if (!!e.target.value) {
    findSubQueAndSetAnswer(
      singleCustomerData,
      questionId,
      queObj,
      checkListIndex,
      e.target.value,
      dispatch,
      storeKeyToUpdate
    );
    // }
  };

  const { register, setValue, errors, watch, getValues } = useReactHookForm({
    defaultValues: { [queObj?.id]: queObj?.answer },
    mode: "onchange",
  });

  useEffect(() => {
    setValue(queObj?.id, queObj?.answer);
  }, [queObj?.id]);

  const handleChangeDropdown = (e) => {
    findSubQueAndSetAnswer(
      singleCustomerData,
      questionId,
      queObj,
      checkListIndex,
      e.target.value,
      dispatch,
      storeKeyToUpdate
    );
    getSubofSubQue(queObj, e.target.value);
  };

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

        findSubQueAndSetAnswer(
          singleCustomerData,
          questionId,
          queObj,
          checkListIndex,
          updatedImagesArray,
          dispatch,
          storeKeyToUpdate
        );
        getSubofSubQue(queObj, updatedImagesArray);
        // setSubQueAnswer(queObj, updatedImagesArray);
      }
      // else {
      //   setOpen(true);
      //   setMessage(imageUploaded?.data?.message || "Something went wrong");
      //   setType("error");
      // }
      dispatch(setImageLoading(false));
    }
  };

  let filledOut = useMemo(() => {
    let mainQue = singleCustomerData?.[storeKeyToUpdate]?.[
      checkListIndex
    ]?.all_questions?.find((que) => que?.id === questionId);

    let findQue = mainQue?.subQuestion?.find(
      (subque) => subque?.id === queObj?.id
    );

    // queObj?.type === "TEXT" ? getValues(queObj?.id) : findQue?.answer
    let fill = checkFilledOutFromAnswer(
      queObj,
      findQue?.answer,
      storeKeyToUpdate
    );
    return fill;
  }, [singleCustomerData]);

  const renderQuestions = (type) => {
    switch (type) {
      case "BOOLEAN":
        return (
          <BooleanField
            level={queObj?.level}
            decreasePadding={true}
            question={queObj?.question}
            value={queObj?.answer}
            handleClickBoolean={() => handleClickBoolean(queObj?.answer)}
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
            type={queObj?.fieldType || "text"}
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
            handleChangeDropdown={handleChangeDropdown}
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

export default SubQueGrid;

SubQueGrid.propTypes = {
  queObj: PropTypes.object,
  shouldSubQueIconShow: PropTypes.bool,
  setSubQuesionsShow: PropTypes.bool,
  setSubofSubQuestions: PropTypes.array,
  storeKeyToUpdate: PropTypes.string,
};
