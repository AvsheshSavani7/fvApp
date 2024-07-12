import React, { useState } from "react";
import Image from "../../Image";
import Text from "../../Text";
import ImageSliderPopup from "../../ImageSliderPopup";

const TransitionSummary = ({
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
  const question1 = allQuestions.find(
    (question) => question.question === "Type"
  );
  const question2 = allQuestions.find(
    (question) => question.question === "Location"
  );
  const question3 = allQuestions.find(
    (question) => question.question === "Length"
  );
  const question4 = allQuestions.find(
    (question) => question.question === "Height Diffrence"
  );
  const question5 = allQuestions.find(
    (question) => question.question === "To Type of Flooring"
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
      className={`py-6 !px-[18px] border-[1px] min-w-[400px] w-[540px] min-h-[300px] flex flex-col  items-start bg-white text-black text-md rounded-md shadow-md ${className}`}
    >
      <div className=" flex  w-full min-h-[35px] mb-[5px] ">
        <div className="flex justify-start items-center w-1/2">
          <Text className="text-sm text-start ">
            {activeSummary?.withinRoomName ? (
              `Within ${activeSummary?.withinRoomName}`
            ) : !!activeSummary?.fromRoomName ? (
              <>
                From{" "}
                <span className="font-medium break-words text-ellipsis">
                  {activeSummary?.fromRoomName || " - "}
                </span>{" "}
                to <span className="font-medium break-words text-ellipsis">
                {activeSummary?.toRoomName || " - "}
                </span>
              </>
            ) : (
              "-"
            )}
            {/* <span className="font-medium ">{question1?.answer || "NA"}</span> */}
          </Text>
        </div>
        <div className=" w-[1px] bg-[#D8D8D8] rounded-full"></div>
        <div className="flex items-center w-1/2 pl-2">
          <Text className=" flex text-sm text-start justify-center">
            <div>Type : </div>
            <div className="font-medium break-words text-ellipsis	max-w-[220px] ml-1">
              {question1?.answer || "NA"}
            </div>
          </Text>
        </div>
      </div>
      <div className="w-full h-[1px] bg-[#D8D8D8] rounded-full"></div>
      <div className=" flex  w-full min-h-[35px] mb-[5px] mt-[5px]">
        <div className="flex justify-start items-center w-1/2">
          <Text className=" flex text-sm text-start justify-center">
            <div>Location : </div>
            <div className="font-medium break-words text-ellipsis	max-w-[220px] ml-1">
              {question2?.answer || "NA"}
            </div>
          </Text>
        </div>
        <div className="w-[1px] bg-[#D8D8D8] rounded-full"></div>
        <div className="flex items-center w-1/2 pl-2">
          <Text className=" flex text-sm text-start justify-center">
            <div>Length : </div>
            <div className="font-medium break-words text-ellipsis	max-w-[220px] ml-1">
              {question3?.answer || "NA"}
            </div>
          </Text>
        </div>
      </div>
      <div className="w-full h-[1px] bg-[#D8D8D8] rounded-full"></div>
      <div className=" flex  w-full min-h-[35px] mb-[5px] mt-[5px]">
        <div className="flex justify-start items-center w-1/2">
          <Text className=" flex text-sm text-start justify-center">
            <div>Height Difference : </div>
            <div className="font-medium break-words text-ellipsis	max-w-[220px] ml-1">
              {question4?.answer || "NA"}
            </div>
          </Text>
        </div>
        <div className="w-[1px] bg-[#D8D8D8] rounded-full"></div>
        <div className="flex items-center w-1/2 pl-2">
          <div className="w-[150px]">
            <Text className="text-sm text-start ">To Type of Flooring ?</Text>
          </div>
          <div className="w-[100px]">
            <span className="text-sm font-medium ">
              {question5?.answer || "NA"}
            </span>
          </div>
        </div>
      </div>
      <div className="w-full h-[1px] bg-[#D8D8D8] rounded-full"></div>
      <div className=" flex  w-full min-h-[35px] mb-[5px] mt-[5px]">
        <div className="flex justify-start items-center w-full">
          <div className="w-[45px]">
            <Text className="text-sm text-start ">Note : </Text>
          </div>
          <div className="text-start">
            <span className="text-sm font-medium ">
              {notesQuestion?.answer || "NA"}
            </span>
          </div>
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

export default TransitionSummary;
