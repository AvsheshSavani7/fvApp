import React from "react";
import Image from "../../UI/Image";
import RemainingFieldText from "../../UI/RemainingFieldText";
import { SubmitDialogConstants } from "../../../utils/Constants";
import RemainingFieldHeadingText from "../../UI/RemainingFieldHeadingText";
import { useDispatch, useSelector } from "react-redux";
import { checkMandatoryForProjectScope } from "../../../utils/checkMandatory";

const RemainingProjectScope = ({ projectScopeObj, singleCustomerData }) => {
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

  const { isValidProject } = checkMandatoryForProjectScope(
    dispatch,
    singleCustomerData,
    notFilledOutBtns
  );

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
          // !projectScopeObj.imageExist && !projectScopeObj.dimesionExist ? (
          //   <>
          //     <div
          //       className={`flex items-center gap-${SubmitDialogConstants.GAP_WITH_CROSS_ICON} my-2`}
          //     >
          //       <div className="">{getIcon(true)}</div>
          //       <RemainingFieldText className={``}>
          //         At least one floor should be in the project
          //       </RemainingFieldText>
          //     </div>
          //     <div
          //       className={`flex items-center gap-${SubmitDialogConstants.GAP_WITH_CROSS_ICON} my-2 ml-[${SubmitDialogConstants.SUBQUE_MARGIN_LEFT}px]`}
          //     >
          //       <div className="">{getIcon(true)}</div>
          //       <RemainingFieldText className={``}>
          //         At least one room should be in any of the floors
          //       </RemainingFieldText>
          //     </div>
          //     <div
          //       className={`flex items-center gap-${SubmitDialogConstants.GAP_WITH_CROSS_ICON} my-2 ml-12`}
          //     >
          //       <div className="">{getIcon("")}</div>
          //       <RemainingFieldText className={``}>
          //         At least one image should be in any of the rooms
          //       </RemainingFieldText>
          //     </div>
          //     <div
          //       className={`flex items-center gap-${SubmitDialogConstants.GAP_WITH_CROSS_ICON} ml-12`}
          //     >
          //       <div className="">{getIcon("")}</div>
          //       <RemainingFieldText className={``}>
          //         SF must be greater than 0
          //       </RemainingFieldText>
          //     </div>
          //   </>
          // ) : !projectScopeObj.imageExist && projectScopeObj.dimesionExist ? (
          //   <>
          //     <div
          //       className={`flex items-center gap-${SubmitDialogConstants.GAP_WITH_CROSS_ICON} my-2`}
          //     >
          //       <div className="">{getIcon(true)}</div>
          //       <RemainingFieldText className={``}>
          //         At least one floor should be in the project
          //       </RemainingFieldText>
          //     </div>
          //     <div
          //       className={`flex items-center gap-${SubmitDialogConstants.GAP_WITH_CROSS_ICON} my-2 ml-[${SubmitDialogConstants.SUBQUE_MARGIN_LEFT}px]`}
          //     >
          //       <div className="">{getIcon(true)}</div>
          //       <RemainingFieldText className={``}>
          //         At least one room should be in any of the floors
          //       </RemainingFieldText>
          //     </div>
          //     <div
          //       className={`flex items-center gap-${SubmitDialogConstants.GAP_WITH_CROSS_ICON} ml-12`}
          //     >
          //       <div className="">{getIcon("")}</div>
          //       <RemainingFieldText className={``}>
          //         At least one image should be in any of the rooms
          //       </RemainingFieldText>
          //     </div>
          //   </>
          // ) : projectScopeObj.imageExist && !projectScopeObj.dimesionExist ? (
          //   <>
          //     <div
          //       className={`flex items-center gap-${SubmitDialogConstants.GAP_WITH_CROSS_ICON} my-2`}
          //     >
          //       <div className="">{getIcon(true)}</div>
          //       <RemainingFieldText className={``}>
          //         At least one floor should be in the project
          //       </RemainingFieldText>
          //     </div>
          //     <div
          //       className={`flex items-center gap-${SubmitDialogConstants.GAP_WITH_CROSS_ICON} my-2 ml-[${SubmitDialogConstants.SUBQUE_MARGIN_LEFT}px]`}
          //     >
          //       <div className="">{getIcon(true)}</div>
          //       <RemainingFieldText className={``}>
          //         At least one room should be in any of the floors
          //       </RemainingFieldText>
          //     </div>
          //     <div
          //       className={`flex items-center gap-${SubmitDialogConstants.GAP_WITH_CROSS_ICON} ml-12 my-2`}
          //     >
          //       <div className="">{getIcon("")}</div>
          //       <RemainingFieldText className={``}>
          //         SF must be greater than 0
          //       </RemainingFieldText>
          //     </div>
          //   </>
          // ) : (
          //   <></>
          // )
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

export default RemainingProjectScope;
