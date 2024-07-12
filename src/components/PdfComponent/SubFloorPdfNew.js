import React from "react";
import Text from "../UI/Text";
import { pdfStyle } from "../../utils/Constants";
import { checkAnswerExist } from "../../helper/helper";

const SubFloorPdfnew = ({ customerDetails1, index }) => {
  const allrefinishingChecklist =
    Object.keys(customerDetails1 || {}).length > 0
      ? [...customerDetails1?.fv_data?.subfloor_details]
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

    let question1Flatmap = question1?.subQuestion
      ?.flatMap((arr) => arr?.subQuestion)
      .filter((ques) => ques.whenToShow === question1?.answer);
    let question2Flatmap = question2?.subQuestion
      ?.flatMap((arr) => arr?.subQuestion)
      .filter((ques) => ques.whenToShow === question2?.answer);
    let question3Flatmap = question3?.subQuestion
      ?.flatMap((arr) => arr?.subQuestion)
      .filter((ques) => ques.whenToShow === question3?.answer);
    let question4Flatmap = question4?.subQuestion
      ?.flatMap((arr) => arr?.subQuestion)
      .filter((ques) => ques.whenToShow === question4?.answer);
    let question5Flatmap = question5?.subQuestion
      ?.flatMap((arr) => arr?.subQuestion)
      .filter((ques) => ques.whenToShow === question5?.answer);

    return (
      <>
        {(question1?.answer !== "" ||
          question2?.answer !== "" ||
          question3?.answer !== "" ||
          question4?.answer !== "none" ||
          question5?.answer !== "none" ||
          question6?.answer !== "") && (
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
                          ? `Subfloor Type : ${question1?.answer}`
                          : ""}

                        {question1?.answer === "Wood" &&
                          question1Flatmap?.map((subQues) => {
                            if (subQues?.question === "Type of wood Subfloor") {
                              return (
                                <>
                                  <br />
                                  <span
                                    className={`ml-8 ${pdfStyle?.spanLineHeight}`}
                                  >
                                    - {subQues?.answer || "NA"}
                                  </span>
                                  {subQues?.answer === "Plywood (or OSB)" && (
                                    <>
                                      {subQues?.subQuestion
                                        ?.filter(
                                          (Q) =>
                                            Q.whenToShow === subQues?.answer
                                        )
                                        .map((subOfSubQues) => {
                                          if (
                                            subOfSubQues?.question ===
                                            "Plywood Type and Thickness"
                                          ) {
                                            return (
                                              <>
                                                {subOfSubQues?.answer ? (
                                                  <>
                                                    <br />
                                                    <span className="ml-8 ${pdfStyle?.spanLineHeight}">
                                                      - {subOfSubQues?.answer}
                                                    </span>
                                                  </>
                                                ) : (
                                                  ``
                                                )}
                                              </>
                                            );
                                          }
                                          if (
                                            subOfSubQues?.question ===
                                            "Description of other plywood type"
                                          ) {
                                            return (
                                              <>
                                                {subOfSubQues?.answer ? (
                                                  <>
                                                    <br />
                                                    <span className="ml-8 ${pdfStyle?.spanLineHeight}">
                                                      - {subOfSubQues?.answer}
                                                    </span>
                                                  </>
                                                ) : (
                                                  ``
                                                )}
                                              </>
                                            );
                                          }
                                        })}
                                    </>
                                  )}
                                  {subQues?.answer === "Straight Pine" && (
                                    <>
                                      {subQues?.subQuestion
                                        ?.filter(
                                          (Q) =>
                                            Q.whenToShow === subQues?.answer
                                        )
                                        .map((subOfSubQues) => {
                                          if (
                                            subOfSubQues?.question ===
                                            "Which direction is the pine running ?"
                                          ) {
                                            return (
                                              <>
                                                {subOfSubQues?.answer ? (
                                                  <>
                                                    <br />
                                                    <span className="ml-8 ${pdfStyle?.spanLineHeight}">
                                                      - {subOfSubQues?.answer}
                                                    </span>
                                                  </>
                                                ) : (
                                                  ``
                                                )}
                                              </>
                                            );
                                          }
                                          if (
                                            subOfSubQues?.question ===
                                            "Describe other direction of straight pine"
                                          ) {
                                            return (
                                              <>
                                                {subOfSubQues?.answer ? (
                                                  <>
                                                    <br />
                                                    <span className="ml-8 ${pdfStyle?.spanLineHeight}">
                                                      - {subOfSubQues?.answer}
                                                    </span>
                                                  </>
                                                ) : (
                                                  ``
                                                )}
                                              </>
                                            );
                                          }
                                        })}
                                    </>
                                  )}
                                </>
                              );
                            }
                          })}
                        {question1?.answer === "Concrete" &&
                          question1Flatmap?.map((subQues) => {
                            if (
                              subQues?.question === "Type of concrete subfloor"
                            ) {
                              return (
                                <>
                                  <br />
                                  <span
                                    className={`ml-8 ${pdfStyle?.spanLineHeight} `}
                                  >
                                    - {subQues?.answer || "NA"}
                                  </span>

                                  {subQues?.answer === "Other" &&
                                    subQues?.subQuestion
                                      ?.filter(
                                        (Q) => Q.whenToShow === subQues?.answer
                                      )
                                      .map((subOfSubQues) => {
                                        if (
                                          subOfSubQues?.question ===
                                          "Other type of concrete"
                                        ) {
                                          return (
                                            <>
                                              {subOfSubQues?.answer ? (
                                                <>
                                                  <br />
                                                  <span
                                                    className={`ml-8 ${pdfStyle?.spanLineHeight} `}
                                                  >
                                                    -{" "}
                                                    {subOfSubQues?.answer ||
                                                      "NA"}
                                                  </span>
                                                </>
                                              ) : (
                                                ``
                                              )}
                                            </>
                                          );
                                        }
                                      })}
                                </>
                              );
                            }
                            if (
                              subQues?.question === "Is this a new slab ?" &&
                              subQues?.answer
                            ) {
                              return (
                                <>
                                  <br />
                                  <span
                                    className={`ml-8 ${pdfStyle?.spanLineHeight} `}
                                  >
                                    -{" "}
                                    {subQues?.answer === "Yes"
                                      ? "New Slab"
                                      : subQues?.answer === "No"
                                      ? `Not New Slab`
                                      : subQues?.answer === "Unknown"
                                      ? "Unknown slab"
                                      : ""}
                                  </span>

                                  {subQues?.answer === "Unknown" &&
                                    subQues?.subQuestion
                                      ?.filter(
                                        (Q) => Q.whenToShow === subQues?.answer
                                      )
                                      .map((subOfSubQues) => {
                                        if (subOfSubQues?.answer) {
                                          return (
                                            <>
                                              {subOfSubQues?.answer ? (
                                                <>
                                                  <br />
                                                  <span
                                                    className={`ml-8 ${pdfStyle?.spanLineHeight} `}
                                                  >
                                                    - {subOfSubQues?.answer}
                                                  </span>
                                                </>
                                              ) : (
                                                ``
                                              )}
                                            </>
                                          );
                                        }
                                      })}
                                </>
                              );
                            }
                          })}
                      </li>
                    ) : (
                      ``
                    )}
                    {question1?.answer === "Wood" &&
                      question1Flatmap?.map((subQues) => {
                        if (
                          subQues?.question === "Joist Spacing" &&
                          subQues?.answer
                        ) {
                          return (
                            <li
                              className={` text-left ${
                                subQues?.answer === "16 inch"
                                  ? ""
                                  : pdfStyle?.redColor
                              } font-semibold  ${pdfStyle?.liSpacing}`}
                            >
                              {subQues?.answer
                                ? `Joist Spacing : ${subQues?.answer}`
                                : ""}
                              {subQues?.answer === "Other" &&
                                subQues?.subQuestion
                                  ?.filter(
                                    (Q) => Q.whenToShow === subQues?.answer
                                  )
                                  .map((subOfSubQues) => {
                                    if (subOfSubQues?.answer) {
                                      return (
                                        <>
                                          <br />
                                          <span
                                            className={`ml-8 ${pdfStyle?.spanLineHeight} ${pdfStyle?.defaultTextColor}`}
                                          >
                                            - {subOfSubQues?.answer || "NA"}
                                          </span>
                                        </>
                                      );
                                    }
                                  })}
                            </li>
                          );
                        }
                      })}
                    {question1?.answer === "Concrete" &&
                      question1Flatmap?.map((subQues) => {
                        if (subQues?.question === "Any moisture identified ?") {
                          return (
                            <>
                              <li
                                className={` text-left ${
                                  subQues?.answer === "Yes"
                                    ? pdfStyle?.redColor
                                    : ""
                                } font-semibold  ${pdfStyle?.liSpacing}`}
                              >
                                {subQues?.answer === "Yes"
                                  ? "Moisture Identified on Subfloor"
                                  : subQues?.answer === "No"
                                  ? "No moisture identified on subfloor"
                                  : `Moisture identified : ${
                                      subQues?.answer || "NA"
                                    }`}
                                {subQues?.subQuestion
                                  ?.filter(
                                    (Q) => Q.whenToShow === subQues?.answer
                                  )
                                  .map((subOfSubQues) => {
                                    if (subOfSubQues?.answer) {
                                      return (
                                        <>
                                          {subOfSubQues?.answer ? (
                                            <>
                                              <br />
                                              <span
                                                className={`ml-8 ${pdfStyle?.spanLineHeight} ${pdfStyle?.defaultTextColor}`}
                                              >
                                                - {subOfSubQues?.answer}
                                              </span>
                                            </>
                                          ) : (
                                            ``
                                          )}
                                        </>
                                      );
                                    }
                                  })}
                              </li>
                            </>
                          );
                        }
                      })}
                    {question1?.answer === "Concrete" &&
                      question1Flatmap?.map((subQues) => {
                        if (subQues?.question === "Any cracks identified ?") {
                          return (
                            <>
                              <li
                                className={` text-left ${
                                  subQues?.answer === "Yes"
                                    ? pdfStyle?.redColor
                                    : ""
                                } font-semibold  ${pdfStyle?.liSpacing}`}
                              >
                                {subQues?.answer === "Yes"
                                  ? "Cracks identified in concrete subfloor"
                                  : subQues?.answer === "No"
                                  ? "No Cracks Identified"
                                  : `Cracks Currently Covered`}
                                {subQues?.subQuestion
                                  ?.filter(
                                    (Q) => Q.whenToShow === subQues?.answer
                                  )
                                  .map((subOfSubQues) => {
                                    if (subOfSubQues?.answer) {
                                      return (
                                        <>
                                          {subOfSubQues?.answer ? (
                                            <>
                                              <br />
                                              <span
                                                className={`ml-8 ${pdfStyle?.spanLineHeight} ${pdfStyle?.defaultTextColor}`}
                                              >
                                                - {subOfSubQues?.answer}
                                              </span>
                                            </>
                                          ) : (
                                            ``
                                          )}
                                        </>
                                      );
                                    }
                                  })}
                              </li>
                            </>
                          );
                        }
                      })}
                    {question1?.answer === "Concrete" &&
                      question1Flatmap?.map((subQues) => {
                        if (
                          subQues?.question ===
                          "Any other non leveling concerns w/ concrete subfloor"
                        ) {
                          return (
                            <>
                              <li
                                className={` text-left ${pdfStyle?.redColor} font-semibold  ${pdfStyle?.liSpacing}`}
                              >
                                Non Levelling Concrete Concerns :{" "}
                                {subQues?.answer || "NA"}
                              </li>
                            </>
                          );
                        }
                      })}
                    {question2?.answer ? (
                      <li
                        className={` text-left ${
                          question2?.answer === "None" ? "" : pdfStyle?.redColor
                        } font-semibold  ${pdfStyle?.liSpacing}`}
                      >
                        {question2?.answer
                          ? `Current Floor Covering: ${question2?.answer} `
                          : ""}

                        {question2?.answer === "Wood" &&
                          question2Flatmap?.map((subQues) => {
                            if (subQues?.question === "Type of Wood Floor") {
                              return (
                                <>
                                  {subQues?.answer ? (
                                    <>
                                      <br />
                                      <span
                                        className={`ml-8 ${pdfStyle?.spanLineHeight} ${pdfStyle?.defaultTextColor}`}
                                      >
                                        - {subQues?.answer || "NA"}
                                      </span>
                                    </>
                                  ) : (
                                    ""
                                  )}
                                </>
                              );
                            }
                            if (subQues?.question === "Notes") {
                              return (
                                <>
                                  {subQues?.answer ? (
                                    <>
                                      <br />
                                      <span
                                        className={`ml-8 ${pdfStyle?.spanLineHeight} ${pdfStyle?.defaultTextColor}`}
                                      >
                                        - {subQues?.answer || "NA"}
                                      </span>
                                    </>
                                  ) : (
                                    ""
                                  )}
                                </>
                              );
                            }
                          })}
                        {question2?.answer === "Tile" &&
                          question2Flatmap?.map((subQues) => {
                            if (
                              subQues?.question ===
                              "Estimated Thickness of the tile floor"
                            ) {
                              return (
                                <>
                                  {subQues?.answer ? (
                                    <>
                                      <br />
                                      <span
                                        className={`ml-8 ${pdfStyle?.spanLineHeight} ${pdfStyle?.defaultTextColor}`}
                                      >
                                        - Est. Tile Thickness: {subQues?.answer}
                                      </span>
                                    </>
                                  ) : (
                                    ""
                                  )}
                                </>
                              );
                            }
                            if (
                              subQues?.question ===
                              "Is the existing tile coming loose in any areas?"
                            ) {
                              return (
                                <>
                                  <>
                                    {subQues?.answer !== "none" ? (
                                      <>
                                        <br />
                                        <span
                                          className={`ml-8 ${
                                            pdfStyle?.spanLineHeight
                                          } ${
                                            subQues?.answer === true
                                              ? pdfStyle?.redColor
                                              : pdfStyle?.defaultTextColor
                                          }`}
                                        >
                                          -{" "}
                                          {subQues?.answer === true
                                            ? "Loose tiles found"
                                            : subQues?.answer === false
                                            ? "No loose tiles found"
                                            : "NA"}
                                        </span>
                                      </>
                                    ) : (
                                      ""
                                    )}
                                  </>
                                </>
                              );
                            }
                          })}
                        {question2?.answer === "Multiple" &&
                          question2Flatmap?.map((subQues) => {
                            if (
                              subQues?.question ===
                              "Description of multiple floor covering types"
                            ) {
                              return (
                                <>
                                  {subQues?.answer ? (
                                    <>
                                      <br />
                                      <span
                                        className={`ml-8 ${pdfStyle?.spanLineHeight} ${pdfStyle?.defaultTextColor}`}
                                      >
                                        - {subQues?.answer}
                                      </span>
                                    </>
                                  ) : (
                                    ""
                                  )}
                                </>
                              );
                            }
                          })}
                        {question2?.answer === "Other" &&
                          question2Flatmap?.map((subQues) => {
                            if (
                              subQues?.question ===
                              "Description of other floor covering types"
                            ) {
                              return (
                                <>
                                  {subQues?.answer ? (
                                    <>
                                      <br />
                                      <span
                                        className={`ml-8 ${pdfStyle?.spanLineHeight} ${pdfStyle?.defaultTextColor}`}
                                      >
                                        - {subQues?.answer}
                                      </span>
                                    </>
                                  ) : (
                                    ""
                                  )}
                                </>
                              );
                            }
                          })}
                      </li>
                    ) : (
                      ``
                    )}
                    {question3?.answer ? (
                      <li
                        className={` text-left  ${
                          question3?.answer === "Finished Basement" ||
                          question3?.answer === "Finished Living Space" ||
                          question3?.answer === "Nothing (slab)" ||
                          question3?.answer === "Apartment Building"
                            ? ""
                            : pdfStyle?.redColor
                        } font-semibold  ${pdfStyle?.liSpacing}`}
                      >
                        {question3?.answer
                          ? `Below the subfloor: ${question3?.answer} `
                          : ""}

                        {question3?.answer === "Unfinished Basement" &&
                          question3Flatmap?.map((subQues) => {
                            if (
                              subQues?.question ===
                              "Are there any humidity concerns?"
                            ) {
                              return (
                                <>
                                  {subQues?.answer !== "none" ? (
                                    <>
                                      <br />
                                      <span
                                        className={`ml-8 ${
                                          pdfStyle?.spanLineHeight
                                        } ${
                                          subQues?.answer === true
                                            ? pdfStyle?.redColor
                                            : pdfStyle?.defaultTextColor
                                        }`}
                                      >
                                        -{" "}
                                        {subQues?.answer === true
                                          ? "Humidity concerns"
                                          : subQues?.answer === false
                                          ? "No humidity concerns"
                                          : "NA"}
                                      </span>
                                    </>
                                  ) : (
                                    ""
                                  )}
                                </>
                              );
                            }

                            if (
                              subQues?.question ===
                              "Is the unfinished floor finished?"
                            ) {
                              return (
                                <>
                                  {subQues?.answer !== "none" ? (
                                    <>
                                      <br />
                                      <span
                                        className={`ml-8 ${pdfStyle?.spanLineHeight} ${pdfStyle?.defaultTextColor}`}
                                      >
                                        -{" "}
                                        {subQues?.answer === true
                                          ? "Unfinished floor finished"
                                          : subQues?.answer === false
                                          ? "Unfinished floor not finished"
                                          : "NA"}
                                      </span>
                                    </>
                                  ) : (
                                    ""
                                  )}
                                </>
                              );
                            }
                            if (
                              subQues?.question ===
                              "Other notes for the unfinished basement"
                            ) {
                              return (
                                <>
                                  {subQues?.answer ? (
                                    <>
                                      <br />
                                      <span
                                        className={`ml-8 ${pdfStyle?.spanLineHeight} ${pdfStyle?.defaultTextColor}`}
                                      >
                                        - {subQues?.answer || "NA"}
                                      </span>
                                    </>
                                  ) : (
                                    ""
                                  )}
                                </>
                              );
                            }
                          })}
                        {question3?.answer === "Crawlspace" &&
                          question3Flatmap?.map((subQues) => {
                            if (
                              subQues?.question ===
                              "Is the crawlspace floor finished"
                            ) {
                              return (
                                <>
                                  {subQues?.answer !== "none" ? (
                                    <>
                                      <br />
                                      <span
                                        className={`ml-8 ${
                                          pdfStyle?.spanLineHeight
                                        } ${
                                          subQues?.answer === true
                                            ? pdfStyle?.defaultTextColor
                                            : pdfStyle?.redColor
                                        }`}
                                      >
                                        -{" "}
                                        {subQues?.answer === true
                                          ? "Crawlspace floor is finished"
                                          : subQues?.answer === false
                                          ? "Crawlspace floor is unfinished"
                                          : "NA"}
                                      </span>
                                    </>
                                  ) : (
                                    ""
                                  )}
                                </>
                              );
                            }

                            if (
                              subQues?.question === "Is there proper insulation"
                            ) {
                              return (
                                <>
                                  {subQues?.answer !== "none" ? (
                                    <>
                                      <br />
                                      <span
                                        className={`ml-8 ${
                                          pdfStyle?.spanLineHeight
                                        } ${
                                          subQues?.answer === true
                                            ? pdfStyle?.defaultTextColor
                                            : pdfStyle?.redColor
                                        }`}
                                      >
                                        -{" "}
                                        {subQues?.answer === true
                                          ? "Proper insulation"
                                          : subQues?.answer === false
                                          ? "Proper Insulation not found"
                                          : "NA"}
                                      </span>
                                    </>
                                  ) : (
                                    ""
                                  )}
                                </>
                              );
                            }
                            if (
                              subQues?.question ===
                              "Other notes for the Crawlspace"
                            ) {
                              return (
                                <>
                                  {subQues?.answer ? (
                                    <>
                                      <br />
                                      <span
                                        className={`ml-8 ${pdfStyle?.spanLineHeight} ${pdfStyle?.defaultTextColor}`}
                                      >
                                        - {subQues?.answer || "NA"}
                                      </span>
                                    </>
                                  ) : (
                                    ""
                                  )}
                                </>
                              );
                            }
                          })}
                      </li>
                    ) : (
                      ``
                    )}
                    {question4?.answer !== "none" ? (
                      <li
                        className={` text-left ${
                          question4?.answer === true ? pdfStyle?.redColor : ""
                        } font-semibold  ${pdfStyle?.liSpacing}`}
                      >
                        {question4?.answer === true
                          ? `Radiant Heating`
                          : question4?.answer === false
                          ? "No Radiant Heating"
                          : ""}

                        {question4?.answer === true &&
                          question4Flatmap?.map((subQues) => {
                            if (
                              subQues?.question ===
                              "Is the system Electric or Water?"
                            ) {
                              return (
                                <>
                                  {subQues?.answer ? (
                                    <>
                                      <br />
                                      <span
                                        className={`ml-8 ${pdfStyle?.spanLineHeight} ${pdfStyle?.defaultTextColor}`}
                                      >
                                        - {subQues?.answer || "NA"}
                                      </span>
                                    </>
                                  ) : (
                                    ""
                                  )}
                                </>
                              );
                            }
                          })}
                      </li>
                    ) : (
                      ``
                    )}
                    {question5?.answer !== "none" ? (
                      <li
                        className={` text-left ${
                          question5?.answer === true ? pdfStyle?.redColor : ""
                        } font-semibold  ${pdfStyle?.liSpacing}`}
                      >
                        {question5?.answer === true
                          ? `Water/Moisture Found`
                          : question5?.answer === false
                          ? "Water/Moisture not found"
                          : ""}

                        {question5?.answer === true &&
                          question5Flatmap?.map((subQues) => {
                            if (
                              subQues?.question ===
                              "Description of any water or moisture issues identified"
                            ) {
                              return (
                                <>
                                  {subQues?.answer ? (
                                    <>
                                      <br />
                                      <span
                                        className={`ml-8 ${pdfStyle?.spanLineHeight} ${pdfStyle?.defaultTextColor}`}
                                      >
                                        - {subQues?.answer || "NA"}
                                      </span>
                                    </>
                                  ) : (
                                    ""
                                  )}
                                </>
                              );
                            }
                          })}
                      </li>
                    ) : (
                      ``
                    )}
                    {question6?.answer ? (
                      <li
                        className={` text-left  font-semibold  ${pdfStyle?.liSpacing}`}
                      >
                        Note : {question6?.answer}
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
                                className={`border rounded-lg ${
                                  pdfStyle?.projectFloorText
                                } ${pdfStyle?.projectFloorPadding} ${
                                  room?.subfloor_detail_id === checklist?.id
                                    ? "text-white"
                                    : "border-[#1E2E5A]"
                                }`}
                                style={{
                                  backgroundColor:
                                    room?.subfloor_detail_id === checklist?.id
                                      ? `${checklist?.color}`
                                      : ``,
                                  borderColor:
                                    room?.subfloor_detail_id === checklist?.id
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
              SUBFLOOR DETAILS
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

export default SubFloorPdfnew;
