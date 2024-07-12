import React from "react";
import Text from "../UI/Text";
import { pdfStyle } from "../../utils/Constants";
import { useSelector } from "react-redux";

const StaircasePdfNew = ({ customerDetails1, index }) => {
  const store = useSelector((state) => state.customerReducer);

  const allrefinishingChecklist =
    Object.keys(customerDetails1 || {}).length > 0
      ? [...customerDetails1?.fv_data?.staircases]
      : [];

  const MAX_STORE_COLORS = 5; // Maximum number of colors in the store

  // Function to generate a random color
  function generateRandomColor(existingColors) {
    const characters = "0123456789ABCDEF";
    let color;
    let isUnique = false;

    // Function to generate a random color
    const getRandomColor = () => {
      let color = "#";
      for (let i = 0; i < 6; i++) {
        color += characters[Math.floor(Math.random() * 16)];
      }
      return color;
    };

    // Keep generating random colors until a unique color is found
    while (!isUnique) {
      color = getRandomColor();
      isUnique = !existingColors.includes(color);
    }

    return color;
  }

  if (allrefinishingChecklist?.length >= 1) {
    const existingColors = store.checkListDefaultColor.slice(
      0,
      MAX_STORE_COLORS
    );
    let usedColor = [];
    let colorIndex = 0;

    for (let i = 0; i < allrefinishingChecklist.length; i++) {
      if (colorIndex < MAX_STORE_COLORS) {
        // Use color from store
        allrefinishingChecklist[i].color = existingColors[colorIndex];
        colorIndex++;
      } else {
        // Generate random unique color
        const randomColor = generateRandomColor(usedColor);
        allrefinishingChecklist[i].color = randomColor;
        usedColor.push(randomColor);
      }
    }
  }

  const SingleCheckList = ({ checklist, index }) => {
    let allQuestions =
      Object.keys(checklist || {}).length > 0
        ? [...checklist?.all_questions]
        : [];

    const question1 = allQuestions.find(
      (question) => question.question === "Name of Staircase"
    );
    const question2 = allQuestions.find(
      (question) => question.question === "Scope"
    );
    const question3 = allQuestions.find(
      (question) => question.question === "# of Close Treads"
    );
    const question4 = allQuestions.find(
      (question) => question.question === "# of Open Treads"
    );
    const question5 = allQuestions.find(
      (question) => question.question === "# of Risers"
    );
    const question6 = allQuestions.find(
      (question) => question.question === "# of Posts"
    );
    const question7 = allQuestions.find(
      (question) => question.question === "LF of Handrailing"
    );
    const question8 = allQuestions.find(
      (question) => question.question === "Exposed/Covered"
    );
    const question9 = allQuestions.find(
      (question) => question.question === "Cove Molding"
    );
    const question10 = allQuestions.find(
      (question) => question.question === "Species"
    );
    const question11 = allQuestions.find(
      (question) => question.question === "Notes"
    );

    let question8Flatmap = question1?.subQuestion?.filter(
      (ques) => ques.whenToShow === question8?.answer
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
                className={`list-disc list-outside	ml-3 ${pdfStyle?.defaultTextColor} ${pdfStyle?.checklistLeftFont}`}
              >
                <li
                  className={`text-left  font-semibold  ${pdfStyle?.liSpacing}`}
                >
                  {question1?.answer
                    ? `${question1?.answer} :  `
                    : "Unknown Staircase : "}
                  {question2?.answer || "NA"}

                  <br />
                </li>

                {question3?.answer ? (
                  <li
                    className={`text-left  font-semibold  ${pdfStyle?.liSpacing}`}
                  >
                    {question3?.answer || "NA"} close treads
                    <br />
                  </li>
                ) : (
                  ``
                )}
                {question4?.answer ? (
                  <li
                    className={` text-left  font-semibold  ${pdfStyle?.liSpacing}`}
                  >
                    {question4?.answer || "NA"} open treads
                    <br />
                  </li>
                ) : (
                  ``
                )}
                {question5?.answer ? (
                  <li
                    className={` text-left  font-semibold  ${pdfStyle?.liSpacing}`}
                  >
                    {question5?.answer || ""} risers
                    <br />
                  </li>
                ) : (
                  ``
                )}
                {question6?.answer ? (
                  <li
                    className={` text-left  font-semibold  ${pdfStyle?.liSpacing}`}
                  >
                    {question6?.answer || ""} posts
                    <br />
                  </li>
                ) : (
                  ``
                )}
                {question7?.answer ? (
                  <li
                    className={`text-left  font-semibold  ${pdfStyle?.liSpacing}`}
                  >
                    {question7?.answer || ""} LF of Handrailing
                    <br />
                  </li>
                ) : (
                  ``
                )}
                {question8?.answer ? (
                  <li
                    className={` text-left  font-semibold  ${pdfStyle?.liSpacing}`}
                  >
                    {`Exposed/Covered : ${question8?.answer || "NA"}`}
                    <br />
                    {question8?.answer &&
                      question8?.answer !== "Exposed" &&
                      question8Flatmap?.map((subQues) => {
                        return (
                          <>
                            {subQues?.answer ? (
                              <div className="ml-8">
                                <span
                                  className={` ${pdfStyle?.spanLineHeight} `}
                                >
                                  -
                                </span>
                                <span
                                  className={`ml-1  ${pdfStyle?.spanLineHeight}`}
                                >
                                  {subQues?.answer === true
                                    ? "KASA Removing"
                                    : subQues?.answer === false
                                    ? "KASA Not Removing"
                                    : ""}
                                </span>
                              </div>
                            ) : (
                              ""
                            )}
                          </>
                        );
                      })}
                  </li>
                ) : (
                  ``
                )}
                {question9?.answer ? (
                  <li
                    className={` text-left  font-semibold  ${pdfStyle?.liSpacing}`}
                  >
                    {question9?.answer || ""}
                    <br />
                  </li>
                ) : (
                  ``
                )}
                {question10?.answer ? (
                  <li
                    className={` text-left  font-semibold  ${pdfStyle?.liSpacing}`}
                  >
                    {`Species : ${question10?.answer || "NA"}`}
                    <br />
                  </li>
                ) : (
                  ``
                )}
                {question11?.answer ? (
                  <li
                    className={` text-left  font-semibold  ${pdfStyle?.liSpacing}`}
                  >
                    {question11?.answer || "NA"}
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
                      className={`border border-[#1E2E5A] rounded-lg ${
                        floor?.staircase_from_ids.includes(checklist?.id)
                          ? "bg-[#8EC24A] text-white border-[#8EC24A]"
                          : ""
                      } ${
                        floor?.staircase_to_ids.includes(checklist?.id)
                          ? "bg-[#F8842F] text-white border-[#F8842F]"
                          : ""
                      } ${
                        floor?.staircase_from_ids.includes(checklist?.id) ||
                        floor?.staircase_to_ids.includes(checklist?.id)
                          ? ""
                          : "border-[#1E2E5A]"
                      } ${pdfStyle?.projectFloorText} ${
                        pdfStyle?.projectFloorPadding
                      }`}
                    >
                      {floor?.name}
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
              STAIRCASE
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

export default StaircasePdfNew;
