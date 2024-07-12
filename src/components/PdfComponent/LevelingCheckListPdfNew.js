import React from "react";
import Text from "../UI/Text";
import { pdfStyle } from "../../utils/Constants";
import { useSelector } from "react-redux";

const LevelingCheckListPdfNew = ({ customerDetails1, index }) => {
  const store = useSelector((state) => state.customerReducer);
  const allrefinishingChecklist =
    Object.keys(customerDetails1 || {}).length > 0
      ? [...customerDetails1?.fv_data?.levellings]
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
      (question) =>
        question.question ===
        "How particular is the customer (1 doesn't care, 10 reason for doing project)"
    );
    const question2 = allQuestions.find(
      (question) =>
        question.question ===
        "How bad is the leveling ( 1 Perfectly flat,  10 Disaster)"
    );
    const question3 = allQuestions.find(
      (question) => question.question === "What type of leveling?"
    );
    const question4 = allQuestions.find(
      (question) => question.question === "Leveling Details"
    );
    const question5 = allQuestions.find(
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
            className="flex  justify-between"
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
                  {` Expectations for Project : 
                  ${
                    question1?.answer <= 3
                      ? "Minimal improvement is perfect"
                      : question1?.answer > 3 && question1?.answer <= 6
                      ? "Moderate improvement is expected"
                      : question1?.answer > 6
                      ? "Nothing less than perfect"
                      : ""
                  }`}
                </li>
                {/* ) : (
                  ``
                )} */}
                {/* {question2?.answer ? ( */}
                <li
                  className={` text-left  font-semibold  ${pdfStyle?.liSpacing}`}
                >
                  {` Estimated Severity : 
                  ${
                    question2?.answer <= 3
                      ? "Low"
                      : question2?.answer > 3 && question2?.answer <= 6
                      ? "Medium"
                      : question2?.answer > 6
                      ? "High"
                      : ""
                  }`}
                </li>
                {/* ) : (
                  ``
                )} */}
                {question3?.answer ? (
                  <li
                    className={` text-left  font-semibold  ${pdfStyle?.liSpacing}`}
                  >
                    {question3?.answer
                      ? ` ${question3?.answer} leveling`
                      : "Leveling NA"}
                    <br />
                  </li>
                ) : (
                  ``
                )}
                {question4?.answer ? (
                  <li
                    className={` text-left  font-semibold  ${pdfStyle?.liSpacing}`}
                  >
                    {question4?.answer
                      ? `Leveling Details : ${question4?.answer} `
                      : "Leveling Details : NA"}
                    <br />
                  </li>
                ) : (
                  ``
                )}
                {question5?.answer ? (
                  <li
                    className={` text-left  font-semibold  ${pdfStyle?.liSpacing}`}
                  >
                    {question5?.answer ? `Notes : ${question5?.answer} ` : ""}
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
                            className={`border rounded-lg ${
                              pdfStyle?.projectFloorText
                            } ${pdfStyle?.projectFloorPadding} ${
                              room.levelling_id.includes(checklist?.id)
                                ? "text-white"
                                : "border-[#1E2E5A]"
                            }`}
                            style={{
                              backgroundColor: room.levelling_id.includes(
                                checklist?.id
                              )
                                ? `${checklist?.color}`
                                : ``,
                              borderColor: room.levelling_id.includes(
                                checklist?.id
                              )
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
              LEVELING
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

export default LevelingCheckListPdfNew;
