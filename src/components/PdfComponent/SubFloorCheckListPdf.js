import React from "react";
import Text from "../UI/Text";
import Image from "../UI/Image";
import { pdfStyle } from "../../utils/Constants";

const SubFloorCheckListPdf = ({ customerDetails1 }) => {
  // const {temperature,humidity,buildingType} = customerDetails?.fv_data?.customer

  const allChecklist =
    Object.keys(customerDetails1 || {}).length > 0
      ? [...customerDetails1?.fv_data?.subfloor_details]
      : [];

  const SingleCheckList = ({ checklist }) => {
    function getRoomNamesByRefinishingId(floors, refinishingId) {
      const roomNames = [];

      for (const floor of floors) {
        for (const room of floor.rooms) {
          //   debugger
          if (room.subfloor_detail_id === refinishingId) {
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

    const question1 = allQuestions.find(
      (question) => question.question === "Type"
    );
    const question2 = allQuestions.find(
      (question) => question.question === "Floor Covering"
    );
    const question3 = allQuestions.find(
      (question) => question.question === "Below Subfloor"
    );
    const question4 = allQuestions.find(
      (question) => question.question === "Radiant Heating"
    );
    const question5 = allQuestions.find(
      (question) => question.question === "Signs of Moisture"
    );
    const question6 = allQuestions.find(
      (question) => question.question === "Notes"
    );

    return (
      <>
        <div
          className={`bg-[${pdfStyle?.headingBgColor}] flex pl-2 p-1.5 rounded-lg items-center  my-${pdfStyle?.marginY}`}
        >
          <div
            className={`!w-[20px] h-[20px] rounded-full flex-none`}
            style={{ backgroundColor: checklist?.color }}
          ></div>
          <Text
            className={`text-black text-[${pdfStyle.headingSize}px]  font-semibold text-start   flex-none pr-4 ml-2.5`}
          >
            SubFloor Details
          </Text>
          {singleStringRoom && (
            <div className={`text-black text-[16px] font-normal text-start   `}>
              [{singleStringRoom}]
            </div>
          )}
        </div>

        <div class={`my-${pdfStyle?.marginY}`}>
          {question1?.answer && (
            <>
              <div className={`flex py-${pdfStyle?.paddingY}`}>
                <div
                  className={`flex flex-col items-start justify-center my-${pdfStyle?.marginY} pl-${pdfStyle?.paddingL} w-1/2`}
                >
                  <div className="flex items-center justify-start">
                    <Text
                      className={`w-[150px] text-start text-[${pdfStyle?.questionTextSize}px]`}
                    >
                      Type
                    </Text>
                    <span
                      className={`font-semibold text-[${pdfStyle?.answerTextSize}px]`}
                    >
                      : {question1?.answer || "NA"}
                    </span>
                  </div>
                </div>

                <div className={` w-[1px] bg-[#D8D8D8] rounded-full`}></div>
                <div
                  className={`flex flex-col items-start my-${pdfStyle?.marginY} pl-${pdfStyle?.paddingL} w-1/2`}
                >
                  {question1?.subQuestion
                    ?.flatMap((item) => item.subQuestion || [])
                    .filter(
                      (ques) =>
                        ques.whenToShow === question1?.answer &&
                        ques?.answer !== "none"
                    )
                    .map((question, i) => {
                      //   const mergedSubQuestions = question1?.subQuestion?.flatMap(item => item.subQuestion || []);
                      const checkLength = question1?.subQuestion
                        ?.flatMap((item) => item.subQuestion || [])
                        .filter(
                          (ques) =>
                            ques.whenToShow === question1?.answer &&
                            ques?.answer !== "none"
                        ).length;
                      return (
                        <>
                          <div
                            className={`flex items-center justify-start my-${pdfStyle?.marginY}`}
                          >
                            <Text
                              className={`w-[250px] text-start text-[${pdfStyle?.questionTextSize}px]`}
                            >
                              {question?.question}
                            </Text>
                            <span
                              className={`font-semibold text-start text-[${pdfStyle?.answerTextSize}px]`}
                            >
                              : {question?.answer || "NA"}
                            </span>
                          </div>
                          {question?.subQuestion
                            ?.filter(
                              (v) =>
                                v?.whenToShow === question?.answer &&
                                v?.answer !== "none"
                            )
                            .map((subofSubQues, j) => {
                              return (
                                <>
                                  <div className="w-full h-[1px] bg-[#D8D8D8] rounded-full "></div>
                                  <div
                                    className={`flex items-center justify-start my-${pdfStyle?.marginY}`}
                                  >
                                    <Text
                                      className={`w-[250px] text-start text-[${pdfStyle?.questionTextSize}px]`}
                                    >
                                      {subofSubQues?.question}
                                    </Text>
                                    <span
                                      className={`font-semibold text-start text-[${pdfStyle?.answerTextSize}px]`}
                                    >
                                      : {subofSubQues?.answer || "NA"}
                                    </span>
                                  </div>
                                </>
                              );
                            })}
                          {checkLength - 1 !== i && (
                            <div className="w-full h-[1px] bg-[#D8D8D8] rounded-full "></div>
                          )}
                        </>
                      );
                    })}
                </div>
              </div>
              <div className="w-full h-[1px] bg-[#D8D8D8] rounded-full"></div>
            </>
          )}

          {question2?.answer && (
            <>
              <div className={`flex py-${pdfStyle?.paddingY}`}>
                <div
                  className={`flex flex-col items-start justify-center my-${pdfStyle?.marginY} pl-${pdfStyle?.paddingL} w-1/2`}
                >
                  <div className={`flex items-center justify-start`}>
                    <Text
                      className={`w-[150px] text-start text-[${pdfStyle?.questionTextSize}px]`}
                    >
                      {question2?.question || ""}
                    </Text>
                    <span
                      className={`font-semibold text-[${pdfStyle?.answerTextSize}px]`}
                    >
                      : {question2?.answer || "NA"}
                    </span>
                  </div>
                </div>

                <div className=" w-[1px] bg-[#D8D8D8] rounded-full"></div>
                <div
                  className={`flex flex-col items-start my-${pdfStyle?.marginY} pl-${pdfStyle?.paddingL} w-1/2`}
                >
                  {question2?.subQuestion
                    ?.flatMap((item) => item.subQuestion || [])
                    .filter(
                      (ques) =>
                        ques.whenToShow === question2?.answer &&
                        ques?.answer !== "none" &&
                        ques?.type !== "IMAGE"
                    )
                    .map((question, i) => {
                      //   const mergedSubQuestions = question1?.subQuestion?.flatMap(item => item.subQuestion || []);
                      const checkLength = question2?.subQuestion
                        ?.flatMap((item) => item.subQuestion || [])
                        .filter(
                          (ques) =>
                            ques.whenToShow === question2?.answer &&
                            ques?.answer !== "none" &&
                            ques?.type !== "IMAGE"
                        ).length;
                      return (
                        <>
                          <div
                            className={`flex items-center justify-start my-${pdfStyle?.marginY}`}
                          >
                            <Text
                              className={`w-[250px] text-start mr-2 text-[${pdfStyle?.questionTextSize}px]`}
                            >
                              {question?.question}
                            </Text>
                            <span
                              className={`font-semibold text-start text-[${pdfStyle?.answerTextSize}px]`}
                            >
                              :{" "}
                              {question?.answer === true
                                ? "Yes"
                                : question?.answer === false
                                ? "No"
                                : question?.answer || "NA"}
                            </span>
                          </div>
                          {question?.subQuestion
                            ?.filter(
                              (v) =>
                                v?.whenToShow === question?.answer &&
                                v?.answer !== "none" &&
                                v?.type !== "IMAGE"
                            )
                            .map((subofSubQues, j) => {
                              return (
                                <>
                                  <div className="w-full h-[1px] bg-[#D8D8D8] rounded-full "></div>
                                  <div
                                    className={`flex items-center justify-start my-${pdfStyle?.marginY}`}
                                  >
                                    <Text
                                      className={`w-[250px] text-start text-[${pdfStyle?.questionTextSize}px]`}
                                    >
                                      {subofSubQues?.question}
                                    </Text>
                                    <span
                                      className={`font-semibold text-start text-[${pdfStyle?.answerTextSize}px]`}
                                    >
                                      :{" "}
                                      {subofSubQues?.answer === true
                                        ? "Yes"
                                        : subofSubQues?.answer === false
                                        ? "No"
                                        : subofSubQues?.answer || "NA"}
                                    </span>
                                  </div>
                                </>
                              );
                            })}
                          {checkLength - 1 !== i && (
                            <div className="w-full h-[1px] bg-[#D8D8D8] rounded-full "></div>
                          )}
                        </>
                      );
                    })}
                  {question2?.subQuestion
                    ?.flatMap((item) => item.subQuestion || [])
                    .filter(
                      (ques) =>
                        ques.whenToShow === question2?.answer &&
                        ques?.type === "IMAGE"
                    )
                    .map((question, i) => {
                      return (
                        <>
                          {question?.answer?.length > 0 && (
                            <div className="w-full h-[1px] bg-[#D8D8D8] rounded-full"></div>
                          )}
                          <div
                            className={`flex flex-wrap items-center justify-start`}
                          >
                            {question?.answer?.map((src, index) => (
                              <Image
                                className={`w-[${pdfStyle?.imageW}px] h-[${pdfStyle?.imageH}px] rounded-md p-1`}
                                src={src}
                                alt={"src"}
                              />
                            ))}
                          </div>
                        </>
                      );
                    })}
                </div>
              </div>
              <div className="w-full h-[1px] bg-[#D8D8D8] rounded-full"></div>
            </>
          )}
          {question3?.answer && (
            <>
              <div className={`flex py-${pdfStyle?.paddingY}`}>
                <div
                  className={`flex flex-col items-start justify-center my-${pdfStyle?.marginY} pl-${pdfStyle?.paddingL} w-1/2`}
                >
                  <div className="flex items-center justify-start">
                    <Text
                      className={`w-[150px] text-start text-[${pdfStyle?.questionTextSize}px]`}
                    >
                      {question3?.question}
                    </Text>
                    <span
                      className={`font-semibold text-[${pdfStyle?.answerTextSize}px]`}
                    >
                      : {question3?.answer || "NA"}
                    </span>
                  </div>
                </div>

                <div className=" w-[1px] bg-[#D8D8D8] rounded-full"></div>

                <div
                  className={`flex flex-col items-start my-${pdfStyle?.marginY} pl-${pdfStyle?.paddingL} w-1/2`}
                >
                  {question3?.subQuestion[0]?.subQuestion
                    ?.filter(
                      (ques) =>
                        ques.whenToShow === question3?.answer &&
                        ques?.answer !== "none" &&
                        ques?.type !== "IMAGE"
                    )
                    .map((question, i) => {
                      let checkLength =
                        question3?.subQuestion[0]?.subQuestion?.filter(
                          (ques) =>
                            ques.whenToShow === question3?.answer &&
                            ques?.answer !== "none" &&
                            ques?.type !== "IMAGE"
                        ).length;
                      return (
                        <>
                          <div
                            className={`flex items-center justify-start my-${pdfStyle?.marginY}`}
                          >
                            <Text
                              className={`w-[250px] text-start mr-2 text-[${pdfStyle?.questionTextSize}px]`}
                            >
                              {question?.question}
                            </Text>
                            <span
                              className={`font-semibold text-start text-[${pdfStyle?.answerTextSize}px]`}
                            >
                              :{" "}
                              {question?.answer === true
                                ? "Yes"
                                : question?.answer === false
                                ? "No"
                                : question?.answer || "NA"}
                            </span>
                          </div>
                          {checkLength - 1 !== i && (
                            <div className="w-full h-[1px] bg-[#D8D8D8] rounded-full "></div>
                          )}
                        </>
                      );
                    })}
                  {question3?.subQuestion
                    ?.flatMap((item) => item.subQuestion || [])
                    .filter(
                      (ques) =>
                        ques.whenToShow === question3?.answer &&
                        ques?.type === "IMAGE"
                    )
                    .map((question, i) => {
                      return (
                        <>
                          {" "}
                          {question?.answer.length > 0 && (
                            <div className="w-full h-[1px] bg-[#D8D8D8] rounded-full"></div>
                          )}
                          <div
                            className={`flex flex-wrap items-center justify-start`}
                          >
                            {question?.answer?.map((src, index) => (
                              <Image
                                className={`w-[${pdfStyle?.imageW}px] h-[${pdfStyle?.imageH}px] rounded-md p-1`}
                                src={src}
                                alt={"src"}
                              />
                            ))}
                          </div>
                        </>
                      );
                    })}
                </div>
              </div>
              <div className="w-full h-[1px] bg-[#D8D8D8] rounded-full"></div>
            </>
          )}
          {question4?.answer === true && (
            <>
              <div className={`flex py-${pdfStyle?.paddingY}`}>
                <div
                  className={`flex flex-col items-start justify-center my-${pdfStyle?.marginY} pl-${pdfStyle?.paddingL} w-1/2`}
                >
                  <div className="flex items-center justify-start">
                    <Text
                      className={`w-[150px] text-start text-[${pdfStyle?.questionTextSize}px]`}
                    >
                      {question4?.answer ? "Radiant Heating" : ""}
                    </Text>
                  </div>
                </div>

                <div className=" w-[1px] bg-[#D8D8D8] rounded-full"></div>

                <div
                  className={`flex flex-col items-start my-${pdfStyle?.marginY} pl-${pdfStyle?.paddingL} w-1/2`}
                >
                  {question4?.subQuestion[0]?.subQuestion
                    ?.filter(
                      (ques) =>
                        ques.whenToShow === question4?.answer &&
                        ques?.answer !== "none" &&
                        ques?.type !== "IMAGE"
                    )
                    .map((question, i) => {
                      let checkLength =
                        question4?.subQuestion[0]?.subQuestion?.filter(
                          (ques) =>
                            ques.whenToShow === question4?.answer &&
                            ques?.answer !== "none" &&
                            ques?.type !== "IMAGE"
                        ).length;
                      return (
                        <>
                          <div
                            className={`flex items-center justify-start my-${pdfStyle?.marginY}`}
                          >
                            <Text
                              className={`w-[200px] text-start mr-2 text-[${pdfStyle?.questionTextSize}px]`}
                            >
                              {question?.question}
                            </Text>
                            <span
                              className={`font-semibold text-start text-[${pdfStyle?.answerTextSize}px]`}
                            >
                              :{" "}
                              {question?.answer === true
                                ? "Yes"
                                : question?.answer === false
                                ? "No"
                                : question?.answer || "NA"}
                            </span>
                          </div>
                          {checkLength - 1 !== i && (
                            <div className="w-full h-[1px] bg-[#D8D8D8] rounded-full "></div>
                          )}
                        </>
                      );
                    })}
                  {question4?.subQuestion
                    ?.flatMap((item) => item.subQuestion || [])
                    .filter(
                      (ques) =>
                        ques.whenToShow === question4?.answer &&
                        ques?.type === "IMAGE"
                    )
                    .map((question, i) => {
                      return (
                        <>
                          {" "}
                          {question?.answer.length > 0 && (
                            <div className="w-full h-[1px] bg-[#D8D8D8] rounded-full"></div>
                          )}
                          <div
                            className={`flex flex-wrap items-center justify-start`}
                          >
                            {question?.answer?.map((src, index) => (
                              <Image
                                className={`w-[${pdfStyle?.imageW}px] h-[${pdfStyle?.imageH}px] rounded-md p-1`}
                                src={src}
                                alt={"src"}
                              />
                            ))}
                          </div>
                        </>
                      );
                    })}
                </div>
              </div>
              <div className="w-full h-[1px] bg-[#D8D8D8] rounded-full"></div>
            </>
          )}

          {/* 5th  */}
          {question5?.answer === true && (
            <>
              <div className={`flex py-${pdfStyle?.paddingY}`}>
                <div
                  className={`flex flex-col items-start justify-center my-${pdfStyle?.marginY} pl-${pdfStyle?.paddingL} w-1/2`}
                >
                  <div className={`flex items-center justify-start`}>
                    <Text
                      className={`w-[150px] text-start text-[${pdfStyle?.questionTextSize}px]`}
                    >
                      {question5?.question}
                    </Text>
                  </div>
                </div>

                <div className=" w-[1px] bg-[#D8D8D8] rounded-full"></div>

                <div
                  className={`flex flex-col items-start my-${pdfStyle?.marginY} pl-${pdfStyle?.paddingL} w-1/2`}
                >
                  {question5?.subQuestion[0]?.subQuestion
                    ?.filter(
                      (ques) =>
                        ques.whenToShow === question5?.answer &&
                        ques?.answer !== "none" &&
                        ques?.type !== "IMAGE"
                    )
                    .map((question, i) => {
                      let checkLength =
                        question5?.subQuestion[0]?.subQuestion?.filter(
                          (ques) =>
                            ques.whenToShow === question5?.answer &&
                            ques?.answer !== "none" &&
                            ques?.type !== "IMAGE"
                        ).length;
                      return (
                        <>
                          <div
                            className={`flex items-center justify-start my-${pdfStyle?.marginY}`}
                          >
                            <Text
                              className={`w-[200px] text-start mr-2 text-[${pdfStyle?.questionTextSize}px]`}
                            >
                              {question?.question}
                            </Text>
                            <span
                              className={`font-semibold text-start text-[${pdfStyle?.answerTextSize}px]`}
                            >
                              :{" "}
                              {question?.answer === true
                                ? "Yes"
                                : question?.answer === false
                                ? "No"
                                : question?.answer || "NA"}
                            </span>
                          </div>
                          {checkLength - 1 !== i && (
                            <div className="w-full h-[1px] bg-[#D8D8D8] rounded-full "></div>
                          )}
                        </>
                      );
                    })}
                  {question5?.subQuestion
                    ?.flatMap((item) => item.subQuestion || [])
                    .filter(
                      (ques) =>
                        ques.whenToShow === question5?.answer &&
                        ques?.type === "IMAGE"
                    )
                    .map((question, i) => {
                      return (
                        <>
                          {" "}
                          {question?.answer.length > 0 && (
                            <div className="w-full h-[1px] bg-[#D8D8D8] rounded-full"></div>
                          )}
                          <div
                            className={`flex flex-wrap items-center justify-start`}
                          >
                            {question?.answer?.map((src, index) => (
                              <Image
                                className={`w-[${pdfStyle?.imageW}px] h-[${pdfStyle?.imageH}px] rounded-md p-1`}
                                src={src}
                                alt={"src"}
                              />
                            ))}
                          </div>
                        </>
                      );
                    })}
                </div>
              </div>
              <div className="w-full h-[1px] bg-[#D8D8D8] rounded-full"></div>
            </>
          )}
          {/* 6th  */}
          {question6?.answer && (
            <>
              <div className={`flex py-${pdfStyle?.paddingY}`}>
                <div
                  className={`flex flex-col items-start justify-center my-${pdfStyle?.marginY} pl-${pdfStyle?.paddingL} w-full`}
                >
                  <div className="flex items-center justify-start">
                    <Text
                      className={`w-[150px] text-start text-[${pdfStyle?.questionTextSize}px]`}
                    >
                      {question6?.question}
                    </Text>
                    <span
                      className={`font-semibold text-[${pdfStyle?.answerTextSize}px]`}
                    >
                      : {question6?.answer || "NA"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="w-full h-[1px] bg-[#D8D8D8] rounded-full"></div>
            </>
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

export default SubFloorCheckListPdf;
