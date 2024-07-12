import React from "react";
import Image from "../../UI/Image";
import RemainingFieldText from "../../UI/RemainingFieldText";
import { SubmitDialogConstants } from "../../../utils/Constants";
import RemainingFieldHeadingText from "../../UI/RemainingFieldHeadingText";
import _ from "lodash";
import { ImportantFieldQues } from "../../../utils/importantFields";

const NewRemainingCustomerDetails = ({
  customerDetailsObj,
  mode,
  oneIsExist,
}) => {
  const getIcon = (answer) => {
    return <Image src={SubmitDialogConstants.CROSS_ICON_URL} />;
  };

  return (
    <div>
      {(_.size(customerDetailsObj) > 0 || !oneIsExist) && (
        <RemainingFieldHeadingText
          className={`text-black font-semibold text-[18px] bg-[#80808052] w-full p-[8px] text-start rounded-[4px] mb-2`}
        >
          Customer Details
        </RemainingFieldHeadingText>
      )}
      {Object.keys(customerDetailsObj)?.map((customer) => {
        return (
          <div className="mt-1">
            {mode === "important"
              ? ImportantFieldQues.includes(customer)
                ? !customerDetailsObj?.[customer]?.answer && (
                    <div className="flex items-center gap-2">
                      <div className="">
                        {getIcon(customerDetailsObj[customer]?.answer)}
                      </div>
                      <RemainingFieldText
                        className={`"capitalize text-[14px]"`}
                      >
                        {customer}
                      </RemainingFieldText>
                    </div>
                  )
                : ""
              : (customer === "Name" || customer === "Building Type") &&
                typeof customerDetailsObj?.[customer] === "string" &&
                !customerDetailsObj?.[customer]?.answer && (
                  <div className="flex items-center gap-2">
                    <div className="">
                      {getIcon(customerDetailsObj[customer]?.answer)}
                    </div>
                    <RemainingFieldText className={`"capitalize text-[14px]"`}>
                      {customer}
                    </RemainingFieldText>
                  </div>
                )}
            {customerDetailsObj?.[customer]?.subQuestion?.map((subQue, idx) => {
              if (
                subQue?.[mode] &&
                (subQue?.answer === "none" || subQue?.answer === "")
              ) {
                return (
                  <>
                    <div className={`my-1`}>
                      <div
                        className={`flex items-center gap-${SubmitDialogConstants.GAP_WITH_CROSS_ICON}`}
                      >
                        <div className="">{getIcon("")}</div>
                        <RemainingFieldText className={``}>
                          Builing Type
                        </RemainingFieldText>
                      </div>
                    </div>

                    <div
                      className={`flex items-center gap-2 ml-[${SubmitDialogConstants.SUBQUE_MARGIN_LEFT}px] my-${SubmitDialogConstants.MARGIN_Y}`}
                    >
                      <div className="">{getIcon(subQue?.answer)}</div>
                      <RemainingFieldText>
                        {subQue?.question}
                      </RemainingFieldText>
                    </div>
                  </>
                );
              } else if (
                subQue?.[mode] &&
                subQue?.subQuestion &&
                subQue?.subQuestion?.length > 0
              ) {
                return subQue?.subQuestion?.map((subofsub, idx) => {
                  if (
                    subofsub?.[mode] &&
                    subofsub?.whenToShow === subQue?.answer &&
                    subofsub?.answer?.length === 0
                  ) {
                    return (
                      <div
                        className={`ml-[${SubmitDialogConstants.SUBQUE_MARGIN_LEFT}px] mt-1`}
                      >
                        {idx === 0 && (
                          <div className="flex items-center gap-2">
                            <div className="">{getIcon(subQue?.answer)}</div>
                            <RemainingFieldText>
                              {subQue?.question}
                            </RemainingFieldText>
                          </div>
                        )}
                        <div
                          className={`flex items-center gap-2 ml-[${SubmitDialogConstants.SUBQUE_MARGIN_LEFT}px] my-${SubmitDialogConstants.MARGIN_Y}`}
                        >
                          <div className="">{getIcon(subofsub?.answer)}</div>
                          <RemainingFieldText>
                            {subofsub?.question}
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
      })}
      {!oneIsExist && mode === "mandatory" && (
        <div className="flex items-center gap-2">
          <div className="">{getIcon("")}</div>
          <RemainingFieldText className={`"capitalize text-[14px]"`}>
            Either Refinishing or Installation must be the part of project
          </RemainingFieldText>
        </div>
      )}
    </div>
  );
};

export default NewRemainingCustomerDetails;
