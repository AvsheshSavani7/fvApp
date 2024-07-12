import React from "react";
import Text from "../UI/Text";
import { pdfStyle } from "../../utils/Constants";
import { checkAnswerExist } from "../../helper/helper";

const MoldingPdfNew = ({ customerDetails1, index }) => {
  const allrefinishingChecklist =
    Object.keys(customerDetails1 || {}).length > 0
      ? [...customerDetails1?.fv_data?.molding]
      : [];

  let answerExist = checkAnswerExist(allrefinishingChecklist);

  const SingleCheckList = ({ checklist, index }) => {
    let allQuestions =
      Object.keys(checklist || {}).length > 0
        ? [...checklist?.all_questions]
        : [];

    const question1 = allQuestions.find(
      (question) => question.question === "Height"
    );
    const question2 = allQuestions.find(
      (question) => question.question === "Notes"
    );

    return (
      <>
        {(question1?.answer || question2?.answer) && (
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
                className="flex  justify-between "
                style={{ width: "calc(100% - 45px)" }}
              >
                <div
                  className={`${pdfStyle?.checkListLeftW} ml-3  flex  justify-between items-center`}
                >
                  <ul
                    className={`list-disc list-outside	ml-3 ${pdfStyle?.defaultTextColor} ${pdfStyle?.checklistLeftFont}`}
                  >
                    {question1?.answer ? (
                      <li
                        className={` text-left  font-semibold  ${pdfStyle?.liSpacing}`}
                      >
                        {question1?.answer
                          ? `Height : ${question1?.answer} `
                          : ""}

                        <br />
                      </li>
                    ) : (
                      ``
                    )}
                    {question2?.answer ? (
                      <li
                        className={` text-left  font-semibold  ${pdfStyle?.liSpacing}`}
                      >
                        {question2?.answer
                          ? `Note :  ${question2?.answer} `
                          : ""}
                        <br />
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
                                  room?.molding_id === checklist?.id
                                    ? "text-white"
                                    : "border-[#1E2E5A]"
                                }`}
                                style={{
                                  backgroundColor:
                                    room?.molding_id === checklist?.id
                                      ? `${checklist?.color}`
                                      : ``,
                                  borderColor:
                                    room?.molding_id === checklist?.id
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
            {answerExist?.length > 1 &&
            allrefinishingChecklist?.length - 1 !== index ? (
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
              MOLDING
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

export default MoldingPdfNew;
