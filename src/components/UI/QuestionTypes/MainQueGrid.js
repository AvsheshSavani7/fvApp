import React, { useEffect, useMemo } from "react";
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
  updateSingleCustomerApi,
} from "../../../redux/customer";
import {
  checkFilledOut,
  checkSubQueFilledOut,
  findQueAndSetAnswer,
  handleImageCompression,
} from "../../../helper/helper";
import { useReactHookForm } from "../../../hooks/useReactHookForm";
import ImageField from "./ImageField";
import {
  updateCustomerFVData,
  uploadImage,
} from "../../../services/customers.service";
import SliderField from "./SliderField";
import { v4 as uuidv4 } from "uuid";

const MainQueGrid = ({
  queObj,
  setSubQuesionsShow,
  setSubQuestions,
  checkListIndex,
  setSubofSubQuestions,
  storeKeyToUpdate,
  setIsDragEnabled,
  hadMargin,
}) => {
  const singleCustomerData = useSelector(
    (state) => state.customerReducer.singleCustomer
  );

  const dispatch = useDispatch();

  let shouldSubQueIconShow = queObj?.subQuestion?.some(
    (subQue) => subQue?.whenToShow == queObj?.answer
  );

  const getSubQuestions = (findQue, value) => {
    // debugger

    let filteredSubsQuestions =
      findQue?.subQuestion?.filter((que) => que?.whenToShow == value) || [];

    if (filteredSubsQuestions?.length > 0) {
      setSubQuesionsShow(true);
      setSubQuestions({
        mainQuestion: findQue?.question,
        mainQuestionAnswer: value,
        subQuestions: filteredSubsQuestions,
        questionId: queObj?.id,
        checkListIndex: checkListIndex,
      });

      const filteredSubsQuestions1 = [...filteredSubsQuestions]; // Your original array of sub-questions

      const updatedSubofSubQuestions = filteredSubsQuestions1?.reduce(
        (accumulator, subQueObj) => {
          if (subQueObj.subQuestion?.length > 0) {
            const subofsubQ = subQueObj.subQuestion.filter(
              (v) => v.whenToShow === subQueObj.answer
            );
            accumulator.push(...subofsubQ);
          }
          return accumulator;
        },
        []
      );
      setSubofSubQuestions(updatedSubofSubQuestions);
    } else {
      setSubQuesionsShow(false);
    }
  };

  const handleClickBoolean = async (value, type) => {
    if (typeof value === "string") {
      if (type == "yesOrNo") {
        let allQuestions = await findQueAndSetAnswer(
          singleCustomerData,
          queObj,
          checkListIndex,
          false,
          dispatch,
          storeKeyToUpdate
        );
        let findQue = allQuestions?.find((que) => que?.id == queObj?.id);
        let newValue = false;
        await getSubQuestions(findQue, newValue);
      } else {
        getSubQuestions(queObj, value);
      }
    } else {
      if (type == "yesOrNo") {
        let allQuestions = await findQueAndSetAnswer(
          singleCustomerData,
          queObj,
          checkListIndex,
          !value,
          dispatch,
          storeKeyToUpdate
        );
        let findQue = allQuestions?.find((que) => que?.id == queObj?.id);
        let newValue = !value;
        await getSubQuestions(findQue, newValue);
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

  const { register, setValue, errors, watch, getValues, control } =
    useReactHookForm({
      // defaultValues: { [queObj?.id]: queObj?.answer },
      // mode: "onchange",
    });

  useEffect(() => {
    setValue(queObj?.id, queObj?.answer);
  }, [queObj?.id]);

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

        findQueAndSetAnswer(
          singleCustomerData,
          queObj,
          checkListIndex,
          updatedImagesArray,
          dispatch,
          storeKeyToUpdate
        );
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

  const handleChangeSlider = (e, value) => {
    findQueAndSetAnswer(
      singleCustomerData,
      queObj,
      checkListIndex,
      value,
      dispatch,
      storeKeyToUpdate
    );
  };

  const filledOut = checkFilledOut(queObj);
  const subQueFilledOut = checkSubQueFilledOut(queObj, storeKeyToUpdate);

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
          // <div className="mt-1">
          <NoteField
            question={queObj?.question}
            value={queObj?.answer}
            shouldSubQueIconShow={shouldSubQueIconShow}
            handleNoteBlur={handleNoteBlur}
            register={register}
            id={queObj?.id}
            name={queObj?.id}
            hadMargin={hadMargin}
            type={queObj?.fieldType || "text"}
            latestValue={getValues(queObj?.id) || ""}
            filledOut={filledOut}
          />
          // {/* </div> */}
        );
      case "DROPDOWN":
        return (
          <DropdownField
            level={queObj?.level}
            question={queObj?.question}
            value={queObj?.answer}
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
      case "RANGE":
        return (
          <SliderField
            question={queObj?.question}
            value={queObj?.answer}
            handleChangeSlider={(e, newValue) =>
              handleChangeSlider(e, newValue)
            }
            setIsDragEnabled={setIsDragEnabled}
            filledOut={filledOut}
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

export default MainQueGrid;

MainQueGrid.propTypes = {
  queObj: PropTypes.object,
  shouldSubQueIconShow: PropTypes.bool,
  setSubQuesionsShow: PropTypes.bool,
  setSubQuestions: PropTypes.object,
  storeKeyToUpdate: PropTypes.string,
};
