import React from "react";
import Text from "../UI/Text";
import Image from "../UI/Image";
import { pdfStyle } from "../../utils/Constants";

const MatchingInstallationPdf = ({ customerDetails1 }) => {
  const allChecklist =
    Object.keys(customerDetails1 || {}).length > 0
      ? [...customerDetails1?.fv_data?.matching_installation_checklists]
      : [];
  const SingleCheckList = ({ checklist }) => {
    function getRoomNamesByRefinishingId(floors, refinishingId) {
      const roomNames = [];

      for (const floor of floors) {
        for (const room of floor.rooms) {
          if (room.matching_installation_checklists_id === refinishingId) {
            roomNames.push(room.name);
          }
        }
      }

      return roomNames;
    }
    const matchingRoomNames = getRoomNamesByRefinishingId(
      customerDetails1?.fv_data?.scope?.floors,
      checklist?.id
    );
    const singleStringRoom =
      matchingRoomNames.length > 0 && matchingRoomNames.join(", ");

    let allQuestions =
      Object.keys(checklist || {}).length > 0
        ? [...checklist?.all_questions]
        : [];

    const fixQuestionArray = [];

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
    const onlyQwithAnswer = excludedImagesArray.filter((Q) => {
      return Q?.answer || (Q?.type === "BOOLEAN" && Q?.answer !== "none");
    });

    const groupedArray = [];
    for (let i = 0; i < onlyQwithAnswer.length; i += 2) {
      const pair = [onlyQwithAnswer[i]];
      if (i + 1 < onlyQwithAnswer.length) {
        pair.push(onlyQwithAnswer[i + 1]);
      }
      groupedArray.push(pair);
    }

    return (
      <>
        <div
          className={`bg-[${pdfStyle?.headingBgColor}]  flex    pl-2 rounded-lg items-center my-${pdfStyle?.marginY} p-1.5`}
        >
          <div
            className={`!w-[20px] h-[20px] rounded-full flex-none `}
            style={{ backgroundColor: checklist?.color }}
          ></div>
          <Text
            className={`text-black text-[${pdfStyle.headingSize}px] font-semibold text-start  flex-none pr-4 ml-2.5`}
          >
            Matching Installation
          </Text>
          {singleStringRoom && (
            <div className={`text-black text-[16px] font-normal text-start`}>
              [{singleStringRoom}]
            </div>
          )}
        </div>
        {groupedArray?.map((group, index) => {
          return (
            <>
              <div className={`flex  py-${pdfStyle?.paddingY}`}>
                <div
                  className={`flex flex-col items-start justify-center my-${
                    pdfStyle?.marginY
                  } pl-${pdfStyle?.paddingL} ${
                    group?.length > 1 ? "w-1/2" : "w-full"
                  }`}
                >
                  <div className={`flex items-center justify-start`}>
                    <Text
                      className={`w-[200px] text-start text-[${pdfStyle?.questionTextSize}px]`}
                    >
                      {group[0]?.question}
                    </Text>
                    <span
                      className={`font-semibold text-[${pdfStyle?.answerTextSize}px]`}
                    >
                      :{" "}
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
                    <div
                      className={`flex flex-col items-start justify-center my-${pdfStyle?.marginY} pl-${pdfStyle?.paddingL} w-1/2`}
                    >
                      <div className="flex items-center justify-start ">
                        <Text className={`w-[200px] text-start text-[${pdfStyle?.questionTextSize}px]`}>
                          {" "}
                          {group[1]?.question}
                        </Text>
                        <span
                          className={`font-semibold text-[${pdfStyle?.answerTextSize}px]`}
                        >
                          :{" "}
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
              <div className="w-full h-[1px] bg-[#D8D8D8] rounded-full"></div>
            </>
          );
        })}
        {filteredIncludedImagesArray?.map((ques, index) => {
          return (
            <>
              {ques?.type === "TEXT" && (
                <>
                  <div className={`flex  py-${pdfStyle?.paddingY}`}>
                    <div
                      className={`flex flex-col items-start justify-center my-${pdfStyle?.marginY} pl-${pdfStyle?.paddingL} w-full`}
                    >
                      <div className="flex items-center justify-start">
                        <Text
                          className={`w-[200px] text-start text-[${pdfStyle?.questionTextSize}px]`}
                        >
                          {ques?.question}
                        </Text>
                        <span
                          className={`font-semibold text-[${pdfStyle?.answerTextSize}px]`}
                        >
                          : {ques?.answer || "NA"}
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
                  <div className={`flex w-full py-${pdfStyle?.paddingY}`}>
                    <div
                      className={`flex  items-start justify-start my-${pdfStyle?.marginY} w-full`}
                    >
                      <div className="flex flex-col items-center justify-start">
                        <Text
                          className={`w-[200px] text-start my-${pdfStyle?.marginY} text-[${pdfStyle?.questionTextSize}px]`}
                        >
                          {ques?.question === "Photos"
                            ? "Photo of Specs"
                            : ques?.question}
                        </Text>
                        <div className="flex flex-wrap">
                          {ques?.answer?.map((src, index) => (
                            <img
                              className={`w-[${pdfStyle?.imageW}px] h-[${pdfStyle?.imageH}px] rounded-md p-1`}
                              src={src}
                              alt={"src"}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  {filteredIncludedImagesArray?.length > 1 && (
                    <div className="w-full h-[1px] bg-[#D8D8D8] border-[1px] rounded-full"></div>
                  )}
                </>
              )}
            </>
          );
        })}
      </>
    );
  };

  return (
    <>
      {allChecklist.map((singleCL) => {
        return <SingleCheckList checklist={singleCL} />;
      })}
    </>
  );
};

export default MatchingInstallationPdf;
