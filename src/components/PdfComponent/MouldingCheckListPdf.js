import React from "react";
import Text from "../UI/Text";
import Image from "../UI/Image";
import { pdfStyle } from "../../utils/Constants";

const MouldingCheckListPdf = ({ customerDetails1 }) => {
  // const {temperature,humidity,buildingType} = customerDetails?.fv_data?.customer

  const allChecklist =
    Object.keys(customerDetails1 || {}).length > 0
      ? [...customerDetails1?.fv_data?.molding]
      : [];

  const SingleCheckList = ({ checklist }) => {
    function getRoomNamesByRefinishingId(floors, refinishingId) {
      const roomNames = [];

      for (const floor of floors) {
        for (const room of floor.rooms) {
          //   debugger
          if (room.molding_id === refinishingId) {
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

    const rowOne = allQuestions?.filter((Q) => Q.type !== "IMAGE" && Q.answer);
    const rowTwo = allQuestions?.filter((Q) => Q.type === "IMAGE");

    return (
      <>
        <div
          className={`bg-[${pdfStyle?.headingBgColor}] flex    pl-2 rounded-lg items-center my-2 p-1.5`}
        >
          <div
            className={`!w-[20px] h-[20px] rounded-full flex-none`}
            style={{ backgroundColor: checklist?.color }}
          ></div>
          <Text
            className={`text-black text-[${pdfStyle.headingSize}px]  font-semibold text-start   flex-none pr-4 ml-2.5`}
          >
            Molding
          </Text>
          {singleStringRoom ? (
            <div
              className={`text-black text-[16px] font-normal text-start  `}
            >
              [{singleStringRoom}]
            </div>
          ) : (
            ``
          )}
        </div>
        <div class={`my-${pdfStyle?.marginY}`}>
          {rowOne?.length > 0 ? (
            <>
              <div className={`flex py-${pdfStyle?.paddingY}`}>
                {rowOne?.map((ques, i) => {
                  return (
                    <>
                      <div
                        className={`flex flex-col items-start justify-center my-${pdfStyle?.marginY} pl-${pdfStyle?.paddingL} w-1/2`}
                      >
                        <div className="flex items-center justify-start">
                          <Text className={`w-[150px] text-start text-[${pdfStyle?.questionTextSize}px]`}>
                            {ques?.question}
                          </Text>
                          <span className={`font-semibold text-[${pdfStyle?.answerTextSize}px]`}>
                            : {ques?.answer || "NA"}
                          </span>
                        </div>
                      </div>
                      {rowOne?.length == 2 && i == 0 ? (
                        <div className=" w-[1px] bg-[#D8D8D8] rounded-full"></div>
                      ) : (
                        ``
                      )}
                    </>
                  );
                })}
              </div>
              <div className="w-full h-[1px] bg-[#D8D8D8] rounded-full"></div>
            </>
          ) : ``}
          {rowTwo?.length > 0 && rowTwo[0].answer?.length > 0 ? (
            <>
              <div className={`flex py-${pdfStyle?.paddingY}`}>
                {rowTwo?.map((ques, i) => {
                  return (
                    <>
                      <div
                        className={`flex flex-col items-start justify-center my-${pdfStyle?.marginY} pl-${pdfStyle?.paddingL} w-full`}
                      >
                        <div className="flex flex-wrap items-center justify-start">
                          {ques?.answer?.map((src, index) => (
                            <img
                              className={`w-[${pdfStyle?.imageW}px] h-[${pdfStyle?.imageH}px] rounded-md p-1`}
                              src={src}
                              alt={"src"}
                            />
                          ))}
                        </div>
                      </div>
                    </>
                  );
                })}
              </div>
              <div className="w-full h-[1px] bg-[#D8D8D8] rounded-full"></div>
            </>
          ) : (
            ``
          )}
        </div>
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

export default MouldingCheckListPdf;
