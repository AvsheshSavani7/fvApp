import React from "react";
import Image from "../../UI/Image";
import RemainingFieldText from "../../UI/RemainingFieldText";
import { SubmitDialogConstants } from "../../../utils/Constants";
import Text from "../../UI/Text";
import { useDispatch, useSelector } from "react-redux";
import RemainingFieldHeadingText from "../../UI/RemainingFieldHeadingText";
import { checkMandatoryForChecklist } from "../../../utils/checkMandatory";

const RemainingChecklist = ({ singleCustomerData }) => {
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

  const { isValid, isValidRoom } = checkMandatoryForChecklist(
    dispatch,
    singleCustomerData,
    "",
    notFilledOutBtns
  );

  const checklists = singleCustomerData?.refinishing_checklists;
  const refinishingChecklistlIsPart =
    singleCustomerData?.scope?.refinishing?.is_part;

  let inValidRooms = [];
  if (singleCustomerData?.scope?.floors?.length > 0) {
    for (const floor of singleCustomerData?.scope?.floors) {
      if (floor?.rooms) {
        for (const room of floor?.rooms) {
          if (room?.refinishing_checklists_id === "") {
            inValidRooms?.push(room?.name);
          }
        }
      }
    }
  }

  return (
    <>
      {refinishingChecklistlIsPart && checklists?.length > 0 && (
        <div>
          {(!isValid || !isValidRoom) && (
            <RemainingFieldHeadingText
              className={`text-black font-semibold text-[18px] bg-[#80808052] w-full p-[8px] text-start rounded-[4px] mb-2`}
            >
              Refinishing Checklists
            </RemainingFieldHeadingText>
          )}
          {checklists?.map((cl, clIndex) => {
            if (cl?.all_questions) {
              let mainQueFilled = true;
              let subQueFilled = true;

              cl?.all_questions?.map((que) => {
                if (
                  que?.question ===
                    "Excessive damage (ex. pet stains,cracked boards)" ||
                  que?.question === "Surface issues ( ex. mastic, paint, wax)"
                ) {
                  if (que?.answer === "none") {
                    mainQueFilled = false;
                  } else {
                    if (que?.answer === true) {
                      let subQuestionFilled = que?.subQuestion?.some(
                        (subQue) => subQue?.answer === true
                      );
                      if (!subQuestionFilled) {
                        subQueFilled = false;
                      }
                    }
                  }
                } else {
                  if (que?.mandatory && que?.answer === "none") {
                    mainQueFilled = false;
                  } else {
                    if (que?.subQuestion) {
                      que?.subQuestion?.map((subQue) => {
                        if (
                          subQue?.mandatory &&
                          subQue?.whenToShow === que?.answer
                        ) {
                          if (
                            subQue?.answer === "none" ||
                            subQue?.answer === ""
                          ) {
                            subQueFilled = false;
                          } else {
                            if (subQue?.subQuestion) {
                              subQue?.subQuestion?.map((subofsubQue) => {
                                if (
                                  subofsubQue?.mandatory &&
                                  subofsubQue?.whenToShow === subQue?.answer &&
                                  (subofsubQue?.answer === "none" ||
                                    subofsubQue?.answer?.length === 0 ||
                                    subofsubQue?.answer === "")
                                ) {
                                  subQueFilled = false;
                                }
                              });
                            }
                          }
                        }
                      });
                    }
                  }
                }
              });

              return (
                <div className="">
                  {(!mainQueFilled || !subQueFilled) && (
                    <div className={`flex items-center gap-2 my-3`}>
                      <div
                        className={`!w-[30px] h-[30px] rounded-full flex-none `}
                        style={{ backgroundColor: cl?.color }}
                      ></div>
                      <Text className="font-semibold">
                        Checklist {clIndex + 1}
                      </Text>
                    </div>
                  )}
                  {cl?.all_questions?.map((que, idx) => {
                    if (que?.mandatory && que?.answer === "none") {
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
                        que?.question ===
                          "Excessive damage (ex. pet stains,cracked boards)" ||
                        que?.question ===
                          "Surface issues ( ex. mastic, paint, wax)"
                      ) {
                        if (que?.answer === true) {
                          let allSubQueNotFilled = que?.subQuestion?.some(
                            (subQue) => subQue?.answer === true
                          );

                          if (!allSubQueNotFilled) {
                            return (
                              <div
                                className={`my-1 ml-[${SubmitDialogConstants.MAINQUE_MARGIN_LEFT}px]`}
                              >
                                <div
                                  className={`flex items-center gap-${SubmitDialogConstants.GAP_WITH_CROSS_ICON}`}
                                >
                                  <div className="">{getIcon(que?.answer)}</div>
                                  <RemainingFieldText className={``}>
                                    {que?.question}
                                  </RemainingFieldText>
                                </div>
                                <div
                                  className={`flex items-center gap-${SubmitDialogConstants.GAP_WITH_CROSS_ICON} ml-[${SubmitDialogConstants.SUBQUE_MARGIN_LEFT}px] my-${SubmitDialogConstants.MARGIN_Y}`}
                                >
                                  <div className="">{getIcon("")}</div>
                                  <RemainingFieldText className={``}>
                                    Please fill out at least one sub question
                                  </RemainingFieldText>
                                </div>
                              </div>
                            );
                          }
                        }
                      } else {
                        if (
                          que?.mandatory &&
                          que?.subQuestion &&
                          que?.subQuestion?.length > 0
                        ) {
                          let leftSubQues = que?.subQuestion?.filter(
                            (subque) =>
                              subque?.mandatory &&
                              subque?.whenToShow === que?.answer &&
                              (subque?.answer === "none" ||
                                subque?.answer === "" ||
                                subque?.answer?.length === 0)
                          );

                          let filledSubQues = que?.subQuestion?.filter(
                            (subque) =>
                              subque?.mandatory &&
                              subque?.whenToShow === que?.answer &&
                              (subque?.answer !== "none" ||
                                subque?.answer !== "" ||
                                subque?.answer?.length !== 0)
                          );

                          if (leftSubQues?.length > 0) {
                            return leftSubQues?.map((subQue, subIdx) => {
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

                          if (filledSubQues?.length > 0) {
                            return filledSubQues?.map((filledSubque) => {
                              const leftSubofSubQue =
                                filledSubque?.subQuestion?.filter(
                                  (subque) =>
                                    subque.mandatory &&
                                    subque?.whenToShow ===
                                      filledSubque?.answer &&
                                    (subque?.answer === "none" ||
                                      subque?.answer === "" ||
                                      subque?.answer?.length === 0)
                                );

                              return leftSubofSubQue?.map(
                                (subofsub, subofsubidx) => {
                                  return (
                                    <div
                                      className={`my-1 ml-[${SubmitDialogConstants.MAINQUE_MARGIN_LEFT}px]`}
                                    >
                                      {subofsubidx === 0 && (
                                        <>
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
                                          <div
                                            className={`flex items-center gap-${SubmitDialogConstants.GAP_WITH_CROSS_ICON} ml-[${SubmitDialogConstants.SUBQUE_MARGIN_LEFT}px] my-${SubmitDialogConstants.MARGIN_Y}`}
                                          >
                                            <div className="">
                                              {getIcon(que?.answer)}
                                            </div>
                                            <RemainingFieldText className={``}>
                                              {filledSubque?.question}
                                            </RemainingFieldText>
                                          </div>
                                        </>
                                      )}
                                      <div
                                        className={`flex items-center gap-${SubmitDialogConstants.GAP_WITH_CROSS_ICON} ml-[46px] my-${SubmitDialogConstants.MARGIN_Y}`}
                                      >
                                        <div className="">{getIcon("")}</div>
                                        <RemainingFieldText className={``}>
                                          {subofsub?.question}
                                        </RemainingFieldText>
                                      </div>
                                    </div>
                                  );
                                }
                              );
                            });
                          }
                        }
                      }
                    }
                  })}
                </div>
              );
            }
          })}
          {inValidRooms?.length > 0 && (
            <div className="text-md mt-5 bg-[#ff00002e] p-2 rounded-md block">
              <Text> - Following rooms don't have refinishing checklist</Text>
              <ul className="ml-4 mt-1">
                {inValidRooms?.map((room) => (
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

export default RemainingChecklist;
