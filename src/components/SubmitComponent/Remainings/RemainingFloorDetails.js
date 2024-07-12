import React from "react";
import Image from "../../UI/Image";
import RemainingFieldText from "../../UI/RemainingFieldText";
import { SubmitDialogConstants } from "../../../utils/Constants";
import Text from "../../UI/Text";
import { useDispatch, useSelector } from "react-redux";
import RemainingFieldHeadingText from "../../UI/RemainingFieldHeadingText";
import { checkMandatoryForFloorDetails } from "../../../utils/checkMandatory";

const RemainingFloorDetails = ({ singleCustomerData }) => {
  const notFilledOutBtns = useSelector(
    (state) => state.customerReducer.notFilledOutBtns
  );
  const dispatch = useDispatch();

  const getIcon = (answer) => {
    return <Image src={SubmitDialogConstants.CROSS_ICON_URL} />;
    // if (answer === "" || answer === "none" || answer?.length === 0) {
    //   return <Image src={SubmitDialogConstants.CROSS_ICON_URL} />;
    // } else {
    //   return <Image src={SubmitDialogConstants.CHECK_ICON_URL} />;
    // }
  };

  // const singleCustomerData = useSelector(
  //   (state) => state.customerReducer.singleCustomer
  // );

  const { isValid, isValidRoomForExistingMaterial, isValidRoomSubFloor } =
    checkMandatoryForFloorDetails(
      dispatch,
      singleCustomerData,
      "",
      notFilledOutBtns
    );

  const existing_materials = singleCustomerData?.existing_materials;
  const subfloor_details = singleCustomerData?.subfloor_details;
  const existingMaterialIsPart =
    singleCustomerData?.scope?.refinishing?.is_part;
  const subFloorIsPart = singleCustomerData?.scope?.installation?.is_part;

  let inValidRoomsForExt = [];
  let inValidRoomsForSF = [];

  if (singleCustomerData?.scope?.floors?.length > 0) {
    for (const floor of singleCustomerData?.scope?.floors) {
      if (floor?.rooms) {
        for (const room of floor?.rooms) {
          if (existingMaterialIsPart && room?.existing_material_id === "") {
            inValidRoomsForExt?.push(room?.name);
          }
          if (subFloorIsPart && room?.subfloor_detail_id === "") {
            inValidRoomsForSF?.push(room?.name);
          }
        }
      }
    }
  }

  let mainQueFilled = true;
  let subQueFilled = true;

  existing_materials?.map((cl) => {
    cl?.all_questions?.map((que) => {
      if (
        que?.mandatory &&
        (que?.answer === "none" ||
          que?.answer === "" ||
          que?.answer?.length === 0)
      ) {
        mainQueFilled = false;
      } else {
        if (que?.subQuestion) {
          que?.subQuestion?.map((subQue) => {
            if (
              subQue?.mandatory &&
              subQue?.whenToShow === que?.answer &&
              (subQue?.answer === "none" || subQue?.answer === "")
            ) {
              subQueFilled = false;
            }
          });
        }
      }
    });
  });

  let mainSubFloorQueFilled = true;
  let subSubFloorQueFilled = true;

  subfloor_details?.map((cl) => {
    cl?.all_questions?.map((que) => {
      if (
        que?.mandatory &&
        (que?.answer === "none" ||
          que?.answer === "" ||
          que?.answer?.length === 0)
      ) {
        mainSubFloorQueFilled = false;
      } else {
        if (que?.subQuestion) {
          let flatArray = que?.subQuestion?.flatMap(
            (subQue) => subQue?.subQuestion
          );
          flatArray?.map((subQue) => {
            if (
              subQue?.mandatory &&
              subQue?.whenToShow === que?.answer &&
              (subQue?.answer === "none" ||
                subQue?.answer === "" ||
                subQue?.answer?.length === 0)
            ) {
              subSubFloorQueFilled = false;
            }
          });
        }
      }
    });
  });

  return (
    <>
      {existingMaterialIsPart && existing_materials?.length > 0 && (
        <div>
          {(!mainQueFilled ||
            !subQueFilled ||
            inValidRoomsForExt?.length > 0) && (
            <RemainingFieldHeadingText
              className={`text-black font-semibold text-[18px] bg-[#80808052] w-full p-[8px] text-start rounded-[4px] mb-2`}
            >
              Existing Material Checklists
            </RemainingFieldHeadingText>
          )}
          {existing_materials?.map((cl, clIndex) => {
            if (cl?.all_questions) {
              let mainQueFilled = true;
              let subQueFilled = true;

              cl?.all_questions?.map((que) => {
                if (
                  que?.mandatory &&
                  (que?.answer === "none" ||
                    que?.answer === "" ||
                    que?.answer?.length === 0)
                ) {
                  mainQueFilled = false;
                } else {
                  if (que?.subQuestion) {
                    que?.subQuestion?.map((subQue) => {
                      if (
                        subQue?.mandatory &&
                        subQue?.whenToShow === que?.answer &&
                        (subQue?.answer === "none" || subQue?.answer === "")
                      ) {
                        subQueFilled = false;
                      }
                    });
                  }
                }
              });

              return (
                <div>
                  {(!mainQueFilled || !subQueFilled) && (
                    <div className={`flex items-center gap-2 my-3`}>
                      <div
                        className={`!w-[30px] h-[30px] rounded-full flex-none `}
                        style={{ backgroundColor: cl?.color }}
                      ></div>
                      <Text className="font-semibold">
                        Existing Material Checklist {clIndex + 1}
                      </Text>
                    </div>
                  )}
                  {cl?.all_questions?.map((que, idx) => {
                    if (
                      que?.mandatory &&
                      (que?.answer === "none" ||
                        que?.answer === "" ||
                        que?.answer?.length === 0)
                    ) {
                      return (
                        <div
                          className={`my-1 ml-[${SubmitDialogConstants.MAINQUE_MARGIN_LEFT}px]`}
                        >
                          <div
                            className={`flex items-center gap-${SubmitDialogConstants.GAP_WITH_CROSS_ICON}`}
                          >
                            <div className="">{getIcon("")}</div>
                            <RemainingFieldText className={``}>
                              {que?.question}
                            </RemainingFieldText>
                          </div>
                        </div>
                      );
                    } else {
                      if (
                        que?.mandatory &&
                        que?.subQuestion &&
                        que?.subQuestion?.length > 0
                      ) {
                        let filteredSubQueArray = que?.subQuestion?.filter(
                          (subQue) =>
                            subQue?.whenToShow === que?.answer &&
                            (subQue?.answer === "none" ||
                              subQue?.answer === "" ||
                              subQue?.answer?.length === 0)
                        );

                        return filteredSubQueArray?.map((subQue, subIdx) => {
                          if (
                            subQue?.mandatory &&
                            subQue?.whenToShow === que?.answer &&
                            (subQue?.answer === "none" ||
                              subQue?.answer === "" ||
                              subQue?.answer?.length === 0)
                          ) {
                            return (
                              <div
                                className={`my-1 ml-[${SubmitDialogConstants.MAINQUE_MARGIN_LEFT}px]`}
                              >
                                {subIdx === 0 && (
                                  <div
                                    className={`flex items-center gap-${SubmitDialogConstants.GAP_WITH_CROSS_ICON}`}
                                  >
                                    <div className="">
                                      {getIcon(que?.answer)}
                                    </div>
                                    <RemainingFieldText className={``}>
                                      {que?.question}
                                    </RemainingFieldText>
                                  </div>
                                )}
                                <div
                                  className={`flex items-center gap-${SubmitDialogConstants.GAP_WITH_CROSS_ICON} ml-[${SubmitDialogConstants.SUBQUE_MARGIN_LEFT}px] my-${SubmitDialogConstants.MARGIN_Y}`}
                                >
                                  <div className="">{getIcon("")}</div>
                                  <RemainingFieldText className={``}>
                                    {subQue?.question}
                                  </RemainingFieldText>
                                </div>
                              </div>
                            );
                          }
                        });
                      }
                    }
                  })}
                </div>
              );
            }
          })}

          {inValidRoomsForExt?.length > 0 && (
            <div className="text-md mt-5 bg-[#ff00002e] p-2 rounded-md">
              <Text className="text-[15px]">
                {" "}
                - Following rooms don't have existing material checklist
              </Text>
              <ul className="ml-4 mt-1">
                {inValidRoomsForExt?.map((room) => (
                  <li className="custom-bullet-point font-semibold">{room}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
      {subFloorIsPart && subfloor_details?.length > 0 && (
        <div className="mt-3">
          {(!mainSubFloorQueFilled ||
            !subSubFloorQueFilled ||
            inValidRoomsForSF?.length > 0) && (
            <RemainingFieldHeadingText
              className={`text-black font-semibold text-[18px] bg-[#80808052] w-full p-[8px] text-start rounded-[4px] mb-2`}
            >
              Subfloor Checklists
            </RemainingFieldHeadingText>
          )}
          {subfloor_details?.map((cl, clIndex) => {
            if (cl?.all_questions) {
              let mainSubFloorQueFilled = true;
              let subSubFloorQueFilled = true;

              cl?.all_questions?.map((que) => {
                if (
                  que?.mandatory &&
                  (que?.answer === "none" ||
                    que?.answer === "" ||
                    que?.answer?.length === 0)
                ) {
                  mainSubFloorQueFilled = false;
                } else {
                  if (que?.subQuestion) {
                    let flatArray = que?.subQuestion?.flatMap(
                      (subQue) => subQue?.subQuestion
                    );
                    flatArray?.map((subQue) => {
                      if (
                        subQue?.mandatory &&
                        subQue?.whenToShow === que?.answer &&
                        (subQue?.answer === "none" ||
                          subQue?.answer === "" ||
                          subQue?.answer?.length === 0)
                      ) {
                        subSubFloorQueFilled = false;
                      }
                    });
                  }
                }
              });

              return (
                <div>
                  {(!mainSubFloorQueFilled || !subSubFloorQueFilled) && (
                    <div className={`flex items-center gap-2 my-3`}>
                      <div
                        className={`!w-[30px] h-[30px] rounded-full flex-none `}
                        style={{ backgroundColor: cl?.color }}
                      ></div>
                      <Text className="font-semibold">
                        Subfloor Checklist {clIndex + 1}
                      </Text>
                    </div>
                  )}
                  {cl?.all_questions?.map((que, idx) => {
                    if (
                      que?.mandatory &&
                      (que?.answer === "none" ||
                        que?.answer === "" ||
                        que?.answer?.length === 0)
                    ) {
                      return (
                        <div
                          className={`my-1 ml-[${SubmitDialogConstants.MAINQUE_MARGIN_LEFT}px]`}
                        >
                          <div
                            className={`flex items-center gap-${SubmitDialogConstants.GAP_WITH_CROSS_ICON}`}
                          >
                            <div className="">{getIcon("")}</div>
                            <RemainingFieldText className={``}>
                              {que?.question}
                            </RemainingFieldText>
                          </div>
                        </div>
                      );
                    } else {
                      if (
                        que?.mandatory &&
                        que?.subQuestion &&
                        que?.subQuestion?.length > 0
                      ) {
                        let flatArray = que?.subQuestion?.flatMap(
                          (subQue) => subQue?.subQuestion
                        );

                        flatArray = flatArray?.filter(
                          (subQue) =>
                            subQue?.whenToShow === que?.answer &&
                            (subQue?.answer === "none" ||
                              subQue?.answer === "" ||
                              subQue?.answer?.length === 0)
                        );

                        return flatArray?.map((subQue, subIdx) => {
                          if (
                            subQue?.mandatory &&
                            subQue?.whenToShow === que?.answer &&
                            (subQue?.answer === "none" ||
                              subQue?.answer === "" ||
                              subQue?.answer?.length === 0)
                          ) {
                            return (
                              <div
                                className={`my-1 ml-[${SubmitDialogConstants.MAINQUE_MARGIN_LEFT}px]`}
                              >
                                {subIdx === 0 && (
                                  <div
                                    className={`flex items-center gap-${SubmitDialogConstants.GAP_WITH_CROSS_ICON}`}
                                  >
                                    <div className="">
                                      {getIcon(que?.answer)}
                                    </div>
                                    <RemainingFieldText className={``}>
                                      {que?.question}
                                    </RemainingFieldText>
                                  </div>
                                )}
                                <div
                                  className={`flex items-center gap-${SubmitDialogConstants.GAP_WITH_CROSS_ICON} ml-[${SubmitDialogConstants.SUBQUE_MARGIN_LEFT}px] my-${SubmitDialogConstants.MARGIN_Y}`}
                                >
                                  <div className="">{getIcon("")}</div>
                                  <RemainingFieldText className={``}>
                                    {subQue?.question}
                                  </RemainingFieldText>
                                </div>
                              </div>
                            );
                          }
                        });
                      }
                    }
                  })}
                </div>
              );
            }
          })}
          {inValidRoomsForSF?.length > 0 && (
            <div className="text-md mt-5 bg-[#ff00002e] p-2 rounded-md">
              <Text className="text-[15px]">
                {" "}
                - Following rooms don't have Subfloor checklist
              </Text>
              <ul className="ml-4 mt-1">
                {inValidRoomsForSF?.map((room) => (
                  <li className="custom-bullet-point font-semibold">{room}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default RemainingFloorDetails;
