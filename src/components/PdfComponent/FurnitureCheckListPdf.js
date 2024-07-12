import React from "react";
import Text from "../UI/Text";
import Image from "../UI/Image";
import { pdfStyle } from "../../utils/Constants";

const FurnitureCheckListPdf = ({ customerDetails1 }) => {
  function getRoomsWithFurniture(floorsData) {
    const roomsWithFurniture = [];

    for (const floor of floorsData) {
      for (const room of floor.rooms) {
        if (room.furniture_ids && room.furniture_ids.length > 0) {
          roomsWithFurniture.push(room);
        }
      }
    }

    return roomsWithFurniture;
  }

  // Get rooms with at least one furniture id
  const roomsWithFurniture = getRoomsWithFurniture(
    customerDetails1?.fv_data?.scope?.floors || []
  );

  const SingleCheckList = ({ singleRoom }) => {
    // Function to filter furniture objects by IDs
    function filterFurnitureByIds(furnitureIds, furnitureArray) {
      return furnitureArray.filter((furniture) =>
        furnitureIds.includes(furniture.id)
      );
    }

    // Get the filtered furniture objects
    const filteredFurniture = filterFurnitureByIds(
      singleRoom?.furniture_ids || [],
      customerDetails1?.fv_data?.furnitures || []
    );

    return (
      <>
        <div className={`flex items-stretch py-${pdfStyle?.paddingY}`}>
          <div className="flex w-4/12 justify-start">
            <div
              className={`flex flex-col items-start justify-center my-${pdfStyle?.marginY} pl-${pdfStyle?.paddingL} w-full`}
            >
              <div className="flex items-center justify-start">
                <Text
                  className={`text-start text-[${pdfStyle?.questionTextSize}px]`}
                >
                  {singleRoom?.name}
                </Text>
              </div>
            </div>
          </div>
          <div className=" w-[1px] bg-[#D8D8D8] rounded-full"></div>
          {/* right side panel */}
          <div className={`flex flex-wrap w-8/12 pl-${pdfStyle?.paddingL}`}>
            {filteredFurniture?.map((furniture, i) => {
              return (
                <>
                  {/* right side upper panel */}
                  <div className={`flex w-full  my-${pdfStyle?.marginY}`}>
                    <div
                      className={`flex flex-col items-start justify-center my-${pdfStyle?.marginY} pr-2 w-1/2 `}
                    >
                      <div className="flex items-center justify-start">
                        <Text
                          className={`w-[140px] text-start text-[${pdfStyle?.questionTextSize}px]`}
                        >
                          Furniture Name
                        </Text>
                        <span
                          className={`font-semibold text-start text-[${pdfStyle?.answerTextSize}px]`}
                        >
                          : {furniture?.name}
                        </span>
                      </div>
                      {furniture?.isAD ? (
                        <>
                          <div className="w-full h-[1px] bg-[#D8D8D8] rounded-full"></div>
                          <div className="flex items-center justify-start">
                            <Text
                              className={`w-[140px] text-start text-[${pdfStyle?.questionTextSize}px]`}
                            >
                              isAD
                            </Text>
                            <span
                              className={`font-semibold text-start text-[${pdfStyle?.answerTextSize}px]`}
                            >
                              : {furniture?.isAD ? "Yes" : "No"}
                            </span>
                          </div>
                        </>
                      ) : (
                        ``
                      )}
                    </div>
                    <div className=" w-[1px] bg-[#D8D8D8] rounded-full"></div>
                    <div
                      className={`flex flex-col items-start justify-center my-${pdfStyle?.marginY} pl-${pdfStyle?.paddingL} w-1/2`}
                    >
                      <div className="flex items-start justify-start">
                        <Text
                          className={`w-[140px] text-start text-[${pdfStyle?.questionTextSize}px]`}
                        >
                          Size
                        </Text>
                        <span
                          className={`font-semibold text-[${pdfStyle?.answerTextSize}px]`}
                        >
                          :{" "}
                          {furniture?.size === "S"
                            ? "Small"
                            : furniture?.size === "M"
                            ? "Medium"
                            : "Large"}
                        </span>
                      </div>
                    </div>
                  </div>
                  {filteredFurniture?.length - 1 !== i ||
                  furniture?.images?.length > 0 ? (
                    <div className="w-full h-[1px] bg-[#D8D8D8] rounded-full"></div>
                  ) : (
                    ``
                  )}
                  {/*right side lower panel */}
                  {furniture?.images?.length > 0 ? (
                    <div className="flex w-full">
                      <div
                        className={`flex flex-col items-start justify-center my-${pdfStyle?.marginY} pl-${pdfStyle?.paddingL} w-full `}
                      >
                        <div className="flex flex-wrap items-center justify-start">
                          {furniture?.images?.map((src, index) => (
                            <img
                              className={`w-[${pdfStyle?.imageW}px] h-[${pdfStyle?.imageH}px] rounded-md p-1`}
                              src={src}
                              alt={"src"}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    ``
                  )}
                  {furniture?.images?.length > 0 &&
                  filteredFurniture?.length - 1 !== i ? (
                    <div className="w-full h-[1px] bg-[#D8D8D8] rounded-full"></div>
                  ) : (
                    ``
                  )}
                </>
              );
            })}
          </div>
        </div>
        <div className="w-full h-[1px] bg-[#D8D8D8] rounded-full"></div>
      </>
    );
  };

  return (
    <>
      <div
        className={`bg-[${pdfStyle?.headingBgColor}] flex    pl-2 rounded-lg items-center  my-${pdfStyle?.marginY} p-1.5`}
      >
        <Text
          className={`text-black text-[${pdfStyle.headingSize}px]  font-semibold text-start   flex-none pr-4 ml-2.5 `}
        >
          Furniture Items (Standard)
        </Text>
      </div>
      {roomsWithFurniture.map((singleCL) => {
        return <SingleCheckList singleRoom={singleCL} />;
      })}
    </>
  );
};

export default FurnitureCheckListPdf;
