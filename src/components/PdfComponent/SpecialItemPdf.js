import React from "react";
import Text from "../UI/Text";
import Image from "../UI/Image";
import { pdfStyle } from "../../utils/Constants";

const SpecialItemPdf = ({ customerDetails1 }) => {
  const allChecklist =
    Object.keys(customerDetails1 || {}).length > 0
      ? [...customerDetails1?.fv_data?.specialItem_furnitures]
      : [];

  const SingleCheckList = ({ checklist }) => {
    let allQuestions =
      Object.keys(checklist || {}).length > 0
        ? [...checklist?.all_questions]
        : [];

    const question1 = allQuestions.find(
      (question) => question.question === "Standard Pool Table"
    );
    const question2 = allQuestions.find(
      (question) => question.question === "Full Size Pool Table"
    );
    const question3 = allQuestions.find(
      (question) => question.question === " Grand Piano"
    );
    const question4 = allQuestions.find(
      (question) => question.question === "Baby Grand Piano"
    );
    const question5 = allQuestions.find(
      (question) => question.question === " Upright Piano"
    );
    const question6 = allQuestions.find(
      (question) => question.question === "Radiators Other"
    );

    let kitchenArray = [
      {
        questionObj: question1,
        QToPrint: "Standard Pool Table",
      },
      {
        questionObj: question2,
        QToPrint: "Full Size Pool Table",
      },
      {
        questionObj: question3,
        QToPrint: " Grand Piano",
      },
      {
        questionObj: question4,
        QToPrint: "Baby Grand Piano",
      },
      {
        questionObj: question5,
        QToPrint: " Upright Piano",
      },
      {
        questionObj: question6,
        QToPrint: "Radiators Other",
      },
    ];

    return (
      <>
        <div
          className={`bg-[${pdfStyle?.headingBgColor}]  flex    pl-2 rounded-lg items-center my-${pdfStyle?.marginY} p-1.5`}
        >
          <Text
            className={`text-black text-[${pdfStyle.headingSize}px] font-semibold text-start  flex-none pr-4 ml-2.5`}
          >
            Special Items
          </Text>
        </div>

        {kitchenArray.map((kitchen, index) => {
          let { questionObj, QToPrint } = kitchen;

          return (
            <>
              {questionObj?.answer === true && (
                <>
                  <div className={`flex  py-${pdfStyle?.paddingY}`}>
                    <div
                      className={`flex flex-col items-start justify-center my-${pdfStyle?.marginY} pl-${pdfStyle?.paddingL} w-1/2`}
                    >
                      <div className="flex items-center justify-start">
                        <Text
                          className={`w-[150px] text-start text-[${pdfStyle?.questionTextSize}px]`}
                        >
                          {QToPrint}
                        </Text>
                      </div>
                    </div>

                    <div className=" w-[1px] bg-[#D8D8D8] rounded-full"></div>
                    <div
                      className={`flex flex-col items-start my-${pdfStyle?.marginY} pl-${pdfStyle?.paddingL} w-1/2`}
                    >
                      {questionObj?.subQuestion
                        ?.filter(
                          (ques) =>
                            ques.whenToShow === questionObj?.answer &&
                            ques?.type !== "IMAGE" &&
                            ques?.answer !== "none"
                        )
                        .map((question, i) => {
                          let findImageQues = questionObj?.subQuestion?.filter(
                            (Q) => Q?.type === "IMAGE"
                          );
                          let checkLength = questionObj?.subQuestion?.filter(
                            (ques) =>
                              ques.whenToShow === questionObj?.answer &&
                              ques?.type !== "IMAGE"
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
                                  :{" "}
                                  {typeof question?.answer === "boolean"
                                    ? question?.answer === true
                                      ? `      Yes`
                                      : question?.answer === false
                                      ? "No"
                                      : question?.answer
                                    : question?.answer || "NA"}
                                </span>
                              </div>
                              {checkLength - 1 !== i ? (
                                <div className="w-full h-[1px] bg-[#D8D8D8] rounded-full "></div>
                              ) : (
                                findImageQues?.[0]?.answer?.length > 0 && (
                                  <div className="w-full h-[1px] bg-[#D8D8D8] rounded-full "></div>
                                )
                              )}
                            </>
                          );
                        })}
                      {questionObj?.subQuestion
                        ?.filter(
                          (ques) =>
                            ques.whenToShow === questionObj?.answer &&
                            ques?.type === "IMAGE"
                        )
                        .map((question, i) => {
                          let checkLength = questionObj?.subQuestion?.filter(
                            (ques) =>
                              ques.whenToShow === questionObj?.answer &&
                              ques?.type === "IMAGE"
                          ).length;
                          return (
                            <>
                              <div className="flex flex-wrap items-center justify-start">
                                {question?.answer?.map((src, index) => (
                                  <img
                                    className={`w-[${pdfStyle?.imageW}px] h-[${pdfStyle?.imageH}px] rounded-md p-1`}
                                    src={src}
                                    alt={"src"}
                                  />
                                ))}
                              </div>{" "}
                              {checkLength - 1 !== i && (
                                <div className="w-full h-[1px] bg-[#D8D8D8] rounded-full "></div>
                              )}{" "}
                            </>
                          );
                        })}
                    </div>
                  </div>
                  <div className="w-full h-[1px] bg-[#D8D8D8] rounded-full"></div>
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

export default SpecialItemPdf;
