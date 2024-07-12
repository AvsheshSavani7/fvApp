import React, { useState } from "react";
import styled from "@emotion/styled";
import { CircularProgress, TextField } from "@mui/material";
import { useSelector } from "react-redux";
import ImageSliderPopup from "../ImageSliderPopup";
import { Constants } from "../../../utils/Constants";

const StyledTextField = styled(TextField)(({ filledOut }) => ({
  "& .MuiInputBase-input[type='file']": {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "50px",
    opacity: 0,
    cursor: "pointer",
  },
  "& .image-preview": {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
  },
  "&.MuiTextField-root": {
    "& .MuiInputBase-input": {
      padding: "14px",
      fontSize: "13px",
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderRadius: "10px",
      borderColor: !filledOut && Constants.MANDATE_BORDER_COLOR,
    },
    "& .MuiInputLabel-root": {
      color: "#202020",
      fontSize: "13px",
      top: "2px",
      marginTop: "3px",
    },
    "& .MuiInputLabel-shrink": {
      marginTop: "0",
    },
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset>legend": {
      fontSize: "10px",
    },
  },
}));

const ImageField = ({
  question,
  setIsDragEnabled,
  files,
  handleFileChange,
  hasMargin,
  classname = "max-w-[370px]",
  questionId,
  filledOut,
  type,
  checkListIndex,
  storeKeyToUpdate,
  roomId,
}) => {
  const imageLoading = useSelector(
    (state) => state.customerReducer.imageLoading
  );

  const imageQuestionId = useSelector(
    (state) => state.customerReducer.imageQuestionId
  );

  let reverseArray = [...files]?.reverse();

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupImages, setPopupImages] = useState([]);
  const [popupInitialSlide, setPopupInitialSlide] = useState(0);

  const handleImageClick = (clickedImage, index) => {
    setPopupImages(reverseArray); // Set images for the popup
    setPopupInitialSlide(index); // Set initial slide based on clicked image index
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setPopupImages([]);
    setPopupInitialSlide(0);
  };

  return (
    <div className="relative">
      <StyledTextField
        filledOut={filledOut}
        id="input-with-icon-textfield"
        label={question}
        disabled={imageLoading}
        variant="outlined"
        type="file"
        sx={{
          marginTop: hasMargin ? "4px" : 0,
          width: "100%",
          ".MuiOutlinedInput-root": {
            height: "105px",
          },
          img: {
            paddingRight: "1rem",
          },
        }}
        onChange={handleFileChange}
        InputProps={{
          startAdornment:
            imageLoading && questionId === imageQuestionId ? (
              <div className="w-[127px] h-[85px] rounded-md border-[1px] border-[#80808036] flex justify-center items-center">
                <CircularProgress size={20} />
              </div>
            ) : (
              <img src="/images/takePhotoIcon.svg" />
            ),
          onChange: handleFileChange,
          id: "image-input",
          type: "file",
          // inputProps: {
          //   multiple: true,
          // },
        }}
      />
      <div
        className={`${classname} image-preview absolute left-[152px] flex gap-3 overflow-x-scroll ${
          hasMargin ? "top-[14px]" : "top-[10px]"
        }`}
        onMouseEnter={() => setIsDragEnabled(false)}
        onMouseLeave={() => setIsDragEnabled(true)}
        onTouchStart={() => setIsDragEnabled(false)}
        onTouchEnd={() => setIsDragEnabled(true)}
      >
        {reverseArray?.map((file, index) => (
          <img
            key={index}
            src={file}
            alt={`Image Preview ${index + 1}`}
            className="min-w-[127px] h-[85px] object-cover rounded-[4px]"
            onClick={() => handleImageClick(file, index)}
          />
        ))}
        <ImageSliderPopup
          images={popupImages}
          setPopupImages={setPopupImages}
          initialSlide={popupInitialSlide}
          open={isPopupOpen}
          onClose={closePopup}
          type={type}
          questionId={questionId}
          checkListIndex={checkListIndex}
          storeKeyToUpdate={storeKeyToUpdate}
          roomId={roomId}
        />
      </div>
    </div>
  );
};

export default ImageField;
