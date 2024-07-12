import React, { useEffect } from "react";
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
import { uploadImage } from "../../../services/customers.service";
import SliderField from "./SliderField";

const InstallaltionMainQueGrid = ({
  queObj,
  setSubQuesionsShow,
  setSubQuestions,
  checkListIndex,
  setSubofSubQuestions,
  storeKeyToUpdate,
  setIsDragEnabled,
  hadMargin,
  setDropDownChanged,
  setInstallationQues,
  questionIndex,
}) => {
  const singleCustomerData = useSelector(
    (state) => state.customerReducer.singleCustomer
  );

  let currentInstallationChecklist =
    singleCustomerData?.matching_installation_checklists?.[checkListIndex];

  let findQue1 = currentInstallationChecklist?.all_questions?.find(
    (que) => que?.question === "Type of Floor"
  );
  let findQue2 = currentInstallationChecklist?.all_questions?.find(
    (que) => que?.question === "Type of Matching"
  );
  let findQue3 = currentInstallationChecklist?.all_questions?.find(
    (que) => que?.question === "Are we Refinishing?"
  );

  const getOptions = () => {
    if (queObj?.question === "Type of Matching") {
      if (findQue1?.answer === "Laminate" || findQue1?.answer === "Vinyl") {
        return ["Product", "Look"];
      } else if (
        findQue1?.answer === "Unfinished Solid" ||
        findQue1?.answer === "Unfinished Engineered"
      ) {
        return ["Specifications", "Look"];
      } else {
        return ["Product", "Specifications", "Look"];
      }
    } else if (queObj?.question === "Are we Refinishing?") {
      if (
        (findQue1?.answer === "Prefinished Solid" ||
          findQue1?.answer === "Prefinished Engineered" ||
          findQue1?.answer === "Laminate" ||
          findQue1?.answer === "Vinyl") &&
        findQue2?.answer === "Product"
      ) {
        return ["No"];
      } else {
        return ["Yes", "No"];
      }
    } else {
      return queObj?.option;
    }
  };

  const dispatch = useDispatch();

  let shouldSubQueIconShow = queObj?.subQuestion?.some(
    (subQue) => subQue?.whenToShow == queObj?.answer
  );

  const getSubQuestions = (findQue, value) => {
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

  const handleChangeDropdown = async (value, type) => {
    if (type == "yesOrNo") {
      if (queObj?.question === "Type of Floor") {
        let allQuestions = [
          ...singleCustomerData?.[storeKeyToUpdate]?.[checkListIndex]
            ?.all_questions,
        ];

        let filteredQue = allQuestions?.filter(
          (que) =>
            que?.id == queObj?.id ||
            que?.question == "Type of Matching" ||
            que?.question == "Are we Refinishing?"
        );

        let updatedRefinishing = [...singleCustomerData[storeKeyToUpdate]];
        await Promise.all(
          filteredQue?.map((findQue) => {
            if (findQue?.id === queObj?.id) {
              let findQueIndex = allQuestions?.findIndex(
                (que) => que?.id == findQue?.id
              );
              let queWithUpdatedAns = { ...findQue, answer: value };
              allQuestions[findQueIndex] = queWithUpdatedAns;

              updatedRefinishing[checkListIndex] = {
                ...updatedRefinishing[checkListIndex],
                all_questions: allQuestions,
              };
            } else {
              let findQueIndex = allQuestions?.findIndex(
                (que) => que?.id == findQue?.id
              );
              let queWithUpdatedAns = { ...findQue, answer: "" };
              allQuestions[findQueIndex] = queWithUpdatedAns;

              updatedRefinishing[checkListIndex] = {
                ...updatedRefinishing[checkListIndex],
                all_questions: allQuestions,
              };
            }
          })
        );
        dispatch(
          updateSingleCustomerApi({
            ...singleCustomerData,
            [storeKeyToUpdate]: updatedRefinishing,
          })
        );
      } else if (queObj?.question === "Type of Matching") {
        let allQuestions = [
          ...singleCustomerData?.[storeKeyToUpdate]?.[checkListIndex]
            ?.all_questions,
        ];
        let filteredQue = allQuestions?.filter(
          (que) =>
            que?.id == queObj?.id || que?.question == "Are we Refinishing?"
        );
        let updatedRefinishing = [...singleCustomerData[storeKeyToUpdate]];

        await Promise.all(
          filteredQue?.map((findQue) => {
            if (findQue?.id === queObj?.id) {
              let findQueIndex = allQuestions?.findIndex(
                (que) => que?.id == findQue?.id
              );
              let queWithUpdatedAns = { ...findQue, answer: value };
              allQuestions[findQueIndex] = queWithUpdatedAns;

              updatedRefinishing[checkListIndex] = {
                ...updatedRefinishing[checkListIndex],
                all_questions: allQuestions,
              };
            } else {
              let findQueIndex = allQuestions?.findIndex(
                (que) => que?.id == findQue?.id
              );
              let queWithUpdatedAns = { ...findQue, answer: "" };
              allQuestions[findQueIndex] = queWithUpdatedAns;

              updatedRefinishing[checkListIndex] = {
                ...updatedRefinishing[checkListIndex],
                all_questions: allQuestions,
              };
            }
          })
        );
        dispatch(
          updateSingleCustomerApi({
            ...singleCustomerData,
            [storeKeyToUpdate]: updatedRefinishing,
          })
        );
      } else {
        findQueAndSetAnswer(
          singleCustomerData,
          queObj,
          checkListIndex,
          value,
          dispatch,
          storeKeyToUpdate
        );
      }
      setDropDownChanged((prev) => !prev);
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
  const subQueFilledOut = checkSubQueFilledOut(queObj);

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
            fullHeight={queObj?.fullHeight || false}
            multiline={queObj?.fullHeight || false}
            maxRows={queObj?.fullHeight && 3.8}
            minRows={queObj?.fullHeight && 3.8}
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
            options={getOptions() || []}
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
            // hasMargin={true}
            setIsDragEnabled={setIsDragEnabled}
            classname={`${queObj?.hasHalfWidth && "max-w-[95px]"}`}
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
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Grid item xs={12} md={queObj?.col} key={queObj?.question}>
        {renderQuestions(queObj?.type)}
      </Grid>
      {questionIndex === 2 && (
        <div
          key={`divider-${questionIndex}`}
          className="mt-[14px]  ml-[28px]"
          style={{ backgroundColor: "#D8D8D8", width: "92%", height: "1px" }}
        />
      )}
    </>
  );
};

export default InstallaltionMainQueGrid;

InstallaltionMainQueGrid.propTypes = {
  queObj: PropTypes.object,
  shouldSubQueIconShow: PropTypes.bool,
  setSubQuesionsShow: PropTypes.bool,
  setSubQuestions: PropTypes.object,
  storeKeyToUpdate: PropTypes.string,
};
