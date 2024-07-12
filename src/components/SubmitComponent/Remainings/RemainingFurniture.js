import React from "react";
import Image from "../../UI/Image";
import RemainingFieldText from "../../UI/RemainingFieldText";
import { SubmitDialogConstants } from "../../../utils/Constants";
import { useDispatch, useSelector } from "react-redux";
import RemainingFieldHeadingText from "../../UI/RemainingFieldHeadingText";
import { checkMandatoryForFurniture } from "../../../utils/checkMandatory";

const RemainingFurniture = ({ singleCustomerData }) => {
  const notFilledOutBtns = useSelector(
    (state) => state.customerReducer.notFilledOutBtns
  );
  const dispatch = useDispatch();

  const getIcon = (answer) => {
    return <Image src={SubmitDialogConstants.CROSS_ICON_URL} />;
  };

  const { isValidKitchen, isValidSpecialItems } = checkMandatoryForFurniture(
    dispatch,
    singleCustomerData,
    "",
    notFilledOutBtns
  );

  const scope = singleCustomerData?.scope;
  const kitchen_furnitures = singleCustomerData?.kitchen_furnitures;
  const specialItem_furnitures = singleCustomerData?.specialItem_furnitures;

  let isRoomExist = false;

  if (scope?.floors?.length > 0) {
    for (const floor of scope?.floors) {
      if (floor?.rooms?.length > 0) {
        isRoomExist = true;
        break;
      }
    }
  }

  let mainQueFilled = false;
  let subQueFilled = true;

  specialItem_furnitures?.map((cl) => {
    cl?.all_questions?.map((que) => {
      if (que?.answer === true) {
        mainQueFilled = true;
        if (que?.subQuestion) {
          que?.subQuestion?.map((subQue) => {
            if (
              subQue?.mandatory &&
              subQue?.whenToShow === que?.answer &&
              (subQue?.answer === "" || subQue?.answer?.length === 0)
            ) {
              subQueFilled = false;
            }
          });
        }
      }
    });
  });

  let kitchenMainQueFilled = false;
  let kitchenSubQueFilled = true;

  kitchen_furnitures?.map((cl) => {
    cl?.all_questions?.map((que) => {
      if (que?.answer === true) {
        kitchenMainQueFilled = true;
        if (que?.subQuestion) {
          que?.subQuestion?.map((subQue) => {
            if (
              subQue?.mandatory &&
              subQue?.whenToShow === que?.answer &&
              (subQue?.answer === "none" ||
                subQue?.answer === false ||
                subQue?.answer === "" ||
                subQue?.answer?.length === 0)
            ) {
              kitchenSubQueFilled = false;
            }
          });
        }
      }
    });
  });

  return (
    <>
      {!isValidKitchen && (
        <div>
          {kitchen_furnitures?.length > 0 &&
            (!kitchenMainQueFilled || !kitchenSubQueFilled) && (
              <RemainingFieldHeadingText
                className={`text-black font-semibold text-[18px] bg-[#80808052] w-full p-[8px] text-start rounded-[4px] my-2`}
              >
                Kitchen Furniture
              </RemainingFieldHeadingText>
            )}
          {kitchen_furnitures?.length > 0 &&
            kitchen_furnitures?.map((cl) => {
              if (cl?.all_questions) {
                let oneQueIsFilledOut = cl?.all_questions?.some(
                  (subQue) => subQue?.answer === true
                );

                if (oneQueIsFilledOut) {
                  return (
                    <div>
                      {cl?.all_questions?.map((que, idx) => {
                        if (
                          que?.answer === true &&
                          que?.subQuestion?.length > 0
                        ) {
                          let leftSubQues = que?.subQuestion?.filter(
                            (subQue) =>
                              subQue?.whenToShow === que?.answer &&
                              (subQue?.answer === "none" ||
                                subQue?.answer === false ||
                                subQue?.answer === "" ||
                                subQue?.answer?.length === 0)
                          );

                          return leftSubQues?.map((subQue, subIdx) => {
                            if (
                              subQue?.mandatory &&
                              subQue?.whenToShow === que?.answer &&
                              (subQue?.answer === "none" ||
                                subQue?.answer === false ||
                                subQue?.answer === "" ||
                                subQue?.answer?.length === 0)
                            ) {
                              return (
                                <div className="my-1">
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
                                    className={`flex items-center gap-${SubmitDialogConstants.GAP_WITH_CROSS_ICON} ml-[${SubmitDialogConstants.SUBQUE_MARGIN_LEFT}px] mt-1`}
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
                      })}
                    </div>
                  );
                } else {
                  return (
                    <div>
                      <div className="my-1">
                        <div
                          className={`flex items-center gap-${SubmitDialogConstants.GAP_WITH_CROSS_ICON}`}
                        >
                          <div className="">{getIcon("")}</div>
                          <RemainingFieldText className={``}>
                            At least one Kitchen furniture should be there.
                          </RemainingFieldText>
                        </div>
                      </div>
                    </div>
                  );
                }
              }
            })}
        </div>
      )}
      {!isValidSpecialItems && (
        <div className="mt-3">
          {specialItem_furnitures?.length > 0 &&
            (!mainQueFilled || !subQueFilled) && (
              <RemainingFieldHeadingText
                className={`text-black font-semibold text-[18px] bg-[#80808052] w-full p-[8px] text-start rounded-[4px] mb-2`}
              >
                Special items Furniture
              </RemainingFieldHeadingText>
            )}
          {specialItem_furnitures?.map((cl) => {
            if (cl?.all_questions) {
              let oneQueIsFilledOut = cl?.all_questions?.some(
                (subQue) => subQue?.answer === true
              );

              if (oneQueIsFilledOut) {
                return (
                  <div>
                    {cl?.all_questions?.map((que, idx) => {
                      if (
                        que?.answer === true &&
                        que?.subQuestion?.length > 0
                      ) {
                        let leftSubQues = que?.subQuestion?.filter(
                          (subQue) =>
                            subQue?.whenToShow === que?.answer &&
                            (subQue?.answer === "none" ||
                              subQue?.answer === false ||
                              subQue?.answer === "" ||
                              subQue?.answer?.length === 0)
                        );

                        return leftSubQues?.map((subQue, subIdx) => {
                          if (
                            subQue?.mandatory &&
                            subQue?.whenToShow === que?.answer &&
                            (subQue?.answer === "none" ||
                              subQue?.answer === false ||
                              subQue?.answer === "" ||
                              subQue?.answer?.length === 0)
                          ) {
                            return (
                              <div className="my-1">
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
                                  className={`flex items-center gap-${SubmitDialogConstants.GAP_WITH_CROSS_ICON} ml-[${SubmitDialogConstants.SUBQUE_MARGIN_LEFT}px] mt-1`}
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
                    })}
                  </div>
                );
              } else {
                return (
                  <div>
                    <div className="my-1">
                      <div
                        className={`flex items-center gap-${SubmitDialogConstants.GAP_WITH_CROSS_ICON}`}
                      >
                        <div className="">{getIcon("")}</div>
                        <RemainingFieldText className={``}>
                          At least one Special item should be there.
                        </RemainingFieldText>
                      </div>
                    </div>
                  </div>
                );
              }
            }
          })}
        </div>
      )}
    </>
  );
};

export default RemainingFurniture;
