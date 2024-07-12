import React from "react";
import { motion } from "framer-motion";
import GetIconFile from "../../../../assets/GetIconFile";
import { useDispatch, useSelector } from "react-redux";
import {
  setStep,
  updateActiveBtnKey,
  updateBtnArray,
  updateSingleCustomerApi,
} from "../../../../redux/customer";
import RIComponent from "../../RIComponent";
import ESComponent from "../../ESComponent";

const CLFloorDetailsButtonGroup = ({
  className,
  initial,
  animate,
  exit,
  transition,
  BtnChildren,
  isChild,
  handleBtnClick,
}) => {
  const singleCustomerData = useSelector(
    (state) => state.customerReducer.singleCustomer
  );
  const activeBtnKey = useSelector(
    (state) => state.customerReducer.activeBtnKey
  );

  const btnArray = useSelector((state) => state.customerReducer.btnArray);

  const dispatch = useDispatch();

  const handleClickBtn = (btnKey) => {
    dispatch(updateActiveBtnKey(btnKey));
    if (
      btnKey == "customerDetails" ||
      btnKey == "projectScope" ||
      btnKey == "measurement"
    ) {
      dispatch(setStep(1));
    } else {
      dispatch(setStep(2));
    }
  };

  const removeBtn = (btnKey) => {
    if (btnKey === "repaire") {
      let newBtnArray = btnArray.filter((item) => item.key !== "repaire");
      dispatch(updateBtnArray(newBtnArray));

      dispatch(
        updateSingleCustomerApi({
          ...singleCustomerData,
          scope: {
            ...singleCustomerData.scope,
            is_repair: false,
          },
        })
      );
    }
    if (btnKey === "staircase") {
      let newBtnArray = btnArray.filter((item) => item.key !== "staircase");
      dispatch(updateBtnArray(newBtnArray));

      dispatch(
        updateSingleCustomerApi({
          ...singleCustomerData,
          scope: {
            ...singleCustomerData.scope,
            is_staircase: false,
          },
        })
      );
    }
    if (btnKey === "transitions") {
      let newBtnArray = btnArray.filter((item) => item.key !== "transitions");
      dispatch(updateBtnArray(newBtnArray));

      dispatch(
        updateSingleCustomerApi({
          ...singleCustomerData,
          scope: {
            ...singleCustomerData.scope,
            is_transition: false,
          },
        })
      );
    }
  };
  return (
    // <div>
    <motion.div
      className={className}
      initial={initial}
      animate={animate}
      exit={exit}
      transition={transition}
    >
      <div className={`flex gap-2 items-center justify-between`}>
        {BtnChildren?.map((btn, idx) => {
          // Check if 'btn.key' is present in the specified array
          const isKeyPresent = ["repaire", "transitions", "staircase"].includes(
            btn.key
          );

          // Conditionally render the button or something else
          return !isKeyPresent ? (
            <>
              <motion.button
                key={idx}
                // className={`${btn.className}` || ""}
                className={
                  `${
                    isChild
                      ? "round-small-btn"
                      : activeBtnKey == btn.key
                      ? "round-btn-bottom"
                      : "checklist-small-btn"
                  } relative overflow-hidden transition-all ease-in-out duration-700 ` ||
                  ""
                }
                onClick={() => handleClickBtn(btn.key)}
                // whileTap={{ scale: 0.9 }}
              >
                {btn.name || ""}
                {btn.key == "checklist" && (
                  <RIComponent isActive={activeBtnKey == btn.key} />
                )}
                {btn.key == "floorDetails" && (
                  <ESComponent isActive={activeBtnKey == btn.key} />
                )}
              </motion.button>
            </>
          ) : (
            <>
              <button
                key={idx}
                className={
                  `${
                    isChild
                      ? "round-small-btn"
                      : activeBtnKey == btn.key
                      ? "round-btn-bottom"
                      : "checklist-small-btn"
                  } relative transition-all ease-in-out duration-700 ` || ""
                }
                onClick={btn.handleClickBtn}
              >
                <div
                  className={`absolute ${
                    activeBtnKey ? "-top-2.5 -right-2.5" : "-top-0.5 -right-0.5"
                  } rounded-full bg-white padding-2.5`}
                  onClick={() => removeBtn(btn.key)}
                >
                  <GetIconFile iconName="remove-icon" />
                </div>
                {btn.name || ""}
              </button>
            </>
          );
        })}
      </div>

      {activeBtnKey && isChild && (
        <div className="  flex justify-end align-bottom absolute bottom-1.5 right-0">
          {!singleCustomerData.scope.is_repair && (
            <div>
              <GetIconFile
                onClick={() => handleBtnClick("repaire")}
                iconName="repaire-customerDetails"
              />
            </div>
          )}
          {!singleCustomerData.scope.is_staircase && (
            <div className="ml-[24px]">
              <GetIconFile
                onClick={() => handleBtnClick("staircase")}
                iconName="staircase-customerDetails"
              />
            </div>
          )}
          {!singleCustomerData.scope.is_transition && (
            <div className="ml-[24px]">
              <GetIconFile
                onClick={() => handleBtnClick("transitions")}
                iconName="transitions-customerDetails"
              />
            </div>
          )}
        </div>
      )}
    </motion.div>

    //  </div>
  );
};

export default CLFloorDetailsButtonGroup;
