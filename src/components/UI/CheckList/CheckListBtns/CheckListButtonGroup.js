import React, { useState } from "react";
import { motion } from "framer-motion";
import GetIconFile from "../../../../assets/GetIconFile";
import { useDispatch, useSelector } from "react-redux";
import {
  setCheckListActiveBtn,
  setMatchingActiveBtn,
  setStep,
  updateActiveBtnKey,
  updateBtnArray,
  updateSingleCustomerApi,
} from "../../../../redux/customer";
import RIComponent from "../../RIComponent";
import ESComponent from "../../ESComponent";
import RemoveDialog from "../../RemoveDialog";
import { Constants } from "../../../../utils/Constants";

const CheckListButtonGroup = ({
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
  const notFilledOutBtns = useSelector(
    (state) => state.customerReducer.notFilledOutBtns
  );

  const btnArray = useSelector((state) => state.customerReducer.btnArray);
  const existingScope = useSelector(
    (state) => state.customerReducer.singleCustomer.scope
  );
  const dispatch = useDispatch();

  const handleClickBtn = (btnKey) => {
    dispatch(updateActiveBtnKey(btnKey));
    if (btnKey === "checklist") {
      if (existingScope?.refinishing?.is_part) {
        dispatch(setCheckListActiveBtn("refinishing"));
      } else {
        dispatch(setCheckListActiveBtn("installation"));
      }
    } else if (btnKey === "floorDetails") {
      if (existingScope?.refinishing?.is_part) {
        dispatch(setCheckListActiveBtn("existingMaterials"));
      } else if (existingScope?.installation?.is_part) {
        dispatch(setCheckListActiveBtn("subFloor"));
      } else {
        dispatch(setCheckListActiveBtn("molding"));
      }
    } else if (btnKey === "matching") {
      if (existingScope?.refinishing?.are_we_matching) {
        dispatch(setMatchingActiveBtn("refinishing"));
      } else if (existingScope?.installation?.are_we_matching) {
        dispatch(setMatchingActiveBtn("installation"));
      }
    }
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
      if (activeBtnKey === "repaire") {
        dispatch(updateActiveBtnKey(newBtnArray[newBtnArray.length - 1].key));
      }
      const updatedSingleCustomer = JSON.parse(
        JSON.stringify(singleCustomerData)
      );
      const updatedFloor = updatedSingleCustomer.scope.floors.map((floor) => ({
        ...floor,
        rooms: floor.rooms.map((room) => ({
          ...room,
          repair_ids: [],
        })),
      }));
      updatedSingleCustomer.scope.floors = updatedFloor;

      dispatch(
        updateSingleCustomerApi({
          ...updatedSingleCustomer,
          repairs: [],
          scope: {
            ...updatedSingleCustomer.scope,
            is_repair: false,
          },
        })
      );
    }
    if (btnKey === "staircase") {
      let newBtnArray = btnArray.filter((item) => item.key !== "staircase");
      dispatch(updateBtnArray(newBtnArray));
      if (activeBtnKey === "staircase") {
        dispatch(updateActiveBtnKey(newBtnArray[newBtnArray.length - 1].key));
      }
      const updatedSingleCustomer = JSON.parse(
        JSON.stringify(singleCustomerData)
      );
      const updatedFloor = updatedSingleCustomer.scope.floors.map((floor) => ({
        ...floor,
        staircase_from_ids: [],
        staircase_to_ids: [],
      }));
      updatedSingleCustomer.scope.floors = updatedFloor;

      dispatch(
        updateSingleCustomerApi({
          ...singleCustomerData,
          scope: {
            ...singleCustomerData.scope,
            is_staircase: false,
          },
          staircases: [],
        })
      );
    }
    if (btnKey === "transitions") {
      let newBtnArray = btnArray.filter((item) => item.key !== "transitions");
      dispatch(updateBtnArray(newBtnArray));
      if (activeBtnKey === "transitions") {
        dispatch(updateActiveBtnKey(newBtnArray[newBtnArray.length - 1].key));
      }
      const updatedSingleCustomer = JSON.parse(
        JSON.stringify(singleCustomerData)
      );
      const updatedFloor = updatedSingleCustomer.scope.floors.map((floor) => ({
        ...floor,
        rooms: floor.rooms.map((room) => ({
          ...room,
          transition_from_id: [],
          transition_to_id: [],
          transition_within_id: [],
        })),
      }));
      updatedSingleCustomer.scope.floors = updatedFloor;

      dispatch(
        updateSingleCustomerApi({
          ...singleCustomerData,
          scope: {
            ...singleCustomerData.scope,
            is_transition: false,
          },
          transitions: [],
        })
      );
    }
  };

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleRemoveClick = (e, item) => {
    e.stopPropagation();
    setSelectedItem(item);
    setTimeout(() => {
      setDialogOpen(true);
    }, 20);
  };

  const handleConfirmRemove = () => {
    setDialogOpen(false);
    removeBtn(selectedItem);
    setSelectedItem(null);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedItem(null);
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
                  } relative overflow-hidden transition-all ease-in-out duration-700 ${
                    btn?.key === "measurement" && "!text-[8px]"
                  }` || ""
                }
                style={
                  notFilledOutBtns?.includes(btn.key)
                    ? {
                        color: Constants.MANDATE_TEXT_COLOR,
                      }
                    : {}
                }
                onClick={() => handleClickBtn(btn.key)}
                // whileTap={{ scale: 0.9 }}
              >
                {btn.name || ""}
                {/* {btn.key == "checklist" && (
                  <RIComponent isActive={activeBtnKey == btn.key} />
                )} */}
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
                onClick={() => handleClickBtn(btn.key)}
                style={
                  notFilledOutBtns?.includes(btn.key)
                    ? {
                        color: Constants.MANDATE_TEXT_COLOR,
                      }
                    : {}
                }
              >
                <div
                  className={`absolute ${
                    activeBtnKey ? "-top-2.5 -right-2.5" : "-top-0.5 -right-0.5"
                  } rounded-full bg-white padding-2.5`}
                  onClick={(e) => handleRemoveClick(e, btn.key)}
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
      <RemoveDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        onConfirm={handleConfirmRemove}
        text={`Are you sure you want to remove all ${
          selectedItem === "repaire"
            ? "Items of Interest"
            : selectedItem === "staircase"
            ? "Staircases"
            : selectedItem === "transitions"
            ? "Transitions"
            : ""
        } ?`}
        title="Remove Confirmation"
      />
    </motion.div>

    //  </div>
  );
};

export default CheckListButtonGroup;
