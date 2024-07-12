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

export const getFieldsForCustomerDetails = (singleCustomerData) => {
  let customerDetailsobj = {};
  let customerDetails = singleCustomerData?.customer;

  if (customerDetails?.name === "") {
    customerDetailsobj.Name = "";
  }
  // if (customerDetails?.phone === "") {
  //   customerDetailsobj.Phone = "";
  // }
  if (customerDetails?.address === "") {
    customerDetailsobj.Address = "";
  }
  if (customerDetails?.email === "") {
    customerDetailsobj.Email = "";
  }

  if (customerDetails?.buildingType) {
    if (customerDetails?.buildingType?.answer === "") {
      customerDetailsobj["Building Type"] = "";
    } else if (
      customerDetails?.buildingType?.answer !== "" &&
      customerDetails?.buildingType?.answer === "Apartment/Condo"
    ) {
      for (const subQue of customerDetails?.buildingType?.subQuestion) {
        if (
          subQue?.mandatory &&
          subQue?.whenToShow === customerDetails?.buildingType?.answer
        ) {
          if (
            subQue?.answer === "none" ||
            subQue?.answer === false ||
            subQue?.answer === "" ||
            subQue?.answer?.length === 0
          ) {
            customerDetailsobj["Building Type"] = customerDetails?.buildingType;
            break;
          } else {
            if (subQue?.subQuestion)
              for (const subofsub of subQue?.subQuestion) {
                if (subofsub?.type === "BOOLEAN") {
                  if (subofsub?.answer !== true) {
                    customerDetailsobj["Building Type"] =
                      customerDetails?.buildingType;
                    break;
                  }
                } else if (
                  typeof subofsub?.answer == "string" &&
                  subofsub?.answer === ""
                ) {
                  customerDetailsobj["Building Type"] =
                    customerDetails?.buildingType;
                  break;
                } else if (
                  typeof subofsub?.answer == "object" &&
                  subofsub?.answer?.length === 0
                ) {
                  customerDetailsobj["Building Type"] =
                    customerDetails?.buildingType;
                  break;
                }
              }
          }
        }
      }
    }
  }
  return customerDetailsobj;
};

export const getRemainingFieldsForCustomerDetails = (singleCustomerData) => {
  let customerDetailsobj = {};
  let customerDetails = singleCustomerData?.customer;

  if (customerDetails?.name === "") {
    customerDetailsobj.Name = "";
  }

  if (customerDetails?.address === "") {
    customerDetailsobj.Address = "";
  }
  if (customerDetails?.email === "") {
    customerDetailsobj.Email = "";
  }

  if (customerDetails?.buildingType) {
    if (customerDetails?.buildingType?.answer === "") {
      customerDetailsobj["Building Type"] = "";
    } else if (
      customerDetails?.buildingType?.answer !== "" &&
      customerDetails?.buildingType?.answer === "Apartment/Condo"
    ) {
      for (const subQue of customerDetails?.buildingType?.subQuestion) {
        if (
          (subQue?.mandatory || subQue?.important) &&
          subQue?.whenToShow === customerDetails?.buildingType?.answer
        ) {
          if (
            subQue?.answer === "none" ||
            subQue?.answer === "" ||
            subQue?.answer?.length === 0
          ) {
            customerDetailsobj["Building Type"] = customerDetails?.buildingType;
            break;
          } else {
            if (subQue?.subQuestion)
              for (const subofsub of subQue?.subQuestion) {
                if (subofsub?.type === "BOOLEAN") {
                  if (subofsub?.answer === "none") {
                    customerDetailsobj["Building Type"] =
                      customerDetails?.buildingType;
                    break;
                  }
                } else if (
                  typeof subofsub?.answer == "string" &&
                  subofsub?.answer === ""
                ) {
                  customerDetailsobj["Building Type"] =
                    customerDetails?.buildingType;
                  break;
                } else if (
                  typeof subofsub?.answer == "object" &&
                  subofsub?.answer?.length === 0
                ) {
                  customerDetailsobj["Building Type"] =
                    customerDetails?.buildingType;
                  break;
                }
              }
          }
        }
      }
    }
  }
  return customerDetailsobj;
};

export const mandateBuildingTypeFilledOut = (customerDetailsobj, type) => {
  const buildingType = customerDetailsobj["Building Type"];
  let isValid = true;
  for (const subQue of buildingType?.subQuestion) {
    if (subQue?.[type] && subQue?.whenToShow === "Apartment/Condo") {
      if (
        subQue?.answer === "none" ||
        subQue?.answer === "" ||
        subQue?.answer?.length === 0
      ) {
        isValid = false;
        break;
      } else {
        if (subQue?.subQuestion)
          for (const subofsub of subQue?.subQuestion) {
            if (subofsub?.[type] && subofsub?.whenToShow === subQue?.answer) {
              if (subofsub?.[type] === "BOOLEAN") {
                if (subofsub?.answer === "none") {
                  isValid = false;
                  break;
                }
              } else if (
                typeof subofsub?.answer == "string" &&
                subofsub?.answer === ""
              ) {
                isValid = false;
                break;
              } else if (
                typeof subofsub?.answer == "object" &&
                subofsub?.answer?.length === 0
              ) {
                isValid = false;
                break;
              }
            }
          }
      }
    }

    if (!isValid) {
      break;
    }
  }

  return isValid;
};

export const getFieldsForProectScope = (singleCustomerData) => {
  let floors = singleCustomerData?.scope?.floors;
  let floorExist = false;
  let roomExist = false;
  let imageExist = false;
  let dimesionExist = false;

  if (floors?.length > 0) {
    floorExist = true;
    for (const floor of floors) {
      if (floor?.rooms?.length > 0) {
        roomExist = true;
        for (const room of floor?.rooms) {
          if (room?.totalSqFeet > 0 && room?.images?.length > 0) {
            dimesionExist = true;
            imageExist = true;
          }
          // if (room?.totalSqFeet > 0) {
          //   dimesionExist = true;
          // }
          // if (room?.images?.length > 0) {
          //   imageExist = true;
          // }
        }
      }
    }
  }
  return { floorExist, roomExist, imageExist, dimesionExist };
};
