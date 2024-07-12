import React, { useMemo } from "react";
import Text from "../UI/Text";
import { Box, Grid } from "@mui/material";
import Image from "../UI/Image";
import { pdfStyle } from "../../utils/Constants";
import GetIconFile from "../../assets/GetIconFile";
import SingleImage from "./ImageRenderer/SingleImage";

const ProjectScopeinDetail = ({ customerDetails1 }) => {
  const rooms = useMemo(() => {
    let roomArr = [];
    customerDetails1?.fv_data?.scope?.floors?.map((floor) => {
      floor?.rooms?.map((room) => {
        roomArr.push(room);
      });
    });
    return roomArr;
  }, [customerDetails1]);

  let somthingExist = false;

  for (const room of rooms) {
    if (
      room?.dimensions?.length > 0 ||
      room?.images?.length > 0 ||
      room?.furniture_ids?.length > 0
    ) {
      somthingExist = true;
    }
  }

  let isKitchenChecklistAnsExist = false;

  if (customerDetails1?.fv_data?.kitchen_furnitures?.length > 0) {
    for (const que of customerDetails1?.fv_data?.kitchen_furnitures?.[0]
      ?.all_questions) {
      if (que?.answer === true) {
        isKitchenChecklistAnsExist = true;
      }
    }
  }

  return (
    <div className="">
      {somthingExist && (
        <div className={`flex item-center pl-2 p-1 pb-0 rounded-lg mt-5`}>
          <Text
            className={`text-black text-[25px] font-extrabold font-lora text-start `}
          >
            PROJECT SCOPE IN DETAIL
          </Text>
        </div>
      )}
      <div
        className="ml-[15px] h-[1px] bg-[#3a3a3a] rounded-full"
        style={{ width: "calc(100% - 30px)" }}
      ></div>
      <div className="mx-[38px]">
        {rooms?.map((room) => {
          if (
            room?.images?.length === 0 &&
            room?.dimensions?.length === 0 &&
            room?.furniture_ids?.length === 0 &&
            room?.name !== "Kitchen"
          ) {
            return <></>;
          } else {
            return (
              <div className="">
                <Text className="text-start text-lg text-black font-semibold my-2">
                  {room?.name}
                </Text>
                <div className="mb-2 h-[1px] bg-[#3a3a3a] rounded-full w-full" />

                {/* Room Images */}

                {room?.images?.length > 0 && (
                  <div className="mt-4">
                    <Text className="text-start text-sm font-semibold my-2 underline underline-offset-4">
                      Room Images
                    </Text>
                    <div className="grid grid-cols-3 gap-2" spacing={1}>
                      {room?.images?.map((src) => (
                        <div className="break-avoid">
                          <SingleImage src={src} alt="Room Image" />
                        </div>
                      ))}
                    </div>
                    {/* <Grid container spacing={1}>
                      {room?.images?.map((src) => (
                        <Grid item xs={4}>
                          <SingleImage src={src} alt="Room Image" />
                        </Grid>
                      ))}
                    </Grid> */}
                  </div>
                )}

                {/* Room Dimensions */}

                {room?.dimensions?.length > 0 && (
                  <div className="my-4 break-avoid">
                    <Text className="text-start text-sm font-semibold my-2 underline underline-offset-4">
                      Dimensions
                    </Text>
                    <table className="w-full ">
                      <thead className="bg-gray-200">
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
                            SF
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
                                className={`border text-[${pdfStyle?.tableBodyTextSize}px] border-[#D8D8D8] p-1 m-1`}
                              >
                                {item.shape || "-"}
                              </td>
                              <td
                                className={`border text-[${pdfStyle?.tableBodyTextSize}px] border-[#D8D8D8] p-1 m-1`}
                              >
                                {item.shape === "Semi-Ellipse"
                                  ? item?.radius1 || "-"
                                  : item?.length || "-"}
                              </td>
                              <td
                                className={`border text-[${pdfStyle?.tableBodyTextSize}px] border-[#D8D8D8] p-1 m-1`}
                              >
                                {item.shape === "Semi-Ellipse"
                                  ? item?.radius2 || "-"
                                  : item?.width || "-"}
                              </td>
                              <td
                                className={`border text-[${pdfStyle?.tableBodyTextSize}px] border-[#D8D8D8] p-1 m-1`}
                              >
                                {item.sqFeet || 0}
                              </td>
                              <td
                                className={`border text-[${pdfStyle?.tableBodyTextSize}px] border-[#D8D8D8] p-1 m-1`}
                              >
                                {item.closet ? (
                                  <div className="flex justify-center items-center">
                                    <GetIconFile
                                      iconName="yes-icon"
                                      data={{ width: 25, height: 25 }}
                                    />
                                  </div>
                                ) : (
                                  <div className="flex justify-center items-center">
                                    <GetIconFile
                                      iconName="no-icon"
                                      data={{ width: 25, height: 25 }}
                                    />
                                  </div>
                                )}
                              </td>
                              <td
                                className={`border text-[${pdfStyle?.tableBodyTextSize}px] border-[#D8D8D8] p-1 m-1`}
                              >
                                {item.scope ? (
                                  <div className="flex justify-center items-center">
                                    <GetIconFile
                                      iconName="yes-icon"
                                      data={{ width: 25, height: 25 }}
                                    />
                                  </div>
                                ) : (
                                  <div className="flex justify-center items-center">
                                    <GetIconFile
                                      iconName="no-icon"
                                      data={{ width: 25, height: 25 }}
                                    />
                                  </div>
                                )}
                              </td>
                            </tr>
                          ) : (
                            ``
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Room Furnitures */}

                <div className="my-4">
                  {(room?.furniture_ids?.length > 0 ||
                    (room?.name === "Kitchen" &&
                      isKitchenChecklistAnsExist)) && (
                    <Text className="text-start text-sm font-semibold my-2 underline underline-offset-4">
                      Furniture Items
                    </Text>
                  )}
                  <div className="grid grid-cols-12 gap-2">
                    {room?.furniture_ids?.map((fid) => {
                      let findFurniture =
                        customerDetails1.fv_data?.furnitures?.find(
                          (fur) => fur?.id === fid
                        ) || {};
                      return (
                        <>
                          <div
                            className={`col-span-3 flex items-center ${
                              room?.name === "Kitchen"
                                ? "justify-start"
                                : "justify-center"
                            }`}
                          >
                            <Text className="text-sm">
                              {findFurniture?.name}
                            </Text>
                          </div>

                          {/* This div is technically taking up a whole grid column, but the divider itself is much thinner. */}
                          <div className="col-span-1 w-[10px] flex justify-center items-center">
                            <div className="w-[1px] h-full bg-gray-700"></div>
                          </div>

                          <div className="col-span-8 -ml-[40px]">
                            <div className="grid grid-cols-12 gap-2">
                              {findFurniture?.images?.length > 0 ? (
                                findFurniture?.images?.map((src) => (
                                  <div className="col-span-4">
                                    <SingleImage
                                      src={src}
                                      alt="Furniture Image"
                                    />
                                  </div>
                                ))
                              ) : (
                                <div className="col-span-12">
                                  <Text className="text-sm">No Images</Text>
                                </div>
                              )}
                            </div>
                          </div>
                        </>
                      );
                    })}
                  </div>

                  {/* <Grid container spacing={1}>
                    {room?.furniture_ids?.map((fid) => {
                      let findFurniture =
                        customerDetails1.fv_data?.furnitures?.find(
                          (fur) => fur?.id === fid
                        ) || {};
                      return (
                        <>
                          <Grid
                            item
                            xs={3}
                            sx={{
                              display: "flex",
                              justifyContent:
                                room?.name === "Kitchen"
                                  ? "flex-start"
                                  : "center",
                              alignItems: "center",
                            }}
                          >
                            <Text className="text-sm">
                              {findFurniture?.name}
                            </Text>
                          </Grid>
                          <Grid item xs={0.2}>
                            <div className="w-[1px] h-full bg-[#3a3a3a]" />
                          </Grid>
                          <Grid item xs={8.8}>
                            <Grid container spacing={1}>
                              {findFurniture?.images?.length > 0 ? (
                                findFurniture?.images?.map((src) => (
                                  <Grid item xs={4}>
                                    <SingleImage
                                      src={src}
                                      alt="Furniture Image"
                                    />
                                  </Grid>
                                ))
                              ) : (
                                <Grid item xs={12} sx={{ textAlign: "start" }}>
                                  <Text className="text-sm">No Images</Text>
                                </Grid>
                              )}
                            </Grid>
                          </Grid>
                        </>
                      );
                    })}
                  </Grid> */}
                  {room?.name === "Kitchen" && (
                    <div className="my-2">
                      <div className="grid grid-cols-12 gap-2">
                        {customerDetails1?.fv_data?.kitchen_furnitures?.[0]?.all_questions?.map(
                          (que) => {
                            if (que?.answer === true) {
                              let findImages = que?.subQuestion?.find(
                                (subQue) => subQue?.type === "IMAGE"
                              );

                              return (
                                <>
                                  {/* Question and Subquestions */}
                                  <div className="col-span-3 flex items-center">
                                    <div>
                                      <Text className="mb-1 text-start text-sm">
                                        {que?.question}
                                      </Text>
                                      <ul className="list-disc list-outside ml-3 text-xs">
                                        {que?.subQuestion?.map((subque) => {
                                          if (subque?.answer !== "none") {
                                            let text;
                                            if (
                                              subque?.question ===
                                              "Any water hookups"
                                            ) {
                                              text =
                                                subque?.answer === true
                                                  ? "Water hookups"
                                                  : "No water hookups";
                                            } else if (
                                              subque?.question ===
                                              "Any potential clearance issues"
                                            ) {
                                              text =
                                                subque?.answer === true
                                                  ? "Potential clearance issues"
                                                  : "No potential clearance issues";
                                            } else if (
                                              subque?.question ===
                                              "Any Gas or Water hookups"
                                            ) {
                                              text =
                                                subque?.answer === true
                                                  ? "Gas or Water hookups"
                                                  : "No Gas or Water hookups";
                                            } else if (
                                              subque?.question === "Notes" &&
                                              subque?.answer
                                            ) {
                                              text = subque?.answer;
                                            }

                                            if (text) {
                                              return (
                                                <li className="text-left">
                                                  {text}
                                                </li>
                                              );
                                            }
                                          }
                                        })}
                                      </ul>
                                    </div>
                                  </div>

                                  {/* Divider */}
                                  <div className="col-span-1 w-[10px] flex justify-center items-center">
                                    <div className="w-[1px] h-full bg-gray-700"></div>
                                  </div>

                                  {/* Images */}
                                  <div className="col-span-8 -ml-[40px]">
                                    <div className="grid grid-cols-12 gap-2">
                                      {findImages?.answer?.length > 0 ? (
                                        findImages?.answer?.map((src) => (
                                          <div className="col-span-4">
                                            <SingleImage
                                              src={src}
                                              alt="Kitchen Furniture Image"
                                            />
                                          </div>
                                        ))
                                      ) : (
                                        <div className="col-span-12">
                                          <Text className="text-sm">
                                            No Images
                                          </Text>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </>
                              );
                            }
                          }
                        )}
                      </div>

                      {/* <Grid container spacing={1}>
                        {customerDetails1?.fv_data?.kitchen_furnitures?.[0]?.all_questions?.map(
                          (que) => {
                            if (que?.answer === true) {
                              let findImages = que?.subQuestion?.find(
                                (subQue) => subQue?.type === "IMAGE"
                              );

                              return (
                                <>
                                  <Grid
                                    item
                                    xs={3}
                                    sx={{
                                      display: "flex",
                                      justifyContent: "flex-start",
                                      alignItems: "center",
                                    }}
                                  >
                                    <div className="">
                                      <Text className="mb-1 text-start text-sm">
                                        {que?.question}
                                      </Text>
                                      <ul
                                        className={`list-disc list-outside ml-3 ${pdfStyle?.defaultTextColor} ${pdfStyle?.checklistLeftFont}`}
                                      >
                                        {que?.subQuestion?.map((subque) => {
                                          if (subque?.answer !== "none") {
                                            if (
                                              subque?.question ===
                                              "Any water hookups"
                                            ) {
                                              if (subque?.answer === true) {
                                                return (
                                                  <li
                                                    className={`text-left  ${pdfStyle?.liSpacing} text-xs`}
                                                  >
                                                    Water hookups
                                                  </li>
                                                );
                                              } else {
                                                return (
                                                  <li
                                                    className={`text-left  ${pdfStyle?.liSpacing} text-xs`}
                                                  >
                                                    No water hookups
                                                  </li>
                                                );
                                              }
                                            } else if (
                                              subque?.question ===
                                              "Any potential clearance issues"
                                            ) {
                                              if (subque?.answer === true) {
                                                return (
                                                  <li
                                                    className={`text-left  ${pdfStyle?.liSpacing} text-xs`}
                                                  >
                                                    Potential clearance issues
                                                  </li>
                                                );
                                              } else {
                                                return (
                                                  <li
                                                    className={`text-left  ${pdfStyle?.liSpacing} text-xs`}
                                                  >
                                                    No potential clearance
                                                    issues
                                                  </li>
                                                );
                                              }
                                            } else if (
                                              subque?.question ===
                                              "Any Gas or Water hookups"
                                            ) {
                                              if (subque?.answer === true) {
                                                return (
                                                  <li
                                                    className={`text-left  ${pdfStyle?.liSpacing} text-xs`}
                                                  >
                                                    Gas or Water hookups
                                                  </li>
                                                );
                                              } else {
                                                return (
                                                  <li
                                                    className={`text-left  ${pdfStyle?.liSpacing} text-xs`}
                                                  >
                                                    No Gas or Water hookups
                                                  </li>
                                                );
                                              }
                                            } else if (
                                              subque?.question === "Notes" &&
                                              subque?.answer
                                            ) {
                                              return (
                                                <li
                                                  className={`text-left  ${pdfStyle?.liSpacing} text-xs`}
                                                >
                                                  {subque?.answer}
                                                </li>
                                              );
                                            }
                                          }
                                        })}
                                      </ul>
                                    </div>
                                  </Grid>
                                  <Grid item xs={0.2}>
                                    <div className="w-[1px] h-full bg-[#3a3a3a]" />
                                  </Grid>
                                  <Grid item xs={8.8}>
                                    <Grid container spacing={1}>
                                      {findImages?.answer?.length > 0 ? (
                                        findImages?.answer?.map((src) => (
                                          <Grid item xs={4}>
                                            <SingleImage
                                              src={src}
                                              alt="Kitchen Furniture Image"
                                            />
                                          </Grid>
                                        ))
                                      ) : (
                                        <Grid
                                          item
                                          xs={12}
                                          sx={{ textAlign: "start" }}
                                        >
                                          <Text className="text-sm">
                                            No Images
                                          </Text>
                                        </Grid>
                                      )}
                                    </Grid>
                                  </Grid>
                                </>
                              );
                            }
                          }
                        )}
                      </Grid> */}
                    </div>
                  )}
                </div>
              </div>
            );
          }
        })}
      </div>
    </div>
  );
};

export default ProjectScopeinDetail;
