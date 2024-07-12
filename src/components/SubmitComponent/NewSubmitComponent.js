import React, { useCallback, useState } from "react";
import PropTypes from "prop-types";
import {
  getFieldsForProectScope,
  getRemainingFieldsForCustomerDetails,
} from "../../utils/getRemainingMandatoryFields";
import Image from "../UI/Image";
import {
  reduceQuestions,
  reduceQuestionsForSubfloor,
} from "../../helper/helper";
import { pushFVDatatoZoho } from "../../services/customers.service";
import { pushRemainingFieldsToObj } from "../../helper/remainingCLHelper";
import NewSubmitDialog from "./NewSubmitDialog";

const NewSubmitComponent = ({
  singleCustomerData,
  id,
  ZC_PO_ID,
  setOpen,
  setMessage,
  setType,
  updatedSingleCustomerData,
  floors,
}) => {
  const [openModal, setOpenModal] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [customerDetailsObj, setCustomerDetailsObj] = useState({});
  const [projectScopeObj, setProjectScopeObj] = useState({});
  const [updatedNotFilledOutBtns, setUpdatedNotFilledOutBtns] = useState([]);
  const [remainingQueObj, setRemainingQueObj] = useState({
    mandatory: {
      "Refinishing Checklist": {},
      "Existing Material Checklist": {},
      "Subfloor Checklist": {},
      Levelling: {},
      "Matching Refinishing Checklist": {},
      "Matching Installation Checklist": {},
      Repair: {},
      Staircase: {},
      Transition: {},
    },
    important: {
      "Refinishing Checklist": {},
      "Existing Material Checklist": {},
      "Subfloor Checklist": {},
      Levelling: {},
      "Matching Refinishing Checklist": {},
      "Matching Installation Checklist": {},
      Repair: {},
      Staircase: {},
      Transition: {},
    },
  });

  let asyncFunc = useCallback(async () => {
    let data = await getReducedData();
    let reducedData = await finalReducedData(data); //remove checklist array if not in scope
    let reducedData1 = await finalReducedData1(reducedData); //remove checklist id if checklist empty for zoho

    return reducedData1;
  }, [openModal, singleCustomerData]);

  const getReducedData = useCallback(() => {
    let customer = singleCustomerData?.customer;

    let reducedCustomer = JSON.parse(
      JSON.stringify(singleCustomerData?.customer)
    );

    let reducedRefinishing = JSON.parse(
      JSON.stringify(singleCustomerData?.refinishing_checklists)
    );

    let reducedExistingMaterial = JSON.parse(
      JSON.stringify(singleCustomerData?.existing_materials)
    );

    let reducedSubfloor = JSON.parse(
      JSON.stringify(singleCustomerData?.subfloor_details)
    );

    let reducedMolding = JSON.parse(
      JSON.stringify(singleCustomerData?.molding)
    );

    let reducedKitchenFurniture = JSON.parse(
      JSON.stringify(singleCustomerData?.kitchen_furnitures)
    );

    let reducedSpecialItems = JSON.parse(
      JSON.stringify(singleCustomerData?.specialItem_furnitures)
    );

    let reduceMatchingRefinishing = JSON.parse(
      JSON.stringify(singleCustomerData?.matching_refinishing_checklists)
    );

    let reduceMatchingInstalltion = JSON.parse(
      JSON.stringify(singleCustomerData?.matching_installation_checklists)
    );

    let levellings = JSON.parse(JSON.stringify(singleCustomerData?.levellings));

    let staircases = JSON.parse(JSON.stringify(singleCustomerData?.staircases));

    let transitions = JSON.parse(
      JSON.stringify(singleCustomerData?.transitions)
    );

    let building = {};

    building["id"] = customer.buildingType?.id;
    building["question"] = customer.buildingType?.question;
    building["answer"] = customer.buildingType?.answer;
    building["type"] = customer.buildingType?.type;

    let reducedSubQuestions = customer.buildingType?.subQuestion
      ? customer.buildingType?.subQuestion?.map((subQue) => {
          const { id, question, answer, type, subQuestion } = subQue;
          if (subQuestion) {
            let subOfSub = subQuestion?.map((subofsub) => {
              const { id, question, answer, type } = subofsub;
              return { id, question, answer, type };
            });
            return { id, question, answer, type, subQuestion: subOfSub };
          } else {
            return { id, question, answer, type };
          }
        })
      : {};

    building["subQuestion"] = reducedSubQuestions;

    reducedCustomer = { ...reducedCustomer, buildingType: building };

    if (reducedRefinishing?.length > 0) {
      reducedRefinishing = reduceQuestions(reducedRefinishing);
    }

    if (reducedExistingMaterial?.length > 0) {
      reducedExistingMaterial = reduceQuestions(reducedExistingMaterial);
    }

    if (reducedSubfloor?.length > 0) {
      reducedSubfloor = reduceQuestionsForSubfloor(reducedSubfloor);
    }

    if (reducedMolding?.length > 0) {
      reducedMolding = reduceQuestions(reducedMolding);
    }

    if (reducedKitchenFurniture?.length > 0) {
      reducedKitchenFurniture = reduceQuestions(reducedKitchenFurniture);
    }

    if (reducedSpecialItems?.length > 0) {
      reducedSpecialItems = reduceQuestions(reducedSpecialItems);
    }

    if (reduceMatchingRefinishing?.length > 0) {
      reduceMatchingRefinishing = reduceQuestions(reduceMatchingRefinishing);
    }

    if (reduceMatchingInstalltion?.length > 0) {
      reduceMatchingInstalltion = reduceQuestions(reduceMatchingInstalltion);
    }

    if (levellings?.length > 0) {
      levellings = reduceQuestions(levellings);
    }

    if (staircases?.length > 0) {
      staircases = reduceQuestions(staircases);
    }

    if (transitions?.length > 0) {
      transitions = reduceQuestions(transitions);
    }

    return {
      customer: reducedCustomer,
      refinishing_checklists: reducedRefinishing,
      existing_materials: reducedExistingMaterial,
      subfloor_details: reducedSubfloor,
      molding: reducedMolding,
      kitchen_furnitures: reducedKitchenFurniture,
      specialItem_furnitures: reducedSpecialItems,
      matching_refinishing_checklists: reduceMatchingRefinishing,
      matching_installation_checklists: reduceMatchingInstalltion,
      levellings,
      staircases,
      transitions,
    };
  }, [openModal, singleCustomerData]);

  const addInExclude = React.useCallback(
    (data) => {
      const scope = data?.scope;
      const excludeArray = [];
      if (!scope.refinishing.is_part) {
        excludeArray.push(
          "refinishing_checklists",
          "matching_refinishing_checklists",
          "existing_materials"
        );
      } else if (!scope.refinishing.are_we_matching) {
        excludeArray.push("matching_refinishing_checklists");
      }

      if (!scope.installation.is_part) {
        excludeArray.push(
          "subfloor_details",
          "matching_installation_checklists",
          "levellings"
        );
      } else {
        if (!scope.installation.are_we_matching) {
          excludeArray.push("matching_installation_checklists");
        }
        if (!scope.installation.are_we_levelling) {
          excludeArray.push("levellings");
        }
      }

      if (!scope.is_repair) {
        excludeArray.push("repairs");
      }

      if (!scope.is_staircase) {
        excludeArray.push("staircases");
      }

      if (!scope.is_transition) {
        excludeArray.push("transitions");
      }

      return excludeArray;
    },
    [openModal, singleCustomerData]
  );

  const finalReducedData = useCallback(
    (data) => {
      let deeCopyCustomerData = JSON.parse(JSON.stringify(singleCustomerData));
      const excludeFromArray = addInExclude(deeCopyCustomerData);
      console.log("excludeFromArray-", excludeFromArray);

      let newReducedData = Object.keys(deeCopyCustomerData)?.reduce(
        (acc, cur) => {
          if (excludeFromArray.includes(cur)) {
            acc[cur] = [];
          } else {
            if (data.hasOwnProperty(cur)) {
              acc[cur] = data[cur];
            } else {
              acc[cur] = deeCopyCustomerData[cur];
            }
          }
          return acc;
        },
        {}
      );
      return newReducedData;
    },
    [openModal, singleCustomerData]
  );

  const finalReducedData1 = useCallback(
    (data) => {
      let deeCopyCustomerData = JSON.parse(JSON.stringify(data));
      let {
        matching_refinishing_checklists,
        matching_installation_checklists,
        refinishing_checklists,
        installation_checklists,
        subfloor_details,
        existing_materials,
        molding,
        levellings,
      } = data;

      let floors = [...deeCopyCustomerData?.scope.floors];
      const updatedData = floors.map((item) => ({
        ...item,
        rooms: item.rooms.map((room) => {
          return {
            ...room,
            matching_refinishing_checklists_id:
              matching_refinishing_checklists?.length === 0
                ? ""
                : room?.matching_refinishing_checklists_id,
            matching_installation_checklists_id:
              matching_installation_checklists?.length === 0
                ? ""
                : room?.matching_installation_checklists_id,
            refinishing_checklists_id:
              refinishing_checklists?.length === 0
                ? ""
                : room?.refinishing_checklists_id,
            installation_checklist_id:
              installation_checklists?.length === 0
                ? ""
                : room?.installation_checklist_id,
            subfloor_detail_id:
              subfloor_details?.length === 0 ? "" : room?.subfloor_detail_id,
            existing_material_id:
              existing_materials?.length === 0
                ? ""
                : room?.existing_material_id,
            molding_id: molding?.length === 0 ? "" : room?.molding_id,
            levelling_id: levellings?.length === 0 ? "" : room?.levelling_id,
          };
        }),
      }));

      deeCopyCustomerData.scope.floors = updatedData;

      return deeCopyCustomerData;
    },
    [openModal, singleCustomerData]
  );

  const createDataStructureForRemainingFields = useCallback(async () => {
    let customerDetails = getRemainingFieldsForCustomerDetails(
      updatedSingleCustomerData
    );
    let projectScope = getFieldsForProectScope(updatedSingleCustomerData);

    const refinishingChecklistlIsPart =
      updatedSingleCustomerData?.scope?.refinishing?.is_part;
    const existingMaterialIsPart =
      updatedSingleCustomerData?.scope?.refinishing?.is_part;
    const subFloorIsPart =
      updatedSingleCustomerData?.scope?.installation?.is_part;

    const matchingRefinishingIsPart =
      updatedSingleCustomerData?.scope?.refinishing?.are_we_matching;
    const matchingInstallationIsPart =
      updatedSingleCustomerData?.scope?.installation?.are_we_matching;
    const levellingIsPart =
      updatedSingleCustomerData?.scope?.installation?.are_we_levelling;
    const staircaseIsPart = updatedSingleCustomerData?.scope?.is_staircase;
    const transitionIsPart = updatedSingleCustomerData?.scope?.is_transition;

    const refCl = updatedSingleCustomerData?.refinishing_checklists;
    const extCl = updatedSingleCustomerData?.existing_materials;
    const subFloorCl = updatedSingleCustomerData?.subfloor_details;
    const levllingCl = updatedSingleCustomerData?.levellings;
    const matchingRefCl =
      updatedSingleCustomerData?.matching_refinishing_checklists;
    const matchingInsCl =
      updatedSingleCustomerData?.matching_installation_checklists;
    const staircaseCl = updatedSingleCustomerData?.staircases;
    const transitionCl = updatedSingleCustomerData?.transitions;

    setCustomerDetailsObj(customerDetails);
    setProjectScopeObj(projectScope);

    if (refinishingChecklistlIsPart) {
      pushRemainingFieldsToObj(
        refCl,
        "Refinishing Checklist",
        remainingQueObj,
        setRemainingQueObj,
        floors,
        "refinishing_checklists_id"
      );
    }

    if (existingMaterialIsPart) {
      pushRemainingFieldsToObj(
        extCl,
        "Existing Material Checklist",
        remainingQueObj,
        setRemainingQueObj,
        floors,
        "existing_material_id"
      );
    }

    if (subFloorIsPart) {
      pushRemainingFieldsToObj(
        subFloorCl,
        "Subfloor Checklist",
        remainingQueObj,
        setRemainingQueObj,
        floors,
        "subfloor_detail_id"
      );
    }

    if (levellingIsPart) {
      pushRemainingFieldsToObj(
        levllingCl,
        "Levelling",
        remainingQueObj,
        setRemainingQueObj,
        floors,
        "levelling_id"
      );
    }

    if (matchingRefinishingIsPart) {
      pushRemainingFieldsToObj(
        matchingRefCl,
        "Matching Refinishing Checklist",
        remainingQueObj,
        setRemainingQueObj,
        floors,
        "matching_refinishing_checklists_id"
      );
    }

    if (matchingInstallationIsPart) {
      pushRemainingFieldsToObj(
        matchingInsCl,
        "Matching Installation Checklist",
        remainingQueObj,
        setRemainingQueObj,
        floors,
        "matching_installation_checklists_id"
      );
    }

    if (staircaseIsPart) {
      pushRemainingFieldsToObj(
        staircaseCl,
        "Staircase",
        remainingQueObj,
        setRemainingQueObj,
        floors,
        "staircase_from_ids"
      );
    }

    if (transitionIsPart) {
      pushRemainingFieldsToObj(
        transitionCl,
        "Transition",
        remainingQueObj,
        setRemainingQueObj,
        floors,
        "transition_from_ids"
      );
    }
  }, [updatedSingleCustomerData]);

  const handleSubmitData = async () => {
    await new Promise((resolve) => {
      setTimeout(() => {
        createDataStructureForRemainingFields();
        resolve();
      });
    });

    setOpenModal(true);
  };

  const submitDataToZoho = useCallback(async () => {
    // setUploadLoading(true);
    let reducedData = await asyncFunc();
    const reqBody = {
      fv_data: reducedData,
      ZC_PO_ID: ZC_PO_ID,
      customer_id: id,
    };

    const pushToZoho = await pushFVDatatoZoho(reqBody);
    setOpen(true);
    setMessage(pushToZoho?.data?.message);

    if (pushToZoho?.data?.status) {
      setType("success");
    } else {
      setType("error");
    }
    // setUploadLoading(false);
    // onClose();
  }, [asyncFunc]);

  const onClose = () => {
    setOpenModal(false);
  };

  return (
    <div>
      <Image
        className={`rounded-full p-2 border-[1px] bg-white`}
        src="/images/cloud-up-arrow.svg"
        onClick={handleSubmitData}
      />
      <NewSubmitDialog
        open={openModal}
        onClose={onClose}
        onConfirm={() => {}}
        remainingQueObj={remainingQueObj}
        customerDetailsObj={customerDetailsObj}
        projectScopeObj={projectScopeObj}
        singleCustomerData={singleCustomerData}
        updatedNotFilledOutBtns={updatedNotFilledOutBtns}
        updatedSingleCustomerData={updatedSingleCustomerData}
        submitDataToZoho={submitDataToZoho}
        uploadLoading={uploadLoading}
      />
    </div>
  );
};

export default NewSubmitComponent;

NewSubmitComponent.propTypes = {
  singleCustomerData: PropTypes.object,
  id: PropTypes.string,
  ZC_PO_ID: PropTypes.string,
  setOpen: PropTypes.func,
  setMessage: PropTypes.func,
  setType: PropTypes.func,
};
