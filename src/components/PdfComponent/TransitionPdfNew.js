import React from "react";
import Text from "../UI/Text";
import { pdfStyle } from "../../utils/Constants";
import { useSelector } from "react-redux";

const TransitionPdfNew = ({ customerDetails1, index }) => {
  const store = useSelector((state) => state.customerReducer);

  const allrefinishingChecklist =
    Object.keys(customerDetails1 || {}).length > 0
      ? [...customerDetails1?.fv_data?.transitions]
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
    function getRoomNamesByRefinishingId(floors, refinishingId) {
      const roomNames = [];

      for (const floor of floors) {
        for (const room of floor.rooms) {
          //   debugger
          if (room.subfloor_detail_id === refinishingId) {
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
      (question) => question.question === "Location"
    );
    const question3 = allQuestions.find(
      (question) => question.question === "Length"
    );
    const question4 = allQuestions.find(
      (question) => question.question === "Height Diffrence"
    );
    const question5 = allQuestions.find(
      (question) => question.question === "To Type of Flooring"
    );
    const question6 = allQuestions.find(
      (question) => question.question === "Notes"
    );

    let withinRoomName = "";
    let fromRoomName = "";
    let toRoomName = "";

    customerDetails1?.fv_data?.scope?.floors?.map((floor) => {
      floor?.rooms?.map((room) => {
        if (checklist?.within_room_id) {
          if (room?.id === checklist?.within_room_id) {
            withinRoomName = room?.name;
          }
        } else {
          if (room?.id === checklist?.from_room_id) {
            fromRoomName = room?.name;
          } else if (room?.id === checklist?.to_room_id) {
            toRoomName = room?.name;
          }
        }
      });
    });

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
              className={`${pdfStyle?.checkListLeftW} ml-3 flex  justify-between items-center`}
            >
              <ul
                className={`list-disc list-outside	ml-3 ${pdfStyle?.defaultTextColor} ${pdfStyle?.checklistLeftFont}`}
              >
                {question1?.answer &&
                  question2?.answer &&
                  question3?.answer && (
                    <li
                      className={`
                   text-left  font-semibold  ${pdfStyle?.liSpacing}`}
                    >
                      {question1?.answer ||
                      question2?.answer ||
                      question3?.answer
                        ? `${question3?.answer || "NA"} " long ${
                            question1?.answer || "NA"
                          } in ${question2?.answer}`
                        : ""}
                      <br />
                    </li>
                  )}

                <li
                  className={` text-left  font-semibold  ${pdfStyle?.liSpacing}`}
                >
                  Height Diffrence : {question4?.answer || "NA"}
                  <br />
                </li>

                {checklist?.from_room_id || checklist?.to_room_id ? (
                  <li
                    className={` text-left  font-semibold  ${pdfStyle?.liSpacing} `}
                  >
                    From {fromRoomName || " NA "} to{" "}
                    {question5?.answer || " NA "} in the {toRoomName || "NA"}
                    <br />
                  </li>
                ) : (
                  ""
                )}
                {checklist?.within_room_id ? (
                  <li
                    className={` text-left  font-semibold  ${pdfStyle?.liSpacing} `}
                  >
                    {question5?.answer || " NA "} Within{" "}
                    {withinRoomName || " NA "}
                    <br />
                  </li>
                ) : (
                  ""
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
                            className={`border border-[#009DC2] rounded-lg ${
                              pdfStyle?.projectFloorText
                            } ${pdfStyle?.projectFloorPadding} ${
                              room.transition_from_ids.includes(checklist?.id)
                                ? "bg-[#8EC24A] text-white border-[#8EC24A]"
                                : room.transition_to_ids.includes(checklist?.id)
                                ? "bg-[#F8842F] text-white border-[#F8842F]"
                                : room.transition_within_ids.includes(
                                    checklist?.id
                                  )
                                ? "bg-[#1A65D6] text-white border-[#1A65D6]"
                                : ""
                            } ${
                              room.transition_from_ids.includes(
                                checklist?.id
                              ) ||
                              room.transition_to_ids.includes(checklist?.id) ||
                              room.transition_within_ids.includes(checklist?.id)
                                ? ""
                                : "border-[#1E2E5A]"
                            }`}
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
              TRANSITION
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

export default TransitionPdfNew;
