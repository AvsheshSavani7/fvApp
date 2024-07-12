import React from "react";
import Image from "../../UI/Image";
import RemainingFieldText from "../../UI/RemainingFieldText";
import { SubmitDialogConstants } from "../../../utils/Constants";
import Text from "../../UI/Text";
import { useDispatch, useSelector } from "react-redux";
import RemainingFieldHeadingText from "../../UI/RemainingFieldHeadingText";
import { checkMandatoryForMatching } from "../../../utils/checkMandatory";

const RemainingnMatching = ({ singleCustomerData }) => {
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

  const { isValid, isValidRoomForRefnishing, isValidRoomInstallation } =
    checkMandatoryForMatching(
      dispatch,
      singleCustomerData,
      "",
      notFilledOutBtns
    );

  const scope = singleCustomerData?.scope;
  const matching_refinishing_checklists =
    singleCustomerData?.matching_refinishing_checklists;
  const matching_installation_checklists =
    singleCustomerData?.matching_installation_checklists;

  const refinishingIsPart = scope?.refinishing?.are_we_matching;
  const installationIsPart = scope?.installation?.are_we_matching;

  let inValidRoomsForRef = [];
  let inValidRoomsForIns = [];

  if (singleCustomerData?.scope?.floors?.length > 0) {
    for (const floor of singleCustomerData?.scope?.floors) {
      if (floor?.rooms) {
        for (const room of floor?.rooms) {
          if (
            refinishingIsPart &&
            room?.matching_refinishing_checklists_id === ""
          ) {
            inValidRoomsForRef?.push(room?.name);
          }
          if (
            installationIsPart &&
            room?.matching_installation_checklists_id === ""
          ) {
            inValidRoomsForIns?.push(room?.name);
          }
        }
      }
    }
  }

  let mainQueFilled = [];

  matching_refinishing_checklists?.map((cl, idx) => {
    cl?.all_questions?.map((que) => {
      if (
        que?.mandatory &&
        (que?.answer === "none" ||
          que?.answer === "" ||
          que?.answer?.length === 0)
      ) {
        let clname = `refcl + ${idx}`;
        mainQueFilled.push(clname);
      }
    });
  });

  let insMainQueFilled = [];

  matching_installation_checklists?.map((cl, idx) => {
    cl?.all_questions?.map((que) => {
      if (
        que?.mandatory &&
        (que?.answer === "none" ||
          que?.answer === "" ||
          que?.answer?.length === 0)
      ) {
        let clname = `insCl + ${idx}`;
        insMainQueFilled.push(clname);
      }
    });
  });

  return (
    <>
      {refinishingIsPart && (
        <div>
          {(mainQueFilled?.length > 0 || inValidRoomsForRef?.length > 0) && (
            <RemainingFieldHeadingText
              className={`text-black font-semibold text-[18px] bg-[#80808052] w-full p-[8px] text-start rounded-[4px] mb-2`}
            >
              Matching Refinishing Checklists
            </RemainingFieldHeadingText>
          )}
          {matching_refinishing_checklists?.map((cl, clIndex) => {
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
                        subQue?.answer === "none"
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
                        Matching Refinishing Checklist {clIndex + 1}
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
                        return que?.subQuestion?.map((subQue, subIdx) => {
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

          {inValidRoomsForRef?.length > 0 && (
            <div className="text-md mt-5 bg-[#ff00002e] p-2 rounded-md">
              <Text className="text-[15px]">
                {" "}
                - Following rooms don't have Refinishing checklist
              </Text>
              <ul className="ml-4 mt-1">
                {inValidRoomsForRef?.map((room) => (
                  <li className="custom-bullet-point font-semibold">{room}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {installationIsPart && (
        <div className="mt-3">
          {(insMainQueFilled?.length > 0 || inValidRoomsForIns?.length > 0) && (
            <RemainingFieldHeadingText
              className={`text-black font-semibold text-[18px] bg-[#80808052] w-full p-[8px] text-start rounded-[4px] mb-2`}
            >
              Matching Installation Checklists
            </RemainingFieldHeadingText>
          )}
          {matching_installation_checklists?.map((cl, clIndex) => {
            if (cl?.all_questions) {
              let insMainQueFilled = true;
              let insSubQueFilled = true;

              cl?.all_questions?.map((que) => {
                if (
                  que?.mandatory &&
                  (que?.answer === "none" ||
                    que?.answer === "" ||
                    que?.answer?.length === 0)
                ) {
                  insMainQueFilled = false;
                } else {
                  if (que?.subQuestion) {
                    que?.subQuestion?.map((subQue) => {
                      if (subQue?.mandatory && subQue?.answer === "none") {
                        insSubQueFilled = false;
                      }
                    });
                  }
                }
              });

              return (
                <div>
                  {(!insMainQueFilled || !insSubQueFilled) && (
                    <div className={`flex items-center gap-2 my-3`}>
                      <div
                        className={`!w-[30px] h-[30px] rounded-full flex-none `}
                        style={{ backgroundColor: cl?.color }}
                      ></div>
                      <Text className="font-semibold">
                        Matching Installation Checklist {clIndex + 1}
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
                        let leftSubQueArr = que?.subQuestion?.filter(
                          (que) =>
                            que?.answer === "none" ||
                            que?.answer === "" ||
                            que?.answer?.length === 0
                        );

                        return leftSubQueArr?.map((subQue, subIdx) => {
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
          {inValidRoomsForIns?.length > 0 && (
            <div className="text-md mt-5 bg-[#ff00002e] p-2 rounded-md">
              <Text className="text-[15px]">
                {" "}
                - Following rooms don't have Installation checklist
              </Text>
              <ul className="ml-4 mt-1">
                {inValidRoomsForIns?.map((room) => (
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

export default RemainingnMatching;
