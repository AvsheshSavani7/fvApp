import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import "./FormGroup.css";
import ButtonGroup from "../UI/ButtonGroup";
import CustomerDetailForm from "../Form/CustomerDetailForm";
import VerticalDivider from "../UI/VerticalDivider";

import { useDispatch, useSelector } from "react-redux";
import GetIconFile from "../../assets/GetIconFile";
import Button from "../UI/Button";
import {
  newsingleCustomer,
  singleCustomer,
  updateBtnArray,
  updateSingleCustomerApi,
} from "../../redux/customer";
import ProjectScopeForm from "../Form/ProjectScopeForm";
import { Collapse, Grid } from "@mui/material";
import { useDrop } from "react-dnd";
import Text from "../UI/Text";
import { kitchenItem, specialItem } from "../../utils/furniture";
import { v4 as uuidv4 } from "uuid";
import MeasurementForm from "../Form/MeasurementForm";

const FormGroup = ({ showBottomButtonGroup }) => {
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
        if (singleCustomerData.scope?.furniture.is_part) {
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
                kasa_is_moving: singleCustomerData.scope?.furniture
                  .kasa_is_moving
                  ? false
                  : singleCustomerData.scope?.furniture.kasa_is_moving,
                special_items: singleCustomerData.scope?.furniture
                  ?.special_items
                  ? false
                  : singleCustomerData.scope?.furniture?.special_items,
              },
            },
          })
        );
      } else {
        if (childName === "is_appliance") {
          dispatch(
            updateSingleCustomerApi({
              ...singleCustomerData,
              scope: {
                ...singleCustomerData.scope,
                furniture: {
                  ...singleCustomerData.scope?.furniture,
                  is_appliance:
                    !singleCustomerData.scope?.furniture.is_appliance,
                },
              },
              kitchen_furnitures:
                singleCustomerData.scope?.furniture.is_appliance === true
                  ? []
                  : [{ id: uuidv4(), all_questions: kitchenItem }],
            })
          );
        } else if (childName === "kasa_is_moving") {
          if (!singleCustomerData.scope?.furniture.kasa_is_moving) {
            if (btnArray.some((btn) => btn.key === "checklist")) {
              const indexToInsert = 2;
              dispatch(
                updateBtnArray([
                  ...btnArray.slice(0, indexToInsert),
                  {
                    name: "Furniture",
                    key: "furniture",
                    className: "round-btn-bottom",
                  },
                  ...btnArray.slice(indexToInsert),
                ])
              );
            } else {
              const indexToInsert = 1;
              dispatch(
                updateBtnArray([
                  ...btnArray.slice(0, indexToInsert),
                  {
                    name: "Furniture",
                    key: "furniture",
                    className: "round-btn-bottom",
                  },
                  ...btnArray.slice(indexToInsert),
                ])
              );
            }
          } else {
            let newBtnArray = btnArray.filter(
              (item) => item.key !== "furniture"
            );
            dispatch(updateBtnArray(newBtnArray));
          }
          dispatch(
            updateSingleCustomerApi({
              ...singleCustomerData,
              scope: {
                ...singleCustomerData.scope,
                furniture: {
                  ...singleCustomerData.scope?.furniture,
                  kasa_is_moving:
                    !singleCustomerData.scope?.furniture.kasa_is_moving,
                  is_appliance: singleCustomerData.scope?.furniture.is_part
                    ? false
                    : singleCustomerData.scope?.furniture.is_appliance,
                  special_items: singleCustomerData.scope?.furniture
                    ?.special_items
                    ? false
                    : singleCustomerData.scope?.furniture?.special_items,
                },
              },
              specialItem_furnitures: [],
              kitchen_furnitures: [],
            })
          );
        } else if (childName === "special_items") {
          dispatch(
            updateSingleCustomerApi({
              ...singleCustomerData,
              scope: {
                ...singleCustomerData.scope,
                furniture: {
                  ...singleCustomerData.scope?.furniture,
                  special_items:
                    !singleCustomerData.scope?.furniture.special_items,
                },
              },
              specialItem_furnitures:
                singleCustomerData.scope?.furniture.special_items === true
                  ? []
                  : [
                      {
                        id: uuidv4(),
                        within_room_id: [],
                        all_questions: specialItem,
                      },
                    ],
            })
          );
        }
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
        if (!singleCustomerData.scope?.refinishing?.is_part) {
          const indexToInsert = 0;
          dispatch(
            updateBtnArray([
              ...btnArray.slice(0, indexToInsert),
              {
                name: "Checklist",
                key: "checklist",
                className: "round-btn-bottom",
              },
              ...btnArray.slice(indexToInsert),
            ])
          );
        } else {
          let newBtnArray = btnArray.filter((item) => item.key !== "checklist");
          dispatch(updateBtnArray(newBtnArray));
        }
      } else {
        if (
          !singleCustomerData.scope?.refinishing.are_we_matching &&
          !singleCustomerData.scope?.installation.are_we_matching
        ) {
          if (
            btnArray.some(
              (btn) =>
                btn.key === "furniture" &&
                btnArray.some((btn) => btn.key === "leveling")
            )
          ) {
            const indexToInsert = 4; // Index 4 from the start

            dispatch(
              updateBtnArray([
                ...btnArray.slice(0, indexToInsert),
                {
                  name: "Matching",
                  key: "matching",
                  className: "round-btn-bottom",
                },
                ...btnArray.slice(indexToInsert),
              ])
            );
          } else if (
            btnArray.some(
              (btn) =>
                btn.key === "furniture" ||
                btnArray.some((btn) => btn.key === "leveling")
            )
          ) {
            const indexToInsert = 3;
            dispatch(
              updateBtnArray([
                ...btnArray.slice(0, indexToInsert),
                {
                  name: "Matching",
                  key: "matching",
                  className: "round-btn-bottom",
                },
                ...btnArray.slice(indexToInsert),
              ])
            );
          } else {
            const indexToInsert = 2; // Index 2 from the start

            dispatch(
              updateBtnArray([
                ...btnArray.slice(0, indexToInsert),
                {
                  name: "Matching",
                  key: "matching",
                  className: "round-btn-bottom",
                },
                ...btnArray.slice(indexToInsert),
              ])
            );
          }
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
            // dispatch(
            //   updateBtnArray([
            //     ...btnArray,
            //     {
            //       name: "Matching",
            //       key: "matching",
            //       className: "round-btn-bottom",
            //     },
            //   ])
            // );
            if (
              btnArray.some(
                (btn) =>
                  btn.key === "furniture" &&
                  btnArray.some((btn) => btn.key === "leveling") &&
                  btnArray.some((btn) => btn.key === "checklist")
              )
            ) {
              const indexToInsert = 4; // Index 4 from the start

              dispatch(
                updateBtnArray([
                  ...btnArray.slice(0, indexToInsert),
                  {
                    name: "Matching",
                    key: "matching",
                    className: "round-btn-bottom",
                  },
                  ...btnArray.slice(indexToInsert),
                ])
              );
            } else if (
              btnArray.some(
                (btn) =>
                  btn.key === "furniture" &&
                  btnArray.some((btn) => btn.key === "leveling")
              ) ||
              btnArray.some(
                (btn) =>
                  btn.key === "checklist" &&
                  btnArray.some((btn) => btn.key === "leveling")
              ) ||
              btnArray.some(
                (btn) =>
                  btn.key === "furniture" &&
                  btnArray.some((btn) => btn.key === "checklist")
              )
            ) {
              const indexToInsert = 3;
              dispatch(
                updateBtnArray([
                  ...btnArray.slice(0, indexToInsert),
                  {
                    name: "Matching",
                    key: "matching",
                    className: "round-btn-bottom",
                  },
                  ...btnArray.slice(indexToInsert),
                ])
              );
            } else if (
              btnArray.some(
                (btn) =>
                  btn.key === "furniture" ||
                  btnArray.some((btn) => btn.key === "leveling") ||
                  btnArray.some((btn) => btn.key === "checklist")
              )
            ) {
              const indexToInsert = 2; // Index 2 from the start

              dispatch(
                updateBtnArray([
                  ...btnArray.slice(0, indexToInsert),
                  {
                    name: "Matching",
                    key: "matching",
                    className: "round-btn-bottom",
                  },
                  ...btnArray.slice(indexToInsert),
                ])
              );
            } else {
              const indexToInsert = 1; // Index 1 from the start

              dispatch(
                updateBtnArray([
                  ...btnArray.slice(0, indexToInsert),
                  {
                    name: "Matching",
                    key: "matching",
                    className: "round-btn-bottom",
                  },
                  ...btnArray.slice(indexToInsert),
                ])
              );
            }
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
            if (
              btnArray.some((btn) => btn.key === "furniture") &&
              btnArray.some((btn) => btn.key === "checklist")
            ) {
              const indexToInsert = 3; // Index 3 from the start

              dispatch(
                updateBtnArray([
                  ...btnArray.slice(0, indexToInsert),
                  {
                    name: "Leveling",
                    key: "leveling",
                    className: "round-btn-bottom",
                  },
                  ...btnArray.slice(indexToInsert),
                ])
              );
            } else if (
              btnArray.some((btn) => btn.key === "furniture") ||
              btnArray.some((btn) => btn.key === "checklist")
            ) {
              const indexToInsert = 2; // Index 2 from the start

              dispatch(
                updateBtnArray([
                  ...btnArray.slice(0, indexToInsert),
                  {
                    name: "Leveling",
                    key: "leveling",
                    className: "round-btn-bottom",
                  },
                  ...btnArray.slice(indexToInsert),
                ])
              );
            } else {
              const indexToInsert = 1; // Index 1 from the start

              dispatch(
                updateBtnArray([
                  ...btnArray.slice(0, indexToInsert),
                  {
                    name: "Leveling",
                    key: "leveling",
                    className: "round-btn-bottom",
                  },
                  ...btnArray.slice(indexToInsert),
                ])
              );
            }
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

  const [hide, setHide] = useState(false);

  const renderForms = () => {
    switch (activeBtnKey) {
      case "customerDetails":
        return (
          <div className="relative flex justify-between">
            <div className="ml-9">
              <CustomerDetailForm />
            </div>
            <VerticalDivider />
            <div className="h-[584px] px-5">
              <div className="flex justify-between min-w-[480px]  m-auto mt-[65px]">
                <div className="ml-10">
                  <motion.div
                    whileTap={{ scale: 0.9 }}
                    className="ml-[33px]"
                    onClick={() => handleBtnClick("furniture")}
                  >
                    <GetIconFile
                      iconName="furnitureBtn"
                      data={
                        buttonShow?.furniture.is_part
                          ? { color: "#1E2E5A", secondColor: "white" }
                          : {}
                      }
                    />
                  </motion.div>

                  <Collapse in={singleCustomerData.scope?.furniture.is_part}>
                    <div className="w-[2px] h-[60px] flex m-auto justify-center bg-[#20202033]"></div>
                    <Button
                      className={`rounded-full w-[96px] h-[96px] border-solid border-2 border-[#AEAEAE] p-2 text-xs font-medium ${
                        singleCustomerData.scope?.furniture.kasa_is_moving
                          ? "bg-[#1E2E5A] text-white text-sm"
                          : {}
                      }`}
                      onClick={() =>
                        handleBtnClick("furniture", true, "kasa_is_moving")
                      }
                    >
                      {singleCustomerData.scope?.furniture.kasa_is_moving
                        ? "Kasa"
                        : "Customer"}
                      <div> is moving </div>
                    </Button>
                    <Collapse
                      in={singleCustomerData.scope?.furniture.kasa_is_moving}
                    >
                      <div className="w-[2px] h-[30px] flex m-auto justify-center bg-[#20202033]"></div>
                      <div className="w-[110px] h-[2px] flex m-auto justify-center bg-[#20202033]"></div>
                      <div className="flex gap-x-3">
                        <div>
                          <div className="w-[2px] h-[30px] flex m-auto justify-center bg-[#20202033]"></div>
                          <Button
                            className={`rounded-full w-[96px] h-[96px] border-solid border-2 border-[#AEAEAE] p-2 text-xs font-medium ${
                              singleCustomerData.scope?.furniture.is_appliance
                                ? "bg-[#1E2E5A] text-white text-sm"
                                : ""
                            }`}
                            onClick={() =>
                              handleBtnClick("furniture", true, "is_appliance")
                            }
                            type="button"
                          >
                            Appliances{" "}
                            {`${
                              singleCustomerData.scope?.furniture.is_appliance
                                ? "Yes"
                                : "No"
                            }`}
                          </Button>
                        </div>
                        <div>
                          <div className="w-[2px] h-[30px] flex m-auto justify-center bg-[#20202033]"></div>
                          <Button
                            className={`rounded-full w-[96px] h-[96px] border-solid border-2 border-[#AEAEAE] p-2 text-xs font-medium ${
                              singleCustomerData.scope?.furniture.special_items
                                ? "bg-[#1E2E5A] text-white text-sm"
                                : {}
                            }`}
                            onClick={() =>
                              handleBtnClick("furniture", true, "special_items")
                            }
                          >
                            Special Items
                            <div>
                              {`${
                                singleCustomerData.scope?.furniture
                                  .special_items
                                  ? "Yes"
                                  : "No"
                              }`}
                            </div>
                          </Button>
                        </div>
                      </div>
                    </Collapse>
                  </Collapse>
                </div>
                {/* </RoundedButton> */}
                <div className="">
                  <motion.div
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleBtnClick("refinishing")}
                  >
                    <GetIconFile
                      iconName="refinishing"
                      data={
                        buttonShow.refinishing.is_part
                          ? { color: "#1E2E5A", secondColor: "white" }
                          : ""
                      }
                    />
                  </motion.div>

                  <Collapse in={singleCustomerData.scope?.refinishing.is_part}>
                    <div className="w-[2px] h-[60px] flex m-auto justify-center bg-[#20202033]"></div>
                    <Button
                      className={`rounded-full w-[96px] h-[96px] border-solid border-2 border-[#AEAEAE] p-2 text-xs font-medium ${
                        singleCustomerData.scope?.refinishing.are_we_matching
                          ? "bg-[#1E2E5A] text-white text-sm"
                          : ""
                      }`}
                      onClick={() => handleBtnClick("refinishing", true)}
                    >
                      Matching{" "}
                      {`${
                        singleCustomerData.scope?.refinishing.are_we_matching
                          ? "Yes"
                          : "No"
                      }`}
                    </Button>
                  </Collapse>
                </div>
                <div className="">
                  <motion.div
                    whileTap={{ scale: 0.9 }}
                    className="ms-[33px]"
                    onClick={() => handleBtnClick("installation")}
                  >
                    <GetIconFile
                      iconName="installation"
                      data={
                        buttonShow?.installation.is_part
                          ? { color: "#1E2E5A", secondColor: "white" }
                          : ""
                      }
                    />
                  </motion.div>

                  <Collapse in={singleCustomerData.scope?.installation.is_part}>
                    <div className="w-[2px] h-[30px] flex m-auto justify-center bg-[#20202033]"></div>
                    <div className="w-[110px] h-[2px] flex m-auto justify-center bg-[#20202033]"></div>
                    <div className="flex gap-x-3">
                      <div>
                        <div className="w-[2px] h-[30px] flex m-auto justify-center bg-[#20202033]"></div>
                        <Button
                          className={`rounded-full w-[96px] h-[96px] border-solid border-2 border-[#AEAEAE] p-2 text-xs font-medium ${
                            singleCustomerData.scope?.installation
                              .are_we_matching
                              ? "bg-[#1E2E5A] text-white text-sm"
                              : ""
                          }`}
                          onClick={() =>
                            handleBtnClick(
                              "installation",
                              true,
                              "are_we_matching"
                            )
                          }
                        >
                          Matching{" "}
                          {`${
                            singleCustomerData.scope?.installation
                              .are_we_matching
                              ? "Yes"
                              : "No"
                          }`}
                        </Button>
                      </div>
                      <div>
                        <div className="w-[2px] h-[30px] flex m-auto justify-center bg-[#20202033]"></div>
                        <Button
                          className={`rounded-full w-[96px] h-[96px] border-solid border-2 border-[#AEAEAE] p-2 text-xs font-medium ${
                            singleCustomerData.scope?.installation
                              .are_we_levelling
                              ? "bg-[#1E2E5A] text-white text-sm"
                              : ""
                          }`}
                          onClick={() =>
                            handleBtnClick(
                              "installation",
                              true,
                              "are_we_levelling"
                            )
                          }
                        >
                          Leveling{" "}
                          {`${
                            singleCustomerData.scope?.installation
                              .are_we_levelling
                              ? "Yes"
                              : "No"
                          }`}
                        </Button>
                      </div>
                    </div>
                  </Collapse>
                </div>

                {/* </ButtonGroup> */}
              </div>

              {/* <div className="w-full mb-[20px] flex justify-end"> */}
              {/* {!singleCustomerData.scope.is_repair && (
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
                )} */}
              {/* </div> */}
            </div>
          </div>
        );
      case "projectScope":
        return (
          <div>
            <div>
              <ProjectScopeForm setHide={setHide} />
            </div>
            {/* <Grid container>
              <Grid item xs={12} md={6} style={{ width: "50%" }}>
                <ProjectScopeForm />
              </Grid>
              <Grid item xs={12} md={1}>
                <VerticalDivider />
              </Grid>
              <Grid item xs={12} md={5} style={{ width: "50%" }}>
                <div className=""></div>
              </Grid>
            </Grid> */}
          </div>
        );
      case "measurement":
        return (
          <div>
            <div>
              <MeasurementForm />
            </div>
            {/* <Grid container>
              <Grid item xs={12} md={6} style={{ width: "50%" }}>
                <ProjectScopeForm />
              </Grid>
              <Grid item xs={12} md={1}>
                <VerticalDivider />
              </Grid>
              <Grid item xs={12} md={5} style={{ width: "50%" }}>
                <div className=""></div>
              </Grid>
            </Grid> */}
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
            {/* {!hide && <VerticalDivider />} */}
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence initial={true}>
        <div className="flex justify-between items-center">
          {activeBtnKey && (
            <>
              <ButtonGroup
                className="absolute bottom-[116px] left-[108px] flex  min-w-[1140px] justify-between"
                initial={{
                  opacity: 1,
                  x: 100,
                  y: -400,
                }}
                animate={{ opacity: 1, x: -100, y: 100 }}
                exit={{ opacity: 0, x: 100, y: -400 }}
                transition={{ duration: 1 }}
                BtnChildren={updatedBtnArray}
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

export default FormGroup;
