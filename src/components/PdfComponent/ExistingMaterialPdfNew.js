import React from "react";
import Text from "../UI/Text";
import { pdfStyle } from "../../utils/Constants";
import { checkAnswerExist } from "../../helper/helper";

const ExistingMaterialPdfNew = ({ customerDetails1, index }) => {
  const allrefinishingChecklist =
    Object.keys(customerDetails1 || {}).length > 0
      ? [...customerDetails1?.fv_data?.existing_materials]
      : [];

  let answerExist = checkAnswerExist(allrefinishingChecklist);

  const SingleCheckList = ({ checklist, index }) => {
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
    const question2Sub = question2.subQuestion[0];
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

    return (
      <>
        {(question1?.answer !== "" ||
          question2?.answer !== "none" ||
          question3?.answer !== "" ||
          question4?.answer !== "" ||
          question5?.answer !== "" ||
          question6?.answer !== "" ||
          question7?.answer !== "" ||
          question8?.answer !== "" ||
          question9?.answer !== "" ||
          question10?.answer !== "") && (
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
                    className={`list-disc list-outside	ml-3 ${pdfStyle?.defaultTextColor} ${pdfStyle?.checklistLeftFont}`}
                  >
                    {question1?.answer ? (
                      <li
                        className={` text-left ${
                          question1?.answer === "Site Finished Solid"
                            ? pdfStyle?.defaultTextColor
                            : pdfStyle?.redColor
                        } font-semibold  ${pdfStyle?.liSpacing}`}
                      >
                        {(question1?.answer === "Site Finished Solid" ||
                          question1?.answer === "Prefinished Solid" ||
                          question1?.answer === "New Installation") &&
                          question1?.answer}
                        {question1?.answer === "Site Finished Engineered" &&
                          question1?.answer}
                        {question1?.answer === "Site Finished Engineered" &&
                          question1.subQuestion[0].answer && (
                            <>
                              <br />
                              <span
                                className={`ml-8 ${pdfStyle?.spanLineHeight} ${pdfStyle?.defaultTextColor}`}
                              >
                                - {question1.subQuestion[0].answer}
                              </span>
                            </>
                          )}
                        {question1?.answer === "Prefinished Engineered" &&
                          question1?.answer}
                        {question1?.answer === "Prefinished Engineered" &&
                          question1.subQuestion[1].answer && (
                            <>
                              <br />
                              <span
                                className={`ml-8 ${pdfStyle?.spanLineHeight} ${pdfStyle?.defaultTextColor}`}
                              >
                                - {question1.subQuestion[1].answer}
                              </span>
                            </>
                          )}
                        {question1?.answer === "Unknown" && question1?.answer}
                        {question1?.answer === "Unknown" &&
                          question1.subQuestion[2].answer && (
                            <>
                              <br />
                              <span
                                className={`ml-8 ${pdfStyle?.spanLineHeight} ${pdfStyle?.defaultTextColor}`}
                              >
                                - {question1.subQuestion[2].answer}
                              </span>
                            </>
                          )}
                      </li>
                    ) : (
                      ``
                    )}
                    {question2?.answer === true ? (
                      <li
                        className={` text-left  ${pdfStyle?.redColor} font-semibold  ${pdfStyle?.liSpacing}`}
                      >
                        {question2?.answer === true &&
                          `Bevels ${
                            question2Sub?.answer &&
                            ` : ${question2Sub?.answer || "NA"}`
                          }`}
                        {question2?.answer === true && (
                          <>
                            {question2Sub?.answer === "Standard" &&
                            question2Sub?.subQuestion[0]?.answer ? (
                              <>
                                <br />
                                <span
                                  className={`ml-8 ${pdfStyle?.spanLineHeight} ${pdfStyle?.defaultTextColor}`}
                                >
                                  - {question2Sub?.subQuestion[0]?.answer}
                                </span>
                              </>
                            ) : question2Sub?.answer === "V-Notches" &&
                              question2Sub?.subQuestion[1]?.answer ? (
                              <>
                                <br />
                                <span
                                  className={`ml-8 ${pdfStyle?.spanLineHeight} ${pdfStyle?.defaultTextColor}`}
                                >
                                  - {question2Sub?.subQuestion[1]?.answer}
                                </span>
                              </>
                            ) : question2Sub?.answer === "Other" &&
                              question2Sub?.subQuestion[2]?.answer ? (
                              <>
                                <br />
                                <span
                                  className={`ml-8 ${pdfStyle?.spanLineHeight} ${pdfStyle?.defaultTextColor}`}
                                >
                                  - {question2Sub?.subQuestion[2]?.answer}
                                </span>
                              </>
                            ) : (
                              ""
                            )}
                          </>
                        )}
                      </li>
                    ) : question2?.answer === false ? (
                      <li
                        className={` text-left  font-semibold  ${pdfStyle?.liSpacing}`}
                      >
                        No bevels
                      </li>
                    ) : (
                      ``
                    )}
                    {question3?.answer ? (
                      <li
                        className={` text-left ${
                          question3?.answer === "Red Oak" ||
                          question3?.answer === "White Oak"
                            ? ""
                            : pdfStyle?.redColor
                        } font-semibold  ${pdfStyle?.liSpacing}`}
                      >
                        {question3?.answer
                          ? `Species : ${question3?.answer} `
                          : ""}
                        {question3?.answer === "Pine - Unknown" &&
                          question3?.subQuestion[0].answer && (
                            <>
                              <br />
                              <span
                                className={`ml-8 ${pdfStyle?.spanLineHeight} ${pdfStyle?.defaultTextColor}`}
                              >
                                - {question3?.subQuestion[0].answer}
                              </span>
                            </>
                          )}
                      </li>
                    ) : (
                      ``
                    )}
                    {question4?.answer ? (
                      <li
                        className={` text-left ${
                          question4?.answer === "Straight"
                            ? ""
                            : pdfStyle?.redColor
                        } font-semibold  ${pdfStyle?.liSpacing}`}
                      >
                        Layout : {question4?.answer}
                        {question4?.answer === "Other" &&
                          question4?.subQuestion[0].answer && (
                            <>
                              <br />
                              <span
                                className={`ml-8 ${pdfStyle?.spanLineHeight} ${pdfStyle?.defaultTextColor}`}
                              >
                                - {question4?.subQuestion[0].answer}
                              </span>
                            </>
                          )}
                      </li>
                    ) : (
                      ``
                    )}
                    {question5?.answer ? (
                      <li
                        className={` text-left  font-semibold  ${pdfStyle?.liSpacing}`}
                      >
                        Width : {question5?.answer}
                      </li>
                    ) : (
                      ``
                    )}
                    {question6?.answer ? (
                      <li
                        className={` text-left  font-semibold  ${pdfStyle?.liSpacing}`}
                      >
                        Thickness : {question6?.answer}
                      </li>
                    ) : (
                      ``
                    )}
                    {question7?.answer ? (
                      <li
                        className={` text-left  ${
                          question7?.answer === "Nailed" ||
                          question7?.answer === "Glued"
                            ? ""
                            : pdfStyle?.redColor
                        } font-semibold  ${pdfStyle?.liSpacing}`}
                      >
                        Current Installation : {question7?.answer}
                      </li>
                    ) : (
                      ``
                    )}
                    {question8?.answer ? (
                      <>
                        <li
                          className={` text-left  ${
                            question8?.answer === "Covered" &&
                            (question8?.subQuestion[0]?.answer === "Tile" ||
                              question8?.subQuestion[0]?.answer ===
                                "Sheet Vinyl")
                              ? pdfStyle?.redColor
                              : ""
                          } font-semibold  ${pdfStyle?.liSpacing}`}
                        >
                          {question8?.answer === "Covered" &&
                            question8?.subQuestion[0]?.answer !== "Other" &&
                            `Covered Hardwood with ${
                              question8?.subQuestion[0].answer || "NA"
                            }`}
                          {question8?.answer === "Covered" &&
                            question8?.subQuestion[0]?.answer === "Other" &&
                            `Covered Hardwood with ${
                              question8?.subQuestion[0]?.subQuestion[0]
                                ?.answer || "NA"
                            }`}
                          {question8?.answer === "Exposed" && "Exposed"}
                        </li>
                      </>
                    ) : (
                      ``
                    )}
                    {question8?.answer === "Covered" ? (
                      <>
                        <li
                          className={` text-left  ${
                            question8?.answer === "Covered" &&
                            question8?.subQuestion[1]?.answer === true
                              ? pdfStyle?.redColor
                              : ""
                          } font-semibold  ${pdfStyle?.liSpacing}`}
                        >
                          {question8?.subQuestion[1]?.answer === true &&
                            `Kasa removing existing flooring `}
                          {question8?.subQuestion[1]?.answer === true &&
                            question8?.subQuestion[1]?.subQuestion[0]
                              ?.answer && (
                              <>
                                <br />
                                <span
                                  className={`ml-8 ${pdfStyle?.spanLineHeight} ${pdfStyle?.defaultTextColor}`}
                                >
                                  -{" "}
                                  {
                                    question8?.subQuestion[1]?.subQuestion[0]
                                      ?.answer
                                  }
                                </span>
                              </>
                            )}
                          {question8?.subQuestion[1]?.answer === false &&
                            `Kasa not removing existing flooring `}
                        </li>
                      </>
                    ) : (
                      ``
                    )}

                    {question9?.answer ? (
                      <li
                        className={` text-left  font-semibold  ${pdfStyle?.liSpacing}`}
                      >
                        Sawn type : {question9?.answer}
                      </li>
                    ) : (
                      ``
                    )}
                    {question10?.answer ? (
                      <li
                        className={` text-left  font-semibold  ${pdfStyle?.liSpacing}`}
                      >
                        Note : {question10?.answer}
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
                                  room?.existing_material_id === checklist?.id
                                    ? "text-white"
                                    : "border-[#1E2E5A]"
                                }`}
                                style={{
                                  backgroundColor:
                                    room?.existing_material_id === checklist?.id
                                      ? `${checklist?.color}`
                                      : "",
                                  borderColor:
                                    room?.existing_material_id === checklist?.id
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
              EXISTING MATERIAL
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

export default ExistingMaterialPdfNew;
