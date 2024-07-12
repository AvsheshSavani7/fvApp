import React from "react";
import _ from "lodash";
import RemainingFieldText from "../../UI/RemainingFieldText";
import { SubmitDialogConstants } from "../../../utils/Constants";
import Text from "../../UI/Text";
import RemainingFieldHeadingText from "../../UI/RemainingFieldHeadingText";
import Image from "../../UI/Image";

const GlobalRemainingContent = ({ clObject }) => {
  const getIcon = () => {
    return <Image src={SubmitDialogConstants.CROSS_ICON_URL} />;
  };

  const renderInvalidContentInside = React.useMemo(() => {
    return ["Levelling", "Staircase"];
  }, []);

  const getInvalidContent = React.useCallback((title, invalidRooms) => {
    const levellingTitle = title?.includes("Levelling");
    const staircaseTitle = title?.includes("Staircase");
    const transitionTitle = title?.includes("Transition");

    if (levellingTitle || staircaseTitle || transitionTitle) {
      return (
        <div className="my-3">
          <div className="text-md mt-5 bg-[#ff00002e] p-2 rounded-md block">
            <Text>
              - {invalidRooms?.join(", ")} isn't being applied in any{" "}
              {staircaseTitle ? "floor" : "room"}
            </Text>
          </div>
        </div>
      );
    } else {
      return (
        <div className="my-3">
          <div className="text-md mt-5 bg-[#ff00002e] p-2 rounded-md block">
            <Text> - Following rooms don't have {title}</Text>
            <ul className="ml-4 mt-1">
              {invalidRooms?.map((room) => (
                <li className="custom-bullet-point font-semibold">{room}</li>
              ))}
            </ul>
          </div>
        </div>
      );
    }
  }, []);

  return (
    <>
      {Object.keys(clObject)?.map((clTitle) => {
        const curCLObj = clObject[clTitle];
        const invalidRooms = curCLObj.inValidRooms;

        const allCl = _.pickBy(curCLObj, (_value, key) => {
          return key !== "inValidRooms";
        });

        console.log(invalidRooms, "invalidRooms=");

        return (
          <div key={clTitle} className="my-2">
            <RemainingFieldHeadingText
              className={`text-black font-semibold text-[18px] bg-[#80808052] w-full p-[8px] text-start rounded-[4px] mb-2`}
            >
              {clTitle}
            </RemainingFieldHeadingText>
            <div>
              {Object.keys(allCl)?.map((cl, idx) => {
                const clQues = curCLObj[cl];

                return (
                  <React.Fragment key={idx}>
                    <div className={`flex items-center gap-2 my-3`}>
                      {clQues?.[0]?.color ? (
                        <div
                          className={`!w-[30px] h-[30px] rounded-full flex-none `}
                          style={{ backgroundColor: clQues?.[0]?.color }}
                        ></div>
                      ) : (
                        <div>-</div>
                      )}
                      <Text className="font-semibold">{cl}</Text>
                    </div>
                    {clQues?.map((que, mainQueIndex) => {
                      return (
                        <div
                          className={`ml-[${SubmitDialogConstants.MAINQUE_MARGIN_LEFT}px]`}
                          key={que?.question || mainQueIndex}
                        >
                          <div
                            className={`flex items-center gap-${SubmitDialogConstants.GAP_WITH_CROSS_ICON}`}
                          >
                            <div className="">{getIcon(que?.answer)}</div>
                            <RemainingFieldText className={``}>
                              {que?.question}
                            </RemainingFieldText>
                          </div>
                          {que?.subQuestion?.length > 0 &&
                            que?.subQuestion?.map((subque, subQueIndex) => {
                              return (
                                <React.Fragment
                                  key={subque?.question || subQueIndex}
                                >
                                  <div
                                    className={`flex items-center gap-${SubmitDialogConstants.GAP_WITH_CROSS_ICON} ml-[${SubmitDialogConstants.SUBQUE_MARGIN_LEFT}px] my-${SubmitDialogConstants.MARGIN_Y}`}
                                  >
                                    <div className="">{getIcon()}</div>
                                    <RemainingFieldText className={``}>
                                      {subque?.question}
                                    </RemainingFieldText>
                                  </div>
                                  {subque?.subQuestion?.length > 0 &&
                                    subque?.subQuestion.map(
                                      (subofsubque, subofsubQueIndex) => {
                                        return (
                                          <div
                                            key={
                                              subofsubque?.question ||
                                              subofsubQueIndex
                                            }
                                            className={`flex items-center gap-${SubmitDialogConstants.GAP_WITH_CROSS_ICON} ml-[46px] my-${SubmitDialogConstants.MARGIN_Y}`}
                                          >
                                            <div className="">{getIcon()}</div>
                                            <RemainingFieldText className={``}>
                                              {subofsubque?.question}
                                            </RemainingFieldText>
                                          </div>
                                        );
                                      }
                                    )}
                                </React.Fragment>
                              );
                            })}
                        </div>
                      );
                    })}
                  </React.Fragment>
                );
              })}
              {renderInvalidContentInside.includes(clTitle) &&
                invalidRooms?.length > 0 &&
                getInvalidContent(clTitle, invalidRooms)}
            </div>
            {!renderInvalidContentInside.includes(clTitle) &&
              invalidRooms?.length > 0 &&
              getInvalidContent(clTitle, invalidRooms)}
          </div>
        );
      })}
    </>
  );
};

export default GlobalRemainingContent;
