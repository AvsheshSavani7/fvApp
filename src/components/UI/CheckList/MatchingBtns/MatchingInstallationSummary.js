import React, { useState } from "react";
import Image from "../../Image";
import Text from "../../Text";
import ImageSliderPopup from "../../ImageSliderPopup";
import ImageSlider from "../FurnitureCheckListBtn/ImageSlider";
import { CommentsDisabledOutlined } from "@mui/icons-material";

const MatchingInstallationSummary = ({
  activeSummary,
  setIsDragEnabled,
  objectKey,
  className,
}) => {
  let allQuestions = [...activeSummary?.[objectKey]?.all_questions];
  // let findImageQueIndex = allQuestions?.findIndex(
  //   (que) => que?.type === "IMAGE"
  // );
  // let imageQue = allQuestions?.splice(findImageQueIndex, 1);
  // let newQueArr = [...allQuestions, ...imageQue];

  const fixQuestionArray = [
    "Type of Floor",
    "Type of Matching",
    "Are we Refinishing?",
    "How is the space connected to the area being refinished?",
  ];

  const imageQueKey = ["Notes", "Photos", "Photo of floor", "Photo of Specs"];
  const filteredArray = allQuestions.filter(
    (item1) => !fixQuestionArray.some((item2) => item2 === item1.question)
  );
  const includedImagesArray = filteredArray.filter((item1) =>
    imageQueKey.some((item2) => item2 === item1.question)
  );

  // Remove items with type "image" and an empty answer array
  const filteredIncludedImagesArray = includedImagesArray.filter((item) => {
    return !(
      item.type === "IMAGE" &&
      Array.isArray(item.answer) &&
      item.answer.length === 0
    );
  });

  const foundObjectIndex = filteredIncludedImagesArray.findIndex(
    (obj) => obj.question === "Notes"
  );

  // Check if the object was found
  if (foundObjectIndex !== -1) {
    const foundObject = filteredIncludedImagesArray.splice(
      foundObjectIndex,
      1
    )[0];

    filteredIncludedImagesArray.unshift(foundObject);
  }
  const excludedImagesArray = filteredArray.filter(
    (item1) => !imageQueKey.some((item2) => item2 === item1.question)
  );

  const groupedArray = [];
  for (let i = 0; i < excludedImagesArray.length; i += 2) {
    const pair = [excludedImagesArray[i]];
    if (i + 1 < excludedImagesArray.length) {
      pair.push(excludedImagesArray[i + 1]);
    }
    groupedArray.push(pair);
  }

  // Find the question with the text "Height"
  const question1 = allQuestions.find(
    (question) => question.question === "Type of Floor"
  );
  const question2 = allQuestions.find(
    (question) => question.question === "Type of Matching"
  );
  const question3 = allQuestions.find(
    (question) => question.question === "Are we Refinishing?"
  );
  const question4 = allQuestions.find(
    (question) =>
      question.question ===
      "How is the space connected to the area being refinished?"
  );

  return (
    <div
      className={`py-[8px] !px-[10px] border-[1px] min-w-[400px] w-[540px] overflow-y-auto min-h-min flex flex-col  items-start bg-white text-black text-md rounded-md shadow-md ${className}`}
    >
      {/* first row */}
      <div className=" flex  w-full min-h-[35px] mb-[5px]">
        <div className="flex items-center w-1/2 ">
          <div className="max-w-[130px] min-w-[100px]">
            <Text className="text-sm text-start ">Type of Floor : </Text>
          </div>
          <div className="text-start max-w-[120px]">
            <span className="text-sm font-medium ">
              {question1?.answer || " NA"}
            </span>
          </div>
        </div>
        <div className=" w-[1px] bg-[#D8D8D8] rounded-full"></div>
        <div className="flex justify-start items-center w-1/2 pl-2">
          <div className="w-[132px]">
            <Text className="text-sm text-start ">Type of Matching : </Text>
          </div>
          <div className="text-start max-w-[120px]">
            <span className="text-sm font-medium ">
              {question2?.answer || " NA"}
            </span>
          </div>
        </div>
      </div>
      <div className="w-full h-[1px] bg-[#D8D8D8] border-[1px]  rounded-full"></div>
      {/* second row */}
      <div className=" flex  w-full min-h-[35px] mb-[5px] mt-[5px]">
        <div className="flex items-center w-1/2 ">
          <div className="w-[138px]">
            <Text className="text-sm text-start ">Are we Refinishing : </Text>
          </div>
          <div className="text-start max-w-[120px]">
            <span className="text-sm font-medium ">
              {question3?.answer === true ? " Yes" : " No"}
            </span>
          </div>
        </div>
        <div className=" w-[1px] bg-[#D8D8D8] rounded-full"></div>
        <div className="flex justify-start items-center w-1/2 pl-2">
          <div className="w-[132px]">
            <Text className="text-sm text-start ">
              How is the space connected :{" "}
            </Text>
          </div>
          <div className="text-start max-w-[120px]">
            <span className="text-sm font-medium ">
              {question4?.answer || "NA"}
            </span>
          </div>
        </div>
      </div>
      <div className="w-full h-[1px] bg-[#D8D8D8] border-[1px] rounded-full"></div>
      {groupedArray?.map((group, index) => {
        return (
          <>
            <div className=" flex  w-full min-h-[35px] mb-[5px] mt-[5px]">
              <div
                className={`flex items-center ${
                  group?.length > 1 ? "w-1/2" : "w-full"
                }`}
              >
                <div className={`${group?.length > 1 && "w-[130px]"}`}>
                  <Text className="text-sm text-start ">
                    {group[0]?.question} :{" "}
                  </Text>
                </div>
                &nbsp;
                <div
                  className={`text-start ${
                    group?.length > 1 && "max-w-[120px]"
                  }`}
                >
                  <span className="text-sm font-medium ">
                    {typeof group[0]?.answer === "boolean"
                      ? group[0]?.answer === true
                        ? `      Yes`
                        : group[0]?.answer === false
                        ? "No"
                        : group[0]?.answer
                      : group[0]?.answer}
                  </span>
                </div>
              </div>
              {group?.length > 1 && (
                <>
                  <div className=" w-[1px] bg-[#D8D8D8] rounded-full"></div>
                  <div className="flex items-center w-1/2 pl-2">
                    <div className="w-[130px]">
                      <Text className="text-sm text-start ">
                        {group[1]?.question} :{" "}
                      </Text>
                    </div>
                    &nbsp;
                    <div className="text-start max-w-[120px]">
                      <span className="text-sm font-medium ">
                        {typeof group[1]?.answer === "boolean"
                          ? group[1]?.answer === true
                            ? " Yes"
                            : group[1]?.answer === false
                            ? "No"
                            : group[1]?.answer
                          : group[1]?.answer}
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="w-full h-[1px] bg-[#D8D8D8] border-[1px] rounded-full"></div>
          </>
        );
      })}
      {filteredIncludedImagesArray?.map((ques, index) => {
        return (
          <>
            {ques?.type === "TEXT" && (
              <>
                <div className=" flex item-center w-full  mb-[5px] mt-[5px]">
                  <div className={`flex  items-center w-full`}>
                    <div className="max-w-[130px] min-w-[60px] text-center flex items-center">
                      <span className="text-sm text-start ">
                        {ques?.question} :
                      </span>
                    </div>
                    <div className="text-start">
                      <span className="text-sm font-medium ">
                        {ques?.answer || "NA"}
                      </span>
                    </div>
                  </div>
                </div>
                {filteredIncludedImagesArray?.length > 1 && (
                  <div className="w-full h-[1px] bg-[#D8D8D8] border-[1px] rounded-full"></div>
                )}
              </>
            )}

            {ques?.type === "IMAGE" && ques?.answer?.length > 0 && (
              <>
                <div className="flex w-full  mb-[5px] mt-[5px]">
                  <div className={`flex flex-col items-start w-full`}>
                    <Text className="text-sm text-start ">
                      {ques?.question === "Photos"
                        ? "Photo of Specs"
                        : ques?.question}
                    </Text>
                    <ImageSlider
                      images={ques || []}
                      setIsDragEnabled={setIsDragEnabled}
                    />
                  </div>
                </div>
                {filteredIncludedImagesArray?.length - 1 !== index && (
                  <div className="w-full h-[1px] bg-[#D8D8D8] border-[1px] rounded-full"></div>
                )}
              </>
            )}
          </>
        );
      })}
    </div>
  );
};

export default MatchingInstallationSummary;
