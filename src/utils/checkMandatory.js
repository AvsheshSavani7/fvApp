import { setNotFilledOutBtns } from "../redux/customer";

const isCheckListExistInRoom = (floors, key) => {
  let isValid = true;
  for (const floor of floors) {
    if (floor?.rooms) {
      for (const room of floor?.rooms) {
        if (room?.[key] === "") {
          isValid = false;
          break;
        }
      }
      if (!isValid) {
        break;
      }
    }
  }
  return isValid;
};

export const checkMandatoryForCustomerDetails = (
  dispatch,
  singleCustomerData,
  notFilledOutBtns
) => {
  let customerDetails = singleCustomerData?.customer;
  let scope = singleCustomerData?.scope;
  let isValidCustomer = true;
  let isValidRefOrIns = false;

  if (
    customerDetails?.name === "" ||
    customerDetails?.address === "" ||
    customerDetails?.email === ""
  ) {
    isValidCustomer = false;
  } else {
    if (customerDetails?.buildingType?.answer !== "") {
      if (customerDetails?.buildingType)
        for (const subQue of customerDetails?.buildingType?.subQuestion) {
          if (
            subQue?.mandatory &&
            subQue?.whenToShow === customerDetails?.buildingType?.answer
          ) {
            if (
              subQue?.answer === "none" ||
              subQue?.answer === "" ||
              subQue?.answer?.length === 0
            ) {
              isValidCustomer = false;
              break;
            } else {
              if (subQue?.subQuestion)
                for (const subofsub of subQue?.subQuestion) {
                  if (subofsub?.type === "BOOLEAN") {
                    if (subofsub?.answer === "none") {
                      isValidCustomer = false;
                      break;
                    }
                  } else if (
                    typeof subofsub?.answer == "string" &&
                    subofsub?.answer === ""
                  ) {
                    isValidCustomer = false;
                    break;
                  } else if (
                    typeof subofsub?.answer == "object" &&
                    subofsub?.answer?.length === 0
                  ) {
                    isValidCustomer = false;
                    break;
                  }
                }
            }
          }
        }
    } else {
      isValidCustomer = false;
    }
  }

  if (scope?.refinishing?.is_part || scope?.installation?.is_part) {
    isValidRefOrIns = true;
  }

  let btns = [...notFilledOutBtns];
  if (!isValidCustomer || !isValidRefOrIns) {
    if (!btns?.includes("customerDetails")) {
      btns.push("customerDetails");
      dispatch(setNotFilledOutBtns(btns));
    }
  } else if (isValidCustomer && isValidRefOrIns) {
    if (btns?.includes("customerDetails")) {
      btns = btns.filter((btn) => btn !== "customerDetails");
      dispatch(setNotFilledOutBtns(btns));
    }
  }
  return { isValidCustomer, isValidRefOrIns };
};

export const checkMandatoryForProjectScope = (
  dispatch,
  singleCustomerData,
  notFilledOutBtns
) => {
  let isValidProject = false;
  let btns = [...notFilledOutBtns];
  let floors = singleCustomerData?.scope?.floors;

  if (floors?.length > 0) {
    for (const floor of floors) {
      if (floor?.rooms?.length > 0) {
        for (const room of floor?.rooms) {
          // if (room?.totalSqFeet > 0 && room?.images?.length > 0) {
          isValidProject = true;
          break;
          // }
        }
      }
    }
  }

  if (!isValidProject) {
    if (!btns?.includes("projectScope")) {
      btns.push("projectScope");
      dispatch(setNotFilledOutBtns(btns));
    }
  } else {
    if (btns?.includes("projectScope")) {
      btns = btns.filter((btn) => btn !== "projectScope");
      dispatch(setNotFilledOutBtns(btns));
    }
  }
  return { isValidProject };
};

export const checkMandatoryForChecklist = (
  dispatch,
  singleCustomerData,
  activeBtnKey,
  notFilledOutBtns
) => {
  let isValid = true;
  let checklist = singleCustomerData?.refinishing_checklists;
  let floors = singleCustomerData?.scope?.floors;
  const refinishingChecklistlIsPart =
    singleCustomerData?.scope?.refinishing?.is_part;

  if (checklist?.length > 0) {
    for (const checklistItem of checklist) {
      for (const question of checklistItem?.all_questions) {
        if (question.mandatory && question.answer === "none") {
          isValid = false;
          break;
        } else {
          if (
            question?.question ===
              "Excessive damage (ex. pet stains,cracked boards)" ||
            question?.question === "Surface issues ( ex. mastic, paint, wax)"
          ) {
            if (question?.answer === true) {
              for (const subQuestion of question.subQuestion) {
                if (
                  subQuestion.answer !== "none" &&
                  subQuestion.answer === true
                ) {
                  isValid = true;
                  break;
                } else {
                  isValid = false;
                }
              }
            }
          } else {
            if (question?.subQuestion) {
              for (const subQuestion of question.subQuestion) {
                if (
                  subQuestion.mandatory &&
                  subQuestion.whenToShow === question.answer
                ) {
                  if (
                    subQuestion.answer === "none" ||
                    subQuestion.answer === "" ||
                    subQuestion.answer?.length === 0
                  ) {
                    isValid = false;
                    break;
                  } else {
                    if (subQuestion?.subQuestion) {
                      for (const subofSubQue of subQuestion.subQuestion) {
                        if (
                          subofSubQue.mandatory &&
                          subofSubQue.whenToShow === subQuestion.answer
                        ) {
                          if (
                            subofSubQue.answer === "none" ||
                            subofSubQue.answer === "" ||
                            subofSubQue.answer?.length === 0
                          ) {
                            isValid = false;
                            break;
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }

        if (!isValid) {
          break;
        }
      }
      if (!isValid) {
        break;
      }
    }
  }

  let isValidRoom = true;
  if (checklist?.length > 0) {
    isValidRoom = isCheckListExistInRoom(floors, "refinishing_checklists_id");
  }

  let btns = [...notFilledOutBtns];
  if (dispatch) {
    if (refinishingChecklistlIsPart && (!isValid || !isValidRoom)) {
      if (!btns?.includes("checklist")) {
        btns.push("checklist");
        dispatch(setNotFilledOutBtns(btns));
      }
    } else if (isValid && isValidRoom) {
      if (btns?.includes("checklist")) {
        btns = btns.filter((btn) => btn !== "checklist");
        dispatch(setNotFilledOutBtns(btns));
      }
    }
  }
  return { isValid, isValidRoom };
};

export const checkMandatoryForFloorDetails = (
  dispatch,
  singleCustomerData,
  activeBtnKey,
  notFilledOutBtns
) => {
  let isValid = true;
  let checklist1 = singleCustomerData?.existing_materials;
  let checklist2 = singleCustomerData?.subfloor_details;
  let floors = singleCustomerData?.scope?.floors;

  const existingMaterialIsPart =
    singleCustomerData?.scope?.refinishing?.is_part;
  const subFloorIsPart = singleCustomerData?.scope?.installation?.is_part;

  if (existingMaterialIsPart && checklist1?.length > 0) {
    for (const checklistItem of checklist1) {
      for (const question of checklistItem.all_questions) {
        if (question.mandatory) {
          // if (typeof question.answer === "boolean") {
          if (
            question.answer === "none" ||
            question.answer === "" ||
            question.answer?.length === 0
          ) {
            isValid = false;
            break;
          } else {
            if (question.answer === true || question.answer !== "") {
              if (question?.subQuestion) {
                for (const subQuestion of question?.subQuestion) {
                  if (
                    subQuestion.mandatory &&
                    subQuestion.whenToShow === question.answer
                  ) {
                    if (
                      subQuestion.type === "BOOLEAN" &&
                      subQuestion.answer === "none"
                    ) {
                      isValid = false;
                      break;
                    } else if (
                      typeof subQuestion.answer === "string" &&
                      subQuestion.answer === ""
                    ) {
                      isValid = false;
                      break;
                    } else if (
                      typeof subQuestion.answer === "object" &&
                      subQuestion.answer?.length === 0
                    ) {
                      isValid = false;
                      break;
                    }
                  }
                }
              }
            }
          }
        }

        if (!isValid) {
          break;
        }
      }
      if (!isValid) {
        break;
      }
    }
  }

  if (subFloorIsPart && checklist2?.length > 0) {
    for (const checklistItem of checklist2) {
      for (const question of checklistItem.all_questions) {
        if (question.mandatory) {
          if (
            question.answer === "none" ||
            question.answer === "" ||
            question.answer?.length === 0
          ) {
            isValid = false;
            break;
          } else {
            if (question.answer === true || question.answer !== "") {
              if (question?.subQuestion) {
                let flatArray = question?.subQuestion?.flatMap(
                  (arr) => arr?.subQuestion
                );

                for (const subQuestion of flatArray) {
                  if (
                    subQuestion.mandatory &&
                    subQuestion.whenToShow === question.answer
                  ) {
                    if (
                      typeof subQuestion.answer === "boolean" &&
                      subQuestion.answer === "none"
                    ) {
                      isValid = false;
                      break;
                    } else if (
                      typeof subQuestion.answer === "string" &&
                      subQuestion.answer === ""
                    ) {
                      isValid = false;
                      break;
                    } else if (
                      typeof subQuestion.answer === "object" &&
                      subQuestion.answer?.length === 0
                    ) {
                      isValid = false;
                      break;
                    }
                  }
                }
              }
            }
          }
        }

        if (!isValid) {
          break;
        }
      }
      if (!isValid) {
        break;
      }
    }
  }

  let isValidRoomForExistingMaterial = true;
  if (existingMaterialIsPart && checklist1?.length > 0) {
    isValidRoomForExistingMaterial = isCheckListExistInRoom(
      floors,
      "existing_material_id"
    );
  }
  let isValidRoomSubFloor = true;
  if (subFloorIsPart && checklist2?.length > 0) {
    isValidRoomSubFloor = isCheckListExistInRoom(floors, "subfloor_detail_id");
  }

  let btns = [...notFilledOutBtns];
  if (
    (existingMaterialIsPart || subFloorIsPart) &&
    (!isValid || !isValidRoomForExistingMaterial || !isValidRoomSubFloor)
  ) {
    if (!btns?.includes("floorDetails")) {
      btns.push("floorDetails");
      dispatch(setNotFilledOutBtns(btns));
    }
  } else if (isValid && isValidRoomForExistingMaterial && isValidRoomSubFloor) {
    if (btns?.includes("floorDetails")) {
      btns = btns.filter((btn) => btn !== "floorDetails");
      dispatch(setNotFilledOutBtns(btns));
    }
  }
  return { isValid, isValidRoomForExistingMaterial, isValidRoomSubFloor };
};

export const checkMandatoryForFurniture = (
  dispatch,
  singleCustomerData,
  activeBtnKey,
  notFilledOutBtns
) => {
  // let standardFurniture = singleCustomerData?.furnitures;
  let kitchenFurnitureChecklist = singleCustomerData?.kitchen_furnitures;
  let specialItemsChecklist = singleCustomerData?.specialItem_furnitures;
  let floors = singleCustomerData?.scope?.floors;
  let kitchenIsPart = singleCustomerData?.scope?.furniture?.is_appliance;
  let specialItemIsPart = singleCustomerData?.scope?.furniture?.special_items;
  // let furnitureIsPart = singleCustomerData?.scope?.furniture?.kasa_is_moving;

  let isRoomExist = false;

  if (floors?.length > 0) {
    for (const floor of floors) {
      if (floor?.rooms?.length > 0) {
        isRoomExist = true;
        break;
      }
    }
  }

  let isValidKitchen = true;
  let isValidSpecialItems = true;

  if (kitchenIsPart && kitchenFurnitureChecklist?.length > 0 && isRoomExist) {
    for (const checklistItem of kitchenFurnitureChecklist) {
      for (const question of checklistItem.all_questions) {
        if (question.answer === "none" || question.answer === false) {
          isValidKitchen = false;
        } else if (question.answer === true) {
          if (question?.subQuestion) {
            for (const subQuestion of question.subQuestion) {
              if (
                subQuestion.mandatory &&
                subQuestion.whenToShow === question.answer
              ) {
                if (
                  subQuestion.type === "BOOLEAN" &&
                  subQuestion.answer === "none"
                ) {
                  isValidKitchen = false;
                  break;
                } else if (
                  typeof subQuestion.answer === "string" &&
                  subQuestion.answer === ""
                ) {
                  isValidKitchen = false;
                  break;
                } else if (
                  typeof subQuestion.answer === "object" &&
                  subQuestion.answer?.length === 0
                ) {
                  isValidKitchen = false;
                  break;
                } else {
                  isValidKitchen = true;
                  // break;
                }
              }
            }
          }
        }
        if (isValidKitchen) {
          break;
        }
      }
      if (isValidKitchen) {
        break;
      }
    }
  }

  if (specialItemIsPart && specialItemsChecklist?.length > 0 && isRoomExist) {
    for (const checklistItem of specialItemsChecklist) {
      for (const question of checklistItem.all_questions) {
        if (question.answer === "none" || question.answer === false) {
          isValidSpecialItems = false;
        } else if (question.answer === true) {
          if (question?.subQuestion) {
            for (const subQuestion of question.subQuestion) {
              if (
                subQuestion.mandatory &&
                subQuestion.whenToShow === question.answer
              ) {
                if (
                  subQuestion.type === "BOOLEAN" &&
                  subQuestion.answer === "none"
                ) {
                  isValidSpecialItems = false;
                  break;
                } else if (
                  typeof subQuestion.answer === "string" &&
                  subQuestion.answer === ""
                ) {
                  isValidSpecialItems = false;
                  break;
                } else if (
                  typeof subQuestion.answer === "object" &&
                  subQuestion.answer?.length === 0
                ) {
                  isValidSpecialItems = false;
                  break;
                } else {
                  isValidSpecialItems = true;
                  // break;
                }
              }
            }
          }
        }

        if (isValidSpecialItems) {
          break;
        }
      }
      if (isValidSpecialItems) {
        break;
      }
    }
  }

  let btns = [...notFilledOutBtns];
  if (
    (kitchenIsPart || specialItemIsPart) &&
    (!isValidKitchen || !isValidSpecialItems)
  ) {
    if (!btns?.includes("furniture")) {
      btns.push("furniture");
      dispatch(setNotFilledOutBtns(btns));
    }
  } else if (isValidKitchen && isValidSpecialItems) {
    if (btns?.includes("furniture")) {
      btns = btns.filter((btn) => btn !== "furniture");
      dispatch(setNotFilledOutBtns(btns));
    }
  }

  return { isValidKitchen, isValidSpecialItems };
};

export const checkMandatoryForMatching = (
  dispatch,
  singleCustomerData,
  activeBtnKey,
  notFilledOutBtns
) => {
  let isValid = true;
  let checklist1 = singleCustomerData?.matching_refinishing_checklists;
  let checklist2 = singleCustomerData?.matching_installation_checklists;
  let floors = singleCustomerData?.scope?.floors;

  const refinishingIsPart =
    singleCustomerData?.scope?.refinishing?.are_we_matching;
  const installationIsPart =
    singleCustomerData?.scope?.installation?.are_we_matching;

  if (checklist1?.length > 0) {
    for (const checklistItem of checklist1) {
      for (const question of checklistItem.all_questions) {
        if (question.mandatory) {
          if (
            question.answer === "none" ||
            question.answer === "" ||
            question.answer?.length === 0
          ) {
            isValid = false;
            break;
          } else {
            if (question.answer === true || question.answer !== "") {
              if (question?.subQuestion) {
                for (const subQuestion of question?.subQuestion) {
                  if (
                    subQuestion.mandatory &&
                    subQuestion.whenToShow === question.answer
                  ) {
                    if (
                      typeof subQuestion.answer === "boolean" &&
                      subQuestion.answer === "none"
                    ) {
                      isValid = false;
                      break;
                    } else if (
                      typeof subQuestion.answer === "string" &&
                      subQuestion.answer === ""
                    ) {
                      isValid = false;
                      break;
                    } else if (
                      typeof subQuestion.answer === "object" &&
                      subQuestion.answer?.length === 0
                    ) {
                      isValid = false;
                      break;
                    }
                  }
                }
              }
            }
          }
        }

        if (!isValid) {
          break;
        }
      }
      if (!isValid) {
        break;
      }
    }
  }

  if (checklist2?.length > 0) {
    for (const checklistItem of checklist2) {
      for (const question of checklistItem.all_questions) {
        if (question.mandatory) {
          if (
            question.answer === "none" ||
            question.answer === "" ||
            question.answer?.length === 0
          ) {
            isValid = false;
            break;
          } else {
            if (question.answer === true || question.answer !== "") {
              if (question?.subQuestion) {
                for (const subQuestion of question?.subQuestion) {
                  if (
                    subQuestion.mandatory &&
                    subQuestion.whenToShow === question.answer
                  ) {
                    if (
                      typeof subQuestion.answer === "boolean" &&
                      subQuestion.answer === "none"
                    ) {
                      isValid = false;
                      break;
                    } else if (
                      typeof subQuestion.answer === "string" &&
                      subQuestion.answer === ""
                    ) {
                      isValid = false;
                      break;
                    } else if (
                      typeof subQuestion.answer === "object" &&
                      subQuestion.answer?.length === 0
                    ) {
                      isValid = false;
                      break;
                    }
                  }
                }
              }
            }
          }
        }

        if (!isValid) {
          break;
        }
      }
      if (!isValid) {
        break;
      }
    }
  }

  let isValidRoomForRefnishing = true;
  if (checklist1?.length > 0) {
    isValidRoomForRefnishing = isCheckListExistInRoom(
      floors,
      "matching_refinishing_checklists_id"
    );
  }

  let isValidRoomInstallation = true;
  if (checklist1?.length > 0) {
    isValidRoomInstallation = isCheckListExistInRoom(
      floors,
      "matching_installation_checklists_id"
    );
  }

  let btns = [...notFilledOutBtns];
  if (
    (refinishingIsPart || installationIsPart) &&
    (!isValid || !isValidRoomForRefnishing || !isValidRoomInstallation)
  ) {
    if (!btns?.includes("matching")) {
      btns.push("matching");
      dispatch(setNotFilledOutBtns(btns));
    }
  } else if (isValid && isValidRoomForRefnishing && isValidRoomInstallation) {
    if (btns?.includes("matching")) {
      btns = btns.filter((btn) => btn !== "matching");
      dispatch(setNotFilledOutBtns(btns));
    }
  }

  return { isValid, isValidRoomForRefnishing, isValidRoomInstallation };
};

export const checkMandatoryForLeveling = (
  dispatch,
  singleCustomerData,
  activeBtnKey,
  notFilledOutBtns
) => {
  let isValid = true;
  let checklist = singleCustomerData?.levellings;
  const levellingIsPart =
    singleCustomerData?.scope?.installation?.are_we_levelling;

  if (levellingIsPart && checklist?.length > 0) {
    for (const checklistItem of checklist) {
      for (const question of checklistItem.all_questions) {
        if (question.mandatory) {
          if (
            question.answer === "none" ||
            question.answer === "" ||
            question.answer?.length === 0 ||
            question.answer === 0
          ) {
            isValid = false;
            break;
          } else {
            if (question.answer === true || question.answer !== "") {
              if (question?.subQuestion) {
                for (const subQuestion of question?.subQuestion) {
                  if (
                    subQuestion.mandatory &&
                    subQuestion.whenToShow === question.answer
                  ) {
                    if (
                      subQuestion.type === "BOOLEAN" &&
                      subQuestion.answer === "none"
                    ) {
                      isValid = false;
                      break;
                    } else if (
                      typeof subQuestion.answer === "string" &&
                      subQuestion.answer === ""
                    ) {
                      isValid = false;
                      break;
                    } else if (
                      typeof subQuestion.answer === "object" &&
                      subQuestion.answer?.length === 0
                    ) {
                      isValid = false;
                      break;
                    }
                  }
                }
              }
            }
          }
        }

        if (!isValid) {
          break;
        }
      }
      if (!isValid) {
        break;
      }
    }
  }

  let isLevelingExistInRoom = true;
  if (levellingIsPart && checklist?.length > 0) {
    for (const leveling of checklist) {
      if (leveling?.within_room_id?.length === 0) {
        isLevelingExistInRoom = false;
        break;
      }
      if (!isLevelingExistInRoom) {
        break;
      }
    }
  }

  let btns = [...notFilledOutBtns];
  if (dispatch) {
    if (levellingIsPart && (!isValid || !isLevelingExistInRoom)) {
      if (!btns?.includes("leveling")) {
        btns.push("leveling");
        dispatch(setNotFilledOutBtns(btns));
      }
    } else if (isValid && isLevelingExistInRoom) {
      if (btns?.includes("leveling")) {
        btns = btns.filter((btn) => btn !== "leveling");
        dispatch(setNotFilledOutBtns(btns));
      }
    }
  }
  return { isValid, isLevelingExistInRoom };
};

export const checkMandatoryForRepair = (
  dispatch,
  singleCustomerData,
  activeBtnKey,
  notFilledOutBtns
) => {
  let repairChecklist = singleCustomerData?.repairs;
  let isValid = true;
  let isValidRoomWithRepairId = true;

  if (repairChecklist?.length > 0) {
    for (const checklistItem of repairChecklist) {
      if (
        checklistItem?.repair_description === "" ||
        checklistItem?.images?.length === 0
      ) {
        isValid = false;
        break;
      }
    }
  }

  if (repairChecklist?.length > 0) {
    for (const checklistItem of repairChecklist) {
      if (
        checklistItem?.within_room_id === "" &&
        checklistItem?.within_staircase_id === ""
      ) {
        isValidRoomWithRepairId = false;
        break;
      }
    }
  }

  let btns = [...notFilledOutBtns];
  if (dispatch) {
    if (!isValid || !isValidRoomWithRepairId) {
      if (!btns?.includes("repaire")) {
        btns.push("repaire");
        dispatch(setNotFilledOutBtns(btns));
      }
    } else if (isValid && isValidRoomWithRepairId) {
      if (btns?.includes("repaire")) {
        btns = btns.filter((btn) => btn !== "repaire");
        dispatch(setNotFilledOutBtns(btns));
      }
    }
  }

  return { isValid, isValidRoomWithRepairId };
};

export const checkMandatoryForStaricase = (
  dispatch,
  singleCustomerData,
  activeBtnKey,
  notFilledOutBtns
) => {
  let isValid = true;
  let isStaircaseExistInRoom = true;
  let checklist = singleCustomerData?.staircases;
  const staircaseIsPart = singleCustomerData?.scope?.is_staircase;

  if (staircaseIsPart) {
    if (checklist?.length > 0) {
      for (const checklistItem of checklist) {
        for (const question of checklistItem.all_questions) {
          if (question.mandatory) {
            if (
              question.answer === "none" ||
              question.answer === "" ||
              question.answer?.length === 0
            ) {
              isValid = false;
              break;
            } else {
              if (question.answer === true || question.answer !== "") {
                if (question?.subQuestion) {
                  for (const subQuestion of question?.subQuestion) {
                    if (
                      subQuestion.mandatory &&
                      subQuestion.whenToShow === question.answer
                    ) {
                      if (
                        subQuestion.type === "BOOLEAN" &&
                        subQuestion.answer === "none"
                      ) {
                        isValid = false;
                        break;
                      } else if (
                        typeof subQuestion.answer === "string" &&
                        subQuestion.answer === ""
                      ) {
                        isValid = false;
                        break;
                      } else if (
                        typeof subQuestion.answer === "object" &&
                        subQuestion.answer?.length === 0
                      ) {
                        isValid = false;
                        break;
                      }
                    }
                  }
                }
              }
            }
          }

          if (!isValid) {
            break;
          }
        }
        if (!isValid) {
          break;
        }
      }
    }

    if (checklist?.length > 0) {
      for (const staircase of checklist) {
        if (staircase?.from_floor_id === "") {
          isStaircaseExistInRoom = false;
          break;
        }
        if (!isStaircaseExistInRoom) {
          break;
        }
      }
    }
  }

  let btns = [...notFilledOutBtns];
  if (dispatch) {
    if (!isValid || !isStaircaseExistInRoom) {
      if (!btns?.includes("staircase")) {
        btns.push("staircase");
        dispatch(setNotFilledOutBtns(btns));
      }
    } else if (isValid && isStaircaseExistInRoom) {
      if (btns?.includes("staircase")) {
        btns = btns.filter((btn) => btn !== "staircase");
        dispatch(setNotFilledOutBtns(btns));
      }
    }
  }

  return { isValid, isStaircaseExistInRoom };
};

export const checkMandatoryForTransition = (
  dispatch,
  singleCustomerData,
  activeBtnKey,
  notFilledOutBtns
) => {
  let isValid = true;
  let isTransitionExistInRoom = true;
  let checklist = singleCustomerData?.transitions;
  const transitionIsPart = singleCustomerData?.scope?.is_transition;

  if (transitionIsPart) {
    if (checklist?.length > 0) {
      for (const checklistItem of checklist) {
        for (const question of checklistItem.all_questions) {
          if (question.mandatory) {
            if (
              question.answer === "none" ||
              question.answer === "" ||
              question.answer?.length === 0
            ) {
              isValid = false;
              break;
            } else {
              if (question.answer === true || question.answer !== "") {
                if (question?.subQuestion) {
                  for (const subQuestion of question?.subQuestion) {
                    if (
                      subQuestion.mandatory &&
                      subQuestion.whenToShow === question.answer
                    ) {
                      if (
                        subQuestion.type === "BOOLEAN" &&
                        subQuestion.answer === "none"
                      ) {
                        isValid = false;
                        break;
                      } else if (
                        typeof subQuestion.answer === "string" &&
                        subQuestion.answer === ""
                      ) {
                        isValid = false;
                        break;
                      } else if (
                        typeof subQuestion.answer === "object" &&
                        subQuestion.answer?.length === 0
                      ) {
                        isValid = false;
                        break;
                      }
                    }
                  }
                }
              }
            }
          }

          if (!isValid) {
            break;
          }
        }
        if (!isValid) {
          break;
        }
      }
    }

    if (checklist?.length > 0) {
      for (const transition of checklist) {
        if (transition?.within_room_id === "") {
          if (
            transition?.from_room_id === "" ||
            transition?.to_room_id === ""
          ) {
            isTransitionExistInRoom = false;
            break;
          }
        }
        if (!isTransitionExistInRoom) {
          break;
        }
      }
    }
  }

  let btns = [...notFilledOutBtns];
  if (dispatch) {
    if (!isValid || !isTransitionExistInRoom) {
      if (!btns?.includes("transitions")) {
        btns.push("transitions");
        dispatch(setNotFilledOutBtns(btns));
      }
    } else if (isValid && isTransitionExistInRoom) {
      if (btns?.includes("transitions")) {
        btns = btns.filter((btn) => btn !== "transitions");
        dispatch(setNotFilledOutBtns(btns));
      }
    }
  }

  return { isValid, isTransitionExistInRoom };
};
