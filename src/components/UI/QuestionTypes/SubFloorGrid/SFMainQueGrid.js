import styled from "@emotion/styled";
import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { Grid } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import DropdownField from "../DropdownField";
import NoteField from "../NoteField";
import BooleanField from "../BooleanField";
import {
  checkFilledOut,
  checkSubQueFilledOut,
  findQueAndSetAnswer,
} from "../../../../helper/helper";
import { useReactHookForm } from "../../../../hooks/useReactHookForm";

const SFMainQueGrid = ({
  queObj,
  setSubFLoorSubQuestionsShow,
  setSubFloorSubQuestions,
  checkListIndex,
  setSubofSubQuestions,
  storeKeyToUpdate,
}) => {
  const singleCustomerData = useSelector(
    (state) => state.customerReducer.singleCustomer
  );
  const checkListActiveBtn = useSelector(
    (state) => state.customerReducer.checkListActiveBtn
  );

  const dispatch = useDispatch();

  let shouldSubQueIconShow = queObj?.subQuestion?.some((subQueGrid) =>
    subQueGrid?.subQuestion?.some(
      (subQue) => subQue?.whenToShow == queObj?.answer
    )
  );

  const getSubQuestions = (findQue, value) => {
    const filteredSubQuestions = findQue.subQuestion
      .map((item) => ({
        ...item,
        subQuestion: item.subQuestion.filter(
          (subItem) => subItem.whenToShow === value
        ),
      }))
      .filter((item) => item.subQuestion.length > 0);

    if (filteredSubQuestions?.length > 0) {
      setSubFLoorSubQuestionsShow(true);
    } else {
      setSubFLoorSubQuestionsShow(false);
    }

    setSubFloorSubQuestions({
      mainQuestion: findQue?.question,
      mainQuestionAnswer: value,
      subQuestions: filteredSubQuestions,
      questionId: queObj?.id,
      checkListIndex: checkListIndex,
    });
  };

  const handleClickBoolean = (value, type) => {
    if (typeof value === "string") {
      if (type == "yesOrNo") {
        let allQuestions = findQueAndSetAnswer(
          singleCustomerData,
          queObj,
          checkListIndex,
          false,
          dispatch,
          storeKeyToUpdate
        );
        let findQue = allQuestions?.find((que) => que?.id == queObj?.id);
        let newValue = false;
        getSubQuestions(findQue, newValue);
      } else {
        getSubQuestions(queObj, value);
      }
    } else {
      if (type == "yesOrNo") {
        let allQuestions = findQueAndSetAnswer(
          singleCustomerData,
          queObj,
          checkListIndex,
          !value,
          dispatch,
          storeKeyToUpdate
        );
        let findQue = allQuestions?.find((que) => que?.id == queObj?.id);
        let newValue = !value;
        getSubQuestions(findQue, newValue);
      } else {
        getSubQuestions(queObj, value);
      }
    }
  };

  const handleChangeDropdown = (value, type) => {
    if (type == "yesOrNo") {
      let allQuestions = findQueAndSetAnswer(
        singleCustomerData,
        queObj,
        checkListIndex,
        value,
        dispatch,
        storeKeyToUpdate
      );

      let findQue = allQuestions?.find((que) => que?.id == queObj?.id);

      getSubQuestions(findQue, value);
    } else {
      getSubQuestions(queObj, value);
    }
  };

  const handleNoteBlur = (e) => {
    findQueAndSetAnswer(
      singleCustomerData,
      queObj,
      checkListIndex,
      e.target.value,
      dispatch,
      storeKeyToUpdate
    );
  };

  const { register, setValue, errors, watch, getValues } = useReactHookForm({
    defaultValues: { [queObj?.id]: queObj?.answer },
    mode: "onchange",
  });

  useEffect(() => {
    setValue(queObj?.id, queObj?.answer);
  }, [queObj?.id]);

  const filledOut = checkFilledOut(queObj);
  const subQueFilledOut = checkSubQueFilledOut(queObj, "subFloor");

  const renderQuestions = (type) => {
    switch (type) {
      case "BOOLEAN":
        return (
          <BooleanField
            level={queObj?.level}
            question={queObj?.question}
            value={queObj?.answer}
            handleClickBoolean={() =>
              handleClickBoolean(queObj?.answer, "yesOrNo")
            }
            handleClickSbuQueIcon={() =>
              handleClickBoolean(queObj?.answer, "subQueIcon")
            }
            shouldSubQueIconShow={shouldSubQueIconShow}
            filledOut={filledOut}
            subQueFilledOut={subQueFilledOut}
          />
        );
      case "TEXT":
        return (
          <div className="mt-1">
            <NoteField
              question={queObj?.question}
              value={queObj?.answer}
              shouldSubQueIconShow={shouldSubQueIconShow}
              handleNoteBlur={handleNoteBlur}
              register={register}
              id={queObj?.id}
              name={queObj?.id}
              latestValue={getValues(queObj?.id) || ""}
              filledOut={filledOut}
              subQueFilledOut={subQueFilledOut}
            />
          </div>
        );
      case "DROPDOWN":
        return (
          <DropdownField
            level={queObj?.level}
            question={queObj?.question}
            value={queObj?.answer || ""}
            options={queObj?.option}
            shouldSubQueIconShow={shouldSubQueIconShow}
            handleChangeDropdown={(e) =>
              handleChangeDropdown(e.target.value, "yesOrNo")
            }
            handleClickSbuQueIcon={() =>
              handleChangeDropdown(queObj?.answer, "subQueIcon")
            }
            filledOut={filledOut}
            subQueFilledOut={subQueFilledOut}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Grid item xs={12} md={queObj?.col} key={queObj?.question}>
      {renderQuestions(queObj?.type)}
    </Grid>
    // <div className={`col-span-${queObj?.col}`} key={queObj?.question}>
    //   {renderQuestions(queObj?.type)}
    // </div>
  );
};

export default SFMainQueGrid;

SFMainQueGrid.propTypes = {
  queObj: PropTypes.object,
  shouldSubQueIconShow: PropTypes.bool,
  setSubFLoorSubQuestionsShow: PropTypes.bool,
  setSubQuestions: PropTypes.object,
  storeKeyToUpdate: PropTypes.string,
};
