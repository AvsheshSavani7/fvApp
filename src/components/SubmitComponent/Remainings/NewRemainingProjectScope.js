import React from "react";
import Image from "../../UI/Image";
import RemainingFieldText from "../../UI/RemainingFieldText";
import { SubmitDialogConstants } from "../../../utils/Constants";
import RemainingFieldHeadingText from "../../UI/RemainingFieldHeadingText";
import { useDispatch, useSelector } from "react-redux";
import { checkMandatoryForProjectScope } from "../../../utils/checkMandatory";

const NewRemainingProjectScope = ({ projectScopeObj, singleCustomerData }) => {
  const notFilledOutBtns = useSelector(
    (state) => state.customerReducer.notFilledOutBtns
  );
  const dispatch = useDispatch();

  const getIcon = (answer) => {
    return <Image src={SubmitDialogConstants.CROSS_ICON_URL} />;
  };

  const isValidProject = React.useMemo(() => {
    let floors = singleCustomerData?.scope?.floors;
    if (floors?.length > 0) {
      const isValid = floors?.some((floor) => floor?.rooms?.length > 0);
      return isValid;
    } else {
      return false;
    }
  }, [singleCustomerData]);

  return (
    <div>
      {!isValidProject && (
        <RemainingFieldHeadingText
          className={`text-black font-semibold text-[18px] bg-[#80808052] w-full p-[8px] text-start rounded-[4px] mb-2`}
        >
          Project Scope
        </RemainingFieldHeadingText>
      )}
      {projectScopeObj.floorExist ? (
        projectScopeObj.roomExist ? (
          <></>
        ) : (
          <>
            <div
              className={`flex items-center gap-${SubmitDialogConstants.GAP_WITH_CROSS_ICON} my-2`}
            >
              <div className="">{getIcon(true)}</div>
              <RemainingFieldText className={`"capitalize text-[14px]"`}>
                At least one floor should be in the project
              </RemainingFieldText>
            </div>
            <div
              className={`flex items-center gap-${SubmitDialogConstants.GAP_WITH_CROSS_ICON} my-2 ml-[${SubmitDialogConstants.SUBQUE_MARGIN_LEFT}px]`}
            >
              <div className="">{getIcon("")}</div>
              <RemainingFieldText className={`"capitalize text-[14px]"`}>
                At least one room should be in any of the floor
              </RemainingFieldText>
            </div>
          </>
        )
      ) : (
        <div
          className={`flex items-center gap-${SubmitDialogConstants.GAP_WITH_CROSS_ICON} my-2`}
        >
          <div className="">{getIcon("")}</div>
          <RemainingFieldText className={`"capitalize text-[14px]"`}>
            At least one floor should be in the project
          </RemainingFieldText>
        </div>
      )}
    </div>
  );
};

export default NewRemainingProjectScope;
