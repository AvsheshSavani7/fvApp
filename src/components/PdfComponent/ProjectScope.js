import React from "react";
import Text from "../UI/Text";
import { pdfStyle } from "../../utils/Constants";

const ProjectScope = ({ customerDetails1 }) => {
  let totalProjectSqft = 0;
  customerDetails1?.fv_data?.scope?.floors?.map((floor) => {
    floor.rooms?.map((room) => {
      totalProjectSqft += room?.totalSqFeet;
    });
  });

  return (
    <>
      <div
        className={`flex bg-[${pdfStyle?.headingBgColor}] item-center pl-2 p-1.5 rounded-lg `}
      >
        <Text
          className={`text-black text-[${pdfStyle?.headingSize}px] font-semibold text-start `}
        >
          Project Scope
        </Text>
        <div className={`text-[16px] text-center p-0.5 ml-2`}>
          [{totalProjectSqft} SF]
        </div>
      </div>
      {/* 1st line */}
      {customerDetails1?.fv_data?.scope?.furniture?.is_part && (
        <>
          <div className={`flex py-${pdfStyle?.paddingY}`}>
            <div
              className={`flex flex-col items-start my-${pdfStyle?.marginY} space-y-1 pl-${pdfStyle?.paddingL} ${
                customerDetails1?.fv_data?.scope?.furniture?.kasa_is_moving
                  ? "w-4/12"
                  : "w-1/2"
              }`}
            >
              <div className="flex items-center justify-start">
                <Text
                  className={`w-[250px] text-[${pdfStyle?.questionTextSize}px] text-start`}
                >
                  {customerDetails1?.fv_data?.scope?.furniture?.is_part
                    ? "Furnished"
                    : "Not Furnished"}
                </Text>
              </div>
            </div>
            {customerDetails1?.fv_data?.scope?.furniture?.is_part && (
              <>
                <div className=" w-[1px] bg-[#D8D8D8] rounded-full"></div>
                <div
                  className={`flex flex-col items-start my-${pdfStyle?.marginY} space-y-1 pl-${pdfStyle?.paddingL} ${
                    customerDetails1?.fv_data?.scope?.furniture?.kasa_is_moving
                      ? "w-4/12"
                      : "w-1/2"
                  }`}
                >
                  <div className="flex items-center justify-start">
                    <Text
                      className={`w-[200px] text-[${pdfStyle?.questionTextSize}px] text-start`}
                    >
                      -{" "}
                      {customerDetails1?.fv_data?.scope?.furniture
                        ?.kasa_is_moving
                        ? "Kasa is moving"
                        : "Customer is moving"}{" "}
                    </Text>
                  </div>
                </div>
                {customerDetails1?.fv_data?.scope?.furniture?.is_part &&
                  customerDetails1?.fv_data?.scope?.furniture
                    ?.kasa_is_moving && (
                    <>
                      <div className=" w-[1px] bg-[#D8D8D8] rounded-full"></div>
                      <div
                        className={`flex flex-col items-start my-${pdfStyle?.marginY} space-y-1 pl-${pdfStyle?.paddingL} w-4/12`}
                      >
                        <div className="flex items-center justify-start">
                          <Text
                            className={`w-[200px] text-[${pdfStyle?.questionTextSize}px] text-start`}
                          >
                            -{" "}
                            {customerDetails1?.fv_data?.scope?.furniture
                              ?.is_appliance
                              ? "Appliances"
                              : "No Appliances"}
                          </Text>
                        </div>
                        <div className="flex items-center justify-start">
                          <Text
                            className={`w-[250px] text-[${pdfStyle?.questionTextSize}px] text-start`}
                          >
                            -{" "}
                            {customerDetails1?.fv_data?.scope?.furniture
                              ?.special_items
                              ? "Special items"
                              : "No special items"}
                          </Text>
                        </div>
                      </div>
                    </>
                  )}
              </>
            )}
          </div>
          <div className="w-full h-[1px] bg-[#D8D8D8] rounded-full"></div>
        </>
      )}
      {/* 2nd line */}
      {customerDetails1?.fv_data?.scope?.refinishing?.is_part && (
        <>
          <div className={`flex py-${pdfStyle?.paddingY}`}>
            <div
              className={`flex flex-col items-start my-${pdfStyle?.marginY} space-y-1 pl-${pdfStyle?.paddingL} w-1/2`}
            >
              <div className="flex items-center justify-start">
                <Text
                  className={`w-[250px] text-[${pdfStyle?.questionTextSize}px] text-start`}
                >
                  {customerDetails1?.fv_data?.scope?.refinishing?.is_part
                    ? "Refinishing"
                    : "Not Refinishing"}
                </Text>
              </div>
            </div>
            {customerDetails1?.fv_data?.scope?.refinishing?.is_part && (
              <>
                <div className=" w-[1px] bg-[#D8D8D8] rounded-full"></div>
                <div
                  className={`flex flex-col items-start my-${pdfStyle?.marginY} space-y-1 pl-${pdfStyle?.paddingL} w-1/2`}
                >
                  <div className="flex items-center justify-start">
                    <Text
                      className={`w-[250px] text-[${pdfStyle?.questionTextSize}px] text-start`}
                    >
                      -{" "}
                      {customerDetails1?.fv_data?.scope?.refinishing
                        ?.are_we_matching
                        ? "Matching"
                        : "Not Matching"}{" "}
                    </Text>
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="w-full h-[1px] bg-[#D8D8D8] rounded-full"></div>
        </>
      )}
      {/* 3rd line */}
      {customerDetails1?.fv_data?.scope?.installation?.is_part && (
        <>
          <div className={`flex py-${pdfStyle?.paddingY}`}>
            <div
              className={`flex flex-col items-start my-${pdfStyle?.marginY} space-y-1 pl-${pdfStyle?.paddingL} w-1/2`}
            >
              <div className="flex items-center justify-start">
                <Text
                  className={`w-[250px] text-[${pdfStyle?.questionTextSize}px] text-start`}
                >
                  {customerDetails1?.fv_data?.scope?.installation?.is_part
                    ? "Installation"
                    : "No Installation"}
                </Text>
              </div>
            </div>
            {customerDetails1?.fv_data?.scope?.installation?.is_part && (
              <>
                <div className=" w-[1px] bg-[#D8D8D8] rounded-full"></div>
                <div
                  className={`flex flex-col items-start my-${pdfStyle?.marginY} space-y-1 pl-${pdfStyle?.paddingL} w-1/2`}
                >
                  <div className="flex items-center justify-start">
                    <Text
                      className={`w-[250px] text-[${pdfStyle?.questionTextSize}px] text-start`}
                    >
                      -{" "}
                      {customerDetails1?.fv_data?.scope?.installation
                        ?.are_we_matching
                        ? "Matching"
                        : "Not Matching"}{" "}
                    </Text>
                  </div>
                  <div className="flex items-center justify-start">
                    <Text
                      className={`w-[250px] text-[${pdfStyle?.questionTextSize}px] text-start`}
                    >
                      -{" "}
                      {customerDetails1?.fv_data?.scope?.installation
                        ?.are_we_levelling
                        ? "Leveing"
                        : "Not Leveling"}{" "}
                    </Text>
                  </div>
                </div>
              </>
            )}
          </div>
        </>
      )}

      {/* floors */}
      {customerDetails1?.fv_data?.scope?.floors?.map((floor) => {
        let totalFloorSqFeet = 0;
        floor.rooms?.map((room) => {
          totalFloorSqFeet += room?.totalSqFeet;
        });
        return (
          <>
            <div className={`flex bg-[#D8D8D8]  mx-2 pl-3 items-center rounded-lg `}>
              <Text
                className={`text-black text-[${pdfStyle?.headingSize}px]  text-start `}
              >
                {floor?.name}
              </Text>
              <div className={`mx-2 text-[16px]   text-start `}>
                [{totalFloorSqFeet} SF]
              </div>
            </div>
            {floor?.rooms?.map((room, index) => {
              return (
                <>
                  <div className={`flex py-${pdfStyle?.paddingY} ml-4`}>
                    <div
                      className={`flex flex-col items-start my-${pdfStyle?.marginY} space-y-1 pl-${pdfStyle?.paddingL} w-2/12`}
                    >
                      <div className="flex flex-col items-center justify-start">
                        <Text
                          className={`w-[250px] text-[${pdfStyle?.questionTextSize}px] text-start`}
                        >
                          {room?.name}
                        </Text>
                        <Text
                          className={`w-[250px] text-[${pdfStyle?.questionTextSize}px] text-start`}
                        >
                          ({room?.totalSqFeet} SF)
                        </Text>
                      </div>
                    </div>

                    <div className=" w-[1px] bg-[#D8D8D8] rounded-full"></div>
                    <div
                      className={`"lex flex-col items-start my-${pdfStyle?.marginY} space-y-1 pl-${pdfStyle?.paddingL} w-10/12`}
                    >
                      <div className="flex ">
                        <div
                          className={`flex  items-start justify-start  w-[250px]`}
                        >
                          <Text
                            className={`w-[80px] text-[${pdfStyle?.questionTextSize}px] text-start`}
                          >
                            Notes
                          </Text>
                          <span
                            className={`font-semibold text-[${pdfStyle?.answerTextSize}px] text-start`}
                          >
                            : {room?.note || "NA"}
                          </span>
                        </div>
                        {room?.dimensions?.length > 0 ? (
                          <div className=" w-[1px] bg-[#D8D8D8] rounded-full mx-1"></div>
                        ) : (
                          ``
                        )}
                        {room?.dimensions?.length > 0 && (
                          <>
                            <table>
                              <thead>
                                <tr>
                                  <th
                                    className={`border text-[${pdfStyle?.questionTextSize}px] font-bold border-[#D8D8D8] p-1.5`}
                                  >
                                    Shape
                                  </th>
                                  <th
                                    className={`border text-[${pdfStyle?.questionTextSize}px] font-bold border-[#D8D8D8] p-1.5`}
                                  >
                                    L/R1
                                  </th>
                                  <th
                                    className={`border text-[${pdfStyle?.questionTextSize}px] font-bold border-[#D8D8D8] p-1.5`}
                                  >
                                    W/R2
                                  </th>
                                  <th
                                    className={`border text-[${pdfStyle?.questionTextSize}px] font-bold border-[#D8D8D8] p-1.5`}
                                  >
                                    SqFeet
                                  </th>
                                  <th
                                    className={`border text-[${pdfStyle?.questionTextSize}px] font-bold border-[#D8D8D8] p-1.5`}
                                  >
                                    Closet
                                  </th>
                                  <th
                                    className={`border text-[${pdfStyle?.questionTextSize}px] font-bold border-[#D8D8D8] p-1.5`}
                                  >
                                    Scope
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {room?.dimensions?.map((item) =>
                                  item?.shape ? (
                                    <tr key={item.id}>
                                      <td
                                        className={`border text-[${pdfStyle?.answerTextSize}px] border-[#D8D8D8] p-1 m-1`}
                                      >
                                        {item.shape || "-"}
                                      </td>
                                      <td
                                        className={`border text-[${pdfStyle?.answerTextSize}px] border-[#D8D8D8] p-1 m-1`}
                                      >
                                        {item.shape === "Semi-Ellipse"
                                          ? item?.radius1 || "-"
                                          : item?.length || "-"}
                                      </td>
                                      <td
                                        className={`border text-[${pdfStyle?.answerTextSize}px] border-[#D8D8D8] p-1 m-1`}
                                      >
                                        {item.shape === "Semi-Ellipse"
                                          ? item?.radius2 || "-"
                                          : item?.width || "-"}
                                      </td>
                                      <td
                                        className={`border text-[${pdfStyle?.answerTextSize}px] border-[#D8D8D8] p-1 m-1`}
                                      >
                                        {item.sqFeet || 0}
                                      </td>
                                      <td
                                        className={`border text-[${pdfStyle?.answerTextSize}px] border-[#D8D8D8] p-1 m-1`}
                                      >
                                        {item.closet ? "Yes" : "No"}
                                      </td>
                                      <td
                                        className={`border text-[${pdfStyle?.answerTextSize}px] border-[#D8D8D8] p-1 m-1`}
                                      >
                                        {item.scope ? "Yes" : "No"}
                                      </td>
                                    </tr>
                                  ) : (
                                    ``
                                  )
                                )}
                              </tbody>
                            </table>
                          </>
                        )}
                      </div>

                      {room?.images?.length > 0 && (
                        <div className="w-full h-[1px] bg-[#D8D8D8] rounded-full"></div>
                      )}
                      <div
                        className={`flex flex-wrap items-start my-${pdfStyle?.marginY} space-y-1 pl-${pdfStyle?.paddingL} w-full `}
                      >
                        {room?.images?.map((src, index) => (
                          <img
                            className={`w-[${pdfStyle?.imageW}px] h-[${pdfStyle?.imageH}px] rounded-md p-1`}
                            src={src}
                            alt={"src"}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  {floor?.rooms?.length - 1 !== index && (
                    <div className="w-full h-[1px] bg-[#D8D8D8] rounded-full"></div>
                  )}
                </>
              );
            })}
          </>
        );
      })}
    </>
  );
};

export default ProjectScope;
