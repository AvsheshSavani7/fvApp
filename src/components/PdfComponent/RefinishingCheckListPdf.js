import React from "react";
import Text from "../UI/Text";
import { pdfStyle } from "../../utils/Constants";

const RefinishingCheckListPdf = ({ customerDetails1 }) => {
  const allrefinishingChecklist =
    Object.keys(customerDetails1 || {}).length > 0
      ? [...customerDetails1?.fv_data?.refinishing_checklists]
      : [];

  const SingleCheckList = ({ checklist }) => {
    function getRoomNamesByRefinishingId(floors, refinishingId) {
      const roomNames = [];

      for (const floor of floors) {
        for (const room of floor.rooms) {
          //   debugger
          if (room.refinishing_checklists_id === refinishingId) {
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
      (question) => question.question === "Can Floor be buffed & recoated?"
    );
    const question2 = allQuestions.find(
      (question) =>
        question.question === "Confirmation of enough material for sanding?"
    );
    const question3 = allQuestions.find(
      (question) =>
        question.question === "Excessive damage (ex. pet stains,cracked boards)"
    );
    const question4 = allQuestions.find(
      (question) =>
        question.question === "Surface issued ( ex. mastic, paint, wax)"
    );
    const question5 = allQuestions.find(
      (question) => question.question === "Notes"
    );

    return (
      <>
        <div
          className={`bg-[${pdfStyle?.headingBgColor}] flex  items-center  pl-2  p-1.5 rounded-lg  my-${pdfStyle?.marginY} `}
        >
          <div
            className={`!w-[20px] h-[20px] rounded-full flex-none `}
            style={{ backgroundColor: checklist?.color }}
          ></div>
          <Text
            className={`text-black text-[${pdfStyle.headingSize}px] font-semibold text-start  flex-none pr-4 ml-2.5`}
          >
            Refinishing Checklist
          </Text>
          {singleStringRoom ? (
            <div className={`text-black text-[16px] font-normal text-start `}>
              [{singleStringRoom}]
            </div>
          ) : (
            ``
          )}
        </div>
        <div className={`my-${pdfStyle?.marginY}`}>
          {question1?.answer === true ? (
            <>
              <div className={`flex py-${pdfStyle?.paddingY}`}>
                <div
                  className={`flex flex-col items-start justify-center my-${pdfStyle?.marginY} pl-${pdfStyle?.paddingL} w-1/2`}
                >
                  <div className="flex items-center justify-start">
                    <Text
                      className={`w-[250px] text-start text-[${pdfStyle?.questionTextSize}px]`}
                    >
                      {question1?.answer ? "Floor be buffed & recoated" : ""}
                    </Text>
                  </div>
                </div>

                <div className=" w-[1px] bg-[#D8D8D8] rounded-full"></div>
                <div
                  className={`flex flex-col items-start my-${pdfStyle?.marginY} pl-${pdfStyle?.paddingL} w-1/2`}
                >
                  <div
                    className={`flex items-center justify-start my-${pdfStyle?.marginY}`}
                  >
                    <Text
                      className={`w-[200px] text-start text-[${pdfStyle?.questionTextSize}px]`}
                    >
                      Conf. no waxes or polishes on the floor?
                    </Text>
                    <span
                      className={`font-semibold text-[${pdfStyle?.answerTextSize}px]`}
                    >
                      : {question1?.subQuestion[0]?.answer || "NA"}
                    </span>
                  </div>
                  <div className="w-full h-[1px] bg-[#D8D8D8] rounded-full "></div>
                  <div
                    className={`flex items-center justify-start my-${pdfStyle?.marginY}`}
                  >
                    <Text
                      className={`w-[200px] text-start text-[${pdfStyle?.questionTextSize}px]`}
                    >
                      Buffing and Recoating Notes
                    </Text>
                    <span
                      className={`font-semibold text-[${pdfStyle?.answerTextSize}px]`}
                    >
                      : {question1?.subQuestion[1]?.answer || "NA"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="w-full h-[1px] bg-[#D8D8D8] rounded-full"></div>
            </>
          ) : (
            ``
          )}

          {question2?.answer !== "none" ? (
            <>
              <div className={`flex py-${pdfStyle?.paddingY}`}>
                <div
                  className={`flex flex-col items-start justify-center my-${pdfStyle?.marginY} pl-${pdfStyle?.paddingL} w-1/2`}
                >
                  <div className="flex items-center justify-start">
                    <Text
                      className={`w-[250px] text-start text-[${pdfStyle?.questionTextSize}px]`}
                    >
                      {question2?.answer
                        ? "Enough material for sanding"
                        : "Not enough material for sanding"}
                    </Text>
                  </div>
                </div>

                <div className=" w-[1px] bg-[#D8D8D8] rounded-full"></div>
                {question2?.answer === true ? (
                  <div
                    className={`flex flex-col items-start my-${pdfStyle?.marginY} pl-${pdfStyle?.paddingL} w-1/2`}
                  >
                    <div
                      className={`flex items-center justify-start my-${pdfStyle?.marginY}`}
                    >
                      <Text
                        className={`w-[200px] text-start text-[${pdfStyle?.questionTextSize}px]`}
                      >
                        Wear Layer thickness If Eng.
                      </Text>
                      <span
                        className={`font-semibold text-[${pdfStyle?.answerTextSize}px]`}
                      >
                        : {question2?.subQuestion[0]?.answer || "NA"}
                      </span>
                    </div>
                    <div className="w-full h-[1px] bg-[#D8D8D8] rounded-full "></div>
                    <div
                      className={`flex items-center justify-start my-${pdfStyle?.marginY}`}
                    >
                      <Text
                        className={`w-[200px] text-start text-[${pdfStyle?.questionTextSize}px]`}
                      >
                        Notes
                      </Text>
                      <span
                        className={`font-semibold text-[${pdfStyle?.answerTextSize}px]`}
                      >
                        : {question2?.subQuestion[2]?.answer || "NA"}
                      </span>
                    </div>
                    {question2?.subQuestion?.[1]?.answer?.length > 0 ? (
                      <>
                        <div className="w-full h-[1px] bg-[#D8D8D8] rounded-full"></div>
                        <div
                          className={`flex flex-wrap items-center justify-start`}
                        >
                          {question2?.subQuestion?.[1]?.answer?.map(
                            (src, index) => (
                              <img
                                className={`w-[${pdfStyle?.imageW}px] h-[${pdfStyle?.imageH}px] rounded-md p-1`}
                                src={src}
                                alt={"src"}
                              />
                            )
                          )}
                        </div>
                      </>
                    ) : (
                      ``
                    )}
                  </div>
                ) : (
                  <div
                    className={`flex flex-col items-start my-${pdfStyle?.marginY} pl-${pdfStyle?.paddingL} w-1/2`}
                  >
                    <div
                      className={`flex items-center justify-start my-${pdfStyle?.marginY}`}
                    >
                      <Text
                        className={`w-[200px] text-start text-[${pdfStyle?.questionTextSize}px]`}
                      >
                        Details for thickness of wear layer (confirmed to thin)
                      </Text>
                      <span
                        className={`font-semibold text-[${pdfStyle?.answerTextSize}px]`}
                      >
                        : {question2?.subQuestion[4]?.answer || "NA"}
                      </span>
                    </div>
                  </div>
                )}
              </div>
              <div className="w-full h-[1px] bg-[#D8D8D8] rounded-full"></div>
            </>
          ) : (
            ``
          )}
          {question3?.answer === true ? (
            <>
              <div className={`flex py-${pdfStyle?.paddingY}`}>
                <div
                  className={`flex flex-col items-start justify-center my-${pdfStyle?.marginY} pl-${pdfStyle?.paddingL} w-1/2`}
                >
                  <div className="flex items-center justify-start">
                    <Text
                      className={`w-[250px] text-start text-[${pdfStyle?.questionTextSize}px]`}
                    >
                      {question3?.answer ? "Excessive damage" : ""}
                    </Text>
                  </div>
                </div>

                <div className=" w-[1px] bg-[#D8D8D8] rounded-full"></div>
                <div
                  className={`flex flex-col items-start my-${pdfStyle?.marginY} pl-${pdfStyle?.paddingL} w-1/2`}
                >
                  {question3?.subQuestion?.filter((Q)=> Q?.answer === true).map((ques, index) => {
                    return (
                      <>
                        {ques?.answer === true ? (
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
                            {
                              question3?.subQuestion?.filter((Q)=> Q?.answer === true).length -1 !== index ? 
                              <div className="w-full h-[1px] bg-[#D8D8D8] rounded-full "></div> :``
                            }
                          </>
                        ) : (
                          ``
                        )}
                      </>
                    );
                  })}
                </div>
              </div>
              <div className="w-full h-[1px] bg-[#D8D8D8] rounded-full"></div>
            </>
          ) : (
            ``
          )}
          {question4?.answer === true ? (
            <>
              <div className={`flex py-${pdfStyle?.paddingY}`}>
                <div
                  className={`flex flex-col items-start justify-center my-${pdfStyle?.marginY} pl-${pdfStyle?.paddingL} w-1/2`}
                >
                  <div className="flex items-center justify-start">
                    <Text
                      className={`w-[250px] text-start text-[${pdfStyle?.questionTextSize}px]`}
                    >
                      {question4?.answer ? "Surface issued" : ""}
                    </Text>
                  </div>
                </div>

                <div className=" w-[1px] bg-[#D8D8D8] rounded-full"></div>
                <div
                  className={`flex flex-col items-start my-${pdfStyle?.marginY} pl-${pdfStyle?.paddingL} w-1/2`}
                >
                  {question4?.subQuestion?.map((ques, i) => {
                    return (
                      <>
                        {ques?.answer === true ? (
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
                            {question1?.subQuestion?.filter(
                              (ques) => ques.whenToShow === question1?.answer
                            ).length -
                              1 !==
                            i ? (
                              <div className="w-full h-[1px] bg-[#D8D8D8] rounded-full "></div>
                            ) : (
                              ``
                            )}
                          </>
                        ) : (
                          ``
                        )}
                      </>
                    );
                  })}
                </div>
              </div>
              <div className="w-full h-[1px] bg-[#D8D8D8] rounded-full"></div>
            </>
          ) : (
            ``
          )}

          {question5?.answer ? (
            <div className={`flex py-${pdfStyle?.paddingY}`}>
              <div
                className={`flex flex-col items-start my-${pdfStyle?.marginY} pl-${pdfStyle?.paddingL} w-full`}
              >
                <div className="flex items-center justify-start">
                  <Text
                    className={`w-[150px] text-start text-[${pdfStyle?.questionTextSize}px]`}
                  >
                    Notes
                  </Text>
                  <span
                    className={`font-semibold text-[${pdfStyle?.answerTextSize}px]`}
                  >
                    : {question5?.answer || "NA"}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            ``
          )}
        </div>
      </>
    );
  };

  return (
    <>
      {allrefinishingChecklist.map((singleCL) => {
        return <SingleCheckList checklist={singleCL} />;
      })}
    </>
  );
};

export default RefinishingCheckListPdf;
