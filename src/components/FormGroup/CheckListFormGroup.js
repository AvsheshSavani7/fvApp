import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import "./FormGroup.css";
import { useDispatch, useSelector } from "react-redux";
import { updateBtnArray, updateSingleCustomerApi } from "../../redux/customer";
import CheckListButtonGroup from "../UI/CheckList/CheckListBtns/CheckListButtonGroup";
import CheckListForm from "../Form/CheckListForm";
import FloorDetailsCheckListForm from "../Form/FloorDetailsCheckListForm";
import RepairCheckListForm from "../Form/RepairCheckListForm";
import StairCaseCheckListForm from "../Form/StairCaseCheckListForm";
import TransitionCheckListForm from "../Form/TransitionCheckListForm";
import LevelingCheckListForm from "../Form/LevelingCheckListForm";
import FurnitureCheckListForm from "../Form/FurnitureCheckListForm";
import MatchingCheckListForm from "../Form/MatchingCheckListForm";

const CheckListFormGroup = ({ showBottomButtonGroup }) => {
  const btnArray = useSelector((state) => state.customerReducer.btnArray);
  const keysToUpdate = [
    "checklist",
    "floorDetails",
    "furniture",
    "matching",
    "leveling",
  ];
  const activeBtnKey = useSelector(
    (state) => state.customerReducer.activeBtnKey
  );

  const updatedBtnArray = btnArray?.map((item) => {
    if (keysToUpdate.includes(item.key)) {
      return { ...item, className: "round-small-btn" }; // Update the className field to the new value for matching keys
    } else if (["repaire", "staircase", "transitions"]) {
      return { ...item, className: "round-small-btn" };
    }
    return item; // Return the original object for non-matching keys
  });

  const dispatch = useDispatch();
  const singleCustomerData = useSelector(
    (state) => state.customerReducer.singleCustomer
  );
  const buttonShow = useSelector(
    (state) => state.customerReducer.singleCustomer.scope
  );

  const handleBtnClick = (key, isChildClick = false, childName) => {
    if (key === "furniture") {
      if (!isChildClick) {
        if (!singleCustomerData.scope?.furniture.is_part) {
          dispatch(
            updateBtnArray([
              ...btnArray,
              {
                name: "Furniture",
                key: "furniture",
                className: "round-btn-bottom",
              },
            ])
          );
        } else {
          let newBtnArray = btnArray.filter((item) => item.key !== "furniture");
          dispatch(updateBtnArray(newBtnArray));
        }
        dispatch(
          updateSingleCustomerApi({
            ...singleCustomerData,
            scope: {
              ...singleCustomerData.scope,
              furniture: {
                ...singleCustomerData.scope?.furniture,
                is_part: !singleCustomerData.scope?.furniture.is_part,
                is_appliance: singleCustomerData.scope?.furniture.is_part
                  ? false
                  : singleCustomerData.scope?.furniture.is_appliance,
              },
            },
          })
        );
      } else {
        dispatch(
          updateSingleCustomerApi({
            ...singleCustomerData,
            scope: {
              ...singleCustomerData.scope,
              furniture: {
                ...singleCustomerData.scope?.furniture,
                is_appliance: !singleCustomerData.scope?.furniture.is_appliance,
              },
            },
          })
        );
      }
    }
    if (key === "refinishing") {
      if (!isChildClick) {
        dispatch(
          updateSingleCustomerApi({
            ...singleCustomerData,
            scope: {
              ...singleCustomerData.scope,
              refinishing: {
                ...singleCustomerData.scope?.refinishing,
                is_part: !singleCustomerData.scope?.refinishing.is_part,
                are_we_matching: singleCustomerData.scope?.refinishing.is_part
                  ? false
                  : singleCustomerData.scope?.refinishing.are_we_matching,
              },
            },
          })
        );
        if (
          singleCustomerData.scope?.refinishing.is_part &&
          !singleCustomerData.scope?.installation.are_we_matching
        ) {
          let newBtnArray = btnArray.filter((item) => item.key !== "matching");
          dispatch(updateBtnArray(newBtnArray));
        }
      } else {
        if (
          !singleCustomerData.scope?.refinishing.are_we_matching &&
          !singleCustomerData.scope?.installation.are_we_matching
        ) {
          dispatch(
            updateBtnArray([
              ...btnArray,
              {
                name: "Matching",
                key: "matching",
                className: "round-btn-bottom",
              },
            ])
          );
        } else if (
          singleCustomerData.scope?.refinishing.are_we_matching &&
          !singleCustomerData.scope?.installation.are_we_matching
        ) {
          let newBtnArray = btnArray.filter((item) => item.key !== "matching");
          dispatch(updateBtnArray(newBtnArray));
        }
        dispatch(
          updateSingleCustomerApi({
            ...singleCustomerData,
            scope: {
              ...singleCustomerData.scope,
              refinishing: {
                ...singleCustomerData.scope?.refinishing,
                are_we_matching:
                  !singleCustomerData.scope?.refinishing.are_we_matching,
              },
            },
          })
        );
      }
    }
    if (key === "installation") {
      if (!isChildClick) {
        dispatch(
          updateSingleCustomerApi({
            ...singleCustomerData,
            scope: {
              ...singleCustomerData.scope,
              installation: {
                ...singleCustomerData.scope?.installation,
                is_part: !singleCustomerData.scope?.installation.is_part,
                are_we_matching: singleCustomerData.scope?.installation.is_part
                  ? false
                  : singleCustomerData.scope?.installation.are_we_matching,
                are_we_levelling: singleCustomerData.scope?.installation.is_part
                  ? false
                  : singleCustomerData.scope?.installation.are_we_levelling,
              },
            },
          })
        );

        let newBtnArray = [...btnArray];

        if (
          singleCustomerData.scope?.installation.is_part &&
          !singleCustomerData.scope?.refinishing.are_we_matching
        ) {
          newBtnArray = newBtnArray.filter((item) => item.key !== "matching");
        }
        if (
          singleCustomerData.scope?.installation.is_part &&
          singleCustomerData.scope?.installation.are_we_levelling
        ) {
          newBtnArray = newBtnArray.filter((item) => item.key !== "leveling");
        }
        dispatch(updateBtnArray(newBtnArray));
      } else {
        if (childName === "are_we_matching") {
          if (
            !singleCustomerData.scope?.refinishing.are_we_matching &&
            !singleCustomerData.scope?.installation.are_we_matching
          ) {
            dispatch(
              updateBtnArray([
                ...btnArray,
                {
                  name: "Matching",
                  key: "matching",
                  className: "round-btn-bottom",
                },
              ])
            );
          } else if (
            !singleCustomerData.scope?.refinishing.are_we_matching &&
            singleCustomerData.scope?.installation.are_we_matching
          ) {
            let newBtnArray = btnArray.filter(
              (item) => item.key !== "matching"
            );
            dispatch(updateBtnArray(newBtnArray));
          }
          dispatch(
            updateSingleCustomerApi({
              ...singleCustomerData,
              scope: {
                ...singleCustomerData.scope,
                installation: {
                  ...singleCustomerData.scope?.installation,
                  are_we_matching:
                    !singleCustomerData.scope?.installation.are_we_matching,
                },
              },
            })
          );
        }
        if (childName === "are_we_levelling") {
          if (!singleCustomerData.scope?.installation.are_we_levelling) {
            dispatch(
              updateBtnArray([
                ...btnArray,
                {
                  name: "Leveling",
                  key: "leveling",
                  className: "round-btn-bottom",
                },
              ])
            );
          } else {
            let newBtnArray = btnArray.filter(
              (item) => item.key !== "leveling"
            );
            dispatch(updateBtnArray(newBtnArray));
          }
          dispatch(
            updateSingleCustomerApi({
              ...singleCustomerData,
              scope: {
                ...singleCustomerData.scope,
                installation: {
                  ...singleCustomerData.scope?.installation,
                  are_we_levelling:
                    !singleCustomerData.scope?.installation.are_we_levelling,
                },
              },
            })
          );
        }
      }
    }
    if (key === "repaire") {
      if (!isChildClick) {
        if (!singleCustomerData.scope?.is_repair) {
          // dispatch(
          //   updateBtnArray([
          //     ...btnArray,
          //     {
          //       name: "Repair",
          //       key: "repaire",
          //       className: "round-btn-bottom",
          //     },
          //   ])
          // );
          //For button array manage
          if (
            btnArray.some((btn) => btn.key === "staircase") &&
            btnArray.some((btn) => btn.key === "transitions")
          ) {
            const indexToInsert = btnArray.length - 2; // Index 2 from the last

            dispatch(
              updateBtnArray([
                ...btnArray.slice(0, indexToInsert),
                {
                  name: "Items of Interest",
                  key: "repaire",
                  className: "round-btn-bottom",
                },
                ...btnArray.slice(indexToInsert),
              ])
            );
          } else if (
            btnArray.some((btn) => btn.key === "staircase") ||
            btnArray.some((btn) => btn.key === "transitions")
          ) {
            const indexToInsert = btnArray.length - 1; // Index 2 from the last

            dispatch(
              updateBtnArray([
                ...btnArray.slice(0, indexToInsert),
                {
                  name: "Items of Interest",
                  key: "repaire",
                  className: "round-btn-bottom",
                },
                ...btnArray.slice(indexToInsert),
              ])
            );
          } else {
            dispatch(
              updateBtnArray([
                ...btnArray,
                {
                  name: "Items of Interest",
                  key: "repaire",
                  className: "round-btn-bottom",
                },
              ])
            );
          }
        } else {
          let newBtnArray = btnArray.filter((item) => item.key !== "repaire");
          dispatch(updateBtnArray(newBtnArray));
        }
        dispatch(
          updateSingleCustomerApi({
            ...singleCustomerData,
            scope: {
              ...singleCustomerData.scope,
              is_repair: !singleCustomerData.scope?.is_repair,
            },
          })
        );
      }
    }
    if (key === "staircase") {
      if (!isChildClick) {
        if (!singleCustomerData.scope?.is_staircase) {
          //For button array manage
          if (btnArray.some((btn) => btn.key === "transitions")) {
            const indexToInsert = btnArray.length - 1; // Index 2 from the last

            dispatch(
              updateBtnArray([
                ...btnArray.slice(0, indexToInsert),
                {
                  name: "Staircase",
                  key: "staircase",
                  className: "round-btn-bottom",
                },
                ...btnArray.slice(indexToInsert),
              ])
            );
          } else {
            dispatch(
              updateBtnArray([
                ...btnArray,
                {
                  name: "Staircase",
                  key: "staircase",
                  className: "round-btn-bottom",
                },
              ])
            );
          }
        } else {
          let newBtnArray = btnArray.filter((item) => item.key !== "staircase");
          dispatch(updateBtnArray(newBtnArray));
        }
        dispatch(
          updateSingleCustomerApi({
            ...singleCustomerData,
            scope: {
              ...singleCustomerData.scope,
              is_staircase: !singleCustomerData.scope?.is_staircase,
            },
          })
        );
      }
    }
    if (key === "transitions") {
      if (!isChildClick) {
        if (!singleCustomerData.scope?.is_transition) {
          dispatch(
            updateBtnArray([
              ...btnArray,
              {
                name: "Transition",
                key: "transitions",
                className: "round-btn-bottom",
              },
            ])
          );
        } else {
          let newBtnArray = btnArray.filter(
            (item) => item.key !== "transitions"
          );
          dispatch(updateBtnArray(newBtnArray));
        }
        dispatch(
          updateSingleCustomerApi({
            ...singleCustomerData,
            scope: {
              ...singleCustomerData.scope,
              is_transition: !singleCustomerData.scope?.is_transition,
            },
          })
        );
      }
    }
  };

  const renderForms = () => {
    switch (activeBtnKey) {
      case "checklist":
        return (
          <div>
            <div>
              <CheckListForm />
            </div>
          </div>
        );
      case "floorDetails":
        return (
          <div>
            <div>
              <FloorDetailsCheckListForm />
            </div>
          </div>
        );
      case "repaire":
        return (
          <div>
            <div>
              <RepairCheckListForm />
            </div>
          </div>
        );
      case "staircase":
        return (
          <div>
            <div>
              <StairCaseCheckListForm />
            </div>
          </div>
        );
      case "transitions":
        return (
          <div>
            <div>
              <TransitionCheckListForm />
            </div>
          </div>
        );
      case "leveling":
        return (
          <div>
            <div>
              <LevelingCheckListForm />
            </div>
          </div>
        );
      case "furniture":
        return (
          <div>
            <div>
              <FurnitureCheckListForm />
            </div>
          </div>
        );
      case "matching":
        return (
          <div>
            <div>
              <MatchingCheckListForm />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <AnimatePresence>
        {activeBtnKey && (
          <motion.div
            initial={{
              opacity: 0,
              y: 600,
            }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            exit={{ opacity: 0, y: 600, transition: { duration: 1 } }}
            className="bg-white w-screen h-[584px] sm:h-[584px] lg:h-[584px] mt-[33px] rounded-tl-[24px] rounded-tr-[24px] absolute bottom-0"
          >
            {renderForms()}
            {/* <VerticalDivider /> */}
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence initial={true}>
        <div className="flex justify-between items-center">
          {activeBtnKey && (
            <>
              <CheckListButtonGroup
                className="absolute bottom-[116px] left-[108px] flex  min-w-[1140px] justify-between"
                initial={{
                  opacity: 1,
                  x: 100,
                  y: -400,
                }}
                animate={{ opacity: 1, x: -100, y: 100 }}
                exit={{ opacity: 0, x: 100, y: -400 }}
                transition={{ duration: 1 }}
                BtnChildren={[
                  {
                    name: "Customer Details",
                    key: "customerDetails",
                    className: "round-small-btn",
                  },
                  {
                    name: "Project Scope",
                    key: "projectScope",
                    className: "round-small-btn",
                  },
                  {
                    name: "Measurement",
                    key: "measurement",
                    className: "round-small-btn",
                  },
                ]}
                isChild="true"
                handleBtnClick={(key) => handleBtnClick(key)}
              />

              {/* {activeBtnKey != "customerDetails" && (
                <>
                  <div>
                    <div className="rounded-full bg-black w-4 h-4 absolute bottom-8 left-[560px] gap-4" />
                  </div>
                  <div>
                    <div className="rounded-full  border-2 border-gray-[#505050] w-4 h-4 absolute bottom-8 right-[560px] gap-4" />
                  </div>
                </>
              )} */}
            </>
          )}
        </div>
      </AnimatePresence>
    </div>
  );
};

export default CheckListFormGroup;
