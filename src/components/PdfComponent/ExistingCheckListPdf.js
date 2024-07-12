import React from "react";
import Text from "../UI/Text";
import Image from "../UI/Image";
import { pdfStyle } from "../../utils/Constants";

const ExistingCheckListPdf = ({ customerDetails1 }) => {
  // const {temperature,humidity,buildingType} = customerDetails?.fv_data?.customer

  const allChecklist =
    Object.keys(customerDetails1 || {}).length > 0
      ? [...customerDetails1?.fv_data?.existing_materials]
      : [];

  const SingleCheckList = ({ checklist }) => {
    function getRoomNamesByRefinishingId(floors, refinishingId) {
      const roomNames = [];

      for (const floor of floors) {
        for (const room of floor.rooms) {
          //   debugger
          if (room.existing_material_id === refinishingId) {
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
      (question) => question.question === "Are there any bevels"
    );
    const question3 = allQuestions.find(
      (question) => question.question === "Species"
    );
    const question4 = allQuestions.find(
      (question) => question.question === "Layout"
    );
    const question5 = allQuestions.find(
      (question) => question.question === "Width"
    );
    const question6 = allQuestions.find(
      (question) => question.question === "Thickness"
    );
    const question7 = allQuestions.find(
      (question) => question.question === "Installation"
    );
    const question8 = allQuestions.find(
      (question) => question.question === "Exposed or Covered"
    );
    const question9 = allQuestions.find(
      (question) => question.question === "Sawn Type"
    );
    const question10 = allQuestions.find(
      (question) => question.question === "Notes"
    );
    console.log("q2", question2);
    return (
      <>
        <div
          className={`bg-[${pdfStyle?.headingBgColor}] flex    pl-2 p-1.5 rounded-lg items-center my-${pdfStyle?.marginY} mt-6`}
        >
          <div
            className={`!w-[20px] h-[20px] rounded-full flex-none `}
            style={{ backgroundColor: checklist?.color }}
          ></div>
          <Text
            className={`text-black text-[${pdfStyle.headingSize}px] font-semibold text-start  flex-none pr-4 ml-2.5`}
          >
            Existing Material
          </Text>
          {singleStringRoom && (
            <div className="text-black text-[16px] font-normal text-start   ">
              [{singleStringRoom}]
            </div>
          )}
        </div>
        <div className={`my-${pdfStyle?.marginY}`}>
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

                <div className=" w-[1px] bg-[#D8D8D8] rounded-full"></div>
                <div
                  className={`flex flex-col items-start my-${pdfStyle?.marginY} pl-${pdfStyle?.paddingL} w-1/2`}
                >
                  {question1?.subQuestion
                    ?.filter((ques) => ques.whenToShow === question1?.answer)
                    .map((question, i) => {
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
                          {question1?.subQuestion?.filter(
                            (ques) => ques.whenToShow === question1?.answer
                          ).length -
                            1 !==
                            i && (
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

          {question2?.answer === true && (
            <>
              <div className={`flex py-${pdfStyle?.paddingY}`}>
                <div
                  className={`flex flex-col items-start justify-center my-${pdfStyle?.marginY} pl-${pdfStyle?.paddingL} w-1/2`}
                >
                  <div className="flex items-center justify-start">
                    <Text
                      className={`w-[250px] text-start text-[${pdfStyle?.questionTextSize}px]`}
                    >
                      {question2?.answer ? "There are bevels" : ""}
                    </Text>
                  </div>
                </div>

                <div className=" w-[1px] bg-[#D8D8D8] rounded-full"></div>
                <div
                  className={`flex flex-col items-start my-${pdfStyle?.marginY} pl-${pdfStyle?.paddingL} w-1/2`}
                >
                  {question2?.subQuestion
                    ?.filter((v) => v.whenToShow === question2?.answer)
                    .map((ques, i) => {
                      return (
                        <>
                          {ques?.answer  && (
                            <>
                              <div
                                className={`flex items-center justify-start my-${pdfStyle?.marginY}`}
                              >
                                <Text
                                  className={`w-[200px] text-start text-[${pdfStyle?.questionTextSize}px]`}
                                >
                                  {ques?.question} notes
                                </Text>
                                <span
                                  className={`font-semibold text-start text-[${pdfStyle?.answerTextSize}px]`}
                                >
                                  : {ques?.subQuestion[0]?.answer || "NA"}
                                </span>
                              </div>
                              {question2?.subQuestion?.filter(
                                (ques) => ques.answer === question2?.answer
                              ).length -
                                1 !==
                                i && (
                                <div className="w-full h-[1px] bg-[#D8D8D8] rounded-full "></div>
                              )}
                            </>
                          )}
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
                  <div className={`flex items-center justify-start`}>
                    <Text
                      className={`w-[150px] text-start text-[${pdfStyle?.questionTextSize}px]`}
                    >
                      {question3?.answer ? "Species" : ""}
                    </Text>
                    <span
                      className={`font-semibold text-[${pdfStyle?.answerTextSize}px]`}
                    >
                      : {question3?.answer || "NA"}
                    </span>
                  </div>
                </div>

                {question3?.subQuestion?.filter(
                  (ques) => ques.whenToShow === question4?.answer
                ).length > 0 && (
                  <div className=" w-[1px] bg-[#D8D8D8] rounded-full"></div>
                )}
                <div
                  className={`flex flex-col items-start my-${pdfStyle?.marginY} pl-${pdfStyle?.paddingL} w-1/2`}
                >
                  {question3?.subQuestion
                    ?.filter((v) => v.whenToShow === question3?.answer)
                    .map((ques, i) => {
                      return (
                        <>
                          <div
                            className={`flex items-center justify-start my-${pdfStyle?.marginY}`}
                          >
                            <Text
                              className={`w-[200px] text-start text-[${pdfStyle?.questionTextSize}px]`}
                            >
                              {ques?.question}
                            </Text>
                            <span
                              className={`font-semibold text-start text-[${pdfStyle?.answerTextSize}px]`}
                            >
                              : {ques?.answer || "NA"}
                            </span>
                          </div>
                          {question3?.subQuestion?.filter(
                            (ques) => ques.whenToShow === question3?.answer
                          ).length -
                            1 !==
                            i && (
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
          {question4?.answer && (
            <>
              <div className={`flex py-${pdfStyle?.paddingY}`}>
                <div
                  className={`flex flex-col items-start justify-center my-${pdfStyle?.marginY} pl-${pdfStyle?.paddingL} w-1/2`}
                >
                  <div className="flex items-center justify-start">
                    <Text
                      className={`w-[150px] text-start text-[${pdfStyle?.questionTextSize}px]`}
                    >
                      {question4?.answer ? "Layout" : ""}
                    </Text>
                    <span
                      className={`font-semibold text-[${pdfStyle?.answerTextSize}px]`}
                    >
                      : {question4?.answer || "NA"}
                    </span>
                  </div>
                </div>
                {question4?.subQuestion?.filter(
                  (ques) => ques.whenToShow === question4?.answer
                ).length > 0 && (
                  <div className=" w-[1px] bg-[#D8D8D8] rounded-full"></div>
                )}
                <div
                  className={`flex flex-col items-start my-${pdfStyle?.marginY} pl-${pdfStyle?.paddingL} w-1/2`}
                >
                  {question4?.subQuestion
                    ?.filter((v) => v.whenToShow === question4?.answer)
                    .map((ques, i) => {
                      return (
                        <>
                          <div
                            className={`flex items-center justify-start my-${pdfStyle?.marginY}`}
                          >
                            <Text
                              className={`w-[200px] text-start text-[${pdfStyle?.questionTextSize}px]`}
                            >
                              {ques?.question}
                            </Text>
                            <span
                              className={`font-semibold text-start text-[${pdfStyle?.answerTextSize}px]`}
                            >
                              : {ques?.answer || "NA"}
                            </span>
                          </div>
                          {question4?.subQuestion?.filter(
                            (ques) => ques.whenToShow === question4?.answer
                          ).length -
                            1 !==
                            i && (
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

          {/* 5th and 6th */}
          <div className={`flex py-${pdfStyle?.paddingY}`}>
            {[question5, question6]
              .filter((Q) => Q?.answer)
              .map((ques, p) => {
                const lengthCheck = [question5, question6].filter(
                  (Q) => Q?.answer
                ).length;

                return (
                  <>
                    <div
                      className={`flex flex-col items-start my-${
                        pdfStyle?.marginY
                      } pl-${pdfStyle?.paddingL} ${
                        lengthCheck === 2 ? "w-1/2" : "w-full"
                      }`}
                    >
                      <div className="flex items-center justify-start">
                        <Text
                          className={`w-[150px] text-start text-[${pdfStyle?.questionTextSize}px]`}
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
                    {lengthCheck === 2 && p == 0 && (
                      <div className=" w-[1px] bg-[#D8D8D8] rounded-full"></div>
                    )}
                    {/* <div className="w-full h-[1px] bg-[#D8D8D8] rounded-full"></div> */}
                  </>
                );
              })}
          </div>
          {[question5, question6].filter((Q) => Q?.answer).length > 0 && (
            <div className="w-full h-[1px] bg-[#D8D8D8] rounded-full"></div>
          )}
          {/* 7th */}
          {question7?.answer && (
            <>
              <div className={`flex py-${pdfStyle?.paddingY}`}>
                <div
                  className={`flex flex-col items-start justify-center my-${pdfStyle?.marginY} pl-${pdfStyle?.paddingL} w-full`}
                >
                  <div className="flex items-center justify-start">
                    <Text
                      className={`w-[150px] text-start text-[${pdfStyle?.questionTextSize}px]`}
                    >
                      {question7?.answer ? "Layout" : ""}
                    </Text>
                    <span
                      className={`font-semibold text-[${pdfStyle?.answerTextSize}px]`}
                    >
                      : {question7?.answer || "NA"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="w-full h-[1px] bg-[#D8D8D8] rounded-full"></div>
            </>
          )}

          {/* 8th */}
          {question8?.answer && (
            <>
              <div className={`flex py-${pdfStyle?.paddingY}`}>
                <div
                  className={`flex flex-col items-start justify-center my-${pdfStyle?.marginY} pl-${pdfStyle?.paddingL} w-1/2`}
                >
                  <div className="flex items-center justify-start">
                    <Text
                      className={`w-[150px] text-start text-[${pdfStyle?.questionTextSize}px]`}
                    >
                      {question8?.answer}
                    </Text>
                  </div>
                </div>
                {question8?.subQuestion?.filter(
                  (ques) => ques.whenToShow === question8?.answer
                ).length > 0 && (
                  <div className=" w-[1px] bg-[#D8D8D8] rounded-full"></div>
                )}
                <div
                  className={`flex flex-col items-start my-${pdfStyle?.marginY} pl-${pdfStyle?.paddingL} w-1/2`}
                >
                  {question8?.subQuestion
                    ?.filter(
                      (v) =>
                        v.whenToShow === question8?.answer &&
                        v?.answer !== "none"
                    )
                    .map((ques, i) => {
                      return (
                        <>
                          <div
                            className={`flex items-center justify-start my-${pdfStyle?.marginY}`}
                          >
                            {ques?.question ===
                            "Is KASA removing the existing flooring" ? (
                              ques?.answer === true ? (
                                <Text
                                  className={`w-[300px] text-start text-[${pdfStyle?.questionTextSize}px]`}
                                >
                                  KASA is removing the existing flooring
                                </Text>
                              ) : ques?.answer === false ? (
                                <Text
                                  className={`w-[300px] text-start text-[${pdfStyle?.questionTextSize}px]`}
                                >
                                  KASA is not removing the existing flooring
                                </Text>
                              ) : (
                                ""
                              )
                            ) : (
                              <>
                                <Text
                                  className={`w-[250px] text-start text-[${pdfStyle?.questionTextSize}px]`}
                                >
                                  {ques?.question}
                                </Text>
                                <span
                                  className={`font-semibold text-start text-[${pdfStyle?.answerTextSize}px]`}
                                >
                                  : {ques?.answer || "NA"}
                                </span>
                              </>
                            )}
                          </div>
                          {ques?.subQuestion
                            ?.filter((v) => v.whenToShow === ques?.answer)
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
                          {question8?.subQuestion?.filter(
                            (ques) =>
                              ques.whenToShow === question8?.answer &&
                              ques?.answer !== "none"
                          ).length -
                            1 !==
                            i && (
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

          {/* 9th and 10th */}
          <div className={`flex py-${pdfStyle?.paddingY}`}>
            {[question9, question10]
              .filter((Q) => Q?.answer)
              .map((ques, p) => {
                const lengthCheck = [question9, question10].filter(
                  (Q) => Q?.answer
                ).length;

                return (
                  <>
                    <div
                      className={`flex flex-col items-start my-${
                        pdfStyle?.marginY
                      } pl-${pdfStyle?.paddingL} ${
                        lengthCheck === 2 ? "w-1/2" : "w-full"
                      }`}
                    >
                      <div className="flex items-center justify-start">
                        <Text
                          className={`w-[150px] text-start text-[${pdfStyle?.questionTextSize}px]`}
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
                    {lengthCheck === 2 && p == 0 && (
                      <div className=" w-[1px] bg-[#D8D8D8] rounded-full"></div>
                    )}
                    {/* <div className="w-full h-[1px] bg-[#D8D8D8] rounded-full"></div> */}
                  </>
                );
              })}
          </div>
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

export default ExistingCheckListPdf;
