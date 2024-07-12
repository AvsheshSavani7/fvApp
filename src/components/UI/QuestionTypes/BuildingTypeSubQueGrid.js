import React, { useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import { Grid } from "@mui/material";
import BooleanField from "./BooleanField";
import DropdownField from "./DropdownField";
import { useDispatch, useSelector } from "react-redux";
import { setImageLoading, setImageQuestionId } from "../../../redux/customer";
import {
  checkFilledOutFromAnswer,
  handleImageCompression,
  setBuildingTypeSubQueAnswer,
  setBuildingTypeSubofSubQueAnswer,
} from "../../../helper/helper";
import _ from "lodash";
import { useReactHookForm } from "../../../hooks/useReactHookForm";
import ImageField from "./ImageField";
import { uploadImage } from "../../../services/customers.service";
import SubFloorNoteField from "./SubFloorNoteField";

const BuildingTypeSubQueGrid = ({
  subQuestions,
  setSubQuestions,
  hadMargin,
  customerId,
}) => {
  const singleCustomerData = useSelector(
    (state) => state.customerReducer.singleCustomer
  );
  const imageQuestionId = useSelector(
    (state) => state.customerReducer.imageQuestionId
  );

  const dispatch = useDispatch();

  /**
   * To udpate the panel box images array after remove the image, to render the updated images in field
   */
  useEffect(() => {
    const updatedSubQuestions =
      singleCustomerData.customer.buildingType.subQuestion;
    setSubQuestions({ ...subQuestions, subQuestions: updatedSubQuestions });
  }, [imageQuestionId]);

  const getSubofSubQue = (queObj, value, subQuqIndex) => {
    let tmpSubQue = [...subQuestions?.subQuestions];
    let findSubQue = tmpSubQue?.find((que) => que?.id == queObj?.id);
    let updateSubQue = { ...findSubQue, answer: value };

    tmpSubQue[subQuqIndex] = updateSubQue;
    setSubQuestions({
      ...subQuestions,
      subQuestions: tmpSubQue,
    });
  };

  const handleClickBoolean = (queObj, value, subQuqIndex) => {
    setBuildingTypeSubQueAnswer(
      singleCustomerData,
      dispatch,
      subQuqIndex,
      customerId,
      !value
    );
    getSubofSubQue(queObj, !value, subQuqIndex);
  };

  const handleNoteBlur = (e, subQuqIndex) => {
    setBuildingTypeSubQueAnswer(
      singleCustomerData,
      dispatch,
      subQuqIndex,
      customerId,
      e.target.value
    );
  };

  const { register, setValue, errors, watch, getValues } = useReactHookForm({
    defaultValues: {},
    mode: "onchange",
  });

  const handleChangeDropdown = (e, subQuqIndex, queObj) => {
    setBuildingTypeSubQueAnswer(
      singleCustomerData,
      dispatch,
      subQuqIndex,
      customerId,
      e.target.value
    );
    getSubofSubQue(queObj, e.target.value, subQuqIndex);
  };

  const handleFileChange = async (
    event,
    currentImages,
    subQueObj,
    subofSubQueid,
    subQuqIndex
  ) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      dispatch(setImageLoading(true));
      dispatch(setImageQuestionId(subofSubQueid));

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

        setBuildingTypeSubofSubQueAnswer(
          singleCustomerData,
          dispatch,
          subQuqIndex,
          subofSubQueid,
          customerId,
          updatedImagesArray
        );

        let tmpSubQuestions = [...subQuestions?.subQuestions];

        let updatedSubofSubQue = tmpSubQuestions?.map((subQue, index) => {
          if (index !== subQuqIndex) {
            return subQue;
          }
          const updatedSubofSubQue = subQue?.subQuestion?.map((subofsubQue) => {
            if (subofsubQue?.id === subofSubQueid) {
              return { ...subofsubQue, answer: updatedImagesArray };
            }
            return subofsubQue;
          });
          return { ...subQue, subQuestion: updatedSubofSubQue };
        });

        setSubQuestions({
          ...subQuestions,
          subQuestions: updatedSubofSubQue,
        });
      }
      // else {
      //   setOpen(true);
      //   setMessage(imageUploaded?.data?.message || "Something went wrong");
      //   setType("error");
      // }
      dispatch(setImageLoading(false));
    }
  };

  let filledOutFromAnswer = useCallback(
    (queObj, answer, key) => {
      return checkFilledOutFromAnswer(queObj, answer, key);
    },
    [singleCustomerData]
  );

  const renderQuestions = (queObj, subQuqIndex, key) => {
    let finQue = {};
    if (key === "sub") {
      finQue = singleCustomerData?.customer?.buildingType?.subQuestion?.find(
        (subque) => subque?.id === queObj?.id
      );
    } else {
      singleCustomerData?.customer?.buildingType?.subQuestion?.map((subque) => {
        subque?.subQuestion?.map((subofsub) => {
          if (subofsub?.id === queObj?.id) {
            finQue = subofsub;
          }
        });
      });
    }

    let filledOut = filledOutFromAnswer(queObj, finQue?.answer, "building");

    switch (queObj?.type) {
      case "BOOLEAN":
        return (
          <BooleanField
            level={queObj?.level}
            decreasePadding={true}
            question={queObj?.question}
            value={queObj?.answer}
            handleClickBoolean={() =>
              handleClickBoolean(queObj, queObj?.answer, subQuqIndex)
            }
            filledOut={filledOut}
          />
        );
      case "TEXT":
        return (
          <SubFloorNoteField
            question={queObj?.question}
            value={queObj?.answer}
            handleNoteBlur={(e) => handleNoteBlur(e, subQuqIndex)}
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
            handleChangeDropdown={(e) =>
              handleChangeDropdown(e, subQuqIndex, queObj)
            }
            filledOut={filledOut}
          />
        );
      case "IMAGE":
        return (
          <div className="mt-[10px]">
            <ImageField
              level={queObj?.level}
              question={queObj?.question}
              questionId={queObj?.id}
              value={queObj?.answer}
              handleFileChange={(e) =>
                handleFileChange(
                  e,
                  queObj?.answer,
                  queObj,
                  queObj?.id,
                  subQuqIndex
                )
              }
              files={queObj?.answer || []}
              hasMargin={true}
              classname="max-w-[345px]"
              setIsDragEnabled={() => {}}
              filledOut={filledOut}
              type="BUILDING"
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {subQuestions?.subQuestions?.map((queObj, index) => {
        return (
          <Grid item xs={12} md={queObj?.col} key={queObj?.id}>
            {renderQuestions(queObj, index, "sub")}
            <div>
              {queObj?.subQuestion?.map((subofsubQue, idx) => {
                if (subofsubQue?.whenToShow === queObj?.answer) {
                  return renderQuestions(subofsubQue, idx, "subofsub");
                }
              })}
            </div>
          </Grid>
        );
      })}
    </>
  );
};

export default BuildingTypeSubQueGrid;

BuildingTypeSubQueGrid.propTypes = {
  queObj: PropTypes.object,
  shouldSubQueIconShow: PropTypes.bool,
  setSubQuesionsShow: PropTypes.bool,
  setSubofSubQuestions: PropTypes.array,
  storeKeyToUpdate: PropTypes.string,
};
