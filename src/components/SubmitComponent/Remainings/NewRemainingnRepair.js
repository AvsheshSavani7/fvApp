import React from "react";
import Image from "../../UI/Image";
import RemainingFieldText from "../../UI/RemainingFieldText";
import { SubmitDialogConstants } from "../../../utils/Constants";
import Text from "../../UI/Text";
import RemainingFieldHeadingText from "../../UI/RemainingFieldHeadingText";

const NewRemainingnRepair = ({
  singleCustomerData,
  inValidRepairs,
  isValidRepairForm,
}) => {
  const getIcon = () => {
    return <Image src={SubmitDialogConstants.CROSS_ICON_URL} />;
  };
  const repairs = singleCustomerData?.repairs;

  return (
    <>
      <div>
        {(inValidRepairs?.length > 0 || !isValidRepairForm) && (
          <RemainingFieldHeadingText
            className={`text-black font-semibold text-[18px] bg-[#80808052] w-full p-[8px] text-start rounded-[4px] mb-2`}
          >
            Items of Interest
          </RemainingFieldHeadingText>
        )}
        {repairs?.map((repair, clIndex) => {
          return (
            <div>
              {(repair?.repair_description == "" ||
                repair?.images?.length === 0 ||
                inValidRepairs?.includes(`repair + ${clIndex + 1}`)) && (
                <div className={`flex items-center gap-2 my-3`}>
                  <span className="ml-2"> - </span>
                  <Text className="font-semibold">
                    Items of Interest {clIndex + 1}
                  </Text>
                </div>
              )}
              {repair?.repair_description === "" && (
                <div
                  className={`my-1 ml-[${SubmitDialogConstants.MAINQUE_MARGIN_LEFT}px]`}
                >
                  <div
                    className={`flex items-center gap-${SubmitDialogConstants.GAP_WITH_CROSS_ICON}`}
                  >
                    <div className="">{getIcon("")}</div>
                    <RemainingFieldText className={``}>
                      Items of Interest Description
                    </RemainingFieldText>
                  </div>
                </div>
              )}
              {repair?.images?.length === 0 && (
                <div
                  className={`ml-[${SubmitDialogConstants.MAINQUE_MARGIN_LEFT}px]`}
                >
                  <div
                    className={`flex items-center gap-${SubmitDialogConstants.GAP_WITH_CROSS_ICON}`}
                  >
                    <div className="">{getIcon("")}</div>
                    <RemainingFieldText className={``}>
                      Items of Interest Images
                    </RemainingFieldText>
                  </div>
                </div>
              )}
              {inValidRepairs?.length > 0 &&
                inValidRepairs?.includes(`repair ${clIndex + 1}`) && (
                  <div className="text-md mt-3 bg-[#ff00002e] p-2 rounded-md">
                    <Text className="text-[15px] ml-1">
                      {`Items of interest ${
                        clIndex + 1
                      } isn't being applied in any room.`}
                    </Text>
                  </div>
                )}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default NewRemainingnRepair;
