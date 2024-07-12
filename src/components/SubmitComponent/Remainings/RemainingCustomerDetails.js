import React, { useMemo } from "react";
import Image from "../../UI/Image";
import RemainingFieldText from "../../UI/RemainingFieldText";
import { SubmitDialogConstants } from "../../../utils/Constants";
import RemainingFieldHeadingText from "../../UI/RemainingFieldHeadingText";
import _ from "lodash";
import { useDispatch, useSelector } from "react-redux";
import { checkMandatoryForCustomerDetails } from "../../../utils/checkMandatory";

const RemainingCustomerDetails = ({
  customerDetailsObj,
  singleCustomerData,
}) => {
  const notFilledOutBtns = useSelector(
    (state) => state.customerReducer.notFilledOutBtns
  );
  const dispatch = useDispatch();

  const getIcon = (answer) => {
    return <Image src={SubmitDialogConstants.CROSS_ICON_URL} />;
    // if (
    //   answer === "" ||
    //   answer === "none" ||
    //   answer === false ||
    //   answer?.length === 0
    // ) {
    //   return <Image src={SubmitDialogConstants.CROSS_ICON_URL} />;
    // } else {
    //   return <Image src={SubmitDialogConstants.CHECK_ICON_URL} />;
    // }
  };

  const { isValidCustomer, isValidRefOrIns } = checkMandatoryForCustomerDetails(
    dispatch,
    singleCustomerData,
    notFilledOutBtns
  );

  const refinishingChecklistlIsPart =
    singleCustomerData?.scope?.refinishing?.is_part;
  const installationIsPart = singleCustomerData?.scope?.installation?.is_part;

  let oneIsExist = useMemo(() => {
    if (refinishingChecklistlIsPart || installationIsPart) {
      return true;
    } else {
      return false;
    }
  }, [singleCustomerData]);

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
        if (customerDetailsObj[customer]) {
          return (
            <div className="mt-1">
              {customerDetailsObj[customer]?.answer && (
                <div className="flex items-center gap-2">
                  <div className="">
                    {getIcon(customerDetailsObj[customer]?.answer)}
                  </div>
                  <RemainingFieldText className={`"capitalize text-[14px]"`}>
                    {customer}
                  </RemainingFieldText>
                </div>
              )}
              {customerDetailsObj[customer]?.subQuestion?.map((subQue) => {
                if (
                  subQue?.mandatory &&
                  (subQue?.answer === false || subQue?.answer === "")
                ) {
                  return (
                    <div
                      className={`flex items-center gap-2 ml-[${SubmitDialogConstants.SUBQUE_MARGIN_LEFT}px] my-${SubmitDialogConstants.MARGIN_Y}`}
                    >
                      <div className="">{getIcon(subQue?.answer)}</div>
                      <RemainingFieldText>
                        {subQue?.question}
                      </RemainingFieldText>
                    </div>
                  );
                } else if (
                  subQue?.mandatory &&
                  subQue?.subQuestion &&
                  subQue?.subQuestion?.length > 0
                ) {
                  return subQue?.subQuestion?.map((subofsub, idx) => {
                    if (subofsub?.mandatory && subofsub?.answer?.length === 0) {
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
        } else {
          return (
            <div className="flex items-center gap-2 mt-1">
              <div className="">
                <Image src={SubmitDialogConstants.CROSS_ICON_URL} />
              </div>
              <RemainingFieldText>{customer}</RemainingFieldText>
            </div>
          );
        }
      })}
      {!oneIsExist && (
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

export default RemainingCustomerDetails;
