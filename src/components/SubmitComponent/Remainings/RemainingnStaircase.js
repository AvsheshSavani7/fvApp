import React from "react";
import Image from "../../UI/Image";
import RemainingFieldText from "../../UI/RemainingFieldText";
import { SubmitDialogConstants } from "../../../utils/Constants";
import Text from "../../UI/Text";
import { useDispatch, useSelector } from "react-redux";
import RemainingFieldHeadingText from "../../UI/RemainingFieldHeadingText";
import { checkMandatoryForStaricase } from "../../../utils/checkMandatory";

const RemainingnStaircase = ({ singleCustomerData }) => {
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

  const staircases = singleCustomerData?.staircases;

  const { isValid, isStaircaseExistInRoom } = checkMandatoryForStaricase(
    dispatch,
    singleCustomerData,
    "",
    notFilledOutBtns
  );

  let inValidStaircase = [];

  if (staircases?.length > 0) {
    staircases?.map((staircase, idx) => {
      if (staircase?.from_floor_id === "") {
        let strcase = `staircase + ${idx + 1}`;
        inValidStaircase?.push(strcase);
      }
    });
  }

  return (
    <>
      <div>
        {(!isValid || !isStaircaseExistInRoom) && (
          <RemainingFieldHeadingText
            className={`text-black font-semibold text-[18px] bg-[#80808052] w-full p-[8px] text-start rounded-[4px] mb-2`}
          >
            Staircases
          </RemainingFieldHeadingText>
        )}
        {staircases?.map((cl, clIndex) => {
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
                    <span className="ml-2"> - </span>
                    <Text className="font-semibold">
                      Staircase {clIndex + 1}
                    </Text>
                  </div>
                )}
                {cl?.all_questions?.map((que, idx) => {
                  if (
                    que?.mandatory &&
                    (que?.answer === "none" ||
                      que?.answer === "" ||
                      que?.answer === 0 ||
                      que?.answer?.length === 0)
                  ) {
                    return (
                      <div
                        className={`my-1 ml-[${SubmitDialogConstants.MAINQUE_MARGIN_LEFT}px]`}
                      >
                        <div className="">
                          <div
                            className={`flex items-center gap-${SubmitDialogConstants.GAP_WITH_CROSS_ICON}`}
                          >
                            <div className="">{getIcon("")}</div>
                            <RemainingFieldText className={``}>
                              {que?.question}
                            </RemainingFieldText>
                          </div>
                        </div>
                      </div>
                    );
                  } else {
                    if (
                      que?.mandatory &&
                      que?.subQuestion &&
                      que?.subQuestion?.length > 0
                    ) {
                      let leftSubQues = que?.subQuestion?.filter(
                        (subQue) =>
                          subQue?.mandatory &&
                          subQue?.whenToShow === que?.answer &&
                          (subQue?.answer === "none" ||
                            subQue?.answer === "" ||
                            subQue?.answer?.length === 0)
                      );

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
                                  <div className="">{getIcon(que?.answer)}</div>
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
                {mainQueFilled &&
                  subQueFilled &&
                  inValidStaircase?.includes(`staircase + ${clIndex + 1}`) && (
                    <div className={`flex items-center gap-2 my-3`}>
                      <span className="ml-2"> - </span>
                      <Text className="font-semibold">
                        Staircase {clIndex + 1}
                      </Text>
                    </div>
                  )}
                {inValidStaircase?.length > 0 &&
                  inValidStaircase?.includes(`staircase + ${clIndex + 1}`) && (
                    <div className="text-md mt-3 bg-[#ff00002e] p-2 rounded-md">
                      <Text className="text-[15px] ml-1">
                        {`Staircase ${
                          clIndex + 1
                        } isn't being applied in any floor.`}
                      </Text>
                    </div>
                  )}
              </div>
            );
          }
        })}
      </div>
    </>
  );
};

export default RemainingnStaircase;
