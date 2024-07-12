import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { Grid } from "@mui/material";
import BooleanField from "../BooleanField";
import NoteField from "../NoteField";
import DropdownField from "../DropdownField";
import { useDispatch, useSelector } from "react-redux";
import {
  checkFilledOut,
  findSubQueAndSetAnswer,
  handleImageCompression,
  subFloorfindSubQueAndSetAnswer,
  subFloorfindSubofSubQueAndSetAnswer,
} from "../../../../helper/helper";
import _ from "lodash";
import ImageField from "../ImageField";
import {
  setImageLoading,
  setImageQuestionId,
} from "../../../../redux/customer";
import { uploadImage } from "../../../../services/customers.service";
import { useReactHookForm } from "../../../../hooks/useReactHookForm";
import SubFloorNoteField from "../SubFloorNoteField";

const SFSubQueGrid = ({
  questionId,
  checkListIndex,
  storeKeyToUpdate,
  hadMargin,
  subFloorSubQuestions,
  setSubFloorSubQuestions,
  setIsDragEnabled,
  setOpen,
  setType,
  setMessage,
}) => {
  const singleCustomerData = useSelector(
    (state) => state.customerReducer.singleCustomer
  );

  const dispatch = useDispatch();

  const setSubQueAnswer = (queObj, value) => {
    let updatedSubQuestion = subFloorSubQuestions?.subQuestions?.map(
      (item) => ({
        ...item,
        subQuestion: item?.subQuestion?.map((subQue) => {
          if (subQue?.id === queObj?.id) {
            return { ...subQue, answer: value };
          }
          return subQue;
        }),
      })
    );

    setSubFloorSubQuestions({
      ...subFloorSubQuestions,
      subQuestions: updatedSubQuestion,
    });
  };

  const setSubofSubQueAnswer = (queObj, value) => {
    let updatedSubQuestion = subFloorSubQuestions?.subQuestions?.map(
      (item) => ({
        ...item,
        subQuestion: item?.subQuestion?.map((subQue) => ({
          ...subQue,
          subQuestion: subQue?.subQuestion?.map((subofsub) => {
            if (subofsub?.id === queObj?.id) {
              return { ...subofsub, answer: value };
            }
            return subofsub;
          }),
        })),
      })
    );

    setSubFloorSubQuestions({
      ...subFloorSubQuestions,
      subQuestions: updatedSubQuestion,
    });
  };

  const handleClickBoolean = (value, queObj, questionType) => {
    if (typeof value === "string") {
      if (questionType === "subQuestion") {
        subFloorfindSubQueAndSetAnswer(
          singleCustomerData,
          questionId,
          queObj,
          checkListIndex,
          false,
          dispatch,
          storeKeyToUpdate
        );
        setSubQueAnswer(queObj, false);
      } else {
        subFloorfindSubofSubQueAndSetAnswer(
          singleCustomerData,
          queObj,
          checkListIndex,
          true,
          dispatch,
          storeKeyToUpdate
        );
      }
    } else {
      if (questionType === "subQuestion") {
        subFloorfindSubQueAndSetAnswer(
          singleCustomerData,
          questionId,
          queObj,
          checkListIndex,
          !value,
          dispatch,
          storeKeyToUpdate
        );
        setSubQueAnswer(queObj, !value);
      } else {
        subFloorfindSubofSubQueAndSetAnswer(
          singleCustomerData,
          queObj,
          checkListIndex,
          !value,
          dispatch,
          storeKeyToUpdate
        );
      }
    }
  };

  const handleNoteBlur = (e, queObj, questionType) => {
    if (questionType === "subQuestion") {
      subFloorfindSubQueAndSetAnswer(
        singleCustomerData,
        questionId,
        queObj,
        checkListIndex,
        e.target.value,
        dispatch,
        storeKeyToUpdate
      );
      setSubQueAnswer(queObj, e.target.value);
    } else {
      subFloorfindSubofSubQueAndSetAnswer(
        singleCustomerData,
        queObj,
        checkListIndex,
        e.target.value,
        dispatch,
        storeKeyToUpdate
      );
    }
  };

  const handleChangeDropdown = (e, queObj, questionType) => {
    if (questionType === "subQuestion") {
      subFloorfindSubQueAndSetAnswer(
        singleCustomerData,
        questionId,
        queObj,
        checkListIndex,
        e.target.value,
        dispatch,
        storeKeyToUpdate
      );
      setSubQueAnswer(queObj, e.target.value);
    } else {
      subFloorfindSubofSubQueAndSetAnswer(
        singleCustomerData,
        queObj,
        checkListIndex,
        e.target.value,
        dispatch,
        storeKeyToUpdate
      );
      setSubofSubQueAnswer(queObj, e.target.value);
    }
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

        subFloorfindSubQueAndSetAnswer(
          singleCustomerData,
          questionId,
          queObj,
          checkListIndex,
          updatedImagesArray,
          dispatch,
          storeKeyToUpdate
        );
        setSubQueAnswer(queObj, updatedImagesArray);
      } else {
        setOpen(true);
        setMessage(imageUploaded?.data?.message || "Something went wrong");
        setType("error");
      }
      dispatch(setImageLoading(false));
    }
  };

  const renderQuestions = (questionobj, questionType) => {
    const filledOut = checkFilledOut(questionobj);
    switch (questionobj?.type) {
      case "BOOLEAN":
        return (
          <BooleanField
            level={questionobj?.level}
            decreasePadding={true}
            question={questionobj?.question}
            value={questionobj?.answer}
            handleClickBoolean={() =>
              handleClickBoolean(questionobj?.answer, questionobj, questionType)
            }
            hasFullWidth={true}
            filledOut={filledOut}
          />
        );
      case "TEXT":
        return (
          <SubFloorNoteField
            question={questionobj?.question}
            value={questionobj?.answer}
            handleNoteBlur={(e) => handleNoteBlur(e, questionobj, questionType)}
            hadMargin={hadMargin}
            id={questionobj?.id}
            name={questionobj?.id}
            filledOut={filledOut}
          />
        );
      case "DROPDOWN":
        return (
          <DropdownField
            level={questionobj?.level}
            question={questionobj?.question}
            value={questionobj?.answer}
            options={questionobj?.option}
            handleChangeDropdown={(e) =>
              handleChangeDropdown(e, questionobj, questionType)
            }
            filledOut={filledOut}
          />
        );
      case "IMAGE":
        return (
          <ImageField
            level={questionobj?.level}
            setIsDragEnabled={setIsDragEnabled}
            question={questionobj?.question}
            questionId={questionobj?.id}
            value={questionobj?.answer}
            options={questionobj?.option}
            handleFileChange={(e) =>
              handleFileChange(e, questionobj?.answer, questionobj)
            }
            files={questionobj?.answer || []}
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
    <Grid container spacing={1} sx={{ px: 1, py: 2 }}>
      {subFloorSubQuestions?.subQuestions?.map((subQue) => (
        <>
          {subQue?.whichGrid === 1 && (
            <Grid item xs={6}>
              {subQue?.subQuestion?.map((innerSubQue, index) => {
                return (
                  <div key={index}>
                    <div>{renderQuestions(innerSubQue, "subQuestion")}</div>
                    <div className="my-4 space-y-4">
                      {innerSubQue?.subQuestion?.map((subOfSubque) => {
                        if (subOfSubque?.whenToShow === innerSubQue?.answer) {
                          return renderQuestions(
                            subOfSubque,
                            "subOfSubQuestion"
                          );
                        }
                      })}
                    </div>
                  </div>
                );
              })}
            </Grid>
          )}
          {subQue?.whichGrid === 2 && (
            <Grid item xs={6}>
              {subQue?.subQuestion?.map((innerSubQue, index) => {
                return (
                  <div key={index}>
                    {renderQuestions(innerSubQue, "subQuestion")}
                    <div className="my-4">
                      {innerSubQue?.subQuestion?.map((subOfSubque) => {
                        if (subOfSubque?.whenToShow === innerSubQue?.answer) {
                          return renderQuestions(
                            subOfSubque,
                            "subOfSubQuestion"
                          );
                        }
                      })}
                    </div>
                  </div>
                );
              })}
            </Grid>
          )}
          {subQue?.whichGrid === 3 && (
            <Grid item xs={12}>
              {subQue?.subQuestion?.map((innerSubQue, index) => {
                return (
                  <div key={index}>
                    {renderQuestions(innerSubQue, "subQuestion")}
                    <div className="my-4">
                      {innerSubQue?.subQuestion?.map((subOfSubque) => {
                        if (subOfSubque?.whenToShow === innerSubQue?.answer) {
                          return renderQuestions(
                            subOfSubque,
                            "subOfSubQuestion"
                          );
                        }
                      })}
                    </div>
                  </div>
                );
              })}
            </Grid>
          )}
        </>
      ))}
    </Grid>
  );
};

export default SFSubQueGrid;

SFSubQueGrid.propTypes = {
  queObj: PropTypes.object,
  shouldSubQueIconShow: PropTypes.bool,
  setSubQuesionsShow: PropTypes.bool,
  setSubofSubQuestions: PropTypes.array,
  storeKeyToUpdate: PropTypes.string,
};
