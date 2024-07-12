import React from "react";
import Text from "../UI/Text";
import { pdfStyle } from "../../utils/Constants";
import { checkAnswerExist } from "../../helper/helper";

const RefinishingCheckListPdfNew = ({ customerDetails1, index }) => {
  const allrefinishingChecklist =
    Object.keys(customerDetails1 || {}).length > 0
      ? [...customerDetails1?.fv_data?.refinishing_checklists]
      : [];

  let answerExist = checkAnswerExist(allrefinishingChecklist);

  const SingleCheckList = ({ checklist, index }) => {
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
        question.question === "Surface issues ( ex. mastic, paint, wax)"
    );
    const question5 = allQuestions.find(
      (question) => question.question === "Notes"
    );

    const question3String = () => {
      let str = "";
      if (question3?.answer) {
        question3?.subQuestion?.forEach((ques) => {
          if (ques?.answer === true) {
            // Check if str is not empty to add a comma
            if (str !== "") {
              str += ", ";
            }
            str += ques.question;
          }
        });
      }
      return str || "NA";
    };
    const question4String = () => {
      let str = "";
      if (question4?.answer) {
        question4?.subQuestion?.forEach((ques) => {
          if (ques?.answer === true) {
            // Check if str is not empty to add a comma
            if (str !== "") {
              str += ", ";
            }
            str += ques.question;
          }
        });
      }
      return str || "NA";
    };

    return (
      <>
        {(question1?.answer !== "none" ||
          question2?.answer !== "none" ||
          question3?.answer !== "none" ||
          question4?.answer !== "none" ||
          question5?.answer !== "") && (
          <>
            <div className="flex my-2 break-avoid">
              <div className="flex justify-center items-center">
                <div
                  className={`w-[30px] h-[30px]  flex justify-center items-center bg-[${checklist?.color}] text-white rounded-full text-[12px]`}
                  style={{ backgroundColor: `${checklist?.color}` }}
                >
                  {index + 1}
                </div>
              </div>
              <div
                className="flex  justify-between"
                style={{ width: "calc(100% - 45px)" }}
              >
                <div
                  className={`${pdfStyle?.checkListLeftW} ml-3  flex  justify-between items-center`}
                >
                  <ul
                    className={`list-disc list-outside	ml-3 ${pdfStyle?.checklistLeftFont} ${pdfStyle?.defaultTextColor}`}
                  >
                    {question1?.answer !== "none" ? (
                      <li
                        className={` text-left ${
                          question1?.answer === true ? pdfStyle?.redColor : ""
                        } font-semibold ${pdfStyle?.liSpacing}`}
                      >
                        {question1?.answer === true
                          ? "Buffing and Coating Possible"
                          : "Buffing and Coating not Possible"}
                        {question1?.answer === true && (
                          <>
                            <br />
                            <span
                              className={`ml-8  ${pdfStyle?.spanLineHeight}	 ${pdfStyle?.defaultTextColor}`}
                            >
                              - {question1?.subQuestion[0]?.answer || "NA"}
                            </span>
                            {question1?.subQuestion[1]?.answer && (
                              <>
                                <br />
                                <span
                                  className={`ml-8  ${pdfStyle?.spanLineHeight}	 ${pdfStyle?.defaultTextColor}`}
                                >
                                  - {question1?.subQuestion[1]?.answer || "NA"}
                                </span>
                              </>
                            )}
                          </>
                        )}
                      </li>
                    ) : (
                      ``
                    )}
                    {question2?.answer !== "none" ? (
                      <li
                        className={` text-left  ${
                          question2?.answer === true ? pdfStyle?.redColor : ""
                        } font-semibold ${pdfStyle?.liSpacing}`}
                      >
                        {question2?.answer === true
                          ? "Enough Material for Sanding "
                          : "Not Enough Material for Sanding "}
                        {question2?.answer === true && (
                          <>
                            <br />
                            <span
                              className={`ml-8  ${pdfStyle?.spanLineHeight}	 ${pdfStyle?.defaultTextColor}`}
                            >
                              - Wear Layer thickness :
                              {question2?.subQuestion[0]?.answer || "NA"}
                            </span>
                            {question2?.subQuestion[2]?.answer && (
                              <>
                                <br />
                                <span
                                  className={`ml-8  ${pdfStyle?.spanLineHeight}	 ${pdfStyle?.defaultTextColor}`}
                                >
                                  - {question2?.subQuestion[2]?.answer || "NA"}
                                </span>
                              </>
                            )}
                          </>
                        )}
                        {question2?.answer === false && (
                          <>
                            <br />
                            <span
                              className={`ml-8  ${pdfStyle?.spanLineHeight}	 ${pdfStyle?.defaultTextColor}`}
                            >
                              - Wear Layer thickness :
                              {question2?.subQuestion[3]?.answer || "NA"}
                            </span>
                          </>
                        )}
                      </li>
                    ) : (
                      ``
                    )}
                    {question3?.answer !== "none" ? (
                      <li
                        className={` text-left ${
                          question3?.answer === true ? pdfStyle?.redColor : ""
                        }  font-semibold ${pdfStyle?.liSpacing}`}
                      >
                        {question3?.answer === true
                          ? "Excessive Damage"
                          : "No Excessive Damage"}
                        {question3?.answer === true &&
                          question3?.subQuestion
                            .filter((Q) => Q?.answer === true)
                            .map((subQue) => {
                              return (
                                <>
                                  <br />
                                  <span
                                    className={`ml-8  ${pdfStyle?.spanLineHeight}	 ${pdfStyle?.defaultTextColor}`}
                                  >
                                    - {subQue?.question}{" "}
                                    {subQue?.subQuestion[0]?.answer
                                      ? ` : ${subQue?.subQuestion[0]?.answer}`
                                      : ""}
                                  </span>
                                </>
                              );
                            })}
                      </li>
                    ) : (
                      ``
                    )}
                    {question4?.answer !== "none" ? (
                      <li
                        className={` text-left ${
                          question4?.answer === true ? pdfStyle?.redColor : ""
                        }  font-semibold ${pdfStyle?.liSpacing}`}
                      >
                        {question4?.answer === true
                          ? "Surface Issues"
                          : "No Surface Issues"}
                        {question4?.answer === true &&
                          question4?.subQuestion
                            .filter((Q) => Q?.answer === true)
                            .map((subQue) => {
                              return (
                                <>
                                  <br />
                                  <span
                                    className={`ml-8  ${pdfStyle?.spanLineHeight}	 ${pdfStyle?.defaultTextColor}`}
                                  >
                                    - {subQue?.question}{" "}
                                    {subQue?.subQuestion[0]?.answer
                                      ? ` : ${subQue?.subQuestion[0]?.answer}`
                                      : ""}
                                  </span>
                                </>
                              );
                            })}
                      </li>
                    ) : (
                      ``
                    )}
                    {question5?.answer ? (
                      <li
                        className={` text-left   font-semibold ${pdfStyle?.liSpacing}`}
                      >
                        Note : {question5?.answer}
                      </li>
                    ) : (
                      ``
                    )}
                  </ul>
                </div>
                <div
                  className={`flex justify-center items-start ${pdfStyle?.checkListRightW} gap-[1px]`}
                >
                  {customerDetails1?.fv_data?.scope?.floors.map((floor) => {
                    return (
                      <div className="flex flex-col gap-1 w-[80px]">
                        <div
                          className={`border border-[#009DC2] rounded-lg bg-[#009DC2] text-white ${pdfStyle?.projectFloorText} ${pdfStyle?.projectFloorPadding}`}
                        >
                          {floor?.name}
                        </div>
                        <div className="flex flex-col gap-1 ">
                          {floor?.rooms?.map((room) => {
                            return (
                              <div
                                className={`border  rounded-lg ${
                                  pdfStyle?.projectFloorText
                                } ${pdfStyle?.projectFloorPadding} ${
                                  room?.refinishing_checklists_id ===
                                  checklist?.id
                                    ? `text-white `
                                    : "border-[#1E2E5A]"
                                }`}
                                style={{
                                  backgroundColor:
                                    room?.refinishing_checklists_id ===
                                    checklist?.id
                                      ? `${checklist?.color}`
                                      : ``,
                                  borderColor:
                                    room?.refinishing_checklists_id ===
                                    checklist?.id
                                      ? `${checklist?.color}`
                                      : ``,
                                }}
                              >
                                {room?.name}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            {allrefinishingChecklist?.length - 1 !== index ? (
              <div
                className="ml-[15px] h-[1px] bg-[#3a3a3a] rounded-full"
                style={{ width: "calc(100% - 30px)" }}
              ></div>
            ) : (
              ``
            )}
          </>
        )}
      </>
    );
  };

  return (
    <>
      {allrefinishingChecklist?.length > 0 && answerExist?.length > 0 && (
        <>
          <div className={`flex  item-center pl-2 p-1 pb-0 rounded-lg mt-5`}>
            <Text
              className={`text-black text-[25px] font-extrabold font-lora text-start `}
            >
              REFINISHING CHECKLIST
            </Text>
          </div>
          <div
            className="ml-[15px] h-[1px] bg-[#3a3a3a] rounded-full"
            style={{ width: "calc(100% - 30px)" }}
          ></div>
        </>
      )}
      {allrefinishingChecklist.map((singleCL, index) => {
        return <SingleCheckList checklist={singleCL} index={index} />;
      })}
    </>
  );
};

export default RefinishingCheckListPdfNew;
