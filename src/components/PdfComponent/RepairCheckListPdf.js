import React from "react";
import Text from "../UI/Text";
import Image from "../UI/Image";
import { pdfStyle } from "../../utils/Constants";

const RepairCheckListPdf = ({ customerDetails1 }) => {
  const allChecklist =
    Object.keys(customerDetails1 || {}).length > 0
      ? [...customerDetails1?.fv_data?.repairs]
      : [];
  const SingleCheckList = ({ checklist, index }) => {
    function getRoomNamesByRefinishingId(floors, refinishingId) {
      const roomNames = [];

      for (const floor of floors) {
        for (const room of floor.rooms) {
          if (room.repair_ids.includes(refinishingId)) {
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

    return (
      <>
        <div
          className={`bg-[${pdfStyle?.headingBgColor}]  flex    pl-2 rounded-lg items-center my-${pdfStyle?.marginY} p-1.5`}
        >
          <Text
            className={`text-black text-[${pdfStyle.headingSize}px] font-semibold text-start flex-none pr-4 ml-2.5`}
          >
            Repair - {index + 1}
          </Text>
          {singleStringRoom && (
            <div className={`text-black text-[16px] font-normal text-start`}>
              [{singleStringRoom}]
            </div>
          )}
        </div>
        <div class={`my-${pdfStyle?.marginY}`}>
          {checklist?.repair_description && (
            <>
              <div className={`flex py-${pdfStyle?.paddingY}`}>
                <div
                  className={`flex flex-col items-start justify-center my-${pdfStyle?.marginY} pl-${pdfStyle?.paddingL}  w-full`}
                >
                  <div className={"flex items-center justify-start"}>
                    <Text
                      className={`w-[250px] text-start text-[${pdfStyle?.questionTextSize}px]`}
                    >
                      Repair Description
                    </Text>
                    <span
                      className={`font-semibold text-[${pdfStyle?.answerTextSize}px]`}
                    >
                      : {checklist?.repair_description || "NA"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="w-full h-[1px] bg-[#D8D8D8] rounded-full"></div>
            </>
          )}
          {checklist?.images.length > 0 && (
            <>
              <div className={`flex w-full py-${pdfStyle?.paddingY}`}>
                <div
                  className={`flex  items-start justify-start my-${pdfStyle?.marginY} w-full`}
                >
                  <div className="flex  items-center justify-start">
                    {checklist?.images?.map((src, index) => (
                      <img
                        className={`w-[${pdfStyle?.imageW}px] h-[${pdfStyle?.imageH}px] rounded-md p-1`}
                        src={src}
                        alt={"src"}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="w-full h-[1px] bg-[#D8D8D8] rounded-full"></div>
            </>
          )}
        </div>
      </>
    );
  };

  return (
    <>
      {allChecklist.map((singleCL, i) => {
        return <SingleCheckList checklist={singleCL} index={i} />;
      })}
    </>
  );
};

export default RepairCheckListPdf;
