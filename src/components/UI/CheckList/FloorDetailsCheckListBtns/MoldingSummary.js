import React, { useState } from "react";
import Image from "../../Image";
import Text from "../../Text";
import ImageSliderPopup from "../../ImageSliderPopup";

const MoldingSummary = ({
  activeSummary,
  setIsDragEnabled,
  objectKey,
  className,
}) => {
  let allQuestions = [...activeSummary?.[objectKey]?.all_questions];
  let findImageQueIndex = allQuestions?.findIndex(
    (que) => que?.type === "IMAGE"
  );
  let imageQue = allQuestions?.splice(findImageQueIndex, 1);
  let newQueArr = [...allQuestions, ...imageQue];


  // Find the question with the text "Height"
  const heightQuestion = allQuestions.find(
    (question) => question.question === "Height"
  );
  const notesQuestion = allQuestions.find(
    (question) => question.question === "Notes"
  );

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupImages, setPopupImages] = useState([]);
  const [popupInitialSlide, setPopupInitialSlide] = useState(0);

  const handleImageClick = (clickedImage, index) => {
    setPopupImages(imageQue?.[0]?.answer); // Set images for the popup
    setPopupInitialSlide(index); // Set initial slide based on clicked image index
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setPopupImages([]);
    setPopupInitialSlide(0);
  };

  return (
    <div
      className={`py-6 px-10 border-[1px] min-w-[400px] min-h-[300px] flex flex-col  items-start bg-white text-black text-md rounded-md shadow-md ${className}`}
    >
      {/* <ul className="space-y-2">
        {newQueArr?.map((question) => (
          <li className={`custom-bullet-point flex gap-2`}>
            {question?.type !== "IMAGE" ? (
              <Text className="text-sm text-start">
                {question?.question}:{" "}
                <span className="font-semibold">
                  {question?.answer === true
                    ? "Yes"
                    : question?.answer === false
                    ? "No"
                    : question?.answer}
                </span>
              </Text>
            ) : (
              <>
                <div
                  className="w-[270px] !overflow-scroll flex items-center gap-2"
                  onMouseEnter={() => setIsDragEnabled(false)}
                  onMouseLeave={() => setIsDragEnabled(true)}
                  onTouchStart={() => setIsDragEnabled(false)}
                  onTouchEnd={() => setIsDragEnabled(true)}
                >
                  {imageQue?.[0]?.answer?.map((src) => {
                    <Image
                      className="w-[80px] h-[80px] rounded-lg"
                      src={src}
                    />;
                  })}
                </div>
              </>
            )}
          </li>
        ))}
      </ul> */}
      <div className=" flex  w-full min-h-[35px] mb-[5px]">
        <div className="flex justify-start items-center w-1/2">
          <Text className="text-sm text-start ">
            Height :{" "}
            <span className="font-medium ">
              {heightQuestion?.answer || ""}
            </span>
          </Text>
        </div>
        <div className=" w-[1px] bg-[#D8D8D8] rounded-full"></div>
        <div className="flex items-center w-1/2 pl-2">
          <Text className=" flex text-sm text-start justify-center">
            {/* <div>Note:</div> */}
            <div className="font-medium break-words text-ellipsis	max-w-[220px] ml-1 text-start">
              {notesQuestion?.answer || "-"}
            </div>
          </Text>
        </div>
      </div>
      <div className="w-full h-[1px] bg-[#D8D8D8] rounded-full"></div>
      <div
        className="w-full !overflow-scroll flex items-center gap-2 mt-5"
        onMouseEnter={() => setIsDragEnabled(false)}
        onMouseLeave={() => setIsDragEnabled(true)}
        onTouchStart={() => setIsDragEnabled(false)}
        onTouchEnd={() => setIsDragEnabled(true)}
      >
        {imageQue?.[0]?.answer?.map((src, index) => (
          <Image
            className="w-[120px] h-[90px] rounded-sm"
            src={src}
            onClick={() => handleImageClick(src, index)}
          />
        ))}

        <ImageSliderPopup
          images={popupImages}
          initialSlide={popupInitialSlide}
          open={isPopupOpen}
          onClose={closePopup}
        />
      </div>
    </div>
  );
};

export default MoldingSummary;
