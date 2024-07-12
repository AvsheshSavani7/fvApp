import React from "react";
import Text from "../UI/Text";
import { pdfStyle } from "../../utils/Constants";
import { useSelector } from "react-redux";

const MatchingInstallationPdfNew = ({ customerDetails1, index }) => {
  const allrefinishingChecklist =
    Object.keys(customerDetails1 || {}).length > 0
      ? [...customerDetails1?.fv_data?.matching_installation_checklists]
      : [];

  const SingleCheckList = ({ checklist, index }) => {
    let allQuestions =
      Object.keys(checklist || {}).length > 0
        ? [...checklist?.all_questions]
        : [];

    const question1 = allQuestions.find(
      (question) => question.question === "Type of Floor"
    );
    const question2 = allQuestions.find(
      (question) => question.question === "Type of Matching"
    );
    const question3 = allQuestions.find(
      (question) => question.question === "Are we Refinishing?"
    );
    const question4 = allQuestions.find(
      (question) =>
        question.question ===
        "How is the space connected to the area being refinished?"
    );
    const question5 = allQuestions.find(
      (question) => question.question === "Type"
    );
    const question6 = allQuestions.find(
      (question) => question.question === "Species"
    );
    const question7 = allQuestions.find(
      (question) => question.question === "Layout"
    );
    const question8 = allQuestions.find(
      (question) => question.question === "Width"
    );
    const question9 = allQuestions.find(
      (question) => question.question === "Thickness"
    );
    const question10 = allQuestions.find(
      (question) => question.question === "Installation"
    );
    const question11 = allQuestions.find(
      (question) => question.question === "Sawn Type"
    );
    const question12 = allQuestions.find(
      (question) => question.question === "Does customer have material specs?"
    );
    const question13 = allQuestions.find(
      (question) => question.question === "Notes"
    );

    return (
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
                className={`list-disc list-outside	ml-3 ${pdfStyle?.checklistLeftFont} ${pdfStyle?.defaultTextColor}`}
              >
                {/* {question1?.answer ? ( */}
                <li
                  className={` text-left  font-semibold  ${pdfStyle?.liSpacing}`}
                >
                  {question1?.answer
                    ? `${question1?.answer} Floor `
                    : "NA Floor"}

                  <br />
                </li>
                {/* ) : (
                  ``
                )} */}
                {/* {question2?.answer ? ( */}
                <li
                  className={` text-left  font-semibold  ${pdfStyle?.liSpacing}`}
                >
                  {question2?.answer
                    ? `${question2?.answer} type matching `
                    : "NA type matching"}

                  <br />
                </li>
                {/* ) : (
                  ``
                )} */}
                {question3?.answer ? (
                  <li
                    className={` text-left  font-semibold  ${pdfStyle?.liSpacing}`}
                  >
                    {question3?.answer === "Yes"
                      ? `We are Refinishing `
                      : question3?.answer === "No"
                      ? "We are not refinishing"
                      : ""}
                    <br />
                  </li>
                ) : (
                  ``
                )}
                {/* {question4?.answer ? ( */}
                {question4?.answer ? (
                  <li
                    className={` text-left  font-semibold  ${pdfStyle?.liSpacing}`}
                  >
                    Space is
                    {question4?.answer === "Different Levels" ||
                    question4?.answer === "Different Areas of the home"
                      ? " at"
                      : ""}{" "}
                    {question4?.answer || "NA"} to the area being refinished
                    <br />
                  </li>
                ) : (
                  ""
                )}
                {/* ) : (
                  ``
                )} */}
                {question5?.answer ? (
                  <li
                    className={` text-left  font-semibold  ${pdfStyle?.liSpacing}`}
                  >
                    {question5?.answer ? `${question5?.answer} type` : ""}
                    <br />
                  </li>
                ) : (
                  ``
                )}
                {question6?.answer ? (
                  <li
                    className={` text-left  font-semibold  ${pdfStyle?.liSpacing}`}
                  >
                    {question6?.answer ? `${question6?.answer} Species` : ""}
                    <br />
                  </li>
                ) : (
                  ``
                )}
                {question7?.answer ? (
                  <li
                    className={`text-left  font-semibold  ${pdfStyle?.liSpacing}`}
                  >
                    {question7?.answer ? `${question7?.answer} Layout` : ""}
                    <br />
                  </li>
                ) : (
                  ``
                )}
                {question8?.answer ? (
                  <li
                    className={` text-left  font-semibold  ${pdfStyle?.liSpacing}`}
                  >
                    {question8?.answer ? `${question8?.answer} " Width` : ""}
                    <br />
                  </li>
                ) : (
                  ``
                )}
                {question9?.answer ? (
                  <li
                    className={` text-left  font-semibold  ${pdfStyle?.liSpacing}`}
                  >
                    {question9?.answer ? `${question9?.answer} Thickness` : ""}
                    <br />
                  </li>
                ) : (
                  ``
                )}
                {question10?.answer ? (
                  <li
                    className={` text-left  font-semibold  ${pdfStyle?.liSpacing}`}
                  >
                    {question10?.answer
                      ? `${question10?.answer} Installation`
                      : ""}
                    <br />
                  </li>
                ) : (
                  ``
                )}
                {question11?.answer ? (
                  <li
                    className={` text-left  font-semibold  ${pdfStyle?.liSpacing}`}
                  >
                    {question11?.answer
                      ? `Sawn Type : ${question11?.answer} `
                      : ""}
                    <br />
                  </li>
                ) : (
                  ``
                )}
                {question12?.answer !== "none" ? (
                  <li
                    className={` text-left  font-semibold  ${pdfStyle?.liSpacing}`}
                  >
                    {question12?.answer === true
                      ? `Customer have material space`
                      : "Customer doesn't have material space "}
                    <br />
                  </li>
                ) : (
                  ``
                )}
                {question13?.answer ? (
                  <li
                    className={` text-left  font-semibold  ${pdfStyle?.liSpacing}`}
                  >
                    {question13?.answer ? `Notes : ${question13?.answer} ` : ""}
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
                              room?.matching_installation_checklists_id ===
                              checklist?.id
                                ? "text-white"
                                : "border-[#1E2E5A]"
                            }`}
                            style={{
                              backgroundColor:
                                room?.matching_installation_checklists_id ===
                                checklist?.id
                                  ? `${checklist?.color}`
                                  : ``,
                              borderColor:
                                room?.matching_installation_checklists_id ===
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
    );
  };

  return (
    <>
      {allrefinishingChecklist?.length > 0 && (
        <>
          <div className={`flex  item-center pl-2 p-1 pb-0 rounded-lg mt-5`}>
            <Text
              className={`text-black text-[25px] font-extrabold font-lora text-start `}
            >
              MATCHING INSTALLATION
            </Text>
          </div>
          <div
            className="ml-[15px] h-[1px] bg-[#3a3a3a] rounded-full"
            style={{ width: "calc(100% - 30px)" }}
          ></div>{" "}
        </>
      )}
      {allrefinishingChecklist.map((singleCL, index) => {
        return <SingleCheckList checklist={singleCL} index={index} />;
      })}
    </>
  );
};

export default MatchingInstallationPdfNew;
