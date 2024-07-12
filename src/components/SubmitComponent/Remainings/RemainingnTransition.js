import React from "react";
import Image from "../../UI/Image";
import RemainingFieldText from "../../UI/RemainingFieldText";
import { SubmitDialogConstants } from "../../../utils/Constants";
import Text from "../../UI/Text";
import { useDispatch, useSelector } from "react-redux";
import RemainingFieldHeadingText from "../../UI/RemainingFieldHeadingText";
import { checkMandatoryForTransition } from "../../../utils/checkMandatory";

const RemainingnTransition = ({ singleCustomerData }) => {
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

  const transitions = singleCustomerData?.transitions;

  const { isValid, isTransitionExistInRoom } = checkMandatoryForTransition(
    dispatch,
    singleCustomerData,
    "",
    notFilledOutBtns
  );

  let inValidTransition = [];

  if (transitions?.length > 0) {
    transitions?.map((transition, idx) => {
      if (transition?.within_room_id === "") {
        if (transition?.from_room_id === "" || transition?.to_room_id === "") {
          let strcase = `transition + ${idx + 1}`;
          inValidTransition?.push(strcase);
        }
      }
    });
  }

  return (
    <>
      <div>
        {(!isValid || !isTransitionExistInRoom) && (
          <RemainingFieldHeadingText
            className={`text-black font-semibold text-[18px] bg-[#80808052] w-full p-[8px] text-start rounded-[4px] mb-2`}
          >
            Transitions
          </RemainingFieldHeadingText>
        )}
        {transitions?.map((cl, clIndex) => {
          if (cl?.all_questions) {
            let leftQues = cl?.all_questions?.filter(
              (que) =>
                que?.mandatory &&
                (que?.answer === "none" ||
                  que?.answer === "" ||
                  que?.answer?.length === 0)
            );

            return (
              <div>
                {leftQues?.map((que, idx) => {
                  if (
                    que?.mandatory &&
                    (que?.answer === "none" ||
                      que?.answer === "" ||
                      que?.answer === 0 ||
                      que?.answer?.length === 0)
                  ) {
                    return (
                      <>
                        {idx === 0 && (
                          <div className={`flex items-center gap-2 my-3`}>
                            <span className="ml-2"> - </span>
                            <Text className="font-semibold">
                              Transition {clIndex + 1}
                            </Text>
                          </div>
                        )}
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
                      </>
                    );
                  }
                })}
                {leftQues?.length === 0 &&
                  inValidTransition?.includes(
                    `transition + ${clIndex + 1}`
                  ) && (
                    <div className={`flex items-center gap-2 my-3`}>
                      <span className="ml-2"> - </span>
                      <Text className="font-semibold">
                        Transition {clIndex + 1}
                      </Text>
                    </div>
                  )}
                {inValidTransition?.length > 0 &&
                  inValidTransition?.includes(
                    `transition + ${clIndex + 1}`
                  ) && (
                    <div className="text-md mt-3 bg-[#ff00002e] p-2 rounded-md">
                      <Text className="text-[15px] ml-1">
                        {`Transition ${
                          clIndex + 1
                        } isn't being applied in any room.`}
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

export default RemainingnTransition;
