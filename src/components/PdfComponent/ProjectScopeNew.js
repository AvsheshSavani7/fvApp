import React from "react";
import Text from "../UI/Text";
import { pdfStyle } from "../../utils/Constants";

const ProjectScopeNew = ({ customerDetails1 }) => {
  let totalProjectSqft = 0;
  customerDetails1?.fv_data?.scope?.floors?.map((floor) => {
    floor.rooms?.map((room) => {
      totalProjectSqft += room?.finalTotalSqFeet || 0;
    });
  });
  totalProjectSqft = totalProjectSqft?.toFixed(2);

  let scope = customerDetails1?.fv_data?.scope;
  let buildingType = customerDetails1?.fv_data?.customer?.buildingType;
  let customer = customerDetails1?.fv_data?.customer;

  // let refinishingChecklistQuestions = [];
  let refinishingChecklistQuestions = {};
  let extMtlChecklistQuestions = {};
  let subFloorChecklistQuestions = [];
  let staricaseChecklistQuestions = {};

  // check in refinishing whether any question is matching the condition, then push to the array to show
  customerDetails1?.fv_data?.refinishing_checklists?.map((cl) => {
    cl?.all_questions?.map((que) => {
      if (que?.question === "Can Floor be buffed & recoated?") {
        if (
          que?.answer === true &&
          !refinishingChecklistQuestions?.hasOwnProperty(
            "Floor can be buffed & recoated"
          )
        ) {
          refinishingChecklistQuestions["Floor can be buffed & recoated"] = [];
        }
      } else if (
        que?.answer === false &&
        que?.question === "Confirmation of enough material for sanding?"
      ) {
        if (
          !refinishingChecklistQuestions?.hasOwnProperty(
            "Not enough material for sanding"
          )
        ) {
          refinishingChecklistQuestions["Not enough material for sanding"] = [];
        }
      } else if (
        que?.answer === true &&
        que?.question === "Excessive damage (ex. pet stains,cracked boards)"
      ) {
        que?.subQuestion?.map((subQue) => {
          if (subQue?.whenToShow === que?.answer && subQue?.answer === true) {
            if (
              !refinishingChecklistQuestions?.hasOwnProperty(
                "There is Excessive damage"
              )
            ) {
              refinishingChecklistQuestions["There is Excessive damage"] = [
                subQue?.question,
              ];
            } else {
              if (
                !refinishingChecklistQuestions[
                  "There is Excessive damage"
                ]?.includes(subQue?.question)
              ) {
                refinishingChecklistQuestions["There is Excessive damage"].push(
                  subQue?.question
                );
              }
            }
          } else {
            if (
              !refinishingChecklistQuestions?.hasOwnProperty(
                "There is Excessive damage"
              )
            ) {
              refinishingChecklistQuestions["There is Excessive damage"] = [];
            }
          }
        });
      } else if (
        que?.answer === true &&
        que?.question === "Surface issues ( ex. mastic, paint, wax)"
      ) {
        que?.subQuestion?.map((subQue) => {
          if (subQue?.whenToShow === que?.answer && subQue?.answer === true) {
            if (
              !refinishingChecklistQuestions?.hasOwnProperty(
                "There are Surface issues"
              )
            ) {
              refinishingChecklistQuestions["There are Surface issues"] = [
                subQue?.question,
              ];
            } else {
              if (
                !refinishingChecklistQuestions[
                  "There are Surface issues"
                ]?.includes(subQue?.question)
              ) {
                refinishingChecklistQuestions["There are Surface issues"].push(
                  subQue?.question
                );
              }
            }
          } else {
            if (
              !refinishingChecklistQuestions?.hasOwnProperty(
                "There are Surface issues"
              )
            ) {
              refinishingChecklistQuestions["There are Surface issues"] = [];
            }
          }
        });
      }
    });
  });

  // check in existing material whether any question is matching the condition, then push to the array to show
  customerDetails1?.fv_data?.existing_materials?.map((cl) => {
    cl?.all_questions?.map((que) => {
      if (que?.question === "Type") {
        if (
          que?.answer &&
          (que?.answer === "Prefinished Solid" ||
            que?.answer === "Prefinished Engineered")
        ) {
          if (
            !extMtlChecklistQuestions?.hasOwnProperty("Existing Material Type")
          ) {
            extMtlChecklistQuestions["Existing Material Type"] = [que?.answer];
          } else {
            if (
              !extMtlChecklistQuestions["Existing Material Type"]?.includes(
                que?.answer
              )
            ) {
              extMtlChecklistQuestions["Existing Material Type"]?.push(
                que?.answer
              );
            }
          }
        }
      } else if (que?.question === "Are there any bevels") {
        if (que?.answer === true) {
          if (!extMtlChecklistQuestions?.hasOwnProperty("There are bevels")) {
            extMtlChecklistQuestions["There are bevels"] = [];
          }
        }
      } else if (que?.question === "Species") {
        if (
          que?.answer &&
          que?.answer !== "White Oak" &&
          que?.answer !== "Red Oak"
        ) {
          if (
            !extMtlChecklistQuestions?.hasOwnProperty(
              "Existing Material Species"
            )
          ) {
            extMtlChecklistQuestions["Existing Material Species"] = [
              que?.answer,
            ];
          } else {
            if (
              !extMtlChecklistQuestions["Existing Material Species"]?.includes(
                que?.answer
              )
            ) {
              extMtlChecklistQuestions["Existing Material Species"]?.push(
                que?.answer
              );
            }
          }
        }
      } else if (que?.question === "Layout") {
        if (que?.answer && que?.answer !== "Straight") {
          if (
            !extMtlChecklistQuestions?.hasOwnProperty(
              "Existing Material Layout"
            )
          ) {
            extMtlChecklistQuestions["Existing Material Layout"] = [
              que?.answer,
            ];
          } else {
            if (
              !extMtlChecklistQuestions["Existing Material Layout"]?.includes(
                que?.answer
              )
            ) {
              extMtlChecklistQuestions["Existing Material Layout"]?.push(
                que?.answer
              );
            }
          }
        }
      } else if (que?.question === "Sawn Type") {
        if (que?.answer && que?.answer !== "Plain Sawn") {
          if (
            !extMtlChecklistQuestions?.hasOwnProperty(
              "Existing Material Sawn Type"
            )
          ) {
            extMtlChecklistQuestions["Existing Material Sawn Type"] = [
              que?.answer,
            ];
          } else {
            if (
              !extMtlChecklistQuestions[
                "Existing Material Sawn Type"
              ]?.includes(que?.answer)
            ) {
              extMtlChecklistQuestions["Existing Material Sawn Type"]?.push(
                que?.answer
              );
            }
          }
        }
      }
    });
  });

  // check in subfloor whether any question is matching the condition, then push to the array to show
  customerDetails1?.fv_data?.subfloor_details?.map((cl) => {
    cl?.all_questions?.map((que) => {
      if (que?.question === "Radiant Heating") {
        if (
          que?.answer === true &&
          !subFloorChecklistQuestions?.includes("There is Radiant Heating")
        ) {
          subFloorChecklistQuestions?.push("There is Radiant Heating");
        }
      } else if (que?.question === "Signs of Moisture") {
        if (
          que?.answer === true &&
          !subFloorChecklistQuestions?.includes("There are Signs of Moisture")
        ) {
          subFloorChecklistQuestions?.push("There are Signs of Moisture");
        }
      } else if (
        que?.question === "Excessive damage (ex. pet stains,cracked boards)"
      ) {
        if (
          que?.answer === true &&
          !subFloorChecklistQuestions?.includes("There is Excessive damage")
        ) {
          subFloorChecklistQuestions?.push("There is Excessive damage");
        }
      } else if (que?.question === "Surface issues ( ex. mastic, paint, wax)") {
        if (
          que?.answer === true &&
          !subFloorChecklistQuestions?.includes("There are Surface issues")
        ) {
          subFloorChecklistQuestions?.push("There are Surface issues");
        }
      }
    });
  });

  // check in staircase whether any question is matching the condition, then push to the array to show
  customerDetails1?.fv_data?.staircases?.map((cl) => {
    cl?.all_questions?.map((que) => {
      if (que?.question === "Cove Molding") {
        if (que?.answer && que?.answer !== "No Cove Molding") {
          if (
            !staricaseChecklistQuestions?.hasOwnProperty(
              "Staircase Cove Molding"
            )
          ) {
            staricaseChecklistQuestions["Staircase Cove Molding"] = [
              que?.answer,
            ];
          } else {
            if (
              !staricaseChecklistQuestions["Staircase Cove Molding"]?.includes(
                que?.answer
              )
            ) {
              staricaseChecklistQuestions["Staircase Cove Molding"]?.push(
                que?.answer
              );
            }
          }
        }
      } else if (que?.question === "Species") {
        if (
          que?.answer &&
          que?.answer !== "White Oak" &&
          que?.answer !== "Red Oak"
        ) {
          if (
            !staricaseChecklistQuestions?.hasOwnProperty("Staircase Species")
          ) {
            staricaseChecklistQuestions["Staircase Species"] = [que?.answer];
          } else {
            if (
              !staricaseChecklistQuestions["Staircase Species"]?.includes(
                que?.answer
              )
            ) {
              staricaseChecklistQuestions["Staircase Species"]?.push(
                que?.answer
              );
            }
          }
        }
      } else if (que?.question === "Exposed/Covered") {
        if (que?.answer && que?.answer !== "Exposed") {
          if (
            !staricaseChecklistQuestions?.hasOwnProperty(
              "Staircase Exposed/Covered"
            )
          ) {
            staricaseChecklistQuestions["Staircase Exposed/Covered"] = [
              que?.answer,
            ];
          } else {
            if (
              !staricaseChecklistQuestions[
                "Staircase Exposed/Covered"
              ]?.includes(que?.answer)
            ) {
              staricaseChecklistQuestions["Staircase Exposed/Covered"]?.push(
                que?.answer
              );
            }
          }
        }
      }
    });
  });

  return (
    <>
      <div className={`flex  item-center pl-2 p-1  pb-0 rounded-lg mt-4`}>
        <Text
          className={`text-black text-[25px] font-extrabold	 text-start font-lora`}
        >
          PROJECT SCOPE OVERVIEW
        </Text>
      </div>

      <div
        className="ml-[15px] h-[1px] bg-[#3a3a3a] rounded-full"
        style={{ width: "calc(100% - 30px)" }}
      ></div>

      {customerDetails1?.fv_data?.scope?.refinishing?.is_part && (
        <>
          <div className={`flex py-${pdfStyle?.paddingY} mt-3`}>
            <div
              className={`flex flex-col items-start mt-1   pl-${pdfStyle?.paddingL} `}
            >
              <div className="flex items-center justify-start">
                <div className={` text-[16px] text-start pl-4`}>
                  {customerDetails1?.fv_data?.scope?.refinishing?.is_part ? (
                    <span className="text-[16px]">Sanding and Refinishing</span>
                  ) : (
                    ""
                  )}
                  {customerDetails1?.fv_data?.scope?.refinishing
                    ?.are_we_matching ? (
                    <>
                      {" "}
                      w/{" "}
                      <span className="text-[red] font-semibold text-[16px]">
                        Matching{" "}
                      </span>
                    </>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {customerDetails1?.fv_data?.scope?.installation?.is_part && (
        <>
          <div className={`flex py-${pdfStyle?.paddingY}`}>
            <div className={`flex  items-start  pl-${pdfStyle?.paddingL} `}>
              <div className="flex items-center justify-start">
                <div
                  className={` text-[${pdfStyle?.questionTextSize}px] text-start pl-4`}
                >
                  {customerDetails1?.fv_data?.scope?.installation?.is_part ? (
                    <span className="text-[16px]">Installation</span>
                  ) : (
                    ""
                  )}
                </div>
                <div>
                  &nbsp;
                  {customerDetails1?.fv_data?.scope?.installation
                    ?.are_we_matching ||
                  customerDetails1?.fv_data?.scope?.installation
                    ?.are_we_levelling
                    ? "  w / "
                    : ""}
                  {customerDetails1?.fv_data?.scope?.installation
                    ?.are_we_matching ? (
                    <>
                      <span className="text-[red] font-semibold">
                        Matching &nbsp;
                      </span>
                    </>
                  ) : (
                    ""
                  )}
                </div>
                <div>
                  {customerDetails1?.fv_data?.scope?.installation
                    ?.are_we_matching &&
                  customerDetails1?.fv_data?.scope?.installation
                    ?.are_we_levelling
                    ? " and "
                    : ""}
                </div>
                <div>
                  {customerDetails1?.fv_data?.scope?.installation
                    ?.are_we_levelling ? (
                    <span className="text-[red] font-semibold">
                      {" "}
                      &nbsp; Leveling
                    </span>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {customerDetails1?.fv_data?.scope?.furniture?.is_part && (
        <>
          <div className={`flex py-${pdfStyle?.paddingY}`}>
            <div className={`flex items-start   pl-${pdfStyle?.paddingL} `}>
              <div className="flex items-center justify-start">
                <div
                  className={`text-[${pdfStyle?.questionTextSize}px] text-start pl-4`}
                >
                  {customerDetails1?.fv_data?.scope?.furniture?.is_part ? (
                    <span className={`text-[red] font-semibold text-[16px]`}>
                      {customerDetails1?.fv_data?.scope?.furniture
                        ?.kasa_is_moving
                        ? "Furniture Moving"
                        : "Furniture Not Moving"}
                    </span>
                  ) : (
                    ""
                  )}
                </div>
                <div>
                  <div>
                    &nbsp; with
                    {customerDetails1?.fv_data?.scope?.furniture?.is_appliance
                      ? " appliances "
                      : " no appliances "}
                    or
                    {customerDetails1?.fv_data?.scope?.furniture?.special_items
                      ? " special items "
                      : " no special items "}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Project complication */}
      <div className="break-avoid">
        <div className={`flex  item-center pl-2 p-1 pb-0 mt-5 rounded-lg `}>
          <Text
            className={`text-black text-[25px] font-extrabold font-lora text-start `}
          >
            PROJECT COMPLICATIONS
          </Text>
        </div>
        <div
          className="ml-[15px] h-[1px] bg-[#3a3a3a] rounded-full"
          style={{ width: "calc(100% - 30px)" }}
        ></div>
        <div className={`flex py-${pdfStyle?.paddingY} mt-3`}>
          <div
            className={`flex flex-col items-start my-${pdfStyle?.marginY} space-y-1 pl-${pdfStyle?.paddingL} `}
          >
            <div className="flex flex-col items-start justify-start pl-4 text-start gap-2 text-[red] text-[16px] font-semibold">
              {(Number(customer?.temperature) > 80 ||
                Number(customer?.temperature) < 60) && (
                <ul>
                  <li className="project-complication-bullet">
                    Temperature : {customer?.temperature}
                  </li>
                </ul>
              )}
              {(Number(customer?.humidity) > 50 ||
                Number(customer?.humidity) < 30) && (
                <ul>
                  <li className="project-complication-bullet">
                    Humidity : {customer?.humidity}
                  </li>
                </ul>
              )}
              {buildingType?.answer !== "Single Family House" && (
                <ul>
                  <li className="project-complication-bullet">
                    Building Type : {buildingType?.answer}
                  </li>
                </ul>
              )}

              {buildingType?.answer === "Apartment/Condo" &&
                buildingType?.subQuestion?.map((subQue) => {
                  if (
                    subQue?.question === "Confirmation of 220V Power Source ?"
                  ) {
                    if (subQue?.answer === false) {
                      return (
                        <ul>
                          <li className="project-complication-bullet">
                            220V Power Source not confirmed
                          </li>
                        </ul>
                      );
                    }
                  } else if (
                    subQue?.question ===
                    "Are there any Metal Doors where wood will be scored?"
                  ) {
                    if (subQue?.answer === true) {
                      return (
                        <ul>
                          <li className="project-complication-bullet">
                            Metal Doors will be scored
                          </li>
                        </ul>
                      );
                    }
                  }
                })}

              {scope?.furniture?.kasa_is_moving && (
                <ul>
                  <li className="project-complication-bullet">
                    Kasa is moving Furniture{" "}
                    {(scope?.furniture?.is_appliance ||
                      scope?.furniture?.special_items) && (
                      <span className="text-sm">
                        {scope?.furniture?.is_appliance &&
                        scope?.furniture?.special_items
                          ? "(Appliances and Special Items)"
                          : scope?.furniture?.is_appliance
                          ? "(Appliances)"
                          : "(Special Items)"}
                      </span>
                    )}
                  </li>
                </ul>
              )}
              {(scope?.refinishing?.are_we_matching ||
                scope?.installation?.are_we_matching) && (
                <ul>
                  <li className="project-complication-bullet">
                    We are Matching
                  </li>
                </ul>
              )}
              {scope?.installation?.are_we_levelling && (
                <ul>
                  <li className="project-complication-bullet">
                    We are Levelling
                  </li>
                </ul>
              )}

              {Object.keys(refinishingChecklistQuestions)?.map((que) => {
                return (
                  <ul>
                    <li className="project-complication-bullet">
                      {que}{" "}
                      {refinishingChecklistQuestions?.[que]?.length > 0 && (
                        <span className="text-sm">
                          (
                          {refinishingChecklistQuestions?.[que]?.map(
                            (ans, idx) => (
                              <>
                                {refinishingChecklistQuestions?.[que]?.length >
                                  1 &&
                                  idx ===
                                    refinishingChecklistQuestions?.[que]
                                      ?.length -
                                      1 && <span> and </span>}
                                <span>{ans}</span>
                                {idx !==
                                  refinishingChecklistQuestions?.[que]?.length -
                                    1 &&
                                  idx !==
                                    refinishingChecklistQuestions?.[que]
                                      ?.length -
                                      2 && <span>, </span>}
                              </>
                            )
                          )}
                          )
                        </span>
                      )}
                    </li>
                  </ul>
                );
              })}

              {Object.keys(extMtlChecklistQuestions)?.map((que) => {
                return (
                  <ul>
                    <li className="project-complication-bullet">
                      {que}
                      {extMtlChecklistQuestions?.[que]?.length > 0 && (
                        <span> - </span>
                      )}
                      {extMtlChecklistQuestions?.[que]?.map((ans, idx) => (
                        <>
                          {extMtlChecklistQuestions?.[que]?.length > 1 &&
                            idx ===
                              extMtlChecklistQuestions?.[que]?.length - 1 && (
                              <span> and </span>
                            )}
                          <span>{ans}</span>
                          {idx !==
                            extMtlChecklistQuestions?.[que]?.length - 1 &&
                            idx !==
                              extMtlChecklistQuestions?.[que]?.length - 2 && (
                              <span>, </span>
                            )}
                        </>
                      ))}
                    </li>
                  </ul>
                );
              })}

              {subFloorChecklistQuestions?.map((que) => (
                <ul>
                  <li className="project-complication-bullet">{que}</li>
                </ul>
              ))}

              {Object.keys(staricaseChecklistQuestions)?.map((que) => {
                return (
                  <ul>
                    <li className="project-complication-bullet">
                      {que}
                      {staricaseChecklistQuestions?.[que]?.length > 0 && (
                        <span> - </span>
                      )}
                      {staricaseChecklistQuestions?.[que]?.map((ans, idx) => (
                        <>
                          {staricaseChecklistQuestions?.[que]?.length > 1 &&
                            idx ===
                              staricaseChecklistQuestions?.[que]?.length -
                                1 && <span> and </span>}
                          <span>{ans}</span>
                          {idx !==
                            staricaseChecklistQuestions?.[que]?.length - 1 &&
                            idx !==
                              staricaseChecklistQuestions?.[que]?.length -
                                2 && <span>, </span>}
                        </>
                      ))}
                    </li>
                  </ul>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Project summary */}
      <div
        className={`flex  item-center pl-2 p-1 pb-0 mt-5 rounded-lg break-avoid`}
      >
        <Text
          className={`text-black text-[25px] font-extrabold font-lora text-start `}
        >
          PROJECT SUMMARY
        </Text>
      </div>
      <div
        className="ml-[15px] h-[1px] bg-[#3a3a3a] rounded-full"
        style={{ width: "calc(100% - 30px)" }}
      ></div>
      <div
        className="flex flex-col py-2 ml-[15px] mt-3 break-avoid"
        style={{ width: "calc(100% - 30px)" }}
      >
        <div className="text-center border border-[#1E2E5A] bg-[#1E2E5A] text-white rounded-lg py-[5px] text-[20px]">
          Project - {totalProjectSqft} SF
        </div>
        <div className="flex justify-center mt-2 gap-[16px]">
          {customerDetails1?.fv_data?.scope?.floors?.map((floor) => {
            let totalFloorSqFeet = 0;
            floor.rooms?.map((room) => {
              totalFloorSqFeet += room?.finalTotalSqFeet || 0;
            });
            totalFloorSqFeet = totalFloorSqFeet?.toFixed(2);

            return (
              <div className="flex flex-col gap-2 w-[180px] break-avoid">
                <div className="border bg-[#009DC2] text-white border-[#009DC2] rounded-lg py-[8px] text-[16px]">
                  {floor?.name}- {totalFloorSqFeet} SF
                </div>
                <div className="flex flex-col gap-2">
                  {floor?.rooms?.map((room) => {
                    return (
                      <div className="border border-[#1E2E5A] rounded-lg py-[8px] text-[16px] text-[#1E2E5A]">
                        {room?.name}-{room?.finalTotalSqFeet || 0} SF
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default ProjectScopeNew;
