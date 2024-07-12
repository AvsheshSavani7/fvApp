import React from "react";
import Text from "../UI/Text";
import { Grid } from "@mui/material";
import Image from "../UI/Image";
import { pdfStyle } from "../../utils/Constants";
import SingleImage from "./ImageRenderer/SingleImage";

const SpecialItemsNew = ({ customerDetails1 }) => {
  const specialItemExist =
    customerDetails1?.fv_data?.specialItem_furnitures?.[0]?.all_questions?.some(
      (que) => que?.answer === true
    );

  return (
    <>
      {specialItemExist ? (
        <>
          <div className={`flex item-center pl-2 p-1 pb-0 rounded-lg mt-5`}>
            <Text
              className={`text-black text-[25px] font-extrabold font-lora text-start `}
            >
              FURNITURE SPECIAL ITEMS
            </Text>
          </div>
          <div
            className="ml-[15px] h-[1px] bg-[#3a3a3a] rounded-full"
            style={{ width: "calc(100% - 30px)" }}
          ></div>
          <div className="mx-[38px] my-4">
            <div className="grid grid-cols-12 gap-2">
              {customerDetails1?.fv_data?.specialItem_furnitures?.[0]?.all_questions?.map(
                (que) => {
                  if (que?.answer === true) {
                    let findImages = que?.subQuestion?.find(
                      (subQue) => subQue?.type === "IMAGE"
                    );

                    return (
                      <>
                        {/* Question and Subquestions Section */}
                        <div className="col-span-3 flex items-center">
                          <div>
                            <p className="mb-1 text-start text-sm">
                              {que?.question}
                            </p>
                            <ul
                              className={`list-disc list-outside ml-3 text-xs`}
                            >
                              {que?.subQuestion?.map((subque) => {
                                if (subque?.answer !== "") {
                                  let listItemContent = "";
                                  if (subque?.question === "Quantity") {
                                    listItemContent = `${subque?.answer} ${
                                      Number(subque?.answer) > 1
                                        ? "Quantities"
                                        : "Quantity"
                                    }`;
                                  } else if (subque?.question === "Notes") {
                                    listItemContent = subque?.answer;
                                  }

                                  if (listItemContent) {
                                    return (
                                      <li className="text-left">
                                        {listItemContent}
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

                        {/* Images Section */}
                        <div className="col-span-8 -ml-[40px] flex items-center">
                          <div className="grid grid-cols-12 gap-2 w-full">
                            {findImages?.answer?.length > 0 ? (
                              findImages?.answer?.map((src) => (
                                <div className="col-span-4">
                                  <SingleImage
                                    src={src}
                                    alt="Special Item Furniture Image"
                                  />
                                </div>
                              ))
                            ) : (
                              <div className="col-span-12 text-start">
                                <p className="text-sm">No Images</p>
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
              {customerDetails1?.fv_data?.specialItem_furnitures?.[0]?.all_questions?.map(
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
                                if (subque?.answer !== "") {
                                  if (subque?.question === "Quantity") {
                                    return (
                                      <li
                                        className={`text-left  ${pdfStyle?.liSpacing} text-xs`}
                                      >
                                        {subque?.answer}{" "}
                                        {Number(subque?.answer) > 1
                                          ? "Quantities"
                                          : "Quantity"}
                                      </li>
                                    );
                                  } else if (subque?.question === "Notes") {
                                    return (
                                      <li
                                        className={`text-left  ${pdfStyle?.liSpacing} text-xs `}
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
                        <Grid
                          item
                          xs={8.8}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <Grid container spacing={1}>
                            {findImages?.answer?.length > 0 ? (
                              findImages?.answer?.map((src) => (
                                <Grid item xs={4}>
                                  <SingleImage
                                    src={src}
                                    alt="Special Item Furniture Image"
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
                  }
                }
              )}
            </Grid> */}
          </div>{" "}
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default SpecialItemsNew;
